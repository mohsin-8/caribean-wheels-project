"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { FaEye } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import "../reset-password.css";

const ResetPassword = () => {
    const router = useRouter();
    const params = useParams();
    const token = params.token;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await fetch(`https://caribeanwheelsadmin.vercel.app/api/auth/reset-password/${token}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong");
            } else {
                setMessage(data.message);
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            }
        } catch (err) {
            setError("Server error");
        }
    };

    return (
        <section className='login-page'>
            <div className="container">
                <div className="row align-items-center" style={{ minHeight: "100vh" }}>
                    <div className="col-lg-6">
                        <Image src={"/images/white-logo.jpeg"} width={500} height={500} alt='white logo' />
                    </div>
                    <div className="col-lg-6">
                        <h1>Reset Password</h1>
                        {message && <p style={{ color: "green" }}>{message}</p>}
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-12 mb-3" style={{ position: "relative" }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='Enter new password'
                                        required
                                    />
                                    <span
                                        style={{
                                            position: "absolute",
                                            right: "20px",
                                            top: "50%",
                                            transform: "translateY(-80%)",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword
                                            ? <FaEye color='#960f16' size={18} />
                                            : <LuEyeClosed color='#960f16' size={18} />}
                                    </span>
                                </div>
                                <div className="col-lg-12 mb-3" style={{ position: "relative" }}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <span
                                        style={{
                                            position: "absolute",
                                            right: "20px",
                                            top: "50%",
                                            transform: "translateY(-80%)",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword
                                            ? <FaEye color='#960f16' size={18} />
                                            : <LuEyeClosed color='#960f16' size={18} />}
                                    </span>
                                </div>
                                <div className="col-lg-12 mb-3">
                                    <Link href={"/login"} style={{ color: "#960f16", textDecoration: "none" }}>Go back Sign In?</Link>
                                </div>
                                <div className="col-lg-12">
                                    <button type='submit'>Reset Password</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResetPassword;