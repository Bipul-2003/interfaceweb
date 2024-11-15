// import { stripe } from '@/lib/stripeConfig';
// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//     try {
//         const { price } = await request.json();

//         const session = await stripe.checkout.sessions.create({
//             ui_mode: 'embedded',
//             payment_method_types: ['card','us_bank_account'],
//             line_items: [
//               {
//                 price_data: {
//                   currency: 'usd',
//                   product_data: {
//                     name: 'Your Product',
//                   },
//                   unit_amount: price * 100, // Convert to cents
//                 },
//                 quantity: 1,
//               },
//             ],
//             mode: 'payment',
//             return_url: `${request.headers.get('origin')}/return?session_id={CHECKOUT_SESSION_ID}`,
//         });

//         return NextResponse.json({ id: session.id, client_secret: session.client_secret });
//     } catch (error: any) {
//       console.error(error);
//         return NextResponse.json({ message: error.message }, { status: 500 });
//     }
// }


import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    const { amount,userId,productIds } = await request.json();
    // console.log(productIds);
    

    const paymentIntent = await stripe.paymentIntents.create({
      // payment_method_types: ['card','us_bank_account'],
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        integration_check: "accept_a_payment",
        userId: userId,
        productIds: productIds.join(", "),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}