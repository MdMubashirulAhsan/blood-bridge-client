import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role,
    isLoading: roleLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role; // Ensure backend returns { role: "admin" }
    },
    retry: false, // Prevent endless retries
  });
// console.log(role)
  return { role: role || null, roleLoading: authLoading || roleLoading, error, refetch };
};

export default useUserRole;
