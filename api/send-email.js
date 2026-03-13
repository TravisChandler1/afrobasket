const nodemailer = require('nodemailer');

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Email templates
const getOrderConfirmationEmail = (order) => {
  const itemsList = order.items
    .map(item => `<li>${item.qty}x ${item.name} - $${(item.price * item.qty).toFixed(2)}</li>`)
    .join('');

  return {
    subject: `Order Confirmed - AfroBasket #${order.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #00C96B; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AfroBasket</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">Order Confirmed! ✅</h2>
          
          <p>Thank you for your order, <strong>${order.customerName || 'Customer'}</strong>!</p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> #${order.orderId}</p>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
            <p><strong>Delivery Address:</strong> ${order.shippingAddress || 'Not provided'}</p>
          </div>
          
          <h3 style="color: #333;">Order Details:</h3>
          <ul style="list-style: none; padding: 0;">
            ${itemsList}
          </ul>
          
          <div style="border-top: 2px solid #00C96B; padding-top: 15px; margin-top: 15px;">
            <p style="font-size: 18px;"><strong>Total: $${order.total.toFixed(2)}</strong></p>
          </div>
          
          <p>We'll send you another email once your order is shipped.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
            <p>AfroBasket - Authentic Nigerian Groceries</p>
            <p>This email was sent to ${order.customerEmail}</p>
          </div>
        </div>
      </div>
    `,
  };
};

const getAdminNotificationEmail = (order) => {
  const itemsList = order.items
    .map(item => `<li>${item.qty}x ${item.name} - $${(item.price * item.qty).toFixed(2)}</li>`)
    .join('');

  return {
    subject: `🔔 New Order Received - AfroBasket #${order.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #FF6B2B; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AfroBasket Admin</h1>
        </div>
        
        <div style="padding: 20px; background: #fff3e0;">
          <h2 style="color: #333;">🔔 New Order Received!</h2>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> #${order.orderId}</p>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
            <p><strong>Customer:</strong> ${order.customerName || 'Not provided'}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            <p><strong>Phone:</strong> ${order.customerPhone || 'Not provided'}</p>
            <p><strong>Address:</strong> ${order.shippingAddress || 'Not provided'}</p>
          </div>
          
          <h3 style="color: #333;">Order Items:</h3>
          <ul style="list-style: none; padding: 0;">
            ${itemsList}
          </ul>
          
          <div style="border-top: 2px solid #FF6B2B; padding-top: 15px; margin-top: 15px;">
            <p style="font-size: 18px;"><strong>Total: $${order.total.toFixed(2)}</strong></p>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3000/admin'}" 
               style="background: #00C96B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View in Admin Dashboard
            </a>
          </p>
        </div>
      </div>
    `,
  };
};

const getOrderStatusUpdateEmail = (order, status) => {
  const statusMessages = {
    'processing': 'Your order is being processed.',
    'shipped': 'Your order has been shipped!',
    'delivered': 'Your order has been delivered.',
    'completed': 'Your order is complete. Thank you for shopping with us!',
  };

  return {
    subject: `Order Update - AfroBasket #${order.orderId} - ${status.toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #00C96B; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AfroBasket</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">Order Update 📦</h2>
          
          <p>Hi <strong>${order.customerName || 'Customer'}</strong>,</p>
          
          <p>${statusMessages[status] || 'Your order status has been updated.}</p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> #${order.orderId}</p>
            <p><strong>Status:</strong> ${status.toUpperCase()}</p>
          </div>
          
          <p>If you have any questions, please reply to this email.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
            <p>AfroBasket - Authentic Nigerian Groceries</p>
          </div>
        </div>
      </div>
    `,
  };
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, order, status } = req.body;

    let mailOptions;

    switch (type) {
      case 'order_confirmation':
        mailOptions = {
          from: process.env.GMAIL_EMAIL,
          to: order.customerEmail,
          subject: getOrderConfirmationEmail(order).subject,
          html: getOrderConfirmationEmail(order).html,
        };
        break;

      case 'admin_notification':
        mailOptions = {
          from: process.env.GMAIL_EMAIL,
          to: process.env.ADMIN_EMAIL,
          subject: getAdminNotificationEmail(order).subject,
          html: getAdminNotificationEmail(order).html,
        };
        break;

      case 'status_update':
        mailOptions = {
          from: process.env.GMAIL_EMAIL,
          to: order.customerEmail,
          subject: getOrderStatusUpdateEmail(order, status).subject,
          html: getOrderStatusUpdateEmail(order, status).html,
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid email type' });
    }

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`Email sent: ${info.messageId}`);
    res.status(200).json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
};
