import { Platform } from 'react-native';
import { Application } from '../types';

// ─── CSV Export (Excel-compatible with semicolons) ─────────────

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
  'Tags',
];

function escapeCsvField(value: string): string {
  if (value.includes(';') || value.includes('"') || value.includes('\n')) {
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
      (app.tags ?? []).join(', '),
    ]
      .map(escapeCsvField)
      .join(';'),
  );
  // BOM + semicolon-separated for Excel compatibility
  return '\uFEFF' + [CSV_HEADERS.join(';'), ...rows].join('\n');
}

// ─── Detailed Text Export ───────────────────────────────────────

export function applicationsToDetailedText(applications: Application[]): string {
  if (applications.length === 0) return 'No applications.';

  const divider = '─'.repeat(50);

  return applications
    .map((app, i) => {
      const lines = [
        `${i + 1}. ${app.company} — ${app.position}`,
        divider,
        `   Status:    ${app.status}`,
        `   Location:  ${app.location || '—'}${app.remote ? ' (Remote)' : ''}`,
        `   Source:    ${app.source}`,
        `   Salary:   ${app.salary || '—'}`,
        `   Contact:  ${app.contact || '—'}`,
        `   URL:      ${app.url || '—'}`,
        `   Applied:  ${new Date(app.appliedAt).toLocaleDateString()}`,
      ];
      if (app.tags && app.tags.length > 0) {
        lines.push(`   Tags:     ${app.tags.join(', ')}`);
      }
      if (app.notes) {
        lines.push(`   Notes:    ${app.notes}`);
      }
      lines.push('');
      return lines.join('\n');
    })
    .join('\n');
}

// ─── Simple List Export ─────────────────────────────────────────

export function applicationsToSimpleList(applications: Application[]): string {
  if (applications.length === 0) return 'No applications.';

  const header = `Applications (${applications.length})\n${'═'.repeat(40)}\n`;

  const rows = applications.map(
    (app, i) =>
      `${i + 1}. ${app.company} — ${app.position}  [${app.status}]` +
      (app.location ? `  (${app.location})` : ''),
  );

  return header + rows.join('\n');
}

// ─── Download Helpers ───────────────────────────────────────────

export function downloadCsvWeb(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlobWeb(blob, filename);
}

export function downloadTextWeb(text: string, filename: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
  downloadBlobWeb(blob, filename);
}

function downloadBlobWeb(blob: Blob, filename: string): void {
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

// ─── Native Share Helper ────────────────────────────────────────

export async function shareFileNative(content: string, filename: string): Promise<void> {
  const FileSystem = await import('expo-file-system');
  const Sharing = await import('expo-sharing');

  const fileUri = FileSystem.documentDirectory + filename;
  await FileSystem.writeAsStringAsync(fileUri, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }
}

// ─── Universal Export (auto-selects web vs native) ──────────────

export async function exportFile(content: string, filename: string): Promise<void> {
  if (Platform.OS === 'web') {
    const isCSV = filename.endsWith('.csv');
    if (isCSV) {
      downloadCsvWeb(content, filename);
    } else {
      downloadTextWeb(content, filename);
    }
  } else {
    await shareFileNative(content, filename);
  }
}
