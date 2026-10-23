import { CalendarEvent } from '../types';

/**
 * Format a Date object or date + time string into UTC iCalendar format (YYYYMMDDTHHmmssZ)
 */
export function formatIcsDateTime(dateStr: string, timeStr?: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  let hour = 9;
  let minute = 0;

  if (timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    if (!isNaN(h)) hour = h;
    if (!isNaN(m)) minute = m;
  }

  // Construct local date and format as YYYYMMDDTHHmmSS
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
}

/**
 * Escape text for standard iCalendar RFC 5545 format
 */
function escapeIcsText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generate standard .ics (iCalendar) file string
 */
export function generateIcsContent(event: CalendarEvent): string {
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dtStart = formatIcsDateTime(event.date, event.startTime || '09:00');
  const dtEnd = formatIcsDateTime(event.date, event.endTime || '12:00');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gahanga Cricket Stadium Kigali//GCS Operations//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@gahangacricket.demo`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(event.location || 'Gahanga Cricket Stadium, Kigali')}`,
    `DESCRIPTION:${escapeIcsText((event.description || '') + (event.teamsOrParticipants ? `\\nParticipants: ${event.teamsOrParticipants}` : ''))}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  return lines.join('\r\n');
}

/**
 * Trigger download of .ics file in browser
 */
export function downloadIcsFile(event: CalendarEvent) {
  const icsData = generateIcsContent(event);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeFilename = event.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 32);
  link.setAttribute('download', `GCS_${safeFilename}_${event.date}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Generate Google Calendar direct URL link to create the event
 */
export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const dtStart = formatIcsDateTime(event.date, event.startTime || '09:00');
  const dtEnd = formatIcsDateTime(event.date, event.endTime || '12:00');
  const text = encodeURIComponent(event.title);
  const location = encodeURIComponent(event.location || 'Gahanga Cricket Stadium, Kigali, Rwanda');
  const details = encodeURIComponent(
    `${event.description || ''}\n\nType: ${event.type}\nVenue: ${event.location}${
      event.teamsOrParticipants ? `\nTeams/Participants: ${event.teamsOrParticipants}` : ''
    }\nOrganizer/Assignee: ${event.organizerOrAssignee || 'GCS Operations'}\n\nGahanga Cricket Stadium Operations System`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dtStart}/${dtEnd}&details=${details}&location=${location}`;
}

/**
 * Generate standard multi-event .ics file string
 */
export function generateMultiEventIcsContent(events: CalendarEvent[]): string {
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gahanga Cricket Stadium Kigali//GCS Operations Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  for (const event of events) {
    const dtStart = formatIcsDateTime(event.date, event.startTime || '09:00');
    const dtEnd = formatIcsDateTime(event.date, event.endTime || '12:00');

    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.id}@gahangacricket.demo`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${escapeIcsText(event.title)}`,
      `LOCATION:${escapeIcsText(event.location || 'Gahanga Cricket Stadium, Kigali')}`,
      `DESCRIPTION:${escapeIcsText((event.description || '') + (event.teamsOrParticipants ? `\\nParticipants: ${event.teamsOrParticipants}` : ''))}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Trigger download of multi-event .ics file in browser
 */
export function downloadAllEventsIcs(events: CalendarEvent[], filename = 'GCS_Stadium_Schedule.ics') {
  if (events.length === 0) return;
  const icsData = generateMultiEventIcsContent(events);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
