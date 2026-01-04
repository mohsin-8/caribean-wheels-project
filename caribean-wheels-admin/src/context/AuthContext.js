"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await fetch("https://caribeanwheelsadmin.vercel.app/api/auth/profile", {
                method: "GET",
                credentials: "include", // send cookies
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Login
    const login = async ({ email, password }) => {
        const res = await fetch("https://caribeanwheelsadmin.vercel.app/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Login failed");

        setUser(data.user);
        return data.user;
    };

    // Logout
    const logout = async () => {
        await fetch("https://caribeanwheelsadmin.vercel.app/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);