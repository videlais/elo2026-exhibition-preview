import { useEffect } from 'react';

export default function useManualScrollRestoration() {
  useEffect(() => {
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);
}
