import { useState } from 'react';
import { Calendar, Clock, CheckCircle, Inbox } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Toast from '../components/common/Toast';
import styles from './MyApplications.module.css';

function StatusBadge({ status }) {
  const config = {
    'Interview Scheduled': { color: styles.statusInterview, icon: <Calendar size={13} /> },
    'Under Review':        { color: styles.statusReview,    icon: <Clock size={13} /> },
    'Application Received':{ color: styles.statusReceived,  icon: <Inbox size={13} /> },
  };
  const { color, icon } = config[status] || config['Application Received'];
  return (
    <span className={`${styles.statusBadge} ${color}`}>
      {icon} {status}
    </span>
  );
}

export default function MyApplications() {
  const { state } = useApp();
  const [toast, setToast] = useState(null);

  /* Nielsen H4: System status — application status clearly visible at all times */
  return (
    <div className={`${styles.page} page-content`}>
      <h1 className={styles.title}>My Applications</h1>
      <p className={styles.subtitle}>{state.submittedApplications.length} applications submitted</p>

      <div className={styles.list}>
        {state.submittedApplications.map(app => (
          <div key={app.id} className={styles.card}>
            <div className={styles.cardMain}>
              <div>
                <h3 className={styles.jobTitle}>{app.jobTitle}</h3>
                <div className={styles.company}>{app.company}</div>
                <div className={styles.appliedDate}>
                  Applied {new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div className={styles.statusArea}>
                <StatusBadge status={app.status} />
                {app.status === 'Interview Scheduled' && app.interviewDate && (
                  <div className={styles.interviewDate}>
                    <Calendar size={13} />
                    Interview: {new Date(app.interviewDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.cardBottom}>
              <div className={styles.docTags}>
                {app.documents.map(d => (
                  <span key={d} className={styles.docTag}>{d}</span>
                ))}
              </div>
              <button
                className={styles.viewBtn}
                onClick={() => setToast({ message: 'Application detail view is under development.', variant: 'info' })}
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
        {state.submittedApplications.length === 0 && (
          <div className={styles.empty}>No applications yet. <a href="/jobs">Browse jobs →</a></div>
        )}
      </div>

      {toast && <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />}
    </div>
  );
}
