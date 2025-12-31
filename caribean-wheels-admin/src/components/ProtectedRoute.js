"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/");
        }
    }, [loading, user]);

    if (loading) return <p>Loading...</p>;
    if (!user) return null;

    return <>{children}</>;
};