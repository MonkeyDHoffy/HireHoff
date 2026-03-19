/**
 * ApplyHoff — Core Type Definitions
 *
 * All shared types for job applications, status history,
 * reminders, notes, and document references.
 */

// --- Application Status ---

export const APPLICATION_STATUSES = [
  'draft',
  'applied',
  'acknowledged',
  'interview_1',
  'interview_2',
  'assignment',
  'offer',
  'rejected',
  'withdrawn',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** Human-readable labels for each status */
export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: 'Draft',
  applied: 'Applied',
  acknowledged: 'Acknowledged',
  interview_1: 'Interview 1',
  interview_2: 'Interview 2',
  assignment: 'Assignment',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

/** Color mapping for status display */
export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  draft: '#A08B76',
  applied: '#E07A3A',
  acknowledged: '#5B8FA8',
  interview_1: '#6B9F72',
  interview_2: '#3D8B5F',
  assignment: '#D4956A',
  offer: '#4CAF50',
  rejected: '#C94C4C',
  withdrawn: '#7A6552',
};

// --- Application Source ---

export const APPLICATION_SOURCES = [
  'linkedin',
  'indeed',
  'company_website',
  'referral',
  'recruiter',
  'job_board',
  'other',
] as const;

export type ApplicationSource = (typeof APPLICATION_SOURCES)[number];

export const SOURCE_LABELS: Record<ApplicationSource, string> = {
  linkedin: 'LinkedIn',
  indeed: 'Indeed',
  company_website: 'Company Website',
  referral: 'Referral',
  recruiter: 'Recruiter',
  job_board: 'Job Board',
  other: 'Other',
};

// --- Core Models ---

/** A single job application */
export interface Application {
  id: string;
  company: string;
  position: string;
  location: string;
  remote: boolean;
  url: string;
  source: ApplicationSource;
  status: ApplicationStatus;
  salary: string;
  contact: string;
  notes: string;
  tags: string[];            // user-defined labels
  appliedAt: string;       // ISO date string
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
}

/** A status change event in the application timeline */
export interface StatusEvent {
  id: string;
  applicationId: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  note: string;
  createdAt: string;       // ISO date string
}

/** A follow-up reminder */
export interface Reminder {
  id: string;
  applicationId: string;
  dueAt: string;           // ISO date string
  message: string;
  done: boolean;
  createdAt: string;       // ISO date string
}

/** A document reference (local file path or description) */
export interface DocumentRef {
  id: string;
  applicationId: string;
  name: string;            // e.g. "CV v2", "Cover Letter"
  type: 'cv' | 'cover_letter' | 'certificate' | 'portfolio' | 'other';
  path: string;            // file path or URI
  createdAt: string;       // ISO date string
}

// --- Helpers ---

/** Generate a simple unique ID */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

/** Create a new empty application with defaults */
export function createEmptyApplication(): Omit<Application, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    company: '',
    position: '',
    location: '',
    remote: false,
    url: '',
    source: 'other',
    status: 'draft',
    salary: '',
    contact: '',
    notes: '',
    tags: [],
    appliedAt: new Date().toISOString(),
  };
}
