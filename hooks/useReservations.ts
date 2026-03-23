import { useState, useEffect } from 'react';
import { Reservation, ReservationStatus, BlockedTime } from '../types';
import { fetchReservations, createReservation as apiCreateReservation, updateReservationStatus as apiUpdateStatus, updateReservation as apiUpdateReservation, deleteReservation as apiDeleteReservation } from '../lib/appwrite';
import { sanitizeName, sanitizeRoom, sanitizeText, sanitizeNumber, sanitizeJsonString } from '../lib/sanitize';

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
    } catch (e) { /* ignore corrupt data */ }
    return [];
  });
  const [loading, setLoading] = useState(true);

  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>(() => {
    try {
      const stored = localStorage.getItem(BLOCKED_TIMES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch(e) { /* ignore */ }
    return [];
  });

  const [blockedDaysOfWeek, setBlockedDaysOfWeek] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(BLOCKED_DAYS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch(e) { /* ignore */ }
    return [1]; // Lunes disabled by default
  });

  const [blockedStandardHours, setBlockedStandardHours] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(BLOCKED_HOURS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch(e) { /* ignore */ }
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
      .catch(() => { /* silently use cached data */ })
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
      } catch (e) { /* ignore */ }
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
      } catch (e) { /* API update failed */ }
      persistReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const addReservation = async (reservation: Reservation) => {
      // ═══════ SANITIZE ALL INPUTS ═══════
      const safe: Reservation = {
        ...reservation,
        clientName: sanitizeName(reservation.clientName),
        room: sanitizeRoom(reservation.room || ''),
        modelName: sanitizeText(reservation.modelName, 200),
        total: sanitizeNumber(reservation.total, 0, 9999999),
      };
      try {
        await apiCreateReservation({
          clientName: safe.clientName,
          room: safe.room || '',
          vendorId: safe.vendorId || '',
          date: safe.date,
          time: safe.time,
          modelId: safe.modelId,
          modelName: safe.modelName,
          servicesDetails: sanitizeJsonString(JSON.stringify(safe.servicesDetails)),
          total: safe.total,
          status: safe.status,
        });
      } catch (e) { /* API create reservation failed */ }
      persistReservations([safe, ...reservations]);
  };

  const updateReservation = async (reservation: Reservation) => {
      // ═══════ SANITIZE ═══════
      const safe: Reservation = {
        ...reservation,
        clientName: sanitizeName(reservation.clientName),
        room: sanitizeRoom(reservation.room || ''),
        modelName: sanitizeText(reservation.modelName, 200),
        total: sanitizeNumber(reservation.total, 0, 9999999),
      };
      try {
        await apiUpdateReservation(safe.id, {
          clientName: safe.clientName,
          room: safe.room || '',
          vendorId: safe.vendorId || '',
          date: safe.date,
          time: safe.time,
          modelId: safe.modelId,
          modelName: safe.modelName,
          servicesDetails: sanitizeJsonString(JSON.stringify(safe.servicesDetails)),
          total: safe.total,
          status: safe.status,
        });
      } catch (e) { /* API update failed */ }
      persistReservations(reservations.map(r => r.id === safe.id ? safe : r));
  };

  const deleteReservation = async (id: string) => {
      try {
        await apiDeleteReservation(id);
      } catch (e) { /* API delete failed */ }
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
