import { useState, useEffect } from 'react';
import { Reservation, ReservationStatus, BlockedTime } from '../types';

const RESERVATIONS_STORAGE_KEY = 'laboutiquerd_reservations';
const BLOCKED_TIMES_STORAGE_KEY = 'laboutiquerd_blocked_times';
const BLOCKED_DAYS_STORAGE_KEY = 'laboutiquerd_blocked_days';
const BLOCKED_HOURS_STORAGE_KEY = 'laboutiquerd_blocked_hours';

export const STANDARD_HOURS = [
  { val: "09:00", label: "09:00 AM" },
  { val: "10:00", label: "10:00 AM" },
  { val: "11:00", label: "11:00 AM" },
  { val: "14:00", label: "02:00 PM" },
  { val: "15:00", label: "03:00 PM" },
  { val: "16:00", label: "04:00 PM" }
];

const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'BKG-5012',
    clientName: 'María Clara',
    room: '50A',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    modelId: 'm4',
    modelName: 'Modelo 04',
    servicesDetails: [
        { id: 's2', name: 'Tresse avec cheveux (Con extensiones)', price: 350 }
    ],
    total: 350,
    status: 'Confirmada'
  },
  {
    id: 'BKG-5013',
    clientName: 'Julie Beaumont',
    room: '612C',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '10:00',
    modelId: 'm7',
    modelName: 'Modelo 07',
    servicesDetails: [
        { id: 's4', name: 'Tresse avec cheveux + perles', price: 450 }
    ],
    total: 450,
    status: 'Confirmada'
  }
];

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const stored = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return MOCK_RESERVATIONS;
  });

  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>(() => {
    try {
      const stored = localStorage.getItem(BLOCKED_TIMES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch(e) {
      console.error(e);
    }
    return [];
  });

  const [blockedDaysOfWeek, setBlockedDaysOfWeek] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(BLOCKED_DAYS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch(e) {
      console.error(e);
    }
    return [1]; // Lunes disableByDefault
  });

  const [blockedStandardHours, setBlockedStandardHours] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(BLOCKED_HOURS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch(e) {
      console.error(e);
    }
    return []; // Ej: ["09:00"]
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedR = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
        if (storedR) setReservations(JSON.parse(storedR));

        const storedB = localStorage.getItem(BLOCKED_TIMES_STORAGE_KEY);
        if (storedB) setBlockedTimes(JSON.parse(storedB));

        const storedD = localStorage.getItem(BLOCKED_DAYS_STORAGE_KEY);
        if (storedD) setBlockedDaysOfWeek(JSON.parse(storedD));

        const storedH = localStorage.getItem(BLOCKED_HOURS_STORAGE_KEY);
        if (storedH) setBlockedStandardHours(JSON.parse(storedH));
      } catch (e) {
         console.error(e);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bookingsUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bookingsUpdated', handleStorageChange);
    };
  }, []);

  const persistReservations = (newRes: Reservation[]) => {
      setReservations(newRes);
      localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(newRes));
      window.dispatchEvent(new Event('bookingsUpdated'));
  };

  const persistBlockedTimes = (newBlocks: BlockedTime[]) => {
      setBlockedTimes(newBlocks);
      localStorage.setItem(BLOCKED_TIMES_STORAGE_KEY, JSON.stringify(newBlocks));
      window.dispatchEvent(new Event('bookingsUpdated'));
  };

  const persistBlockedDaysOfWeek = (days: number[]) => {
      setBlockedDaysOfWeek(days);
      localStorage.setItem(BLOCKED_DAYS_STORAGE_KEY, JSON.stringify(days));
      window.dispatchEvent(new Event('bookingsUpdated'));
  };

  const persistBlockedStandardHours = (hours: string[]) => {
      setBlockedStandardHours(hours);
      localStorage.setItem(BLOCKED_HOURS_STORAGE_KEY, JSON.stringify(hours));
      window.dispatchEvent(new Event('bookingsUpdated'));
  };

  const updateReservationStatus = (id: string, newStatus: ReservationStatus) => {
      const newRes = reservations.map(r => r.id === id ? { ...r, status: newStatus } : r);
      persistReservations(newRes);
  };

  const addReservation = (reservation: Reservation) => {
      const newRes = [reservation, ...reservations];
      persistReservations(newRes);
  };

  const updateReservation = (reservation: Reservation) => {
      const newRes = reservations.map(r => r.id === reservation.id ? reservation : r);
      persistReservations(newRes);
  };

  const deleteReservation = (id: string) => {
      const newRes = reservations.filter(r => r.id !== id);
      persistReservations(newRes);
  };

  const addBlockedTime = (block: BlockedTime) => {
      persistBlockedTimes([block, ...blockedTimes]);
  };

  const removeBlockedTime = (id: string) => {
      persistBlockedTimes(blockedTimes.filter(b => b.id !== id));
  };

  const toggleBlockedDayOfWeek = (day: number) => {
      if (blockedDaysOfWeek.includes(day)) {
          persistBlockedDaysOfWeek(blockedDaysOfWeek.filter(d => d !== day));
      } else {
          persistBlockedDaysOfWeek([...blockedDaysOfWeek, day]);
      }
  };

  const toggleBlockedStandardHour = (hour: string) => {
      if (blockedStandardHours.includes(hour)) {
          persistBlockedStandardHours(blockedStandardHours.filter(h => h !== hour));
      } else {
          persistBlockedStandardHours([...blockedStandardHours, hour]);
      }
  };

  return { 
      reservations, 
      updateReservationStatus, 
      addReservation,
      updateReservation,
      deleteReservation,
      blockedTimes,
      addBlockedTime,
      removeBlockedTime,
      blockedDaysOfWeek,
      toggleBlockedDayOfWeek,
      blockedStandardHours,
      toggleBlockedStandardHour
  };
};
