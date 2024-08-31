import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import { useRouter } from "next/navigation";


export default function CheckoutForm({ amount, cartItems, userId }: any) {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // React.useEffect(() => {
  //   if (!stripe) {
  //     return;
  //   }

  //   const clientSecret = new URLSearchParams(window.location.search).get(
  //     "payment_intent_client_secret"
  //   );

  //   if (!clientSecret) {
  //     return;
  //   }

  //   stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
  //     switch (paymentIntent?.status) {
  //       case "succeeded":
  //         setMessage("Payment succeeded!");
  //         break;
  //       case "processing":
  //         setMessage("Your payment is processing.");
  //         break;
  //       case "requires_payment_method":
  //         setMessage("Your payment was not successful, please try again.");
  //         break;
  //       default:
  //         setMessage("Something went wrong.");
  //         break;
  //     }
  //   });
  // }, [stripe]);

 

  // const handleSubmit = async (e:any) => {
  //   e.preventDefault();

  //   if (!stripe || !elements) {
  //     // Stripe.js hasn't yet loaded.
  //     // Make sure to disable form submission until Stripe.js has loaded.
  //     return;
  //   }

  //   setIsLoading(true);

  //   const { error } = await stripe.confirmPayment({
  //     elements,
  //     confirmParams: {
  //       // Make sure to change this to your payment completion page
  //       return_url:`http://localhost:3000/return?status=complete`,
  //     },
  //   });

  //   // This point will only be reached if there is an immediate error when
  //   // confirming the payment. Otherwise, your customer will be redirected to
  //   // your `return_url`. For some payment methods like iDEAL, your customer will
  //   // be redirected to an intermediate site first to authorize the payment, then
  //   // redirected to the `return_url`.
  //   if (error.type === "card_error" || error.type === "validation_error") {
  //     setMessage("An error occurred. Please try again.");
  //   } else {
  //     setMessage("An unexpected error occurred.");
  //   }

  //   setIsLoading(false);
  // };

  // const paymentElementOptions = {
  //   layout:'tabs',
  //   // business: {name: 'Inerface Hub'},

  // };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!stripe || !elements) {
      setError("Stripe hasn't loaded yet. Please try again.")
      setIsLoading(false)
      return
    }

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw new Error(submitError.message)
      }

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/return?product_ids=${cartItems.map((p:any) => p.id).join(',')}&user_id=${userId}`,
        },
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      // If we get here, the payment was successful.
      // The actual redirect will be handled by Stripe, so we don't need to do anything else.

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
      {/* <h2 className="text-3xl font-bold">$ {amount}</h2> */}

      <PaymentElement/>
      <div className="flex flex-col justify-center">
        <Button disabled={isLoading || !stripe || !elements} id="submit">
          <span className="font-bold">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              `Pay $ ${amount}`
            )}
          </span>
        </Button>
        {/* Show any error or success messages */}
        {message && (
          <div id="payment-message" className="text-center">
            {message}
          </div>
        )}
      </div>
    </form>
  );
}
