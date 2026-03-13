// Order storage - in production, use a database
// For now, we share the orders with webhooks.js
const webhooks = require('./webhooks');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Check admin authorization
  const adminCode = req.headers.authorization?.replace('Bearer ', '');
  const isAdmin = adminCode === process.env.ADMIN_CODE;
  
  try {
    if (req.method === 'GET') {
      // Get all orders (admin) or user's orders
      const email = req.query.email;
      
      if (isAdmin) {
        // Admin gets all orders
        const orders = webhooks.getOrders();
        return res.status(200).json({ orders: orders.reverse() });
      } else if (email) {
        // User gets their orders
        const orders = webhooks.getOrders().filter(o => o.customerEmail === email);
        return res.status(200).json({ orders: orders.reverse() });
      } else {
        return res.status(400).json({ error: 'Email required for order history' });
      }
    }
    
    if (req.method === 'PUT' && isAdmin) {
      // Admin updates order status
      const { orderId, status } = req.body;
      
      if (!orderId || !status) {
        return res.status(400).json({ error: 'Order ID and status required' });
      }
      
      const order = webhooks.updateOrderStatus(orderId, status);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      // Send status update email to customer
      try {
        await fetch(process.env.API_URL + '/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'status_update',
            order: order,
            status: status
          })
        });
        console.log('Status update email sent');
      } catch (emailErr) {
        console.error('Failed to send status update email:', emailErr);
      }
      
      return res.status(200).json({ success: true, order });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('Orders API error:', error);
    res.status(500).json({ error: error.message });
  }
};
