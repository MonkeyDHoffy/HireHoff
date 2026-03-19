import { Application } from '../types';

const CSV_HEADERS = [
  'Company',
  'Position',
  'Status',
  'Location',
  'Remote',
  'Source',
  'Salary',
  'Contact',
  'URL',
  'Applied At',
  'Notes',
];

function escapeField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function applicationsToCsv(applications: Application[]): string {
  const rows = applications.map((app) =>
    [
      app.company,
      app.position,
      app.status,
      app.location,
      app.remote ? 'Yes' : 'No',
      app.source,
      app.salary,
      app.contact,
      app.url,
      app.appliedAt,
      app.notes,
    ]
      .map(escapeField)
      .join(','),
  );
  return [CSV_HEADERS.join(','), ...rows].join('\n');
}

export function downloadCsvWeb(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
