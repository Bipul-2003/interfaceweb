"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CheckoutForm from "@/components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import getSession from "@/utils/getSession";
import axios from "axios";
import { useCart } from "@/context/cartCount";
// Define types
// type CartItem = {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// };
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CartPage() {
  // Mock cart data
  const [cartItems, setCartItems] = useState<any[]>([]);
  console.log(cartItems);
  
  const [clientSecret, setClientSecret] = React.useState("");
  const [paymentMethod, setPaymentMethod] = useState("contact");
  const [userId, setUserId] = useState<string>();

  const { removeFromCart, updateCart } = useCart();

  const fetchUser = async () => {
    const session = await getSession();
    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    setUserId(session?.user?.id);
  };

  const fetchCart = async () => {
    const response = await axios.get("/api/getCart");
    console.log(response.data.cartitems);
    updateCart(response.data.cartitems.length);
    setCartItems(response.data.cartitems);
  };

  const removecart = async (id: number) => {
    const response = await axios.patch("/api/getCart", {
      sessionid: id,
    });
    console.log(response.data);
    fetchCart();
  };
  useEffect(() => {
    const fetchCart = async () => {
      const response = await axios.get("/api/getCart");
      console.log(response.data.cartitems);
      updateCart(response.data.cartitems.length);
      setCartItems(response.data.cartitems);
    };
    fetchCart();
  }, []);

  React.useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    try {
      fetchUser();
      if (total > 0) {
        fetch("/api/embedded-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total * 100, // Convert to cents
            productIds: cartItems.map((p) => p.id),
            userId,
          }), // Convert to cents
        })
          .then((res) => res.json())
          .then((data) => setClientSecret(data.clientSecret));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [cartItems, userId]);

  // Calculate total cart value
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.session.price),
    0
  );

  // Update quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    removeFromCart();
    removecart(id);
  };

  // Mock function for payment processing
  // const processPayment = () => {
  //   console.log(`Processing ${paymentMethod} payment for $${total.toFixed(2)}`);
  //   // In a real application, you would handle the payment processing here
  // };

  const appearance = {
    theme: "stripe",
    // paymentMethodOrder: ["card"],
    // payment_method_types: ['card','us_bank_account'],
  };
  const options = {
    clientSecret,
    appearance,
  };

  // console.log(cartItems[0].price)
  return (
    <div className="container mx-auto px-4 py-24 max-w-8xl">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
                {/* <Image 
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
                */}

                <div className="flex-grow">
                  <div className="flex space-x-4">
                    <h2 className="font-semibold">
                      {item.session.course.title}
                    </h2>
                    <p className="text-gray-600 text-xs md:text-base">
                      session: {item.session.sessionno}
                    </p>
                  </div>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                    aria-label="Decrease quantity">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                    aria-label="Increase quantity">
                    <Plus className="w-4 h-4" />
                  </button>
                </div> */}

                <p className="text-muted-foreground text-xs md:text-base">
                  Due:{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  }).format(new Date(item.session.paymentLastDate as string))}
                </p>
                <p className="font-semibold text-xs md:text-base">$ {item.session.price}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 rounded-full bg-red-100 text-red-500 hover:bg-red-200"
                  aria-label="Remove item">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between items-center px-6">
            <h2 className="text-xl font-bold">Total:</h2>
            <p className="text-2xl font-bold">${total.toFixed(2)}</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 w-full">Proceed to Checkout</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Choose Payment Method</DialogTitle>
              </DialogHeader>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="mb-4 flex">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="contact" id="contact" />
                  <Label htmlFor="contact">Contact Payment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Card Payment</Label>
                </div>
              </RadioGroup>
              {paymentMethod === "contact" ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">Bank Information</h3>
                  <p>
                    Please transfer the total amount to the following bank
                    account:
                  </p>
                  <div>
                    <p>Bank Name: Example Bank</p>
                    <p>Account Name: Your Company Name</p>
                    <p>Account Number: 1234567890</p>
                    <p>Sort Code: 12-34-56</p>
                    <p>Reference: Your Order Number</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* <h3 className="font-semibold">Card Payment</h3>
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-date">Expiry Date</Label>
                      <Input id="expiry-date" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div> */}
                  <Elements
                    options={options as StripeElementsOptions}
                    stripe={stripePromise}>
                    <CheckoutForm
                      amount={total}
                      cartItems={cartItems}
                      userId={userId}
                    />
                  </Elements>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
