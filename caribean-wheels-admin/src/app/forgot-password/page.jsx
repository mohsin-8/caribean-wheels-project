"use client";
import React, { useState } from 'react';
import "./forgot-password.css";
import Link from 'next/link';
import Image from 'next/image';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await fetch("https://caribeanwheelsadmin.vercel.app/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong");
            } else {
                setMessage(data.message);
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
                        <h1>Forgot Password?</h1>
                        {message && <p style={{ color: "green" }}>{message}</p>}
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
                                <div className="col-lg-12 mb-3">
                                    <Link href={"/"} style={{ color: "#960f16", textDecoration: "none" }}>Go back Sign In?</Link>
                                </div>
                                <div className="col-lg-12">
                                    <button type='submit'>Forgot Password</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ForgotPassword;