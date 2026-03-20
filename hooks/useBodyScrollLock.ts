import { useEffect } from 'react';

/**
 * Locks the body scroll when a modal/overlay is mounted.
 * Supports nested modals by tracking a counter.
 */
let lockCount = 0;

export const useBodyScrollLock = (isLocked = true) => {
  useEffect(() => {
    if (!isLocked) return;
    
    lockCount++;
    document.body.style.overflow = 'hidden';
    
    return () => {
      lockCount--;
      if (lockCount <= 0) {
        lockCount = 0;
        document.body.style.overflow = '';
      }
    };
  }, [isLocked]);
};
