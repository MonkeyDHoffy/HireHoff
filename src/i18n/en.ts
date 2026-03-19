/**
 * English translations — ApplyHoff
 */
export const en = {
  // --- Navigation / Menu ---
  nav: {
    dashboard: 'Dashboard',
    newApplication: 'New Application',
    allApplications: 'All Applications',
    settings: 'Settings',
    statistics: 'Statistics',
    back: '← Back',
    menu: 'Menu',
    close: 'Close',
    openMenu: 'Open menu',
  },

  // --- Dashboard ---
  dashboard: {
    overview: 'Overview',
    recentApplications: 'Recent Applications',
    total: 'Total',
    pending: 'Pending',
    interviews: 'Interviews',
    viewAll: 'View All',
    addApplication: '+ Add Application',
    noApplicationsTitle: 'No applications yet',
    noApplicationsDescription:
      'Start tracking your job applications by adding your first one.',
    remote: 'Remote',
    appliedDate: 'Applied {date}',
    confirmStatusTitle: 'Change Status',
    confirmStatusMessage: 'Change status to "{status}"?',
    confirmCancel: 'Cancel',
    confirmOk: 'Change',
  },

  // --- Detail Screen ---
  detail: {
    notFoundTitle: 'Not Found',
    notFoundMessage: 'Application not found.',
    deleteTitle: 'Delete Application',
    deleteMessage: 'Delete application at {company}?',
    deleteCancel: 'Cancel',
    deleteConfirm: 'Delete',
    deleteButton: 'Delete Application',
    details: 'Details',
    company: 'Company',
    position: 'Position',
    location: 'Location',
    remote: 'Remote',
    source: 'Source',
    salary: 'Salary',
    contact: 'Contact',
    url: 'URL',
    emptyValue: '—',
    notes: 'Notes',
    changeStatus: 'Change Status',
    status: 'Status',
    timeline: 'Timeline',
    noHistory: 'No history yet.',
    appliedDate: 'Applied {date}',
    edit: 'Edit',
    duplicate: 'Duplicate',
  },

  // --- Reminders ---
  reminder: {
    title: 'Reminders',
    addReminder: 'Add Reminder',
    messagePlaceholder: 'e.g. Follow up if no reply',
    dateLabel: 'Due Date',
    noReminders: 'No reminders set.',
    due: 'Due',
    overdue: 'Overdue',
    done: 'Done',
    dueToday: 'Due Today',
    upcomingReminders: 'Upcoming Reminders',
  },

  // --- New Application Form ---
  form: {
    title: 'New Application',
    editTitle: 'Edit Application',
    save: 'Save',
    saveApplication: 'Save Application',
    sectionCompany: 'Company & Position',
    companyLabel: 'Company *',
    companyPlaceholder: 'e.g. Acme Corp',
    positionLabel: 'Position *',
    positionPlaceholder: 'e.g. Frontend Developer',
    locationLabel: 'Location',
    locationPlaceholder: 'e.g. Berlin, Germany',
    remoteLabel: 'Remote',
    sectionDetails: 'Details',
    sourceLabel: 'Source',
    statusLabel: 'Status',
    urlLabel: 'Job Posting URL',
    urlPlaceholder: 'https://...',
    salaryLabel: 'Salary',
    salaryPlaceholder: 'e.g. 60k-70k EUR',
    contactLabel: 'Contact Person',
    contactPlaceholder: 'e.g. Jane Doe, HR',
    sectionNotes: 'Notes',
    notesLabel: 'Notes',
    notesPlaceholder: 'Interview questions, impressions, benefits...',
    validationCompany: 'Company name is required',
    validationPosition: 'Position is required',
    validationTitle: 'Missing field',
  },

  // --- Settings ---
  settings: {
    title: 'Settings',
    appInfo: 'App Info',
    version: 'ApplyHoff v1.0.0',
    description: 'Job application tracker built with Expo + React Native',
    language: 'Language',
    languageLabel: 'Language',
    componentPreview: 'Component Preview',
    exportCsv: 'Export as CSV',
    exportSuccess: 'CSV exported successfully',
    buttons: 'Buttons',
    primaryButton: 'Primary Button',
    secondary: 'Secondary',
    outline: 'Outline',
    ghost: 'Ghost',
    disabled: 'Disabled',
    loading: 'Loading...',
    buttonSizes: 'Button Sizes',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    badges: 'Badges',
    badgeDefault: 'Default',
    badgePrimary: 'Primary',
    badgeSuccess: 'Success',
    badgeWarning: 'Warning',
    badgeError: 'Error',
    statusPills: 'Status Pills',
    statusApplied: 'Applied',
    statusInterview: 'Interview',
    statusRejected: 'Rejected',
    surfaces: 'Surfaces',
    defaultSurface: 'Default Surface',
    altSurface: 'Alt Surface',
    inputFields: 'Input Fields',
    companyLabel: 'Company',
    companyPlaceholder: 'e.g. Acme Corp',
    positionLabel: 'Position',
    positionPlaceholder: 'e.g. Frontend Developer',
    notesLabel: 'Notes',
    notesPlaceholder: 'Any additional notes...',
    withError: 'With Error',
    requiredField: 'Required field',
    fieldRequired: 'This field is required',
    emptyState: 'Empty State',
    emptyStateTitle: 'No applications yet',
    emptyStateDescription:
      'Start tracking your job applications by adding your first one.',
    addApplication: 'Add Application',
    typographyPreview: 'Typography Preview',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    bodyText: 'Body text — regular',
    bodySmall: 'Body small — secondary',
    caption: 'Caption — light',
    labelText: 'Label — medium weight',
    colorPalette: 'Color Palette',
  },

  // --- Status Labels ---
  status: {
    draft: 'Draft',
    applied: 'Applied',
    acknowledged: 'Acknowledged',
    interview_1: 'Interview 1',
    interview_2: 'Interview 2',
    assignment: 'Assignment',
    offer: 'Offer',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
  },

  // --- Source Labels ---
  source: {
    linkedin: 'LinkedIn',
    indeed: 'Indeed',
    company_website: 'Company Website',
    referral: 'Referral',
    recruiter: 'Recruiter',
    job_board: 'Job Board',
    other: 'Other',
  },

  // --- Statistics ---
  statistics: {
    title: 'Statistics',
    statusBreakdown: 'Status Breakdown',
    applicationsByMonth: 'Applications by Month',
    topSources: 'Top Sources',
    avgResponseTime: 'Avg. Response Time',
    responseTime: 'Response Time',
    days: 'days',
    noData: 'Not enough data yet.',
    successRate: 'Success Rate',
    activeRate: 'Active Rate',
    total: 'Total',
    active: 'Active',
    closed: 'Closed',
  },

  // --- Kanban ---
  kanban: {
    title: 'Kanban Board',
    emptyColumn: 'No applications',
  },

  // --- Store ---
  store: {
    applicationCreated: 'Application created',
  },

  // --- Toasts ---
  toast: {
    applicationSaved: 'Application saved',
    applicationUpdated: 'Application updated',
    applicationDeleted: 'Application deleted',
    statusChanged: 'Status changed',
    applicationDuplicated: 'Application duplicated',
    reminderAdded: 'Reminder set',
    reminderDeleted: 'Reminder removed',
    reminderToggled: 'Reminder updated',
  },

  // --- Footer ---
  footer: {
    brand: 'ApplyHoff',
  },

  // --- Application List ---
  list: {
    title: 'All Applications',
    searchPlaceholder: 'Search company or position...',
    filterAll: 'All',
    noResults: 'No matching applications',
    noResultsDescription: 'Try adjusting your search or filter.',
    count: '{count} applications',
    sortBy: 'Sort',
    sortDate: 'Date',
    sortStatus: 'Status',
    sortCompany: 'Company',
  },
} as const;

/** Deep-writable version: maps all leaf string literals to `string` */
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type Translations = DeepStringify<typeof en>;
