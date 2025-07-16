import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const DonationModal = ({ requestId, user, closeModal }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await axiosSecure.patch(`/donation-requests/${requestId}`, {
        donorName: user.displayName,
        donorEmail: user.email,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['donationRequest']);
      closeModal();
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Your Donation</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}>
          <div className="mb-4">
            <label className="label">Donor Name</label>
            <input type="text" value={user.displayName} readOnly className="input input-bordered w-full" />
          </div>
          <div className="mb-4">
            <label className="label">Donor Email</label>
            <input type="email" value={user.email} readOnly className="input input-bordered w-full" />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-success">Confirm Donation</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationModal;
