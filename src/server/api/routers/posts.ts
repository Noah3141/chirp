import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { filterUserForClient } from "~/server/helpers/filterUsersForClient";
import { Post } from "@prisma/client";

const addUserDataToPosts = async (posts: Post[]) => {
    const userId = posts.map((post) => post.authorId);
    const users = (
        await clerkClient.users.getUserList({
            userId: userId,
            limit: 110,
        })
    ).map(filterUserForClient);

    return posts.map((post: Post) => {
        const author = users.find((user) => user.id === post.authorId);

        if (!author) {
            console.error("AUTHOR NOT FOUND", post);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
            });
        }

        return {
            post,
            author: {
                ...author,
                username: author.username ?? "(username not found)",
            },
        };
    });
};

// Create a new ratelimiter, that allows 5 requests per 1 minute
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */
    prefix: "@upstash/ratelimit",
});

export const postsRouter = createTRPCRouter({
    getById: publicProcedure
        .input(z.object({ id: z.string({ required_error: "This must be a string" }) }))
        .query(async ({ ctx, input }) => {
            const post = await ctx.prisma.post.findUnique({
                where: { id: input.id },
            });

            if (!post || !post.id) throw new TRPCError({ code: "NOT_FOUND" });

            return (await addUserDataToPosts([post]))[0];
        }),

    getAll: publicProcedure.query(async ({ ctx }) => {
        const posts = await ctx.prisma.post.findMany({
            take: 100,
            orderBy: [{ createdAt: "desc" }],
        });

        const users = (
            await clerkClient.users.getUserList({
                userId: posts.map((post) => post.authorId),
                limit: 100,
            })
        ).map(filterUserForClient);

        return posts.map((post) => {
            const author = users.find((user) => user.id === post.authorId);

            if (!author || !author.username)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Author for post not found",
                });

            return {
                post,
                author,
            };
        });
    }),

    getPostsByUserId: publicProcedure
        .input(
            z.object({
                userId: z.string(),
            })
        )
        .query(({ ctx, input }) =>
            ctx.prisma.post
                .findMany({
                    where: {
                        authorId: input.userId,
                    },
                    take: 100,
                    orderBy: [{ createdAt: "desc" }],
                })
                .then(addUserDataToPosts)
        ),

    create: privateProcedure
        .input(
            z.object({
                content: z.string().emoji("Only emojis are allowed").min(1).max(255),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;

            const { success } = await ratelimit.limit(authorId);

            if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

            const post = await ctx.prisma.post.create({
                data: {
                    authorId,
                    content: input.content,
                },
            });

            return post;
        }),
});
