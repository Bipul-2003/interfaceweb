'use client'

import { Suspense, use, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Home, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axios from 'axios'

interface OrderDetails {
  orderId: string
  date: string
  totalAmount: number
}

function SuccessPageComponent() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const updateDatabase = async () => {
      const paymentIntentId = searchParams.get('payment_intent')
      // console.log(paymentIntentId);
      
      const productId = searchParams.get('product_ids')
      // console.log(productId);
      const userId = searchParams.get('user_id')
      // console.log(userId);

      if (!paymentIntentId || !productId || !userId) {
        setError('Missing required information')
        setLoading(false)
        return
      }

      const productids = productId.split(',')

      for (const id of productids) {
        try {
          const res = await axios.patch(`/api/enrollments/${id}`, {
            paymentDone: true,
            bookingConfirmed: true,
          })
          if (res.status === 200) {
            console.log("Approved")
            continue
          }
        } catch (error) {
          console.error("Error approving booking: ", error)
          setError('Error approving booking')
          break
        }
      }
      setLoading(false)
    }

    updateDatabase()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Processing your order...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-xl text-red-500 mb-4">Error: {error}</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-xl mb-4">No order details found.</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-center">Payment Successful!</CardTitle>
          <CardDescription className="text-center">
            Thank you for your purchase. Your order has been confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            We&apos;ve sent a confirmation email with your order details. If you have any questions, please don&apos;t hesitate to contact our support team.
          </p>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold mb-2">Order Summary:</h3>
            <ul className="list-disc list-inside">
              <li>Order Number: #{orderDetails.orderId}</li>
              <li>Date: {orderDetails.date}</li>
              <li>Total Amount: ${orderDetails.totalAmount.toFixed(2)}</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" /> Return to Home
            </Button>
          </Link>
          <Link href={`/order-details/${orderDetails.orderId}`}>
            <Button className="w-full sm:w-auto">
              <FileText className="mr-2 h-4 w-4" /> View Order Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><p className="text-xl">Loading...</p></div>}>
      <SuccessPageComponent />
    </Suspense>
  )
}
