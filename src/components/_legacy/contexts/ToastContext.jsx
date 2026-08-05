import { createContext, useContext } from 'react';
const ToastContext = createContext(null);
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (typeof ctx === 'function') return ctx;
  return (msg, type) => { console.log(`[Toast ${type || 'info'}]:`, msg); };
};
export default ToastContext;
