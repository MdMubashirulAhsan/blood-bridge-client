import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';
import DonationModal from '../../pages/Home/DonationModal';
import { Helmet } from 'react-helmet';

const DonationRequestDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const { data: request, isLoading } = useQuery({
    queryKey: ['donationRequest', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-requests/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
    <Helmet>
            <title>Donation Requests | Blood Bridge</title>
        </Helmet>
    
    
    <div className=" mx-auto py-10">
      <h2 className="text-3xl font-bold mb-4">Donation Request Details</h2>
      <p><strong>Recipient:</strong> {request.recipientName}</p>
      <p><strong>District:</strong> {request.recipientDistrict}</p>
      <p><strong>Upazila:</strong> {request.recipientUpazila}</p>
      <p><strong>Blood Group:</strong> {request.bloodGroup}</p>
      <p><strong>Hospital Name:</strong> {request.hospitalName}</p>
      <p><strong>Full Address:</strong> {request.fullAddress}</p>
      <p><strong>Donation Date:</strong> {request.donationDate}</p>
      <p><strong>Donation Time:</strong> {request.donationTime}</p>
      <p><strong>Request Message:</strong> {request.requestMessage}</p>

      <button onClick={() => setShowModal(true)} className="btn btn-accent mt-5">
        Donate Now
      </button>

      {showModal && (
        <DonationModal
          requestId={id}
          user={user}
          closeModal={() => setShowModal(false)}
        />
      )}
    </div>
    </>
  );
};

export default DonationRequestDetails;
