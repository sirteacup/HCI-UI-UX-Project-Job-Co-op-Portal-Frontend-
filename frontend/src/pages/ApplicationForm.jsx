import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fakeJobs } from '../data/fakeData';
import StepIndicator from '../components/common/StepIndicator';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Tag from '../components/common/Tag';
import styles from './ApplicationForm.module.css';

const STEPS = ['Select Resume', 'Select Cover Letter', 'Review & Submit'];

function DocPreviewModal({ doc, onClose }) {
  /* A3 O6: Preview modal added after participants expected clickable thumbnails */
  const uploadFormatted = new Date(doc.uploadDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <Modal title={`${doc.name} — Preview`} onClose={onClose}>
      <div className={styles.previewBox}>
        <div className={styles.previewPlaceholder}>
          <span className={styles.previewLabel}>[ PDF Preview ]</span>
          <span className={styles.previewFilename}>{doc.name}.pdf · {doc.pages} page{doc.pages !== 1 ? 's' : ''}</span>
          <span className={styles.previewDate}>Last updated: {uploadFormatted}</span>
        </div>
      </div>
      <p className={styles.previewNote}>In the final implementation, this would render the actual document.</p>
    </Modal>
  );
}

function DocSelector({ docs, selectedId, onSelect }) {
  const [olderExpanded, setOlderExpanded] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const current = docs.filter(d => d.status === 'current');
  const older = docs.filter(d => d.status === 'older');

  function renderCard(doc) {
    const isSelected = selectedId === doc.id;
    const uploadFormatted = new Date(doc.uploadDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return (
      <div
        key={doc.id}
        className={`${styles.docCard} ${isSelected ? styles.docCardSelected : ''}`}
        onClick={() => onSelect(doc.id)}
        role="radio"
        aria-checked={isSelected}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onSelect(doc.id)}
      >
        <div className={styles.docRadio}>
          <div className={`${styles.radioCircle} ${isSelected ? styles.radioSelected : ''}`} />
        </div>
        <div className={styles.docInfo}>
          <div className={styles.docName}>{doc.name}</div>
          <div className={styles.docMeta}>
            <span className={styles.versionTag}>{doc.version}</span>
            <Tag status={doc.status} />
          </div>
          <div className={styles.docDate}>Uploaded {uploadFormatted}</div>
        </div>
        <button
          className={styles.previewBtn}
          onClick={e => { e.stopPropagation(); setPreviewDoc(doc); }}
          title="Preview document"
          aria-label="Preview document"
        >
          <Eye size={16} />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Nielsen H2: 'Current' not 'Active' — A3 O5 */}
      <p className={styles.sectionLabel}>Current Resumes / Cover Letters</p>
      <p className={styles.helperText}>The most recently uploaded version is pre-selected. You can also preview any document before selecting.</p>
      <div className={styles.docList}>
        {current.map(renderCard)}
      </div>

      {older.length > 0 && (
        <div className={styles.olderSection}>
          <button className={styles.olderToggle} onClick={() => setOlderExpanded(v => !v)}>
            {olderExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Older Versions ({older.length})
          </button>
          {olderExpanded && (
            <div className={styles.docList}>{older.map(renderCard)}</div>
          )}
        </div>
      )}

      {previewDoc && <DocPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
    </>
  );
}

export default function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const job = fakeJobs.find(j => j.id === Number(id));
  const [step, setStep] = useState(1);
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const resumes = state.documents.filter(d => d.type === 'resume');
  const coverLetters = state.documents.filter(d => d.type === 'coverLetter');

  const resumeDoc = state.documents.find(d => d.id === selectedResume);
  const clDoc = state.documents.find(d => d.id === selectedCoverLetter);

  function handleSubmit() {
    /* Nielsen H4: 1.5s submission animation then dedicated confirmation state */
    setSubmitting(true);
    setTimeout(() => {
      dispatch({
        type: 'SUBMIT_APPLICATION',
        payload: {
          id: `app-${Date.now()}`,
          jobTitle: job.title,
          company: job.company,
          appliedDate: new Date().toISOString().slice(0, 10),
          status: 'Application Received',
          documents: [resumeDoc?.name, clDoc?.name].filter(Boolean),
        },
      });
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  }

  if (!job) return <div className={`${styles.page} page-content`}><p>Job not found.</p></div>;

  /* A3 O8: Dedicated confirmation state — not just a toast — resolves submission uncertainty */
  if (submitted) {
    return (
      <div className={`${styles.page} page-content`}>
        <div className={styles.confirmation}>
          <div className={styles.checkIcon}>
            <CheckCircle size={64} color="var(--color-success)" />
          </div>
          <h1 className={styles.confirmTitle}>Application Submitted Successfully</h1>
          <p className={styles.confirmSub}>Your application to <strong>{job.company}</strong> has been received.</p>

          <div className={styles.confirmDocs}>
            {resumeDoc && (
              <div className={styles.confirmDocRow}>
                <span className={styles.confirmDocLabel}>Resume submitted:</span>
                <span>{resumeDoc.name}</span>
                <span className={styles.versionTag}>{resumeDoc.version}</span>
              </div>
            )}
            {clDoc && (
              <div className={styles.confirmDocRow}>
                <span className={styles.confirmDocLabel}>Cover letter submitted:</span>
                <span>{clDoc.name}</span>
                <span className={styles.versionTag}>{clDoc.version}</span>
              </div>
            )}
          </div>

          <div className={styles.confirmRef}>Reference: APP-2026-0047</div>

          <div className={styles.confirmActions}>
            <Button variant="primary" onClick={() => navigate('/applications')}>View My Applications</Button>
            <Button variant="secondary" onClick={() => navigate('/jobs')}>Search More Jobs</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} page-content`}>
      <h1 className={styles.title}>Apply: {job.title}</h1>
      <p className={styles.subtitle}>{job.company} · {job.location}</p>

      {/* Nielsen H1: Visibility of system status — numbered step indicator */}
      <StepIndicator steps={STEPS} currentStep={step} />

      {/* Step 1 */}
      {step === 1 && (
        <div className={styles.stepContent}>
          <h2 className={styles.stepHeading}>Step 1 of 3: Select Your Resume</h2>
          <DocSelector
            docs={resumes}
            selectedId={selectedResume}
            onSelect={setSelectedResume}
          />
          <div className={styles.stepNav}>
            <Button
              variant="primary"
              disabled={!selectedResume}
              onClick={() => setStep(2)}
            >
              Next: Cover Letter →
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className={styles.stepContent}>
          <h2 className={styles.stepHeading}>Step 2 of 3: Select Your Cover Letter</h2>
          <DocSelector
            docs={coverLetters}
            selectedId={selectedCoverLetter}
            onSelect={setSelectedCoverLetter}
          />
          <div className={styles.stepNav}>
            <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
            <Button
              variant="primary"
              disabled={!selectedCoverLetter}
              onClick={() => setStep(3)}
            >
              Next: Review →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className={styles.stepContent}>
          <h2 className={styles.stepHeading}>Step 3 of 3: Review Your Application</h2>

          <div className={styles.reviewCard}>
            <div className={styles.reviewRow}>
              <span className={styles.reviewLabel}>Position</span>
              <span className={styles.reviewValue}>{job.title} — {job.company}</span>
            </div>
            {resumeDoc && (
              <div className={styles.reviewRow}>
                <span className={styles.reviewLabel}>Resume</span>
                <div className={styles.reviewDocRow}>
                  <span>{resumeDoc.name}</span>
                  <span className={styles.versionTag}>{resumeDoc.version}</span>
                  <button className={styles.previewBtn} onClick={() => setPreviewDoc(resumeDoc)} title="Preview">
                    <Eye size={15} />
                  </button>
                </div>
              </div>
            )}
            {clDoc && (
              <div className={styles.reviewRow}>
                <span className={styles.reviewLabel}>Cover Letter</span>
                <div className={styles.reviewDocRow}>
                  <span>{clDoc.name}</span>
                  <span className={styles.versionTag}>{clDoc.version}</span>
                  <button className={styles.previewBtn} onClick={() => setPreviewDoc(clDoc)} title="Preview">
                    <Eye size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.stepNav}>
            <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
            {/* Nielsen H4: loading spinner on submit button */}
            <Button variant="primary" size="lg" loading={submitting} onClick={handleSubmit}>
              Submit Application
            </Button>
          </div>
        </div>
      )}

      {previewDoc && <DocPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
    </div>
  );
}
