import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { PostView } from "~/components/postview";

import { useState } from "react";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";

// CREATE POST WIZARD
const CreatePostWizard = () => {
    const { user } = useUser();
    const [input, setInput] = useState("");

    const ctx = api.useContext();

    const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
        onSuccess: async () => {
            setInput("");
            await ctx.posts.getAll.invalidate();
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("Failed to post! Please try again later.");
            }
        },
    });

    if (!user) return null;

    return (
        <div className="flex w-full gap-4">
            <Image
                src={user.profileImageUrl}
                alt="Profile image"
                className="h-14 w-14 rounded-full"
                width={56}
                height={56}
            />
            <input
                placeholder="Type some emojis!"
                type="text"
                className="grow bg-transparent outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isPosting}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        if (input !== "") {
                            mutate({ content: input });
                        }
                    }
                }}
            />
            {input !== "" && !isPosting && (
                <button onClick={() => mutate({ content: input })}>Post</button>
            )}
            {isPosting && (
                <div className="flex items-center justify-center">
                    <LoadingSpinner size={20} />
                </div>
            )}
        </div>
    );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

// FEED
const Feed = () => {
    const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

    if (postsLoading) return <LoadingPage />;
    if (!data) return <div>Something went wrong!</div>;

    return (
        <div className="flex flex-col">
            {data.map((fullPost: PostWithUser) => (
                <PostView {...fullPost} key={fullPost.post.id} />
            ))}
        </div>
    );
};

const SignOutFloat = () => {
    return (
        <div className="absolute left-5 top-28 text-yellow-400">
            <SignOutButton />
        </div>
    );
};
// HOME PAGE
const Home: NextPage = () => {
    const { isLoaded: userLoaded, isSignedIn } = useUser();
    api.posts.getAll.useQuery();

    if (!userLoaded) return <div />;

    return (
        <>
            <Head>
                <title>Chirp</title>
                <meta name="description" content="🐦" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </Head>
            <PageLayout>
                <div className="flex border-b border-slate-400 p-4">
                    {!isSignedIn && (
                        <div className="flex justify-center">
                            <SignInButton />
                        </div>
                    )}
                    {isSignedIn && (
                        <>
                            <CreatePostWizard />
                            <SignOutFloat />
                        </>
                    )}
                </div>
                <Feed />
            </PageLayout>
        </>
    );
};

export default Home;
