import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { fetchOrders, createOrder as apiCreateOrder, updateOrderStatus as apiUpdateStatus } from '../lib/appwrite';

const ORDERS_STORAGE_KEY = 'laboutiquerd_orders';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { console.error(e); }
    return [];
  });
  const [loading, setLoading] = useState(true);

  // Fetch from Appwrite on mount
  useEffect(() => {
    fetchOrders()
      .then((docs) => {
        const mapped: Order[] = docs.map((d: any) => ({
          id: d.$id,
          clientName: d.clientName,
          room: d.room || '',
          whatsapp: d.whatsapp || '',
          date: d.date || d.$createdAt,
          items: typeof d.items === 'string' ? JSON.parse(d.items) : d.items || [],
          total: d.total,
          status: d.status as OrderStatus,
        }));
        setOrders(mapped);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(mapped));
      })
      .catch((err) => {
        console.warn('Appwrite orders fetch failed:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (stored) setOrders(JSON.parse(stored));
      } catch (e) { console.error(e); }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ordersUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ordersUpdated', handleStorageChange);
    };
  }, []);

  const persistAndDispatch = (newOrders: Order[]) => {
      setOrders(newOrders);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders));
      window.dispatchEvent(new Event('ordersUpdated'));
  };

  const updateOrderStatus = async (id: string, newStatus: OrderStatus) => {
      try {
        await apiUpdateStatus(id, newStatus);
      } catch (e) { console.warn('API update order status failed:', e); }
      const newOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
      persistAndDispatch(newOrders);
  };

  const addOrder = async (order: Order) => {
      try {
        await apiCreateOrder({
          clientName: order.clientName,
          room: order.room || '',
          whatsapp: order.whatsapp || '',
          date: order.date,
          total: order.total,
          status: order.status,
          items: JSON.stringify(order.items),
        });
      } catch (e) { console.warn('API create order failed:', e); }
      const newOrders = [order, ...orders];
      persistAndDispatch(newOrders);
  };

  return { orders, updateOrderStatus, addOrder, loading };
};
