/**
 * Persistent localStorage utility for GCS Operations Hub
 */

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing localStorage key "${key}":`, error);
  }
}

export function clearGCSStorage(): void {
  const keys = [
    'gcs_tasks',
    'gcs_inventory',
    'gcs_movements',
    'gcs_requests',
    'gcs_announcements',
    'gcs_messages',
    'gcs_notifications',
    'gcs_audit_logs',
    'gcs_users',
    'gcs_current_user_id',
    'gcs_theme'
  ];
  keys.forEach((k) => localStorage.removeItem(k));
}
