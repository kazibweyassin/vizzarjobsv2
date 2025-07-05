// Application status constants
export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  INTERVIEWING: 'interviewing',
  HIRED: 'hired',
  REJECTED: 'rejected'
};

export const APPLICATION_STATUS_LABELS = {
  [APPLICATION_STATUS.APPLIED]: 'Applied',
  [APPLICATION_STATUS.INTERVIEWING]: 'Interviewing',
  [APPLICATION_STATUS.HIRED]: 'Hired',
  [APPLICATION_STATUS.REJECTED]: 'Rejected'
};

export const APPLICATION_STATUS_COLORS = {
  [APPLICATION_STATUS.APPLIED]: 'bg-blue-50 text-blue-700 border-blue-200',
  [APPLICATION_STATUS.INTERVIEWING]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  [APPLICATION_STATUS.HIRED]: 'bg-green-50 text-green-700 border-green-200',
  [APPLICATION_STATUS.REJECTED]: 'bg-red-50 text-red-700 border-red-200'
};

// User roles
export const USER_ROLES = {
  CANDIDATE: 'candidate',
  RECRUITER: 'recruiter'
};

// Education levels
export const EDUCATION_LEVELS = [
  'Intermediate',
  'Graduate',
  'Post Graduate'
];

// File upload constraints
export const FILE_CONSTRAINTS = {
  RESUME: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    allowedTypesText: 'PDF, DOC, DOCX'
  },
  LOGO: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/svg+xml'
    ],
    allowedTypesText: 'PNG, JPEG, JPG, SVG'
  }
};

// Job status
export const JOB_STATUS = {
  OPEN: true,
  CLOSED: false
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50
};

// API endpoints (for reference)
export const API_ENDPOINTS = {
  JOBS: '/jobs',
  COMPANIES: '/companies',
  APPLICATIONS: '/applications'
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'vite-ui-theme',
  USER_PREFERENCES: 'user-preferences',
  RECENT_SEARCHES: 'recent-searches'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size is too large. Please choose a smaller file.',
  INVALID_FILE_TYPE: 'Invalid file type. Please choose a supported file format.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  JOB_POSTED: 'Job posted successfully!',
  APPLICATION_SUBMITTED: 'Application submitted successfully!',
  COMPANY_ADDED: 'Company added successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  JOB_SAVED: 'Job saved successfully!',
  JOB_REMOVED: 'Job removed from saved jobs.'
};

export default {
  APPLICATION_STATUS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  USER_ROLES,
  EDUCATION_LEVELS,
  FILE_CONSTRAINTS,
  JOB_STATUS,
  PAGINATION,
  API_ENDPOINTS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
