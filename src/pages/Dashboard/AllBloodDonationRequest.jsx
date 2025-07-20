import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { Helmet } from 'react-helmet';
// import useUserRole from '../../hooks/useUserRole';

const statusOptions = ['all', 'pending', 'inprogress', 'done', 'canceled'];

const AllDonationRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  // const { role } = useUserRole();

  const [statusFilter, setStatusFilter] = useState('all');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const { data = {}, isLoading } = useQuery({
      queryKey: ['donationRequests', user?.email, pageIndex, pageSize, statusFilter],
      enabled: !!user?.email,
      queryFn: async () => {
        const res = await axiosSecure.get('/donation-requests', {
          params: {
            email: user?.email,
            page: pageIndex,
            size: pageSize,
            status: statusFilter,
          },
        });
        return res.data; // Should be { total, data }
      },
    });


  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/donation-requests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['donationRequests', user?.email]);
    },
    onError: (err) => {
      alert('Delete failed: ' + (err?.response?.data?.message || err.message));
    },
  });

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this request?')) {
      deleteMutation.mutate(id);
    }
  };

  const donationRequests = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  if (isLoading) return <p className="p-4">Loading donation requests...</p>;

  return (
    <>
    <Helmet>
      <title>All Blood Donation Requsts | Blood Bridge</title>
    </Helmet>
    
    
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Donation Requests</h2>

      {/* 🔍 Filter */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold">Filter by status:</label>
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPageIndex(0);
          }}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-sm">
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
            {donationRequests.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No donation requests found.
                </td>
              </tr>
            ) : (
              donationRequests.map((req) => (
                <tr key={req._id}>
                  <td>{req.recipientName}</td>
                  <td>{req.recipientDistrict}, {req.recipientUpazila}</td>
                  <td>{req.donationDate}</td>
                  <td>{req.donationTime}</td>
                  <td>{req.bloodGroup}</td>
                  <td className="capitalize">{req.donationStatus}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/dashboard/donation-requests/view/${req._id}`}>
                        <button className="btn btn-xs btn-outline">View</button>
                      </Link>
                      <Link to={`/dashboard/donation-requests/update/${req._id}`}><button className="btn btn-xs btn-info">Edit</button></Link>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleDelete(req._id)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div>
          <button
            className="btn btn-sm"
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
            disabled={pageIndex === 0}
          >
            Prev
          </button>
          <button
            className="btn btn-sm ml-2"
            onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={pageIndex >= totalPages - 1}
          >
            Next
          </button>
        </div>
        <span className="text-sm">
          Page {pageIndex + 1} of {totalPages || 1}
        </span>
        <select
          className="select select-bordered select-sm"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPageIndex(0);
          }}
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
    </>
  );
};

export default AllDonationRequests;
