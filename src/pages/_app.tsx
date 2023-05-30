import type { AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import ChirpLogo from "~/components/images/Chirp";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <>
            <ClerkProvider>
                <Link href="/">
                    <div className="absolute left-5 py-8">
                        <ChirpLogo size={64} />
                    </div>
                </Link>
                <Toaster position="bottom-center" />
                <Component {...pageProps} />
            </ClerkProvider>
        </>
    );
};

export default api.withTRPC(MyApp);
