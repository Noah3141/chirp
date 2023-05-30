import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return (
        <main className="flex h-screen justify-center">
            <div className="h-max w-full max-w-2xl    border-x border-b border-slate-400">
                {props.children}
            </div>
        </main>
    );
};
