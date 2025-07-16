import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const useBlogs = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ['publishedBlogs'],
    queryFn: async () => {
      const res = await axiosSecure.get('/blogs?status=published');
      return res.data;
    }
  });
};

export default useBlogs;
