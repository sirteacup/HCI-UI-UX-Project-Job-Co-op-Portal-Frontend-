import { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './Toast.module.css';

export default function Toast({ message, variant = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`${styles.toast} ${styles[variant]}`} role="status">
      <span>{message}</span>
      <button className={styles.close} onClick={onClose} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}
