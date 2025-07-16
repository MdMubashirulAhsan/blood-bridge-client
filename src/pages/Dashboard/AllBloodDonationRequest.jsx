import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useUserRole from '../../hooks/useUserRole';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const statusOptions = ['all', 'pending', 'inprogress', 'done', 'canceled'];

const AllBloodDonationRequest = () => {
  const axiosSecure = useAxiosSecure();
  const { role, isLoading: roleLoading } = useUserRole();
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const queryClient = useQueryClient();

  // ✅ React Query v5-compatible useQuery
  const { data, isLoading, error } = useQuery({
    queryKey: ['allDonationRequests', pageIndex, pageSize, statusFilter],
    queryFn: async () => {
      const params = {
        page: pageIndex,
        size: pageSize,
      };
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await axiosSecure.get('/donation-requests', { params });
      return res.data;
    },
    keepPreviousData: true,
  });

  // ✅ React Query v5-compatible useMutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }) => {
      return axiosSecure.patch(`/donation-requests/${id}/status`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['allDonationRequests'],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`/donation-requests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['allDonationRequests'],
      });
    },
  });

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const handleStatusChange = (id, currentStatus, action) => {
    if (currentStatus !== 'inprogress') return;
    const newStatus = action === 'done' ? 'done' : action === 'canceled' ? 'canceled' : '';
    if (!newStatus) return;
    updateStatusMutation.mutate({ id, newStatus });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this donation request?')) {
      deleteMutation.mutate(id);
    }
  };

  if (roleLoading || isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading donation requests.</p>;
  if (!data || data.data.length === 0) {
    return <p>No donation requests found.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Blood Donation Requests</h2>

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Status:</label>
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPageIndex(0);
          }}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
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
              <th>Donor Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((req) => (
              <tr key={req._id}>
                <td>{req.recipientName}</td>
                <td>
                  {req.recipientDistrict}, {req.recipientUpazila}
                </td>
                <td>{req.donationDate}</td>
                <td>{req.donationTime}</td>
                <td>{req.bloodGroup}</td>
                <td>{req.status}</td>
                <td>
                  {req.status === 'inprogress' && req.donor ? (
                    <>
                      <div>{req.donor.name}</div>
                      <div>{req.donor.email}</div>
                    </>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <div className="flex gap-2 flex-wrap">
                    {/* View */}
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => window.location.href = `/donation-request/${req._id}`}
                    >
                      View
                    </button>

                    {/* Admin-only: Edit/Delete */}
                    {role === 'admin' && (
                      <>
                        <button
                          className="btn btn-xs btn-info"
                          onClick={() => window.location.href = `/dashboard/edit-donation-request/${req._id}`}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleDelete(req._id)}
                          disabled={deleteMutation.isLoading}
                        >
                          Delete
                        </button>
                      </>
                    )}

                    {/* Volunteer/Admin status update */}
                    {(role === 'admin' || role === 'volunteer') && req.status === 'inprogress' && (
                      <>
                        <button
                          className="btn btn-xs btn-success"
                          onClick={() => handleStatusChange(req._id, req.status, 'done')}
                          disabled={updateStatusMutation.isLoading}
                        >
                          Done
                        </button>
                        <button
                          className="btn btn-xs btn-warning"
                          onClick={() => handleStatusChange(req._id, req.status, 'canceled')}
                          disabled={updateStatusMutation.isLoading}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
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
        <div>
          Page {pageIndex + 1} of {totalPages}
        </div>
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
  );
};

export default AllBloodDonationRequest;
