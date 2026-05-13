import { Check } from 'lucide-react';
import styles from './StepIndicator.module.css';

/* Nielsen H1: Visibility of system status — numbered step indicator */
/* A3 O7: Numbered step layout was praised in usability testing — preserved and enhanced */
export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className={styles.container}>
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isPast = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        return (
          <div key={stepNum} className={styles.stepWrapper}>
            <div className={styles.step}>
              <div
                className={`${styles.circle} ${isPast ? styles.past : ''} ${isCurrent ? styles.current : ''}`}
              >
                {isPast ? <Check size={14} strokeWidth={3} /> : stepNum}
              </div>
              <span
                className={`${styles.label} ${isCurrent ? styles.labelCurrent : ''} ${isPast ? styles.labelPast : ''}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`${styles.line} ${isPast ? styles.lineDone : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
