import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import districts from '../../assets/districts.json';
import upazilas from '../../assets/upazilas.json';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Helmet } from 'react-helmet';

const DashboardProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();
  const [availableUpazilas, setAvailableUpazilas] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      blood_group: '',
      district: '',
      upazila: '',
    },
  });

  const selectedDistrict = watch('district');

  // Update available upazilas when district changes
  useEffect(() => {
    if (selectedDistrict && upazilas[selectedDistrict]) {
      setAvailableUpazilas(upazilas[selectedDistrict]);
    } else {
      setAvailableUpazilas([]);
    }
  }, [selectedDistrict]);

  // Fetch and set profile data
  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ['user-profile', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Reset form when profileData is fetched
  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.name || '',
        email: profileData.email || user.email || '',
        blood_group: profileData.blood_group || '',
        district: profileData.district || '',
        upazila: profileData.upazila || '',
      });

      if (profileData.district && upazilas[profileData.district]) {
        setAvailableUpazilas(upazilas[profileData.district]);
      }
    }
  }, [profileData, reset, user?.email]);

  // Mutation to update profile
  const mutation = useMutation({
    mutationFn: (updatedData) =>
      axiosSecure.patch(`/users/${user.email}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['user-profile', user.email]);
      setEditMode(false);
      Swal.fire('Success', 'Profile updated successfully', 'success');
    },
    onError: () => Swal.fire('Error', 'Failed to update profile', 'error'),
  });

  const onSubmit = (data) => mutation.mutate(data);

  if (isLoading) return <div className="text-center py-4">Loading profile...</div>;
  if (isError) return <div className="text-center text-red-500">Failed to load profile.</div>;

  return (
    <>
    <Helmet>
            <title>Profile | Blood Bridge</title>
        </Helmet>
    
    <div className="max-w-2xl mx-auto bg-base-100 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <button className="btn btn-sm btn-outline" onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="label">Full Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="input input-bordered w-full"
            disabled={!editMode}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            {...register('email')}
            className="input input-bordered w-full"
            disabled
          />
        </div>

        {/* Blood Group */}
        <div>
          <label className="label">Blood Group</label>
          <select
            {...register('blood_group', { required: 'Blood group is required' })}
            className="select select-bordered w-full"
            disabled={!editMode}
          >
            <option value="">Select Blood Group</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          {errors.blood_group && <p className="text-red-500 text-sm">{errors.blood_group.message}</p>}
        </div>

        {/* District */}
        <div>
          <label className="label">District</label>
          <select
            {...register('district', { required: 'District is required' })}
            className="select select-bordered w-full"
            disabled={!editMode}
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
        </div>

        {/* Upazila */}
        <div>
          <label className="label">Upazila</label>
          <select
            {...register('upazila', { required: 'Upazila is required' })}
            className="select select-bordered w-full"
            disabled={!editMode}
          >
            <option value="">Select Upazila</option>
            {availableUpazilas.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          {errors.upazila && <p className="text-red-500 text-sm">{errors.upazila.message}</p>}
        </div>

        {editMode && (
          <button type="submit" className="btn btn-primary w-full">
            Save
          </button>
        )}
      </form>
    </div>
    </>
  );
};

export default DashboardProfile;
