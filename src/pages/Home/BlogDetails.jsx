import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const BlogDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/blogs/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="text-center mt-10">Loading blog...</div>;
  if (isError || !blog) return <div className="text-center mt-10">Blog not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>
    </div>
  );
};

export default BlogDetails;
