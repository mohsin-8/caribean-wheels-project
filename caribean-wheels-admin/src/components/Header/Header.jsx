"use client";
import React from 'react';
import "./Header.css";
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    return (
        <header className='header'>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-6 col-6">
                        <Link href={"/"}><Image src={"/images/headerLogo.png"} width={262} height={258} alt='white logo' /></Link>
                    </div>
                    <div className="col-lg-6 col-md-6 col-6">
                        <div className='d-flex align-items-center justify-content-end'>
                            <ul>
                                <li className="nav-item dropdown">
                                    <Link className="nav-link profile-name-circle dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </Link>
                                    <ul className="dropdown-menu">
                                        {/* <li><Link className="dropdown-item" href={"/profile"}>Profile</Link></li> */}
                                        {/* <li><hr className="dropdown-divider m-0" /></li> */}
                                        <li>
                                            <button onClick={logout}>
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;