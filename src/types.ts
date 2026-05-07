export type TextSize = 'normal' | 'grande' | 'muy-grande';
export type MovementMode = 'normal' | 'reducido';
export type ContrastMode = 'suave' | 'alto';
export type Intensity = 'poquito' | 'medio' | 'mucho';

export interface ChildProfile {
  nickname: string;
  age: string;
  favoriteTheme: string;
  favoriteThing: string;
  readingLevel: 'No lee todavía' | 'Reconoce letras' | 'Lee palabras cortas' | 'Lee frases simples';
  supportStyle: 'Imágenes' | 'Texto' | 'Audio' | 'Imágenes + texto' | 'Imágenes + audio';
  sensitivities: string[];
  helpfulStrategies: string[];
}

export interface AccessibilitySettings {
  lowStimulus: boolean;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  textSize: TextSize;
  movement: MovementMode;
  contrast: ContrastMode;
  showTextWithImages: boolean;
  imagesOnly: boolean;
}

export interface RoutineActivity { id: string; name: string; icon: string; description: string; duration?: string; category: string; status: 'pendiente'|'en-proceso'|'hecho'; }
export interface Routine { id: string; name: string; tag: 'mañana'|'tarde'|'noche'|'escuela'|'fin de semana'|'especial'; activities: RoutineActivity[]; }
export interface NeedItem { id: string; name: string; category: string; icon: string; phrase: string; active: boolean; }
export interface EmotionItem { id: string; name: string; icon: string; color: string; strategies: string[]; }
export interface PainArea { id: string; name: string; icon: string; basePhrase: string; }
export interface PainLog { id: string; date: string; area: string; intensity: Intensity; action: string; }
export interface ChangePlan { id: string; before: string; now: string; same: string; canDo: string; icon: string; calmMessage: string; active?: boolean; }
export interface TriggerLogEntry { id: string; date: string; event: string; before: string; helped: string; notes?: string; }
export interface ProgressStats { routinesCompleted: number; emotionsLogged: number; needsUsed: number; calmZoneUsed: number; painReports: number; planChangesViewed: number; achievements: string[]; }

export interface AppData {
  profile: ChildProfile;
  accessibility: AccessibilitySettings;
  routines: Routine[];
  needs: NeedItem[];
  emotions: EmotionItem[];
  painAreas: PainArea[];
  painLogs: PainLog[];
  changePlans: ChangePlan[];
  triggerLogs: TriggerLogEntry[];
  progress: ProgressStats;
  lastModule: string;
}
