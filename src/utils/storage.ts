const LUMI_PREFIX = 'lumi_';

export const LUMI_STORAGE_KEYS = {
  childProfile: 'lumi_child_profile',
  accessibilitySettings: 'lumi_accessibility_settings',
  progress: 'lumi_progress',
  painReports: 'lumi_pain_reports',
  emotionLogs: 'lumi_emotion_logs',
  planChanges: 'lumi_plan_changes',
  triggerLogs: 'lumi_trigger_logs',
} as const;

export const LUMI_STORAGE_DEFAULTS = {
  [LUMI_STORAGE_KEYS.childProfile]: null,
  [LUMI_STORAGE_KEYS.accessibilitySettings]: {
    lowStimulus: false,
    soundEnabled: true,
    voiceEnabled: true,
    fontSize: 'normal',
    motion: 'normal',
    contrast: 'suave',
    showTextWithImages: true,
  },
  [LUMI_STORAGE_KEYS.progress]: {
    completedRoutines: [],
    gameStars: 0,
  },
  [LUMI_STORAGE_KEYS.painReports]: [],
  [LUMI_STORAGE_KEYS.emotionLogs]: [],
  [LUMI_STORAGE_KEYS.planChanges]: {
    items: [],
    activeId: null,
  },
  [LUMI_STORAGE_KEYS.triggerLogs]: [],
} as const;

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const withPrefix = (key: string) => (key.startsWith(LUMI_PREFIX) ? key : `${LUMI_PREFIX}${key}`);

export function getStorageItem<T>(key: string, defaultValue?: T): T | null {
  if (!isBrowser()) return defaultValue ?? null;

  const normalizedKey = withPrefix(key);
  const fallback =
    defaultValue ??
    ((LUMI_STORAGE_DEFAULTS as Record<string, unknown>)[normalizedKey] as T | undefined) ??
    null;

  try {
    const rawValue = window.localStorage.getItem(normalizedKey);
    if (rawValue === null) return fallback;
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T): boolean {
  if (!isBrowser()) return false;

  const normalizedKey = withPrefix(key);

  try {
    window.localStorage.setItem(normalizedKey, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(key: string): boolean {
  if (!isBrowser()) return false;

  const normalizedKey = withPrefix(key);

  try {
    window.localStorage.removeItem(normalizedKey);
    return true;
  } catch {
    return false;
  }
}

export function clearLumiStorage(): number {
  if (!isBrowser()) return 0;

  const keysToRemove: string[] = [];

  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith(LUMI_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => window.localStorage.removeItem(key));
  return keysToRemove.length;
}
