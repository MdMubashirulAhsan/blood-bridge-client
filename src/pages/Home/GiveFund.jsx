import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../../components/CheckoutForm";
import { Helmet } from "react-helmet";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const GiveFund = () => {
  return (
    <>
    
    <Helmet>
      <title>Give Fund | Blood Bridge</title>
    </Helmet>
    
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Give Fund</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
    </>
  );
};

export default GiveFund;
