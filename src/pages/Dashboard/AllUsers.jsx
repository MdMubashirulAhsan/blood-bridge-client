import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useUserRole from '../../hooks/useUserRole';
import Swal from 'sweetalert2';

const statusOptions = ['all', 'active', 'blocked'];

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { role: userRole, isLoading: roleLoading } = useUserRole();

  const [statusFilter, setStatusFilter] = useState('all');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // ✅ Fetch all users with pagination and filtering
  const { data, isLoading, error } = useQuery({
    queryKey: ['allUsers', statusFilter, pageIndex, pageSize],
    queryFn: async () => {
      const res = await axiosSecure.get('/all-users', {
        params: {
          page: pageIndex,
          size: pageSize,
          status: statusFilter,
        },
      });
      return res.data;
    },
  });

  const users = data?.users || [];
  const totalUsers = data?.total || 0;
  const totalPages = Math.ceil(totalUsers / pageSize);

  // ✅ Update status (block/unblock)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/users/${id}/status`, { status }),
    onSuccess: () => {
      Swal.fire('Success!', 'User status updated.', 'success');
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
    onError: () => {
      Swal.fire('Error!', 'Failed to update user status.', 'error');
    },
  });

  // ✅ Update role
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) =>
      axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      Swal.fire('Success!', 'User role updated.', 'success');
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
    onError: () => {
      Swal.fire('Error!', 'Failed to update user role.', 'error');
    },
  });

  if (isLoading || roleLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load users.</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Users</h2>
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPageIndex(0);
          }}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img src={user.avatar || '/default-avatar.png'} className="w-10 h-10 rounded-full" alt="avatar" />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    <div className="dropdown dropdown-left">
                      <button tabIndex={0} className="btn btn-sm btn-ghost">⋮</button>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 z-10">
                        {userRole === 'admin' && user.status === 'active' && (
                          <li>
                            <button onClick={() => updateStatusMutation.mutate({ id: user._id, status: 'blocked' })}>Block</button>
                          </li>
                        )}
                        {userRole === 'admin' && user.status === 'blocked' && (
                          <li>
                            <button onClick={() => updateStatusMutation.mutate({ id: user._id, status: 'active' })}>Unblock</button>
                          </li>
                        )}
                        {userRole === 'admin' && user.role !== 'volunteer' && (
                          <li>
                            <button onClick={() => updateRoleMutation.mutate({ id: user._id, role: 'volunteer' })}>Make Volunteer</button>
                          </li>
                        )}
                        {userRole === 'admin' && user.role !== 'admin' && (
                          <li>
                            <button onClick={() => updateRoleMutation.mutate({ id: user._id, role: 'admin' })}>Make Admin</button>
                          </li>
                        )}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
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

export default AllUsers;
