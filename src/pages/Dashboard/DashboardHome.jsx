import React from 'react';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link } from 'react-router-dom';
import { FaUserFriends, FaHandHoldingUsd, FaTint } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const DashboardHome = () => {
  const { user } = useAuth();
  const { role, roleLoading } = useUserRole();
  const axios = useAxiosSecure();

  // Donor: recent 3 donation requests (pass email)
  const {
    data: recentRequests = [],
    isLoading: recentLoading,
    isError: recentError,
    error: recentErrorDetails,
  } = useQuery({
    queryKey: ['recentRequests', user?.email],
    enabled: !!user?.email && role === 'donor',
    queryFn: async () => {
      const res = await axios.get('/donation-requests', {
        params: {
          email: user.email,
          limit: 3,
        },
      });
      // Adjust according to your backend response shape
      return res.data.data || [];
    },
  });

  // Admin/Volunteer: dashboard stats
  const {
    data: stats = {},
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ['dashboardStats'],
    enabled: role === 'admin' || role === 'volunteer',
    queryFn: async () => {
      const res = await axios.get('/dashboard-stats');
      return res.data;
    },
  });

  if (roleLoading || statsLoading || recentLoading) {
    return <p className="text-center text-lg font-medium">Loading dashboard...</p>;
  }

  if (statsError || recentError) {
    console.error('Dashboard load error:', recentErrorDetails);
    return <p className="text-center text-error">Failed to load dashboard data.</p>;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard Home | Blood Bridge</title>
      </Helmet>

      <div className="p-6">
        {/* Welcome Section */}
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.displayName || 'User'} 👋</h1>

        {/* Donor Dashboard */}
        {role === 'donor' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Recent Donation Requests</h2>
              {recentRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Recipient</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Blood Group</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.map((req) => (
                        <tr key={req._id}>
                          <td>{req.recipientName}</td>
                          <td>{req.recipientDistrict}, {req.recipientUpazila}</td>
                          <td>{req.donationDate}</td>
                          <td>{req.donationTime}</td>
                          <td>{req.bloodGroup}</td>
                          <td>{req.donationStatus}</td>
                          <td>
                            <div className="flex gap-1">
                              <Link to={`/dashboard/donation-requests/view/${req._id}`} className="btn btn-xs">View</Link>
                              <Link to={`/dashboard/donation-requests/update/${req._id}`} className="btn btn-xs btn-info">Edit</Link>
                              {req.status === 'inprogress' && (
                                <>
                                  <button className="btn btn-xs btn-success">Done</button>
                                  <button className="btn btn-xs btn-error">Cancel</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">You haven’t made any donation requests yet.</p>
              )}
            </div>
            <div className="text-right">
              <Link to="/dashboard/my-donation-requests" className="btn btn-primary">View My All Requests</Link>
            </div>
          </>
        )}

        {/* Admin / Volunteer Dashboard */}
        {(role === 'admin' || role === 'volunteer') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-md p-4 flex flex-col items-center text-center">
              <FaUserFriends className="text-4xl text-primary mb-2" />
              <h2 className="text-3xl font-bold">{stats.totalDonors || 0}</h2>
              <p className="text-sm font-medium">Total Donors</p>
            </div>
            <div className="card bg-base-100 shadow-md p-4 flex flex-col items-center text-center">
              <FaHandHoldingUsd className="text-4xl text-secondary mb-2" />
              <h2 className="text-3xl font-bold">${stats.totalAmount || '0.00'}</h2>
              <p className="text-sm font-medium">Total Funding</p>
            </div>
            <div className="card bg-base-100 shadow-md p-4 flex flex-col items-center text-center">
              <FaTint className="text-4xl text-red-500 mb-2" />
              <h2 className="text-3xl font-bold">{stats.totalRequests || 0}</h2>
              <p className="text-sm font-medium">Total Donation Requests</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardHome;
