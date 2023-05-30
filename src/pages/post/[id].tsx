import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";
import { prisma } from "~/server/db";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
    const { data } = api.posts.getById.useQuery({
        id,
    });
    if (!data) return <div>404</div>;

    return (
        <>
            <Head>
                <title>{`${data.post.content} - @${data.author.username}`}</title>
            </Head>
            <div className="mt-48">
                <PageLayout>
                    <div className="border-t border-slate-400">
                        <PostView {...data} />
                    </div>
                </PageLayout>
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const ssg = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, userId: null },
        transformer: SuperJSON,
    });

    const id = context.params?.id;

    if (typeof id !== "string") throw new Error("no id");

    await ssg.posts.getById.prefetch({ id });

    return {
        props: {
            trpcState: ssg.dehydrate(),
            id,
        },
    };
};

export const getStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
