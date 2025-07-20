import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// import useAxiosSecure from './useAxiosSecure';

const useBlogs = () => {
  // const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ['publishedBlogs'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs?status=published`);
      return res.data;
    }
  });
};

export default useBlogs;
