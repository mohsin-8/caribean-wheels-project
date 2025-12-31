"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/");
        }
    }, [loading, user]);

    if (loading) return <p>Loading...</p>;

    if (!user) return null;
    return (
        <ProtectedRoute>
            <div style={{ padding: "20px" }}>
                <h1>Dashboard</h1>
                <p>Welcome, {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <button onClick={logout} style={{ padding: "10px 20px", marginTop: "20px" }}>
                    Logout
                </button>
            </div>
        </ProtectedRoute>
    );
};