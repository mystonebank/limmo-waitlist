import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-update
export const updateSW = registerSW({
  onNeedRefresh() {
    // Show update notification to user
    console.log('New version available');
  },
  onOfflineReady() {
    // App is ready for offline use
    console.log('App ready for offline use');
  },
  onRegistered(swRegistration) {
    // Service worker registered
    console.log('Service worker registered');
  },
  onRegisterError(error) {
    // Service worker registration failed
    console.error('Service worker registration failed:', error);
  },
});

// Check if app is running as PWA
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

// Check if app is running offline
export const isOffline = () => {
  return !navigator.onLine;
};

// Listen for online/offline events
export const setupOfflineListener = (callback: (isOnline: boolean) => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};
