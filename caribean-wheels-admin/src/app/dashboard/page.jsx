"use client";
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Dashboard = () => {
    const { user, loading } = useAuth();
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
            <Layout>
                <div className='dashboard-page'>
                    <h1>Go to Cars</h1>
                    <Link href={"/cars"}>View Cars</Link>
                </div>
            </Layout>
        </ProtectedRoute>
    )
}

export default Dashboard;