import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { PageLayout } from "~/components/layout";
import { GetStaticProps } from "next";
import { TRPCError } from "@trpc/server";

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
