import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Post } from "@prisma/client";
import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import Link from "next/link";
import { useState } from "react";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import toast from "react-hot-toast";

const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

// HOME PAGE
const ProfilePage: NextPage = () => {
    const { data, isLoading } = api.profiles.getUserByUsername.useQuery({ username: "noah3141" });

    if (isLoading) return <div>Loading...</div>;
    if (!data) return <div>404</div>;

    return (
        <>
            <Head>
                <title>Chirp Profile</title>
            </Head>
            <main className="flex h-screen justify-center ">
                <div>{data.username}</div>
            </main>
        </>
    );
};

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import SuperJSON from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export const getStaticProps: GetStaticProps = async (context) => {
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: { prisma, userId: null },
        transformer: SuperJSON,
    });

    const slug = context.params?.slug;

    if (typeof slug !== "string") throw new Error("no slug");

    return {
        props: {},
    };
};

export default ProfilePage;
