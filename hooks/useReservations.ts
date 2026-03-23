import { useState, useEffect } from 'react';
import { Reservation, ReservationStatus, BlockedTime } from '../types';
import { fetchReservations, createReservation as apiCreateReservation, updateReservationStatus as apiUpdateStatus } from '../lib/appwrite';

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

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const stored = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { console.error(e); }
    return [];
  });
  const [loading, setLoading] = useState(true);

  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>(() => {
    try {
      const stored = localStorage.getItem(BLOCKED_TIMES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch(e) { console.error(e); }
    return [];
  });

  const [blockedDaysOfWeek, setBlockedDaysOfWeek] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(BLOCKED_DAYS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch(e) { console.error(e); }
    return [1]; // Lunes disabled by default
  });

  const [blockedStandardHours, setBlockedStandardHours] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(BLOCKED_HOURS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch(e) { console.error(e); }
    return [];
  });

  // Fetch from Appwrite on mount
  useEffect(() => {
    fetchReservations()
      .then((docs) => {
        const mapped: Reservation[] = docs.map((d: any) => ({
          id: d.$id,
          clientName: d.clientName,
          room: d.room || '',
          vendorId: d.vendorId || undefined,
          date: d.date,
          time: d.time,
          modelId: d.modelId,
          modelName: d.modelName,
          servicesDetails: typeof d.servicesDetails === 'string' ? JSON.parse(d.servicesDetails) : d.servicesDetails || [],
          total: d.total,
          status: d.status as ReservationStatus,
        }));
        setReservations(mapped);
        localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(mapped));
      })
      .catch((err) => console.warn('Appwrite reservations fetch failed:', err.message))
      .finally(() => setLoading(false));
  }, []);

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
      } catch (e) { console.error(e); }
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

  const updateReservationStatus = async (id: string, newStatus: ReservationStatus) => {
      try {
        await apiUpdateStatus(id, newStatus);
      } catch (e) { console.warn('API update reservation status failed:', e); }
      persistReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const addReservation = async (reservation: Reservation) => {
      try {
        await apiCreateReservation({
          clientName: reservation.clientName,
          room: reservation.room || '',
          vendorId: reservation.vendorId || '',
          date: reservation.date,
          time: reservation.time,
          modelId: reservation.modelId,
          modelName: reservation.modelName,
          servicesDetails: JSON.stringify(reservation.servicesDetails),
          total: reservation.total,
          status: reservation.status,
        });
      } catch (e) { console.warn('API create reservation failed:', e); }
      persistReservations([reservation, ...reservations]);
  };

  const updateReservation = (reservation: Reservation) => {
      persistReservations(reservations.map(r => r.id === reservation.id ? reservation : r));
  };

  const deleteReservation = (id: string) => {
      persistReservations(reservations.filter(r => r.id !== id));
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
      toggleBlockedStandardHour,
      loading
  };
};
