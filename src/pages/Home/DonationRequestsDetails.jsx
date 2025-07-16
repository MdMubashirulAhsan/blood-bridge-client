import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';
import DonationModal from '../../pages/Home/DonationModal';

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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Donation Request Details</h2>
      <p><strong>Recipient:</strong> {request.recipientName}</p>
      <p><strong>Location:</strong> {request.location}</p>
      <p><strong>Blood Group:</strong> {request.bloodGroup}</p>
      <p><strong>Date:</strong> {request.date}</p>
      <p><strong>Time:</strong> {request.time}</p>
      <p><strong>Additional Info:</strong> {request.additionalInfo || 'N/A'}</p>

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
  );
};

export default DonationRequestDetails;
