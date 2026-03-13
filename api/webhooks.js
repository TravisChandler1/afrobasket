const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Simple in-memory order storage (for demo - use database in production)
const orders = [];

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
      
      // Parse metadata for order details
      let orderItems = [];
      if (session.metadata && session.metadata.order_items) {
        orderItems = JSON.parse(session.metadata.order_items);
      }
      
      // Create order object
      const order = {
        orderId: session.id.slice(-8).toUpperCase(),
        stripeSessionId: session.id,
        customerEmail: session.customer_email,
        customerName: session.customer_details?.name || '',
        customerPhone: session.customer_details?.phone || '',
        shippingAddress: session.customer_details?.address?.line1 + ', ' + 
                          session.customer_details?.address?.city + ', ' + 
                          session.customer_details?.address?.postal_code + ', ' + 
                          session.customer_details?.address?.country || '',
        items: orderItems,
        total: session.amount_total / 100,
        status: 'pending',
        date: new Date().toISOString(),
      };
      
      // Store order (in production, save to database)
      orders.push(order);
      console.log('Order stored:', order.orderId);
      
      // Send confirmation email to customer
      try {
        await fetch(process.env.API_URL + '/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'order_confirmation',
            order: order
          })
        });
        console.log('Confirmation email sent to:', order.customerEmail);
      } catch (emailErr) {
        console.error('Failed to send confirmation email:', emailErr);
      }
      
      // Send notification to admin
      try {
        await fetch(process.env.API_URL + '/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'admin_notification',
            order: order
          })
        });
        console.log('Admin notification sent');
      } catch (emailErr) {
        console.error('Failed to send admin notification:', emailErr);
      }
      
      console.log('Payment successful for session:', session.id);
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

// Export orders for admin API
module.exports.getOrders = () => orders;
module.exports.updateOrderStatus = (orderId, status) => {
  const order = orders.find(o => o.orderId === orderId);
  if (order) {
    order.status = status;
    return order;
  }
  return null;
};
