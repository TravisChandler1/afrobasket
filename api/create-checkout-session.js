const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, customerEmail } = req.body;

    // Transform cart items to Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.name,
          description: item.desc,
          images: item.img ? [item.img] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.qty,
    }));

    // Calculate shipping cost (example: flat rate)
    const shippingCost = 8.00;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    
    // Add shipping as a line item if cart is not empty
    if (items.length > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Shipping',
            description: 'Standard delivery',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: {
        order_items: JSON.stringify(items.map(item => ({
          name: item.name,
          quantity: item.qty,
          price: item.price
        })))
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
};
