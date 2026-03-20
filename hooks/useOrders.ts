import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';

const ORDERS_STORAGE_KEY = 'laboutiquerd_orders';

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7829',
    clientName: 'Daniela Méndez',
    room: '320A',
    whatsapp: '18095551234',
    date: new Date().toISOString(),
    items: [
        { id: '1', name: 'T-Shirt Custom (Dorado)', price: 450, quantity: 2, type: 'product' },
        { id: '2', name: 'Gorra Trucker (Logo Dominicano)', price: 450, quantity: 1, type: 'product' }
    ],
    total: 1350,
    status: 'Pendiente'
  },
  {
    id: 'ORD-7830',
    clientName: 'Alejandro Cruz',
    room: '115B',
    date: new Date(Date.now() - 86400000).toISOString(),
    items: [
        { id: '1', name: 'T-Shirt White (Clásico)', price: 450, quantity: 1, type: 'product' }
    ],
    total: 450,
    status: 'Diseñando'
  },
  {
    id: 'ORD-7815',
    clientName: 'Sofía Valerio',
    room: '401C',
    date: new Date(Date.now() - 172800000).toISOString(),
    items: [
        { id: '1', name: 'Pack Familiar T-Shirts', price: 1800, quantity: 1, type: 'product' }
    ],
    total: 1800,
    status: 'Listo para Entrega'
  }
];

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return MOCK_ORDERS;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (stored) setOrders(JSON.parse(stored));
      } catch (e) {
         console.error(e);
      }
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

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
      const newOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
      persistAndDispatch(newOrders);
  };

  const addOrder = (order: Order) => {
      const newOrders = [order, ...orders];
      persistAndDispatch(newOrders);
  };

  return { orders, updateOrderStatus, addOrder };
};
