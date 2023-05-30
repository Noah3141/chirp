import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

import { api } from "~/utils/api";

const ProfileFeed = (props: { userId: string }) => {
    const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
        userId: props.userId,
    });

    if (isLoading)
        return (
            <div className="flex justify-center py-8">
                <LoadingSpinner size={48} />
            </div>
        );

    if (!data || data.length === 0) return <div>User has not posted</div>;

    return (
        <div className="flex flex-col">
            {data.map((fullPost) => (
                <PostView {...fullPost} key={fullPost.post.id} />
            ))}
        </div>
    );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
    const { data, isLoading } = api.profiles.getUserByUsername.useQuery({ username: username });

    if (isLoading) return <LoadingPage />;
    if (!data) return <div className="p-16 text-6xl">404</div>;

    data.username = data.username ?? "Look";

    return (
        <>
            <Head>
                <title>{data.username}</title>
                <meta name="description" content="🐦" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageLayout>
                <div className="relative h-40 border-slate-400 bg-slate-600">
                    <Image
                        src={data.profileImageUrl}
                        alt={`${data.username}`}
                        width={128}
                        height={128}
                        className="absolute bottom-0 left-6 -mb-[64px] rounded-full border-4 border-black bg-black"
                    />
                </div>
                <div className="mt-[64px] p-4">
                    <div className="font text-3xl font-bold">{data.firstname}</div>
                    <div className="text-lg font-thin">{`@${data.username}`}</div>
                </div>
                <div className="w-full border-b border-slate-400"></div>
                <ProfileFeed userId={data.id} />
            </PageLayout>
        </>
    );
};

import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import type { GetStaticProps } from "next";
import { TRPCError } from "@trpc/server";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { Post } from "@prisma/client";

export const getStaticProps: GetStaticProps = async (context) => {
    const ssg = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, userId: null },
        transformer: SuperJSON,
    });

    const slug = context.params?.slug;

    if (!slug || typeof slug !== "string")
        throw new TRPCError({ message: "no slug", code: "BAD_REQUEST" });

    const username: string = slug.replace("@", "");
    await ssg.profiles.getUserByUsername.prefetch({ username: slug });
    console.log("Username is currently as ", username);
    return {
        props: {
            trpcState: ssg.dehydrate(),
            username,
        },
    };
};

export const getStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
