import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useUserRole from '../../hooks/useUserRole';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ContentManagement = () => {
  const axiosSecure = useAxiosSecure();
  const { role } = useUserRole();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState('all');

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['blogs', filter],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard-blogs${filter === 'all' ? '' : `?status=${filter}`}`
      );
      return res.data; // may be array OR object {blogs:[],total,...}
    },
  });

  // Normalize data shape
  const blogs = Array.isArray(data) ? data : data?.blogs ?? [];
  const total = Array.isArray(data) ? data.length : data?.total ?? 0;

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/blogs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      Swal.fire('Deleted!', 'Blog deleted successfully.', 'success');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }) =>
      await axiosSecure.patch(`/blogs/${id}/status`, { status: newStatus }),
    onSuccess: () => queryClient.invalidateQueries(['blogs']),
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleStatusToggle = (id, currentStatus) => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    toggleStatusMutation.mutate({ id, newStatus });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <Link to="/dashboard/content-management/add-blog" className="btn btn-primary">
          Add Blog
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          className="select select-bordered"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Loading and Error States */}
      {isLoading && <div className="flex justify-center items-center h-40">Loading...</div>}
      {error && <p className="text-red-500 text-center">Failed to load blogs.</p>}

      {/* Blogs */}
      {!isLoading && !error && (
        blogs.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="card bg-base-100 shadow">
                <figure>
                  <img src={blog.thumbnail} alt={blog.title} className="h-48 w-full object-cover" />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{blog.title}</h3>
                  <p>Status: <span className="badge">{blog.status}</span></p>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleStatusToggle(blog._id, blog.status)}
                      className="btn btn-sm btn-outline"
                      disabled={role !== 'admin'}
                      title={role !== 'admin' ? 'Only admins can change status' : ''}
                    >
                      {blog.status === 'draft' ? 'Publish' : 'Unpublish'}
                    </button>

                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="btn btn-sm btn-error"
                      disabled={role !== 'admin'}
                      title={role !== 'admin' ? 'Only admins can delete' : ''}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm opacity-70">No blogs found. (total={total})</p>
        )
      )}
    </div>
  );
};

export default ContentManagement;
