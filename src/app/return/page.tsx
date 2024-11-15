"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";

interface OrderDetails {
  orderId: string;
  date: string;
  totalAmount: number;
}

function SuccessPageComponent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateDatabase = async () => {
      const paymentIntentId = searchParams.get("payment_intent");
      const productId = searchParams.get("product_ids");
      const userId = searchParams.get("user_id");

      if (!paymentIntentId || !productId || !userId) {
        setError("Missing required information");
        setLoading(false);
        return;
      }
      console.log("Product ID:", productId);

      try {
        // Fetch order details from Stripe
        const orderResponse = await axios.get(
          `/api/getOrderDetails?paymentIntentId=${paymentIntentId}`
        );
        const orderData = orderResponse.data.data;
        console.log("Order Data:", orderData);

        setOrderDetails({
          orderId: orderData.orderId,
          date: new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          }).format(new Date(orderData.date)),
          totalAmount: orderData.totalAmount,
        });

        // Process single or multiple product IDs
        const productIds = productId.includes(",")
          ? productId.split(",")
          : [productId];

        for (const id of productIds) {
          try {
            console.log("Processing enrollment for product ID:", id);
            const res = await axios.patch(`/api/enrollments/${id}`, {
              paymentDone: true,
              bookingConfirmed: true,
            });
            if (res.status === 200) {
              console.log(`Enrollment ${id} approved`);
              await axios.patch("/api/getCart", { sessionid: id });
            }
          } catch (error: any) {
            console.error(`Error approving booking for ${id}: `, error);
            throw new Error(
              `Error approving booking for ${id}: ${error.message}`
            );
          }
        }
      } catch (error: any) {
        console.error(
          "Error fetching order details or processing enrollments: ",
          error
        );
        setError(`Error processing your order: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    updateDatabase();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Processing your order...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-xl text-red-500 mb-4">
          {/* Error: {error} */}
          Something went wrong. Please contact support.
        </p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-xl mb-4">No order details found.</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-center">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-center">
            Thank you for your purchase. Your order has been confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            We&apos;ve sent a confirmation email with your order details. If you
            have any questions, please don&apos;t hesitate to contact our
            support team.
          </p>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold mb-2">Order Summary:</h3>
            <dl className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1">
              <dt className="font-medium">Date:</dt>
              <dd className="text-sm text-muted-foreground">
                {orderDetails.date}
              </dd>
              <dt className="font-medium">Total Amount:</dt>
              <dd className="text-sm text-muted-foreground">
                ${orderDetails.totalAmount.toFixed(2)}
              </dd>
            </dl>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl">Loading...</p>
        </div>
      }>
      <SuccessPageComponent />
    </Suspense>
  );
}
