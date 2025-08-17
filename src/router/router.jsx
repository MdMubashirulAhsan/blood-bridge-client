import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "../routes/PrivateRoute";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import DashboardProfile from "../pages/Dashboard/DashboardProfile";
import DonationRequests from "../pages/Home/DonationRequests";
import Blog from "../pages/Home/Blog";
import DonationRequestsDetails from "../pages/Home/DonationRequestsDetails";
import Funding from "../pages/Home/Funding";
import DonorRoute from "../routes/DonorRoute";
import MyDonationRequests from "../pages/Dashboard/MyDonationRequests";
import CreateDonationRequest from "../pages/Dashboard/CreateDonationRequest";
import AdminRoute from "../routes/AdminRoute";
import AllUsers from "../pages/Dashboard/AllUsers";
import AllBloodDonationRequest from "../pages/Dashboard/AllBloodDonationRequest";
import ContentManagement from "../pages/Dashboard/ContentManagement";
import VolunteerRoute from "../routes/VolunteerRoute";
import Forbidden from "../pages/Forbidden/Forbidden";
import AddBlog from "../pages/Dashboard/AddBlog";
import BlogDetails from "../pages/Home/BlogDetails";
import DonorSearch from "../pages/Home/DonorSearch";
import ViewDonation from "../pages/Dashboard/ViewDonation";
import UpdateDonation from "../pages/Dashboard/UpdateDonation";
import GiveFund from "../pages/Home/GiveFund";
import RoleBasedRoute from "../hooks/RoleBasedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/donation-requests",
        Component: DonationRequests,
      },
      {
        path: "/blog",
        Component: Blog,
      },
      {
        path: "/blog/:id",
        Component: BlogDetails,
      },
      {
        path: "/forbidden",
        Component: Forbidden,
      },

      {
        path: "/donation-requests/:id",
        element: (
          <PrivateRoute>
            <DonationRequestsDetails></DonationRequestsDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/funding",
        element: (
          <PrivateRoute>
            <Funding></Funding>
          </PrivateRoute>
        ),
      },
      {
        path: "/donor-search",
        Component: DonorSearch,
      },
      {
        path: "/give-fund",
        element: (
          <PrivateRoute>
            <GiveFund></GiveFund>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      { path: "/dashboard/profile", Component: DashboardProfile },
      {
        path: "/dashboard/my-donation-requests",
        element: (
          <DonorRoute>
            <MyDonationRequests></MyDonationRequests>
          </DonorRoute>
        ),
      },
      {
        path: "/dashboard/donation-requests/view/:id",
        element: (
          <RoleBasedRoute allowedRoles={["admin", "volunteer", "donor"]}>
            <ViewDonation></ViewDonation>
          </RoleBasedRoute>
        ),
      },
      

      {
        path: "/dashboard/create-donation-request",
        element: (
          <DonorRoute>
            <CreateDonationRequest></CreateDonationRequest>
          </DonorRoute>
        ),
      },

      // admin route
      {
        path: "/dashboard/all-users",
        element: (
          <AdminRoute>
            <AllUsers></AllUsers>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/all-blood-donation-request",
        element: (
          <RoleBasedRoute allowedRoles={["admin", "volunteer"]}>
            <AllBloodDonationRequest />
          </RoleBasedRoute>
        ),
      },

      {
        path: "/dashboard/content-management",
        element: (
          <RoleBasedRoute allowedRoles={["admin", "volunteer"]}>
            <ContentManagement />
          </RoleBasedRoute>
        ),
      },

      {
        path: "/dashboard/content-management/add-blog",
        element: (
          <RoleBasedRoute allowedRoles={["admin", "volunteer"]}>
            <AddBlog />
          </RoleBasedRoute>
        ),
      },
      {
        path: "/dashboard/donation-requests/update/:id",
        element: (
          <RoleBasedRoute allowedRoles={["admin", "volunteer", "donor"]}>
            <UpdateDonation></UpdateDonation>
          </RoleBasedRoute>
        ),
      },
    ],
  },
]);
// ksjdlkamdc.kjsd
