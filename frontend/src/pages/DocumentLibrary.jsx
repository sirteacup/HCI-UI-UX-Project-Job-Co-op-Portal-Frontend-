import { useState, useRef } from 'react';
import { FileText, Eye, Trash2, Upload, File } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';
import Tag from '../components/common/Tag';
import Toast from '../components/common/Toast';
import Button from '../components/common/Button';
import styles from './DocumentLibrary.module.css';

const TABS = ['All', 'Resumes', 'Cover Letters', 'Transcripts'];
const TYPE_MAP = { Resumes: 'resume', 'Cover Letters': 'coverLetter', Transcripts: 'transcript' };

function typeIcon(type) {
  const colors = { resume: '#1D4ED8', coverLetter: '#16A34A', transcript: '#7C3AED' };
  return <File size={22} color={colors[type] || '#6B6560'} />;
}

function PreviewModal({ doc, onClose }) {
  /* A3 O11: In-portal preview preserved and extended */
  const uploadFormatted = new Date(doc.uploadDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <Modal title={`${doc.name} — Preview`} onClose={onClose}>
      <div className={styles.previewPlaceholder}>
        <span className={styles.previewLabel}>[ PDF Preview ]</span>
        <span className={styles.previewFilename}>{doc.name}.pdf · {doc.pages} page{doc.pages !== 1 ? 's' : ''}</span>
        <span className={styles.previewDate}>Last updated: {uploadFormatted}</span>
      </div>
      <p className={styles.previewNote}>In the final implementation, this would render the actual document.</p>
    </Modal>
  );
}

function DeleteConfirmModal({ doc, onConfirm, onClose }) {
  /* Nielsen H5: Error prevention — confirm before delete */
  return (
    <Modal title="Delete Document" onClose={onClose}>
      <p className={styles.deleteMsg}>
        Are you sure you want to delete <strong>{doc.name}</strong>? This cannot be undone.
      </p>
      <div className={styles.deleteActions}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Delete</Button>
      </div>
    </Modal>
  );
}

function UploadModal({ onClose, onUploaded }) {
  /* A3 O9: Drag-and-drop upload area added — participants expected this interaction */
  /* A3 O10: Version label helper text — 3 participants were confused without it */
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [docType, setDocType] = useState('resume');
  const [docName, setDocName] = useState('');
  const [version, setVersion] = useState('');
  const [setCurrent, setSetCurrent] = useState(true);
  const fileInputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setFileName(file.name);
  }

  function handleSubmit() {
    onUploaded({
      id: `doc-${Date.now()}`,
      name: docName || fileName || 'Untitled Document',
      type: docType,
      uploadDate: new Date().toISOString().slice(0, 10),
      version: version || 'v1',
      status: setCurrent ? 'current' : 'older',
      pages: 1,
    });
  }

  return (
    <Modal title="Upload New Document" onClose={onClose}>
      {/* Drag and drop zone */}
      <div
        className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={24} color={dragOver ? 'var(--color-accent)' : 'var(--color-text-muted)'} />
        <span className={styles.dropText}>
          {fileName ? fileName : 'Drag and drop your file here, or click to browse'}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={e => e.target.files[0] && setFileName(e.target.files[0].name)}
          accept=".pdf,.doc,.docx"
        />
      </div>

      <div className={styles.uploadForm}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Document Type</label>
          <select className={styles.select} value={docType} onChange={e => setDocType(e.target.value)}>
            <option value="resume">Resume</option>
            <option value="coverLetter">Cover Letter</option>
            <option value="transcript">Transcript</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Document Name</label>
          <input
            className={styles.input}
            type="text"
            value={docName}
            onChange={e => setDocName(e.target.value)}
            placeholder="e.g., Resume — Software Dev"
          />
        </div>
        <div className={styles.field}>
          {/* A3 O10: Version label helper text */}
          <label className={styles.fieldLabel}>Version Label</label>
          <input
            className={styles.input}
            type="text"
            value={version}
            onChange={e => setVersion(e.target.value)}
            placeholder="e.g., Software Dev v3"
          />
          <p className={styles.fieldHelper}>
            💡 A version label helps you tell documents apart when applying. For example: &ldquo;Software Dev v3&rdquo; or &ldquo;Finance Cover Letter v2&rdquo;.
          </p>
        </div>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={setCurrent}
            onChange={e => setSetCurrent(e.target.checked)}
          />
          Set as my current version for this document type
        </label>
      </div>

      <div className={styles.uploadActions}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Upload Document</Button>
      </div>
    </Modal>
  );
}

export default function DocumentLibrary() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('All');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState(null);

  const filtered = state.documents.filter(d => {
    if (activeTab === 'All') return true;
    return d.type === TYPE_MAP[activeTab];
  });

  function handleDelete(doc) {
    dispatch({ type: 'DELETE_DOCUMENT', payload: doc.id });
    setDeleteDoc(null);
    setToast({ message: `${doc.name} deleted.`, variant: 'info' });
  }

  function handleUploaded(doc) {
    dispatch({ type: 'UPLOAD_DOCUMENT', payload: doc });
    setShowUpload(false);
    setToast({ message: `✓ ${doc.name} uploaded successfully`, variant: 'success' });
  }

  return (
    <div className={`${styles.page} page-content`}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>My Documents</h1>
        <Button variant="primary" icon={<Upload size={15} />} onClick={() => setShowUpload(true)}>
          Upload New Document
        </Button>
      </div>

      {/* Filter tabs */}
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map(doc => (
          <div
            key={doc.id}
            className={`${styles.card} ${doc.status === 'current' ? styles.cardCurrent : styles.cardOlder}`}
          >
            <div className={styles.cardTop}>
              <div className={styles.docIcon}>{typeIcon(doc.type)}</div>
              <div className={styles.docInfo}>
                <div className={styles.docName}>{doc.name}</div>
                <div className={styles.docMeta}>
                  {/* Nielsen H2: 'Current'/'Older Versions' — A3 O5 */}
                  <Tag status={doc.status} />
                  <span className={styles.versionTag}>{doc.version}</span>
                </div>
                <div className={styles.docDate}>
                  {new Date(doc.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.actionBtn} onClick={() => setPreviewDoc(doc)} title="Preview">
                <Eye size={15} /> Preview
              </button>
              <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => setDeleteDoc(doc)} title="Delete">
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={styles.empty}>No documents in this category yet.</div>
        )}
      </div>

      {previewDoc && <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
      {deleteDoc && <DeleteConfirmModal doc={deleteDoc} onConfirm={() => handleDelete(deleteDoc)} onClose={() => setDeleteDoc(null)} />}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUploaded={handleUploaded} />}
      {toast && <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />}
    </div>
  );
}
