import React from 'react';
import NavBar from '../pages/Shared/Navbar';
import { Outlet } from 'react-router';
import Footer from '../pages/Shared/Footer';

const RootLayout = () => {
    return (
        <div>
            <NavBar></NavBar>
            <div className='min-h-screen px-10 bg-base-200 pb-10'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;