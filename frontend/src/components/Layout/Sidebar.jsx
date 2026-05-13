import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, FileText, ClipboardList } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/',             label: 'Dashboard',       icon: <LayoutDashboard size={18} /> },
  { to: '/jobs',         label: 'Job Search',       icon: <Search size={18} /> },
  { to: '/documents',    label: 'My Documents',     icon: <FileText size={18} /> },
  { to: '/applications', label: 'My Applications',  icon: <ClipboardList size={18} /> },
];

export default function Sidebar() {
  const { state } = useApp();
  const unreadCount = state.notifications.filter(n => !n.read).length;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        {/* TMU brand color #0033A0 used only for wordmark */}
        <span className={styles.logo}>TMU</span>
        <span className={styles.portalName}>Co-op Portal</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>{icon}</span>
            <span>{label}</span>
            {/* Notification dot on Dashboard if unread notifications exist */}
            {to === '/' && unreadCount > 0 && (
              <span className={styles.dot} aria-label={`${unreadCount} unread`} />
            )}
          </NavLink>
        ))}
      </nav>

      <div className={styles.userArea}>
        <div className={styles.avatar}>ZN</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>Zaiyan Nazmul</div>
          <div className={styles.userRole}>Computer Science, Year 5</div>
        </div>
      </div>
    </aside>
  );
}
