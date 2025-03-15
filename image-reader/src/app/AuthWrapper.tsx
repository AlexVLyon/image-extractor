"use client";

import { useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

interface AuthWrapperProps {
    children: ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const currentRoute = usePathname();

    console.log("Session:", session);
    console.log("Status:", status);
    console.log("Current route:", currentRoute)


    useEffect(() => {
        if (status !== "loading" && !session && currentRoute !== "/sign-in" && currentRoute !== "/registration") {
            router.push("/sign-in"); // Client-side redirect
        }
    }, [status, session, currentRoute]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

interface AuthWrapperWithProviderProps {
    children: ReactNode;
}

const AuthWrapperWithProvider: React.FC<AuthWrapperWithProviderProps> = ({ children }) => {
    return (
        <SessionProvider>
            <AuthWrapper>{children}</AuthWrapper>
        </SessionProvider>
    );
};

export default AuthWrapperWithProvider;
