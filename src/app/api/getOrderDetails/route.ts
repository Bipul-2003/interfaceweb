
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentIntentId = searchParams.get('paymentIntentId');

  if (!paymentIntentId) {
    return new Response(JSON.stringify({ error: 'PaymentIntent ID is required' }), { status: 400 });
  }

  try {
    console.log(paymentIntentId);
    // console.log(stripe);
    
    // Fetch payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    // console.log(paymentIntent);
    

    // Extract order details
    const orderDetails = {
      orderId: paymentIntent.id,
      date: new Date(paymentIntent.created * 1000).toISOString(),
      totalAmount: paymentIntent.amount / 100, // Stripe amount is in cents
    };

    return new Response(JSON.stringify({ data: orderDetails }), { status: 200 });
  } catch (error) {
    console.error('Error fetching payment intent:', error);
    return new Response(JSON.stringify({ error: 'Unable to retrieve order details' }), { status: 500 });
  }
}
