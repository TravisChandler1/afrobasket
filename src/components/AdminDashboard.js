import React, { useState, useEffect } from 'react';
import { X, Package, Truck, CheckCircle, Clock, Search, RefreshCw } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: '#FFB830', icon: Clock },
  { value: 'processing', label: 'Processing', color: '#3498db', icon: Package },
  { value: 'shipped', label: 'Shipped', color: '#9b59b6', icon: Truck },
  { value: 'delivered', label: 'Delivered', color: '#00C96B', icon: CheckCircle },
  { value: 'completed', label: 'Completed', color: '#27ae60', icon: CheckCircle },
];

const AdminDashboard = ({ onClose, adminCode }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders`, {
        headers: {
          'Authorization': `Bearer ${adminCode}`
        }
      });
      const data = await response.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [adminCode]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/orders`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminCode}`
        },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      
      if (response.ok) {
        await fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusInfo = (status) => STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Admin Dashboard</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.toolbar}>
          <div style={styles.searchBox}>
            <Search size={18} color="#8a8fa8" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button onClick={fetchOrders} style={styles.refreshBtn} disabled={loading}>
            <RefreshCw size={18} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
            Refresh
          </button>
        </div>

        <div style={styles.stats}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{orders.length}</span>
            <span style={styles.statLabel}>Total Orders</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {orders.filter(o => o.status === 'pending').length}
            </span>
            <span style={styles.statLabel}>Pending</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
            </span>
            <span style={styles.statLabel}>Total Revenue</span>
          </div>
        </div>

        <div style={styles.ordersList}>
          {loading ? (
            <div style={styles.loading}>Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div style={styles.empty}>No orders found</div>
          ) : (
            filteredOrders.map(order => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div 
                  key={order.orderId} 
                  style={styles.orderCard}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div style={styles.orderHeader}>
                    <div>
                      <span style={styles.orderId}>#{order.orderId}</span>
                      <span style={{...styles.statusBadge, background: statusInfo.color}}>
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </div>
                    <span style={styles.orderDate}>
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div style={styles.orderDetails}>
                    <p style={styles.customerName}>{order.customerName || 'No name'}</p>
                    <p style={styles.customerEmail}>{order.customerEmail}</p>
                  </div>
                  
                  <div style={styles.orderFooter}>
                    <span style={styles.orderItems}>
                      {order.items?.length || 0} items
                    </span>
                    <span style={styles.orderTotal}>
                      ${order.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div style={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3>Order #{selectedOrder.orderId}</h3>
                <button onClick={() => setSelectedOrder(null)} style={styles.closeBtn}>
                  <X size={20} />
                </button>
              </div>
              
              <div style={styles.modalContent}>
                <div style={styles.detailSection}>
                  <h4>Customer Details</h4>
                  <p><strong>Name:</strong> {selectedOrder.customerName || 'Not provided'}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customerPhone || 'Not provided'}</p>
                  <p><strong>Address:</strong> {selectedOrder.shippingAddress || 'Not provided'}</p>
                </div>
                
                <div style={styles.detailSection}>
                  <h4>Order Items</h4>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} style={styles.itemRow}>
                      <span>{item.qty}x {item.name}</span>
                      <span>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={styles.totalRow}>
                    <strong>Total</strong>
                    <strong>${selectedOrder.total?.toFixed(2)}</strong>
                  </div>
                </div>
                
                <div style={styles.detailSection}>
                  <h4>Update Status</h4>
                  <div style={styles.statusButtons}>
                    {STATUS_OPTIONS.map(status => (
                      <button
                        key={status.value}
                        onClick={() => updateOrderStatus(selectedOrder.orderId, status.value)}
                        disabled={updating || selectedOrder.status === status.value}
                        style={{
                          ...styles.statusBtn,
                          background: selectedOrder.status === status.value ? status.color : '#f0f0f0',
                          color: selectedOrder.status === status.value ? 'white' : '#333',
                        }}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  container: {
    background: 'white',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #eee',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
  },
  toolbar: {
    display: 'flex',
    gap: '12px',
    padding: '16px 24px',
    borderBottom: '1px solid #eee',
  },
  searchBox: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#f5f5f5',
    padding: '10px 16px',
    borderRadius: '8px',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    flex: 1,
    fontSize: '14px',
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: '#00C96B',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  stats: {
    display: 'flex',
    gap: '16px',
    padding: '16px 24px',
    borderBottom: '1px solid #eee',
  },
  statCard: {
    flex: 1,
    background: '#f9f9f9',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  statNumber: {
    display: 'block',
    fontSize: '24px',
    fontWeight: '700',
    color: '#00C96B',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
  },
  ordersList: {
    flex: 1,
    overflow: 'auto',
    padding: '16px 24px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
  },
  orderCard: {
    background: 'white',
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  orderId: {
    fontWeight: '700',
    marginRight: '12px',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    color: 'white',
  },
  orderDate: {
    fontSize: '12px',
    color: '#999',
  },
  customerName: {
    margin: '0 0 4px 0',
    fontWeight: '600',
  },
  customerEmail: {
    margin: 0,
    fontSize: '13px',
    color: '#666',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #eee',
  },
  orderItems: {
    fontSize: '13px',
    color: '#666',
  },
  orderTotal: {
    fontWeight: '700',
    color: '#00C96B',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3000,
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #eee',
  },
  modalContent: {
    padding: '20px',
  },
  detailSection: {
    marginBottom: '20px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    fontSize: '18px',
  },
  statusButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  statusBtn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
};

export default AdminDashboard;
