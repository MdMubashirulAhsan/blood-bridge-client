import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import districts from '../../assets/districts.json';
import upazilas from '../../assets/upazilas.json';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const CreateDonationRequest = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const selectedDistrict = watch('recipientDistrict');
  const filteredUpazilas = selectedDistrict ? upazilas[selectedDistrict] || [] : [];

  // Fetch user from database to get status and name
  const { data: dbUser, isLoading: userLoading } = useQuery({
    queryKey: ['dbUser', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // Set requester name and email from dbUser
  useEffect(() => {
    if (dbUser) {
      reset({
        requesterName: dbUser.name,
        requesterEmail: dbUser.email,
      });
    }
  }, [dbUser, reset]);

  const onSubmit = async (data) => {
    if (dbUser?.status !== 'active') {
      Swal.fire({
        icon: 'error',
        title: 'Blocked',
        text: 'You are blocked and cannot create donation requests.',
      });
      return;
    }

    setLoading(true);

    try {
      const requestData = { ...data, donationStatus: 'pending' };
      const res = await axiosSecure.post('/donation-requests', requestData);

      if (res.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Request Created',
          text: 'Your donation request was created successfully.',
        });
      }

      reset({
        requesterName: dbUser.name,
        requesterEmail: dbUser.email,
        recipientName: '',
        recipientDistrict: '',
        recipientUpazila: '',
        hospitalName: '',
        fullAddress: '',
        bloodGroup: '',
        donationDate: '',
        donationTime: '',
        requestMessage: '',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Create',
        text: error.message || 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return <div className="text-center mt-10">Loading user data...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto p-6 bg-base-100 rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create Donation Request</h2>

      {/* Requester Name */}
      <div>
        <label className="label">Requester Name</label>
        <input
          type="text"
          {...register('requesterName')}
          className="input input-bordered w-full"
          readOnly
        />
      </div>

      {/* Requester Email */}
      <div>
        <label className="label">Requester Email</label>
        <input
          type="email"
          {...register('requesterEmail')}
          className="input input-bordered w-full"
          readOnly
        />
      </div>

      {/* Recipient Name */}
      <div>
        <label className="label">Recipient Name</label>
        <input
          type="text"
          {...register('recipientName', { required: 'Recipient name is required' })}
          className="input input-bordered w-full"
        />
        {errors.recipientName && <p className="text-red-500 text-sm">{errors.recipientName.message}</p>}
      </div>

      {/* Recipient District */}
      <div>
        <label className="label">Recipient District</label>
        <select
          {...register('recipientDistrict', { required: 'District is required' })}
          className="select select-bordered w-full"
        >
          <option value="">Select District</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {errors.recipientDistrict && <p className="text-red-500 text-sm">{errors.recipientDistrict.message}</p>}
      </div>

      {/* Recipient Upazila */}
      <div>
        <label className="label">Recipient Upazila</label>
        <select
          {...register('recipientUpazila', { required: 'Upazila is required' })}
          className="select select-bordered w-full"
          disabled={!selectedDistrict}
        >
          <option value="">Select Upazila</option>
          {filteredUpazilas.map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        {errors.recipientUpazila && <p className="text-red-500 text-sm">{errors.recipientUpazila.message}</p>}
      </div>

      {/* Hospital Name */}
      <div>
        <label className="label">Hospital Name</label>
        <input
          type="text"
          {...register('hospitalName', { required: 'Hospital name is required' })}
          className="input input-bordered w-full"
        />
        {errors.hospitalName && <p className="text-red-500 text-sm">{errors.hospitalName.message}</p>}
      </div>

      {/* Full Address */}
      <div>
        <label className="label">Full Address</label>
        <input
          type="text"
          {...register('fullAddress', { required: 'Address is required' })}
          className="input input-bordered w-full"
        />
        {errors.fullAddress && <p className="text-red-500 text-sm">{errors.fullAddress.message}</p>}
      </div>

      {/* Blood Group */}
      <div>
        <label className="label">Blood Group</label>
        <select
          {...register('bloodGroup', { required: 'Blood group is required' })}
          className="select select-bordered w-full"
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
        {errors.bloodGroup && <p className="text-red-500 text-sm">{errors.bloodGroup.message}</p>}
      </div>

      {/* Donation Date */}
      <div>
        <label className="label">Donation Date</label>
        <input
          type="date"
          {...register('donationDate', { required: 'Date is required' })}
          className="input input-bordered w-full"
        />
        {errors.donationDate && <p className="text-red-500 text-sm">{errors.donationDate.message}</p>}
      </div>

      {/* Donation Time */}
      <div>
        <label className="label">Donation Time</label>
        <input
          type="time"
          {...register('donationTime', { required: 'Time is required' })}
          className="input input-bordered w-full"
        />
        {errors.donationTime && <p className="text-red-500 text-sm">{errors.donationTime.message}</p>}
      </div>

      {/* Request Message */}
      <div>
        <label className="label">Request Message</label>
        <textarea
          {...register('requestMessage', { required: 'Request message is required' })}
          className="textarea textarea-bordered w-full"
          rows={4}
          placeholder="Why do you need the blood?"
        />
        {errors.requestMessage && <p className="text-red-500 text-sm">{errors.requestMessage.message}</p>}
      </div>

      {/* Submit */}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Request'}
      </button>
    </form>
  );
};

export default CreateDonationRequest;
