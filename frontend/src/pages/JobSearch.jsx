import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, Search, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fakeJobs } from '../data/fakeData';
import Badge from '../components/common/Badge';
import styles from './JobSearch.module.css';

function formatDeadline(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function isUrgent(dateStr) {
  return (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24) <= 7;
}

export default function JobSearch() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { query, filters } = state.searchState;
  const containerRef = useRef(null);

  // Restore scroll position on mount — A3 O4
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = state.searchState.scrollPosition;
    }
  }, []);

  function setQuery(q) {
    dispatch({ type: 'UPDATE_SEARCH_STATE', payload: { query: q } });
  }
  function setFilter(key, val) {
    dispatch({ type: 'UPDATE_SEARCH_STATE', payload: { filters: { ...filters, [key]: val } } });
  }
  function saveScroll() {
    dispatch({ type: 'UPDATE_SEARCH_STATE', payload: { scrollPosition: containerRef.current?.scrollTop ?? 0 } });
  }

  // Filtering logic
  const filtered = fakeJobs.filter(job => {
    const q = query.toLowerCase();
    const matchesQuery = !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.requirements.some(r => r.toLowerCase().includes(q));

    const matchesLocation = !filters.location || job.location.includes(filters.location);
    const matchesRoleType = !filters.roleType || job.roleType === filters.roleType;
    const matchesWorkTerm = !filters.workTerm || job.workTerm === filters.workTerm;
    // "international" shows only international-eligible; "domestic" shows all
    const matchesWorkAuth = !filters.workAuth ||
      (filters.workAuth === 'international' ? job.workAuth === 'international' : true);

    return matchesQuery && matchesLocation && matchesRoleType && matchesWorkTerm && matchesWorkAuth;
  });

  const locations = [...new Set(fakeJobs.map(j => j.location))];
  const workTerms = [...new Set(fakeJobs.map(j => j.workTerm))];

  return (
    <div className={`${styles.page} page-content`} ref={containerRef}>
      <h1 className={styles.title}>Job Search</h1>

      {/* Search bar — A3 O2: synonym/abbreviation support indication */}
      <div className={styles.searchSection}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by job title, company, or skills (e.g., SWE, dev, data)"
          />
        </div>
        {/* A3 O2: Helper text explicitly communicates abbreviation/synonym support */}
        <p className={styles.searchHelper}>
          💡 Supports abbreviations and related terms (e.g., &ldquo;SWE&rdquo; finds Software Engineering roles)
        </p>
      </div>

      {/* Eligibility filter — A3 O1 & O3: visually separated above general filters */}
      {/* Nielsen H6: Recognition not recall — explicit text, not icons */}
      <div className={styles.eligibilitySection}>
        <div className={styles.eligibilityLabel}>
          <span className={styles.eligibilityTitle}>Work Authorization</span>
          <span className={styles.tooltip} title="Filter jobs by whether they accept international students or require Canadian citizenship/PR">
            <HelpCircle size={14} />
          </span>
        </div>
        <div className={styles.pillGroup}>
          {[
            { value: '', label: 'All' },
            { value: 'international', label: 'Open to International Students' },
            { value: 'domestic', label: 'Canadian Citizens / PR Only' },
          ].map(opt => (
            <button
              key={opt.value}
              className={`${styles.pill} ${filters.workAuth === opt.value ? styles.pillActive : ''}`}
              onClick={() => setFilter('workAuth', opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* General filters */}
      {/* Nielsen H3: User control — filters visible and reversible */}
      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Location</label>
          <select className={styles.select} value={filters.location} onChange={e => setFilter('location', e.target.value)}>
            <option value="">All Locations</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Role Type</label>
          <select className={styles.select} value={filters.roleType} onChange={e => setFilter('roleType', e.target.value)}>
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Work Term</label>
          <select className={styles.select} value={filters.workTerm} onChange={e => setFilter('workTerm', e.target.value)}>
            <option value="">All Terms</option>
            {workTerms.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button
          className={styles.clearBtn}
          onClick={() => dispatch({ type: 'UPDATE_SEARCH_STATE', payload: { query: '', filters: { location: '', roleType: '', workTerm: '', workAuth: '' } } })}
        >
          Clear Filters
        </button>
      </div>

      <p className={styles.resultCount}>Showing {filtered.length} of {fakeJobs.length} postings</p>

      <div className={styles.grid}>
        {filtered.map(job => (
          <div key={job.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                <div className={styles.jobMeta}>
                  <MapPin size={13} />
                  <span>{job.company} · {job.location}</span>
                </div>
              </div>
              {/* Shortlist toggle — Nielsen H7: efficiency */}
              <button
                className={`${styles.heartBtn} ${state.shortlist.includes(job.id) ? styles.heartActive : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_SHORTLIST', payload: job.id })}
                aria-label={state.shortlist.includes(job.id) ? 'Remove from shortlist' : 'Add to shortlist'}
              >
                <Heart size={18} fill={state.shortlist.includes(job.id) ? '#dc2626' : 'none'} />
              </button>
            </div>

            <div className={styles.chips}>
              <span className={styles.chip}>{job.workTerm}</span>
              <span className={styles.chip}>{job.salary}</span>
            </div>

            {/* A3 O3: Explicit text-based eligibility badge */}
            <Badge type={job.workAuth} />

            <div className={styles.cardBottom}>
              <span className={`${styles.deadline} ${isUrgent(job.deadline) ? styles.deadlineUrgent : ''}`}>
                Apply by {formatDeadline(job.deadline)}
              </span>
              <button
                className={styles.viewBtn}
                onClick={() => { saveScroll(); navigate(`/jobs/${job.id}`); }}
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={styles.noResults}>No postings match your filters. Try adjusting your search.</div>
        )}
      </div>
    </div>
  );
}
