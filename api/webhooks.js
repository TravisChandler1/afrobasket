const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      // Order completed - you can:
      // 1. Send confirmation email
      // 2. Update database with order status
      // 3. Send notification to admin
      
      console.log('Payment successful for session:', session.id);
      console.log('Customer email:', session.customer_email);
      console.log('Amount total:', session.amount_total);
      
      // Parse metadata for order details
      if (session.metadata && session.metadata.order_items) {
        const orderItems = JSON.parse(session.metadata.order_items);
        console.log('Order items:', orderItems);
      }
      
      // TODO: Add your own logic here (database updates, emails, etc.)
      // Example:
      // await sendOrderConfirmationEmail(session.customer_email, session);
      // await updateOrderStatus(session.metadata.orderId, 'paid');
      
      break;
    }
    
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      break;
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message);
      break;
    }
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return 200 to acknowledge receipt
  res.status(200).json({ received: true });
};
