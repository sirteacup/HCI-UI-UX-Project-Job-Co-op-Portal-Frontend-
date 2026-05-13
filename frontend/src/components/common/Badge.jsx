import styles from './Badge.module.css';

/* Nielsen H6: Recognition not recall — explicit text badges replace ambiguous icons */
/* A3 O3: Eligibility badge must use explicit text, not icons alone */
export default function Badge({ type }) {
  if (type === 'international') {
    return (
      <span className={`${styles.badge} ${styles.international}`}>
        ✓ Open to International Students
      </span>
    );
  }
  return (
    <span className={`${styles.badge} ${styles.domestic}`}>
      🇨🇦 Canadian Citizens / PR Only
    </span>
  );
}
