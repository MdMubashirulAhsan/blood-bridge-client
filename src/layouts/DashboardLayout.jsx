import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";
import logo from "../../public/Blood_Bridge_2.png";
import { Link } from "react-router";
import {
  HiOutlineClipboardList,
  HiOutlinePlusCircle,
  HiOutlineUser,
} from 'react-icons/hi';
import {
  FaUsers,
  FaUserEdit,
  FaRegEdit,
  FaRegFileAlt,
  FaUserCircle,
} from 'react-icons/fa';
import { MdOutlineDashboardCustomize } from 'react-icons/md';

const DashboardLayout = () => {
  const linkClass = ({ isActive }) =>
    isActive ? "text-primary font-semibold" : "hover:text-primary";
  const { role, roleLoading } = useUserRole();
  if (roleLoading) return <div>Loading...</div>;
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="bg-base-200 w-full lg:w-64 p-4">
        <div className="flex gap-2 ">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-10 h-10 " />
          </Link>
          <Link to="/dashboard">
            {" "}
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>
          </Link>
        </div>
        <ul className="menu">
  {role === "donor" && (
    <>
      <NavLink to="/dashboard/my-donation-requests" className={linkClass}>
        <HiOutlineClipboardList className="inline mr-2 text-lg" />
        My Requests
      </NavLink>
      <NavLink to="/dashboard/create-donation-request" className={linkClass}>
        <HiOutlinePlusCircle className="inline mr-2 text-lg" />
        Create Request
      </NavLink>
      <NavLink to="/dashboard/profile" className={linkClass}>
        <FaUserCircle className="inline mr-2 text-lg" />
        Donor Profile
      </NavLink>
    </>
  )}

  {role === "admin" && (
    <>
      <NavLink to="/dashboard/all-users" className={linkClass}>
        <FaUsers className="inline mr-2 text-lg" />
        All Users
      </NavLink>
      <NavLink to="/dashboard/all-blood-donation-request" className={linkClass}>
        <HiOutlineClipboardList className="inline mr-2 text-lg" />
        All Donations
      </NavLink>
      <NavLink to="/dashboard/content-management" className={linkClass}>
        <FaRegFileAlt className="inline mr-2 text-lg" />
        Contents
      </NavLink>
      <NavLink to="/dashboard/profile" className={linkClass}>
        <FaUserEdit className="inline mr-2 text-lg" />
        Admin Profile
      </NavLink>
    </>
  )}

  {role === "volunteer" && (
    <>
      <NavLink to="/dashboard/all-blood-donation-request" className={linkClass}>
        <HiOutlineClipboardList className="inline mr-2 text-lg" />
        All Donations
      </NavLink>
      <NavLink to="/dashboard/content-management" className={linkClass}>
        <FaRegFileAlt className="inline mr-2 text-lg" />
        Contents
      </NavLink>
      <NavLink to="/dashboard/profile" className={linkClass}>
        <FaUserCircle className="inline mr-2 text-lg" />
        Volunteer Profile
      </NavLink>
    </>
  )}
</ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 bg-base-100">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
