import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CheckCircle, X, Loader2 } from 'lucide-react';

// Initialize Stripe with your publishable key
// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL after payment completion
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <PaymentElement />
      
      {error && (
        <div style={styles.error}>
          <X size={16} />
          <span>{error}</span>
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={!stripe || processing}
        style={styles.button}
      >
        {processing ? (
          <>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </button>
      
      <button 
        type="button" 
        onClick={onCancel}
        style={styles.cancelButton}
      >
        Cancel
      </button>
    </form>
  );
};

const StripeCheckout = ({ cart, onSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            items: cart.map(item => ({
              name: item.name,
              desc: item.desc,
              price: item.price,
              qty: item.qty,
              img: item.img
            }))
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const data = await response.json();
        setClientSecret(data.sessionId);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (cart.length > 0) {
      createPaymentIntent();
    }
  }, [cart]);

  if (loading) {
    return (
      <div style={styles.loading}>
        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#00C96B' }} />
        <p>Preparing checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <X size={40} color="#ff4444" />
        <p>{error}</p>
        <button onClick={onCancel} style={styles.cancelButton}>
          Go Back
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div style={styles.errorContainer}>
        <p>No items in cart</p>
        <button onClick={onCancel} style={styles.cancelButton}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Elements stripe={stripePromise} options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#00C96B',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
      }}>
        <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
      </Elements>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  button: {
    background: '#00C96B',
    color: 'white',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background 0.2s',
  },
  cancelButton: {
    background: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: '#fee',
    borderRadius: '8px',
    color: '#c00',
    fontSize: '14px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    gap: '16px',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    gap: '16px',
    textAlign: 'center',
  },
};

export default StripeCheckout;
