// src/pages/Dashboard/ViewDonationRequest.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ViewDonation = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: request, isLoading, isError } = useQuery({
    queryKey: ['donationRequest', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-requests/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError || !request) return <p className="p-4 text-error">Donation request not found.</p>;

  const {
    recipientName,
    recipientDistrict,
    recipientUpazila,
    bloodGroup,
    donationDate,
    donationTime,
    donationStatus,
    additionalInfo,
    requesterName,
    requesterPhone,
  } = request;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-base-100 shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Donation Request Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><strong>Recipient Name:</strong> {recipientName}</div>
        <div><strong>Blood Group:</strong> {bloodGroup}</div>
        <div><strong>District:</strong> {recipientDistrict}</div>
        <div><strong>Upazila:</strong> {recipientUpazila}</div>
        <div><strong>Donation Date:</strong> {donationDate}</div>
        <div><strong>Donation Time:</strong> {donationTime}</div>
        <div><strong>Status:</strong> <span className="capitalize">{donationStatus}</span></div>
        <div><strong>Requested By:</strong> {requesterName}</div>
        <div><strong>Phone:</strong> {requesterPhone}</div>
        {additionalInfo && <div className="md:col-span-2"><strong>Additional Info:</strong> {additionalInfo}</div>}
      </div>

      <div className="mt-6 flex gap-3">
        <Link to="/dashboard/my-donation-requests" className="btn btn-outline">
          Back to My Requests
        </Link>
      </div>
    </div>
  );
};

export default ViewDonation;
