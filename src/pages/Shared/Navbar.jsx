import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import logo from '../../../public/Blood_Bridge_2.png'
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
const navigate = useNavigate();
const {user, logOut} = useAuth();
  const linkClass = ({ isActive }) =>
    isActive ? "text-primary font-semibold" : "hover:text-primary";

  const menuItems = (
    <>
      <li>
        <NavLink to="/donation-requests" className={linkClass}>
          Donation Requests
        </NavLink>
      </li>
      <li>
        <NavLink to="/blog" className={linkClass}>
          Blog
        </NavLink>
      </li>
      {user &&
        <li>
          <NavLink to="/funding" className={linkClass}>
            Funding
          </NavLink>
        </li>
      }
    </>
  );

const handleLogout = () => {
    logOut()
      .then(() => navigate("/"))
      .catch((error) =>
        Swal.fire({
          icon: "error",
          title: "LogOut Failed",
          text: error.message,
        })
      );
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-10 sticky top-0 z-50">
      {/* Navbar Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-[999]">
            {menuItems}
          </ul>
        </div>
        <NavLink to="/" className=" text-xl">
         <img src={logo} className='w-10 h-10' alt="Logo" />
        </NavLink>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {menuItems}
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full border-2 border-accent-content">
                <img src={user.photoURL || "https://i.ibb.co/Y2dZb5p/user.png"}  alt="User avatar" />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[999] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              </li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-primary">Login</NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
