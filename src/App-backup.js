import React from 'react';
import './App.css';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#070709',
      color: '#F0EDE6',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#00C96B', fontSize: '2rem', marginBottom: '1rem' }}>
        AFROBASKET - Test Version
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        African Grocery Delivery Service
      </p>
      <div style={{ 
        background: '#111318', 
        padding: '2rem', 
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.07)'
      }}>
        <h2 style={{ color: '#00C96B', marginBottom: '1rem' }}>
          Welcome to AFROBASKET
        </h2>
        <p style={{ color: '#8a8fa8', lineHeight: '1.6' }}>
          If you can see this message, the basic React app is working. 
          The full version with images and styling will be loaded once we confirm the basic setup is working.
        </p>
        <button style={{
          background: '#00C96B',
          color: '#F0EDE6',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          marginTop: '1rem'
        }}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;
