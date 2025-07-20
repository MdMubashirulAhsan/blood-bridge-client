import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import axios from 'axios'; // You need axios here for cloudinary upload
import { Helmet } from 'react-helmet';

const AddBlog = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const editor = useRef(null);

  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Upload image to Cloudinary
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', image);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    formData.append('upload_preset', uploadPreset);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      const res = await axios.post(cloudinaryUrl, formData);
      setThumbnail(res.data.secure_url);
      // Swal.fire('Success', 'Thumbnail uploaded!', 'success');
    } catch (err) {
      console.error('Image upload failed:', err);
      Swal.fire('Upload Error', 'Failed to upload image. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !thumbnail || !content.trim()) {
      Swal.fire('Validation Error', 'Please fill all fields and upload a thumbnail.', 'warning');
      return;
    }

    setLoading(true);

    try {
      const newBlog = {
        title,
        thumbnail,
        content,
        status: 'draft',
        createdAt: new Date().toISOString(),
      };

      await axiosSecure.post('/blogs', newBlog);

      Swal.fire('Success', 'Blog created as draft.', 'success');
      navigate('/dashboard/content-management');
    } catch (error) {
      console.error('Error creating blog:', error);
      Swal.fire('Error', 'Failed to create blog.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Helmet>
      <title>Add Blog | Blood Bridge</title>
    </Helmet>
    
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter blog title"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Thumbnail Image */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="thumbnail">Thumbnail Image</label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading}
            required
          />
          {thumbnail && (
            <img
              src={thumbnail}
              alt="Thumbnail Preview"
              className="mt-2 w-48 h-auto rounded shadow"
            />
          )}
        </div>

        {/* Blog Content */}
        <div>
          <label className="block mb-1 font-medium">Content</label>
          <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)}
            tabIndex={1}
            disabled={loading}
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            Create Blog (Draft)
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default AddBlog;
