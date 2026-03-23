import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { fetchOrders, createOrder as apiCreateOrder, updateOrderStatus as apiUpdateStatus, deleteOrder as apiDeleteOrder } from '../lib/appwrite';
import { sanitizeName, sanitizeRoom, sanitizePhone, sanitizeNumber, sanitizeJsonString } from '../lib/sanitize';

const ORDERS_STORAGE_KEY = 'laboutiquerd_orders';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { /* ignore corrupt data */ }
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
      .catch(() => {
        // Silently use cached data
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (stored) setOrders(JSON.parse(stored));
      } catch (e) { /* ignore */ }
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
      } catch (e) { /* API update failed */ }
      const newOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
      persistAndDispatch(newOrders);
  };

  const addOrder = async (order: Order) => {
      // ═══════ SANITIZE ALL INPUTS ═══════
      const sanitizedOrder: Order = {
        ...order,
        clientName: sanitizeName(order.clientName),
        room: sanitizeRoom(order.room || ''),
        whatsapp: sanitizePhone(order.whatsapp || ''),
        total: sanitizeNumber(order.total, 0, 9999999),
      };

      try {
        await apiCreateOrder({
          clientName: sanitizedOrder.clientName,
          room: sanitizedOrder.room || '',
          whatsapp: sanitizedOrder.whatsapp || '',
          date: sanitizedOrder.date,
          total: sanitizedOrder.total,
          status: sanitizedOrder.status,
          items: sanitizeJsonString(JSON.stringify(sanitizedOrder.items)),
        });
      } catch (e) { /* API create failed */ }
      const newOrders = [sanitizedOrder, ...orders];
      persistAndDispatch(newOrders);
  };

  const deleteOrder = async (id: string) => {
      try {
        await apiDeleteOrder(id);
      } catch (e) { /* API delete failed */ }
      persistAndDispatch(orders.filter(o => o.id !== id));
  };

  return { orders, updateOrderStatus, addOrder, deleteOrder, loading };
};
