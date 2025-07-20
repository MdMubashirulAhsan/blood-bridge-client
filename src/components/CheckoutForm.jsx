import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // 1. Create payment intent
      const { data } = await axiosSecure.post("/create-payment-intent", { amount });
      const clientSecret = data.clientSecret;

      // 2. Confirm card payment
      const card = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            email: user?.email,
            name: user?.displayName || "Anonymous",
          },
        },
      });

      if (paymentResult.error) {
        Swal.fire("Error", paymentResult.error.message, "error");
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        // 3. Save funding in DB
        await axiosSecure.post("/funding", {
          userName: user?.displayName || "Anonymous",
          userEmail: user?.email,
          amount,
          date: new Date(),
        });

        Swal.fire("Success", "Thank you for your contribution!", "success");
      }
    } catch (error) {
      Swal.fire(`${error}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        className="input input-bordered w-full"
      />
      <CardElement className="p-4 border rounded" />
      <button type="submit" className="btn btn-primary w-full" disabled={!stripe || processing}>
        {processing ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

export default CheckoutForm;
