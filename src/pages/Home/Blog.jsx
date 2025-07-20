import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useBlogs from '../../hooks/useBlogs';
import { Helmet } from 'react-helmet';

const Blog = () => {
  const { data: blogs = [], isLoading } = useBlogs();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="text-center mt-10">Loading blogs...</div>;

  return (
    <>
    <Helmet>
      <title>Blogs | My App</title>
    </Helmet>
    
    
    <div className=" mx-auto  py-10">
      <h1 className="text-3xl font-bold mb-6">Published Blogs</h1>

      <input
        type="text"
        placeholder="Search by title..."
        className="input input-bordered w-40 mb-6"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {filteredBlogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-4">
          {filteredBlogs.map(blog => (
            <div key={blog._id} className="border p-4 rounded-lg shadow bg-base-100">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-gray-500 text-sm mb-3">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="line-clamp-3">{blog.content.replace(/<[^>]+>/g, '')}</p>
              <Link to={`/blog/${blog._id}`} className="text-blue-600 mt-2 block hover:underline">
                Read more →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Blog;
