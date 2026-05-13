import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, ClipboardList, ArrowRight, X, Bell, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fakeJobs } from '../data/fakeData';
import styles from './Dashboard.module.css';

function formatDeadline(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isUrgent(dateStr) {
  const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
  return diff <= 7;
}

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [onboardingDismissed, setOnboardingDismissed] = useState(() => {
    return localStorage.getItem('onboardingDismissed') === 'true';
  });

  function dismissOnboarding() {
    localStorage.setItem('onboardingDismissed', 'true');
    setOnboardingDismissed(true);
  }

  const unreadCount = state.notifications.filter(n => !n.read).length;

  // Upcoming deadlines: soonest 3 jobs sorted by deadline
  const upcomingDeadlines = [...fakeJobs]
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  return (
    <div className={`${styles.page} page-content`}>
      {/* Welcome banner */}
      {/* Nielsen H4: Provide system status via notification panel */}
      <div className={styles.welcomeBanner}>
        <div>
          <h1 className={styles.welcomeTitle}>Welcome back, Zaiyan 👋</h1>
          <p className={styles.welcomeSub}>
            You have{' '}
            <span className={styles.notifBadge}>
              <span className={styles.notifPulse} />
              {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
            </span>
          </p>
        </div>
      </div>

      {/* Nielsen H10: Help and documentation — onboarding banner */}
      {!onboardingDismissed && (
        <div className={styles.onboarding}>
          <div className={styles.onboardingHeader}>
            <span className={styles.onboardingTitle}>New to co-op? Here's how it works</span>
            <button className={styles.dismissBtn} onClick={dismissOnboarding} aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
          <div className={styles.onboardingSteps}>
            {['1. Search Jobs', '2. Build Your Package', '3. Apply', '4. Track Status'].map((step, i, arr) => (
              <span key={step} className={styles.pill}>
                {step}
                {i < arr.length - 1 && <span className={styles.arrow}>→</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {/* Left column */}
        <div className={styles.leftCol}>
          {/* Nielsen H6: Recognition not recall — quick action cards expose all main functions */}
          <h2 className={styles.sectionHeading}>Quick Actions</h2>
          <div className={styles.actionCards}>
            <button className={styles.actionCard} onClick={() => navigate('/jobs')}>
              <div className={styles.actionIcon}><Search size={22} /></div>
              <div className={styles.actionLabel}>Search Jobs</div>
              <div className={styles.actionStat}>6 open positions</div>
              <ArrowRight size={16} className={styles.actionArrow} />
            </button>
            <button className={styles.actionCard} onClick={() => navigate('/documents')}>
              <div className={styles.actionIcon}><FileText size={22} /></div>
              <div className={styles.actionLabel}>My Documents</div>
              <div className={styles.actionStat}>{state.documents.length} documents</div>
              <ArrowRight size={16} className={styles.actionArrow} />
            </button>
            <button className={styles.actionCard} onClick={() => navigate('/applications')}>
              <div className={styles.actionIcon}><ClipboardList size={22} /></div>
              <div className={styles.actionLabel}>My Applications</div>
              <div className={styles.actionStat}>{state.submittedApplications.length} applications</div>
              <ArrowRight size={16} className={styles.actionArrow} />
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          {/* Nielsen H4: System status — notification panel */}
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <Bell size={16} />
              <span>Notifications</span>
            </div>
            {state.notifications.length === 0 && (
              <p className={styles.empty}>No notifications.</p>
            )}
            {state.notifications.map(n => (
              <div
                key={n.id}
                className={`${styles.notifRow} ${!n.read ? styles.unread : ''}`}
              >
                <span className={styles.notifText}>{n.text}</span>
                {!n.read && (
                  <button
                    className={styles.markRead}
                    onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id })}
                    aria-label="Mark as read"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <Calendar size={16} />
              <span>Upcoming Deadlines</span>
            </div>
            {upcomingDeadlines.map(job => (
              <div key={job.id} className={styles.deadlineRow}>
                <div>
                  <div className={styles.deadlineCompany}>{job.company}</div>
                  <div className={styles.deadlineRole}>{job.title}</div>
                </div>
                <span className={`${styles.deadlineDate} ${isUrgent(job.deadline) ? styles.urgent : ''}`}>
                  {formatDeadline(job.deadline)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
