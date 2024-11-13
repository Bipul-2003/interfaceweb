'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import CheckoutForm from '@/components/CheckoutForm'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import getSession from '@/utils/getSession'
import axios from 'axios'
import { useCart } from '@/context/cartCount'
import CartCard from '@/components/CartCard'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [clientSecret, setClientSecret] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('contact')
  const [userId, setUserId] = useState<string | undefined>()
  const [total, setTotal] = useState(0)
  const paymentIntentCreated = useRef(false)
  const cartFetched = useRef(false) // Added ref to track cart fetch

  const { removeFromCart, updateCart } = useCart()

  const fetchUser = useCallback(async () => {
    const session = await getSession()
    if (session?.user?.id) {
      setUserId(session.user.id)
    } else {
      // Redirect to login if no session
      window.location.href = '/login'
    }
  }, [])

  const fetchCart = useCallback(async () => {
    try {
      const response = await axios.get('/api/getCart')
      setCartItems(response.data)
      updateCart()
    } catch (error) {
      console.error('Error fetching cart:', error)
      cartFetched.current = false // Reset on error to allow retry
    }
  }, [updateCart])

  const removeCartItem = useCallback(async (sessionId: number, enrollmentId: number) => {
    try {
      await axios.patch('/api/getCart', { sessionid: sessionId })
      await axios.get(`/api/admin/reject-enrollment/${enrollmentId}`)
      await fetchCart()
      removeFromCart()
    } catch (error) {
      console.error('Error removing item from cart:', error)
    }
  }, [fetchCart, removeFromCart])

  useEffect(() => {
    if (!cartFetched.current) { // Updated useEffect to only run once
      cartFetched.current = true
      fetchUser()
      fetchCart()
    }
  }, [fetchUser, fetchCart])

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + Number(item.price), 0)
    setTotal(newTotal)
  }, [cartItems])

  useEffect(() => {
    if (total > 0 && userId && !paymentIntentCreated.current) {
      paymentIntentCreated.current = true
      fetch('/api/embedded-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total * 100,
          productIds: cartItems.map((p) => p.id),
          userId,
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((error) => {
          console.error('Error creating payment intent:', error)
          paymentIntentCreated.current = false
        })
    }
  }, [total, userId, cartItems])

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: { theme: 'stripe' },
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-8xl">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="sm:flex gap-4">
            {cartItems.map((item) => (
              <CartCard 
                key={item.sessionId}
                title={item.course.title}
                sessionNo={item.sessionno}
                startDate={item.session.startDate}
                endDate={item.session.endDate}
                timing={`${item.session.startTime} - ${item.session.endTime}`}
                instructor={item.session.instructor}
                days={item.session.days}
                status={item.status}
                paymentDueDate={item.paymentLastDate}
                price={item.price}
                onRemove={() => removeCartItem(item.sessionId, item.enrollmentId)}
              />
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
                className="mb-4 flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="contact" id="contact" />
                  <Label htmlFor="contact">Contact Payment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Card Payment</Label>
                </div>
              </RadioGroup>
              {paymentMethod === 'contact' ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">Bank Information</h3>
                  <p>Please transfer the total amount to the following bank account:</p>
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
                  {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                      <CheckoutForm
                        amount={total}
                        cartItems={cartItems}
                        userId={userId}
                      />
                    </Elements>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}