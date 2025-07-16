import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/Shared/Navbar';

const AuthLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='min-h-screen'>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default AuthLayout;