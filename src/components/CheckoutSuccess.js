import React from 'react';
import { CheckCircle, Home, Package } from 'lucide-react';

const CheckoutSuccess = ({ onContinue }) => {
  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <CheckCircle size={64} color="#00C96B" />
        </div>
        
        <h1 style={styles.title}>Order Confirmed!</h1>
        
        <p style={styles.message}>
          Thank you for your order. We've received your payment and will process your order shortly.
        </p>
        
        <div style={styles.details}>
          <p style={styles.detailText}>
            A confirmation email has been sent to your email address.
          </p>
          <p style={styles.detailText}>
            You can track your order status in your email.
          </p>
        </div>
        
        <div style={styles.actions}>
          <button 
            onClick={handleContinue}
            style={styles.homeButton}
          >
            <Home size={18} />
            Continue Shopping
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: '#f9f9f9',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
  },
  iconContainer: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#1a1a1a',
  },
  message: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  details: {
    background: '#f5f5f5',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '32px',
  },
  detailText: {
    fontSize: '14px',
    color: '#555',
    margin: '8px 0',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  homeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#00C96B',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

export default CheckoutSuccess;
