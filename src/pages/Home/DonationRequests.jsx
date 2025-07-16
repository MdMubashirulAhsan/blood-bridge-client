import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
// import axios from 'axios';
import useAxios from '../../hooks/useAxios';

const DonationRequests = () => {
  const axios = useAxios();
  const { data: response = {}, isLoading, isError, error } = useQuery({
    queryKey: ['publicDonationRequests'],
    queryFn: async () => {
      try {
        const res = await axios.get('/public-donation-requests', {
          params: {
            status: 'pending',
            page: 0,
            size: 100,
          },
        });
        console.log("✅ Public donation data:", res.data);
        return res.data; // { total, data: [...] }
      } catch (err) {
        console.error("❌ Failed to fetch donation requests:", err.response?.data || err.message);
        throw err;
      }
    }
  });

  const requests = response.data || [];

  if (isLoading) return <p className="text-center py-10">Loading donation requests...</p>;

  if (isError || !Array.isArray(requests)) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load donation requests.
        <br />
        <small>{error?.response?.data?.message || error?.message}</small>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Pending Blood Donation Requests</h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No pending requests found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div key={req._id} className="p-4 border rounded-lg shadow bg-base-100">
              <h3 className="text-xl font-semibold mb-1">Recipient: {req.recipientName}</h3>
              <p>Location: {req.recipientDistrict || 'N/A'}, {req.recipientUpazila || 'N/A'}</p>
              <p>
                Blood Group: <strong>{req.bloodGroup}</strong>
              </p>
              <p>
                Date: {req.donationDate || 'N/A'} | Time: {req.donationTime || 'N/A'}
              </p>
              <Link
                to={`/donation-request/${req._id}`}
                className="btn btn-primary btn-sm mt-3"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequests;
