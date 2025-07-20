import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const DonationModal = ({ requestId, user, closeModal }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  

const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.patch(`/donation-requests/${requestId}`, {
        donorName: user.displayName,
        donorEmail: user.email,
        donationStatus: 'inprogress',
      });
      return res.data;
    },
    onSuccess: (data) => {
      // Update cache & refetch
      queryClient.setQueryData(['donationRequest', requestId], (old) =>
        old
          ? {
              ...old,
              donationStatus: data.donationStatus,
              donorName: user.displayName,
              donorEmail: user.email,
            }
          : old
      );
      queryClient.invalidateQueries({ queryKey: ['donationRequests'] });

      closeModal();
      Swal.fire({
        title: 'Donation Confirmed!',
        text: 'You have successfully confirmed this donation request.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#22c55e',
      });
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error!',
        text: error?.response?.data?.message || 'Failed to confirm donation.',
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#ef4444',
      });
    },
  });


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Your Donation</h2>
        <p className="mb-4 text-sm text-gray-600">
          By confirming the donation, the status will be changed from <strong>pending</strong> to <strong>inprogress</strong>.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="mb-4">
            <label className="label">Donor Name</label>
            <input type="text" value={user.displayName} readOnly className="input input-bordered w-full" />
          </div>
          <div className="mb-4">
            <label className="label">Donor Email</label>
            <input type="email" value={user.email} readOnly className="input input-bordered w-full" />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" className="btn btn-ghost" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Confirm Donation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationModal;
