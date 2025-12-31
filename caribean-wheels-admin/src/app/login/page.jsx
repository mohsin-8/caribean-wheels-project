"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import "./login.css";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { FaEye } from "react-icons/fa6";
import { LuEyeClosed } from "react-icons/lu";

const LoginPage = () => {
    const router = useRouter();
    const { user, login, loading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            router.replace("/dashboard");
        }
    }, [user, loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (user) return null;

    return (
        <section className='login-page'>
            <div className="container">
                <div className="row align-items-center" style={{ minHeight: "100vh" }}>
                    <div className="col-lg-6">
                        <Image src={"/images/white-logo.jpeg"} width={500} height={500} alt='white logo' />
                    </div>
                    <div className="col-lg-6">
                        <h1>Sign In to your account</h1>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-12">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='Enter your email address'
                                    />
                                </div>
                                <div className="col-lg-12" style={{ position: "relative" }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='Enter your password'
                                    />
                                    <span
                                        style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEye color='#960f16' size={18} style={{ marginRight: "20px", marginBottom: "10px" }} /> : <LuEyeClosed color='#960f16' size={18} style={{ marginRight: "20px", marginBottom: "10px" }} />}
                                    </span>
                                </div>
                                <div className="col-lg-12 mb-3">
                                    <Link href={"/forgot-password"} style={{ color: "#960f16", textDecoration: "none" }}>Forgot Password?</Link>
                                </div>
                                <div className="col-lg-12">
                                    <button type='submit'>Sign In</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LoginPage;