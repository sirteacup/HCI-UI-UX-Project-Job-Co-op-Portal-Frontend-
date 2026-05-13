import styles from './Tag.module.css';

/* Nielsen H2: Match system to real world — 'Current'/'Older Versions' not 'Active'/'Archived' */
/* A3 O5: Replaced 'Active/Archived' terminology with 'Current/Older Version' */
export default function Tag({ status }) {
  return (
    <span className={`${styles.tag} ${status === 'current' ? styles.current : styles.older}`}>
      {status === 'current' ? 'Current' : 'Older Version'}
    </span>
  );
}
