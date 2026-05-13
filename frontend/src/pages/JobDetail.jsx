import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Heart, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fakeJobs } from '../data/fakeData';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import styles from './JobDetail.module.css';

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function formatFull(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const job = fakeJobs.find(j => j.id === Number(id));

  if (!job) {
    return (
      <div className={`${styles.page} page-content`}>
        <p>Job not found.</p>
        <Button onClick={() => navigate('/jobs')}>← Back to Results</Button>
      </div>
    );
  }

  const isShortlisted = state.shortlist.includes(job.id);
  const days = daysUntil(job.deadline);

  return (
    <div className={`${styles.page} page-content`}>
      {/* A3 O4: Users praised scroll position persistence on back navigation */}
      <button className={styles.backBtn} onClick={() => navigate('/jobs')}>
        ← Back to Results
      </button>

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{job.title}</h1>
            <div className={styles.meta}>
              <span className={styles.metaItem}><MapPin size={14} />{job.company}</span>
              <span className={styles.metaSep}>·</span>
              <span className={styles.metaItem}>{job.location}</span>
              <span className={styles.metaSep}>·</span>
              <span className={styles.metaItem}><Clock size={14} />{job.workTerm}</span>
            </div>
          </div>
          <span className={styles.salary}><DollarSign size={14} />{job.salary}</span>
        </div>

        {/* Nielsen H6: Explicit eligibility badge */}
        {/* Nielsen H8: Work auth shown once prominently */}
        <Badge type={job.workAuth} />

        {/* Work auth detail box — Nielsen H4 */}
        <div className={`${styles.authBox} ${job.workAuth === 'international' ? styles.authInternational : styles.authDomestic}`}>
          {job.workAuth === 'international'
            ? 'This position is open to all students, including international students on a valid study/work permit.'
            : 'This position requires Canadian citizenship or permanent residency. International students are not eligible to apply.'}
        </div>

        {/* Description */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>About the Role</h2>
          <p className={styles.description}>{job.description}</p>
        </section>

        {/* Requirements as chips */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Requirements</h2>
          <div className={styles.reqChips}>
            {job.requirements.map(r => (
              <span key={r} className={styles.chip}>{r}</span>
            ))}
          </div>
        </section>

        {/* Nielsen H4: Deadline countdown keeps users informed */}
        <div className={`${styles.deadline} ${days <= 7 ? styles.deadlineUrgent : ''}`}>
          <Clock size={15} />
          Application closes in <strong>{days} day{days !== 1 ? 's' : ''}</strong> ({formatFull(job.deadline)})
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            variant="secondary"
            icon={<Heart size={16} fill={isShortlisted ? '#dc2626' : 'none'} color={isShortlisted ? '#dc2626' : undefined} />}
            onClick={() => dispatch({ type: 'TOGGLE_SHORTLIST', payload: job.id })}
          >
            {isShortlisted ? '✓ Shortlisted' : 'Shortlist'}
          </Button>
          <Button variant="primary" size="lg" onClick={() => navigate(`/apply/${job.id}`)}>
            Apply Now →
          </Button>
        </div>
      </div>
    </div>
  );
}
