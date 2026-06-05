/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BookText, 
  MapPin, 
  Download, 
  HeartHandshake, 
  Search,
  ExternalLink,
  Phone,
  Globe,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  ArrowRightLeft,
  RefreshCcw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { clinics } from '../data/mockData';
import { getStorageItem, setStorageItem, LUMI_STORAGE_KEYS } from '../utils/storage';
import { SettingsContext } from '../App';

interface ChildProfile {
  avatar: string;
  nickname: string;
  age: string;
  preferredTheme: string;
  readingLevel: string;
  supportStyle: string;
  sensitivities: string[];
  helpfulStrategies: string[];
}
interface PainReport {
  timestamp: string;
  bodyPart: string;
  intensity: 'Poquito' | 'Medio' | 'Mucho';
}

interface PlanChange {
  id: string;
  beforeGoingTo: string;
  nowGoingTo: string;
  stillTheSame: string;
  canDoThis: string;
  calmMessage: string;
}

interface PlanChangesState {
  items: PlanChange[];
  activeId: string | null;
}

interface TriggerLog {
  id: string;
  date: string;
  event: string;
  trigger: string;
  helpfulStrategy: string;
  notes: string;
}

interface ProgressLog {
  id: string;
  achievement: string;
  message: string;
  timestamp: string;
}

interface LearningSettings {
  educationalLevel: string;
  practiceAreas: string[];
  activityStyle: string;
  visualSupportLevel: string;
  duration: string;
}

interface LearningProgress {
  vowelsSeen: string[];
  lettersSeen?: string[];
  syllablesSeen?: string[];
  readingWordsSeen?: string[];
  readingPhrasesSeen?: string[];
  numbersSeen?: number[];
  shapesSeen?: string[];
  colorsSeen?: string[];
  memoryLevelUsed?: number;
  memoryGamesDone?: number;
  additionExercisesDone?: number;
  subtractionExercisesDone?: number;
  multiplicationExercisesDone?: number;
  attempts: number;
  correctAnswers: number;
  lastPracticeAt: string | null;
  alphabetAttempts?: number;
  syllableAttempts?: number;
  readingAttempts?: number;
  numberAttempts?: number;
  additionAttempts?: number;
  subtractionAttempts?: number;
  multiplicationAttempts?: number;
  shapesColorsAttempts?: number;
  memoryAttempts?: number;
  alphabetCorrectAnswers?: number;
  syllableCorrectAnswers?: number;
  readingCorrectAnswers?: number;
  numberCorrectAnswers?: number;
  additionCorrectAnswers?: number;
  subtractionCorrectAnswers?: number;
  multiplicationCorrectAnswers?: number;
  shapesColorsCorrectAnswers?: number;
  memoryCorrectAnswers?: number;
  alphabetLastPracticeAt?: string | null;
  syllableLastPracticeAt?: string | null;
  readingLastPracticeAt?: string | null;
  numberLastPracticeAt?: string | null;
  additionLastPracticeAt?: string | null;
  subtractionLastPracticeAt?: string | null;
  multiplicationLastPracticeAt?: string | null;
  shapesColorsLastPracticeAt?: string | null;
  memoryLastPracticeAt?: string | null;
}

const defaultPlanExamples: PlanChange[] = [
  { id: '1', beforeGoingTo: 'Parque', nowGoingTo: 'Casa', stillTheSame: 'Jugaremos juntos', canDoThis: 'Elegir un juego tranquilo', calmMessage: 'Estoy contigo, vamos paso a paso.' },
  { id: '2', beforeGoingTo: 'Escuela', nowGoingTo: 'Casa', stillTheSame: 'Tu rutina de comida sigue igual', canDoThis: 'Preparar tu espacio favorito', calmMessage: 'Respiramos juntos y seguimos el plan nuevo.' },
  { id: '3', beforeGoingTo: 'Ruta normal', nowGoingTo: 'Ruta alterna', stillTheSame: 'Llegaremos al mismo lugar', canDoThis: 'Escuchar música tranquila', calmMessage: 'El cambio está bien, estamos seguros.' },
  { id: '4', beforeGoingTo: 'Tarde tranquila', nowGoingTo: 'Recibir visita', stillTheSame: 'Tu habitación sigue disponible', canDoThis: 'Tomar descansos cortos', calmMessage: 'Puedes pedir una pausa cuando quieras.' },
  { id: '5', beforeGoingTo: 'Consulta puntual', nowGoingTo: 'Esperar un poco más', stillTheSame: 'Seguimos con el doctor', canDoThis: 'Tomar agua y respirar', calmMessage: 'Estamos haciendo un gran trabajo esperando.' },
  { id: '6', beforeGoingTo: 'Dormir a las 8:00', nowGoingTo: 'Dormir a las 8:30', stillTheSame: 'Tu cuento antes de dormir sigue', canDoThis: 'Usar luz tenue y respirar', calmMessage: 'Pronto será hora de descansar.' },
];

const avatarOptions = ['🦊', '🐼', '🦁', '🐯', '🐬', '🦄'];
const readingLevelOptions = [
  'No lee todavía',
  'Reconoce letras',
  'Lee palabras cortas',
  'Lee frases simples',
];
const supportStyleOptions = ['Imágenes', 'Texto', 'Audio', 'Imágenes + texto', 'Imágenes + audio'];
const sensitivityOptions = ['Ruido', 'Luz', 'Texturas', 'Multitudes', 'Cambios de rutina', 'Contacto físico', 'Olores'];
const strategyOptions = ['Silencio', 'Audífonos', 'Respirar', 'Tomar agua', 'Descansar', 'Abrazo', 'Estar solo'];
const educationalLevelOptions = ['Preescolar inicial', 'Preescolar avanzado', 'Primaria básica', 'Refuerzo general'];
const practiceAreaOptions = ['Vocales', 'Alfabeto', 'Lectura', 'Números', 'Sumas', 'Restas', 'Multiplicaciones', 'Formas', 'Colores', 'Memoria'];
const activityStyleOptions = ['Tocar respuesta', 'Arrastrar y ordenar', 'Ver y repetir', 'Escuchar y elegir', 'Juego libre'];
const visualSupportOptions = ['Alto', 'Medio', 'Bajo'];
const durationOptions = ['5 minutos', '10 minutos', '15 minutos'];

const defaultLearningSettings: LearningSettings = {
  educationalLevel: educationalLevelOptions[0],
  practiceAreas: ['Vocales'],
  activityStyle: activityStyleOptions[0],
  visualSupportLevel: visualSupportOptions[0],
  duration: durationOptions[0],
};

const defaultChildProfile: ChildProfile = {
  avatar: avatarOptions[0],
  nickname: '',
  age: '',
  preferredTheme: '',
  readingLevel: readingLevelOptions[0],
  supportStyle: supportStyleOptions[0],
  sensitivities: [],
  helpfulStrategies: [],
};

// --- Parent Home ---

const ParentHome = () => {
  const categories = [
    { 
      path: 'autismo', 
      label: '¿Qué es el autismo?', 
      desc: 'Información clara y respetuosa sobre el neurodesarrollo.',
      icon: <BookText size={32} />,
      color: 'bg-indigo-50 border-indigo-100 text-indigo-700'
    },
    { 
      path: 'apoyo-casa', 
      label: 'Apoyo en casa', 
      desc: 'Consejos prácticos para el día a día y crisis sensoriales.',
      icon: <HeartHandshake size={32} />,
      color: 'bg-emerald-50 border-emerald-100 text-emerald-700'
    },
    { 
      path: 'perfil-nino',
      label: 'Perfil del niño',
      desc: 'Configura preferencias básicas para personalizar su experiencia.',
      icon: <HeartHandshake size={32} />,
      color: 'bg-violet-50 border-violet-100 text-violet-700'
    },
    {
      path: 'accesibilidad',
      label: 'Accesibilidad',
      desc: 'Ajusta visualización, movimiento y apoyos de lectura.',
      icon: <Globe size={32} />,
      color: 'bg-slate-50 border-slate-200 text-slate-700'
    },
    {
      path: 'historial-me-duele',
      label: 'Historial "Me duele"',
      desc: 'Consulta reportes recientes del módulo infantil.',
      icon: <AlertCircle size={32} />,
      color: 'bg-rose-50 border-rose-100 text-rose-700'
    },
    {
      path: 'cambio-planes',
      label: 'Cambio de planes',
      desc: 'Crea y activa mensajes para transiciones inesperadas.',
      icon: <RefreshCcw size={32} />,
      color: 'bg-indigo-50 border-indigo-100 text-indigo-700'
    },
    {
      path: 'registro-detonantes',
      label: 'Registro de detonantes',
      desc: 'Documenta eventos, detonantes y apoyos que funcionaron.',
      icon: <AlertCircle size={32} />,
      color: 'bg-orange-50 border-orange-100 text-orange-700'
    },
    {
      path: 'resumen-logros',
      label: 'Resumen de logros',
      desc: 'Consulta un resumen amigable de actividad y logros.',
      icon: <BookText size={32} />,
      color: 'bg-yellow-50 border-yellow-100 text-yellow-700'
    },
    {
      path: 'configuracion-aprendizaje',
      label: 'Configuración de aprendizaje',
      desc: 'Define nivel educativo y preferencias para adaptar actividades.',
      icon: <BookText size={32} />,
      color: 'bg-teal-50 border-teal-100 text-teal-700'
    },
    {
      path: 'directorio', 
      label: 'Directorio México', 
      desc: 'Clínicas, asociaciones y centros especializados.',
      icon: <MapPin size={32} />,
      color: 'bg-blue-50 border-blue-100 text-blue-700'
    },
    { 
      path: 'recursos', 
      label: 'Recursos', 
      desc: 'Guías y materiales visuales para descargar e imprimir.',
      icon: <Download size={32} />,
      color: 'bg-amber-50 border-amber-100 text-amber-700'
    }
  ];

  return (
    <div className="space-y-12">
      <div className="max-w-2xl">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Guía para Padres y Cuidadores</h2>
        <p className="text-lg text-slate-600">
          Un espacio dedicado a brindarte información verificada, herramientas prácticas y apoyo en el camino del autismo.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <Link 
            key={cat.path} 
            to={cat.path}
            className={cn(
              "p-8 rounded-[32px] border-2 transition-all hover:shadow-md group flex items-start gap-6",
              cat.color
            )}
          >
            <div className="bg-white p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110">
              {cat.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{cat.label}</h3>
              <p className="text-slate-600 font-medium">{cat.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="bg-slate-900 text-white p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Comunidad Lumi</h3>
          <p className="text-slate-400">Estamos trabajando en un foro seguro para conectar con otras familias.</p>
        </div>
        <div className="px-6 py-2 bg-white/10 rounded-full text-sm font-bold uppercase tracking-widest border border-white/20">Próximamente</div>
      </div>
    </div>
  );
};

const ChildProfilePage = () => {
  const [profile, setProfile] = useState<ChildProfile>(() => {
    return getStorageItem<ChildProfile>(LUMI_STORAGE_KEYS.childProfile, defaultChildProfile) ?? defaultChildProfile;
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setStorageItem(LUMI_STORAGE_KEYS.childProfile, profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const toggleArrayValue = (key: 'sensitivities' | 'helpfulStrategies', value: string) => {
    setProfile((prev) => {
      const hasValue = prev[key].includes(value);
      return {
        ...prev,
        [key]: hasValue ? prev[key].filter((item) => item !== value) : [...prev[key], value],
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Perfil del niño</h2>
        <p className="text-slate-500">Configura datos básicos y preferencias de apoyo.</p>
      </div>

      <div className="card-lumi space-y-8">
        <section className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Avatar animado</p>
          <div className="flex flex-wrap gap-3">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar}
                type="button"
                onClick={() => setProfile((prev) => ({ ...prev, avatar }))}
                className={cn(
                  'w-14 h-14 rounded-2xl border-2 text-3xl bg-white transition-all hover:scale-105',
                  profile.avatar === avatar ? 'border-lumi-olive shadow-sm' : 'border-slate-200'
                )}
              >
                {avatar}
              </button>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Nombre o apodo</span>
            <input
              value={profile.nickname}
              onChange={(e) => setProfile((prev) => ({ ...prev, nickname: e.target.value }))}
              placeholder="Ej. Alex"
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-lumi-olive"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Edad</span>
            <input
              value={profile.age}
              onChange={(e) => setProfile((prev) => ({ ...prev, age: e.target.value }))}
              placeholder="Ej. 7"
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-lumi-olive"
            />
          </label>
        </section>

        <label className="space-y-2 block">
          <span className="text-sm font-semibold text-slate-700">Color o tema preferido</span>
          <input
            value={profile.preferredTheme}
            onChange={(e) => setProfile((prev) => ({ ...prev, preferredTheme: e.target.value }))}
            placeholder="Ej. Azul, naturaleza, espacio..."
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-lumi-olive"
          />
        </label>

        <section className="grid md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Nivel de lectura</span>
            <select
              value={profile.readingLevel}
              onChange={(e) => setProfile((prev) => ({ ...prev, readingLevel: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-lumi-olive"
            >
              {readingLevelOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Forma de apoyo preferida</span>
            <select
              value={profile.supportStyle}
              onChange={(e) => setProfile((prev) => ({ ...prev, supportStyle: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-lumi-olive"
            >
              {supportStyleOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Sensibilidades comunes</p>
          <div className="flex flex-wrap gap-2">
            {sensitivityOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleArrayValue('sensitivities', item)}
                className={cn(
                  'px-4 py-2 rounded-full border text-sm font-medium transition-all',
                  profile.sensitivities.includes(item)
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-white border-slate-200 text-slate-600'
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Estrategias que ayudan</p>
          <div className="flex flex-wrap gap-2">
            {strategyOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleArrayValue('helpfulStrategies', item)}
                className={cn(
                  'px-4 py-2 rounded-full border text-sm font-medium transition-all',
                  profile.helpfulStrategies.includes(item)
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600'
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-lumi-olive transition-all"
          >
            Guardar perfil
          </button>
          {saved && <span className="text-sm font-semibold text-emerald-700">Perfil guardado en este dispositivo.</span>}
        </div>
      </div>
    </div>
  );
};

const AccessibilityPage = () => {
  const { settings, updateSettings } = useContext(SettingsContext);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Accesibilidad</h2>
        <p className="text-slate-500">Personaliza la experiencia visual y de apoyo.</p>
      </div>

      <div className="card-lumi space-y-8">
        <section className="grid md:grid-cols-2 gap-4">
          <button type="button" onClick={() => updateSettings({ lowStimulus: !settings.lowStimulus })} className="text-left bg-white border border-slate-200 rounded-2xl p-4">
            <p className="font-bold">Modo bajo estímulo</p>
            <p className="text-sm text-slate-500 mt-1">{settings.lowStimulus ? 'Activado' : 'Desactivado'}</p>
          </button>
          <button type="button" onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })} className="text-left bg-white border border-slate-200 rounded-2xl p-4">
            <p className="font-bold">Sonidos</p>
            <p className="text-sm text-slate-500 mt-1">{settings.soundEnabled ? 'Activados' : 'Desactivados'}</p>
          </button>
          <button type="button" onClick={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })} className="text-left bg-white border border-slate-200 rounded-2xl p-4">
            <p className="font-bold">Voz</p>
            <p className="text-sm text-slate-500 mt-1">{settings.voiceEnabled ? 'Activada' : 'Desactivada'}</p>
          </button>
          <button type="button" onClick={() => updateSettings({ showTextWithImages: !settings.showTextWithImages })} className="text-left bg-white border border-slate-200 rounded-2xl p-4">
            <p className="font-bold">Mostrar texto junto a imágenes</p>
            <p className="text-sm text-slate-500 mt-1">{settings.showTextWithImages ? 'Sí' : 'No'}</p>
          </button>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Tamaño de texto</span>
            <select value={settings.fontSize} onChange={(e) => updateSettings({ fontSize: e.target.value as 'normal' | 'large' | 'xlarge' })} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none">
              <option value="normal">Normal</option>
              <option value="large">Grande</option>
              <option value="xlarge">Muy grande</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Movimiento</span>
            <select value={settings.motion} onChange={(e) => updateSettings({ motion: e.target.value as 'normal' | 'reducido' })} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none">
              <option value="normal">Normal</option>
              <option value="reducido">Reducido</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Contraste</span>
            <select value={settings.contrast} onChange={(e) => updateSettings({ contrast: e.target.value as 'suave' | 'alto' })} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none">
              <option value="suave">Suave</option>
              <option value="alto">Alto</option>
            </select>
          </label>
        </section>

        <div className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          Estos ajustes se guardan automáticamente en este dispositivo.
        </div>
      </div>
    </div>
  );
};

const LearningSettingsPage = () => {
  const [settings, setSettings] = useState<LearningSettings>(() => {
    return getStorageItem<LearningSettings>(LUMI_STORAGE_KEYS.learningSettings, defaultLearningSettings) ?? defaultLearningSettings;
  });
  const [saved, setSaved] = useState(false);

  const togglePracticeArea = (value: string) => {
    setSettings((prev) => {
      const exists = prev.practiceAreas.includes(value);
      const nextAreas = exists ? prev.practiceAreas.filter((item) => item !== value) : [...prev.practiceAreas, value];
      return {
        ...prev,
        practiceAreas: nextAreas.length > 0 ? nextAreas : [value],
      };
    });
  };

  const handleSave = () => {
    setStorageItem(LUMI_STORAGE_KEYS.learningSettings, settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Configuración de aprendizaje</h2>
        <p className="text-slate-500">Ajusta preferencias educativas para personalizar actividades infantiles.</p>
      </div>

      <div className="card-lumi space-y-8">
        <label className="space-y-2 block">
          <span className="text-sm font-semibold text-slate-700">Nivel educativo actual</span>
          <select value={settings.educationalLevel} onChange={(e) => setSettings((prev) => ({ ...prev, educationalLevel: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3">
            {educationalLevelOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>

        <section className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Áreas a practicar</p>
          <div className="flex flex-wrap gap-2">
            {practiceAreaOptions.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => togglePracticeArea(area)}
                className={cn(
                  'px-4 py-2 rounded-full border text-sm font-medium transition-all',
                  settings.practiceAreas.includes(area)
                    ? 'bg-teal-100 border-teal-300 text-teal-800'
                    : 'bg-white border-slate-200 text-slate-600'
                )}
              >
                {area}
              </button>
            ))}
          </div>
        </section>

        <label className="space-y-2 block">
          <span className="text-sm font-semibold text-slate-700">Estilo de actividad preferido</span>
          <select value={settings.activityStyle} onChange={(e) => setSettings((prev) => ({ ...prev, activityStyle: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3">
            {activityStyleOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Nivel de apoyo visual</span>
            <select value={settings.visualSupportLevel} onChange={(e) => setSettings((prev) => ({ ...prev, visualSupportLevel: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3">
              {visualSupportOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Duración sugerida</span>
            <select value={settings.duration} onChange={(e) => setSettings((prev) => ({ ...prev, duration: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3">
              {durationOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" onClick={handleSave} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-lumi-olive transition-all">
            Guardar configuración
          </button>
          {saved && <span className="text-sm font-semibold text-emerald-700">Configuración guardada en este dispositivo.</span>}
        </div>
      </div>
    </div>
  );
};

const PainHistoryPage = () => {
  const reports = getStorageItem<PainReport[]>(LUMI_STORAGE_KEYS.painReports, []) ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Historial “Me duele”</h2>
        <p className="text-slate-500">Registro simple de reportes guardados en este dispositivo.</p>
      </div>

      <div className="card-lumi">
        {reports.length === 0 ? (
          <p className="text-slate-500">Aún no hay reportes.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((report, idx) => (
              <div key={`${report.timestamp}-${idx}`} className="bg-white border border-slate-200 rounded-2xl p-4 grid md:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Fecha</p>
                  <p className="font-semibold text-slate-700">{new Date(report.timestamp).toLocaleString('es-MX')}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Parte del cuerpo</p>
                  <p className="font-semibold text-slate-700">{report.bodyPart}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Intensidad</p>
                  <p className="font-semibold text-slate-700">{report.intensity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PlanChangesPage = () => {
  const [state, setState] = useState<PlanChangesState>(() => {
    return getStorageItem<PlanChangesState>(LUMI_STORAGE_KEYS.planChanges, { items: defaultPlanExamples, activeId: defaultPlanExamples[0].id }) ?? { items: defaultPlanExamples, activeId: defaultPlanExamples[0].id };
  });
  const [form, setForm] = useState<Omit<PlanChange, 'id'>>({
    beforeGoingTo: '',
    nowGoingTo: '',
    stillTheSame: '',
    canDoThis: '',
    calmMessage: '',
  });

  const persistState = (nextState: PlanChangesState) => {
    setState(nextState);
    setStorageItem(LUMI_STORAGE_KEYS.planChanges, nextState);
  };

  const addChange = () => {
    if (!form.beforeGoingTo || !form.nowGoingTo) return;
    const newItem: PlanChange = { ...form, id: crypto.randomUUID() };
    const nextState: PlanChangesState = {
      items: [newItem, ...state.items],
      activeId: state.activeId ?? newItem.id,
    };
    persistState(nextState);
    setForm({ beforeGoingTo: '', nowGoingTo: '', stillTheSame: '', canDoThis: '', calmMessage: '' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Cambio de planes</h2>
        <p className="text-slate-500">Crea mensajes claros y activa uno para modo niño.</p>
      </div>

      <div className="card-lumi space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input value={form.beforeGoingTo} onChange={(e) => setForm((p) => ({ ...p, beforeGoingTo: e.target.value }))} placeholder="Antes íbamos a" className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3" />
          <input value={form.nowGoingTo} onChange={(e) => setForm((p) => ({ ...p, nowGoingTo: e.target.value }))} placeholder="Ahora vamos a" className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3" />
          <input value={form.stillTheSame} onChange={(e) => setForm((p) => ({ ...p, stillTheSame: e.target.value }))} placeholder="Esto sigue igual" className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3" />
          <input value={form.canDoThis} onChange={(e) => setForm((p) => ({ ...p, canDoThis: e.target.value }))} placeholder="Puedes hacer esto" className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3" />
        </div>
        <textarea value={form.calmMessage} onChange={(e) => setForm((p) => ({ ...p, calmMessage: e.target.value }))} placeholder="Mensaje de calma" className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 min-h-24" />
        <button type="button" onClick={addChange} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold">
          Guardar cambio
        </button>
      </div>

      <div className="space-y-3">
        {state.items.map((item) => (
          <div key={item.id} className="card-lumi border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <p><strong>Antes:</strong> {item.beforeGoingTo}</p>
                <p><strong>Ahora:</strong> {item.nowGoingTo}</p>
              </div>
              <button
                type="button"
                onClick={() => persistState({ ...state, activeId: item.id })}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-bold border',
                  state.activeId === item.id ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600'
                )}
              >
                {state.activeId === item.id ? 'Cambio activo' : 'Activar este cambio'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TriggerLogsPage = () => {
  const [logs, setLogs] = useState<TriggerLog[]>(() => getStorageItem<TriggerLog[]>(LUMI_STORAGE_KEYS.triggerLogs, []) ?? []);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    event: 'Llanto',
    trigger: 'Ruido',
    helpfulStrategy: 'Silencio',
    notes: '',
  });

  const eventOptions = ['Llanto', 'Gritos', 'Se tapó los oídos', 'Se aisló', 'Se frustró', 'No quiso continuar', 'Otro'];
  const triggerOptions = ['Ruido', 'Hambre', 'Sueño', 'Cambio de rutina', 'Mucha gente', 'Luz intensa', 'Frustración', 'Dolor', 'Espera larga', 'No entendió la instrucción'];
  const strategyOptions = ['Silencio', 'Descanso', 'Agua', 'Abrazo', 'Estar solo', 'Audífonos', 'Respiración', 'Objeto favorito', 'Cambiar actividad'];

  const persistLogs = (nextLogs: TriggerLog[]) => {
    setLogs(nextLogs);
    setStorageItem(LUMI_STORAGE_KEYS.triggerLogs, nextLogs);
  };

  const addLog = () => {
    const next: TriggerLog = {
      id: crypto.randomUUID(),
      date: form.date,
      event: form.event,
      trigger: form.trigger,
      helpfulStrategy: form.helpfulStrategy,
      notes: form.notes.trim(),
    };
    persistLogs([next, ...logs]);
    setForm((prev) => ({ ...prev, notes: '' }));
  };

  const countBy = (items: TriggerLog[], key: 'trigger' | 'helpfulStrategy') => {
    const map = new Map<string, number>();
    items.forEach((item) => map.set(item[key], (map.get(item[key]) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
  };

  const topTrigger = countBy(logs, 'trigger');
  const topStrategy = countBy(logs, 'helpfulStrategy');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Registro de detonantes</h2>
        <p className="text-slate-500">Anota situaciones para identificar qué apoyos funcionaron mejor.</p>
      </div>

      <div className="card-lumi space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Fecha</span>
            <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Qué ocurrió</span>
            <select value={form.event} onChange={(e) => setForm((p) => ({ ...p, event: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3">
              {eventOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Qué pasó antes</span>
            <select value={form.trigger} onChange={(e) => setForm((p) => ({ ...p, trigger: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3">
              {triggerOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Qué ayudó</span>
            <select value={form.helpfulStrategy} onChange={(e) => setForm((p) => ({ ...p, helpfulStrategy: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3">
              {strategyOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        </div>

        <label className="space-y-2 block">
          <span className="text-sm font-semibold text-slate-700">Notas opcionales</span>
          <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 min-h-24" />
        </label>

        <button type="button" onClick={addLog} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold">
          Guardar registro
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card-lumi text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Total de registros</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{logs.length}</p>
        </div>
        <div className="card-lumi text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Detonante más frecuente</p>
          <p className="text-xl font-bold text-slate-800 mt-2">{topTrigger}</p>
        </div>
        <div className="card-lumi text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Estrategia más usada</p>
          <p className="text-xl font-bold text-slate-800 mt-2">{topStrategy}</p>
        </div>
      </div>

      <div className="card-lumi space-y-3">
        <h3 className="text-xl font-bold">Historial</h3>
        {logs.length === 0 ? (
          <p className="text-slate-500">Aún no hay registros.</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-white border border-slate-200 rounded-2xl p-4 grid md:grid-cols-4 gap-3 text-sm">
                <div><p className="text-slate-400 text-xs uppercase font-bold">Fecha</p><p>{log.date}</p></div>
                <div><p className="text-slate-400 text-xs uppercase font-bold">Ocurrió</p><p>{log.event}</p></div>
                <div><p className="text-slate-400 text-xs uppercase font-bold">Detonante</p><p>{log.trigger}</p></div>
                <div><p className="text-slate-400 text-xs uppercase font-bold">Qué ayudó</p><p>{log.helpfulStrategy}</p></div>
                {log.notes && <div className="md:col-span-4"><p className="text-slate-400 text-xs uppercase font-bold">Notas</p><p>{log.notes}</p></div>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-lumi-soft-yellow border border-amber-200 rounded-2xl p-5 text-amber-900 text-sm">
        Este registro puede ayudarte a observar patrones y compartir información útil con profesionales, maestros o cuidadores. No representa un diagnóstico.
      </div>
    </div>
  );
};

const ProgressSummaryPage = () => {
  const [, setLearningResetVersion] = useState(0);
  const defaultLearningProgress: LearningProgress = {
    vowelsSeen: [],
    lettersSeen: [],
    syllablesSeen: [],
    readingWordsSeen: [],
    readingPhrasesSeen: [],
    numbersSeen: [],
    shapesSeen: [],
    colorsSeen: [],
    memoryLevelUsed: 0,
    memoryGamesDone: 0,
    additionExercisesDone: 0,
    subtractionExercisesDone: 0,
    multiplicationExercisesDone: 0,
    attempts: 0,
    correctAnswers: 0,
    lastPracticeAt: null,
    alphabetAttempts: 0,
    syllableAttempts: 0,
    readingAttempts: 0,
    numberAttempts: 0,
    additionAttempts: 0,
    subtractionAttempts: 0,
    multiplicationAttempts: 0,
    shapesColorsAttempts: 0,
    memoryAttempts: 0,
    alphabetCorrectAnswers: 0,
    syllableCorrectAnswers: 0,
    readingCorrectAnswers: 0,
    numberCorrectAnswers: 0,
    additionCorrectAnswers: 0,
    subtractionCorrectAnswers: 0,
    multiplicationCorrectAnswers: 0,
    shapesColorsCorrectAnswers: 0,
    memoryCorrectAnswers: 0,
    alphabetLastPracticeAt: null,
    syllableLastPracticeAt: null,
    readingLastPracticeAt: null,
    numberLastPracticeAt: null,
    additionLastPracticeAt: null,
    subtractionLastPracticeAt: null,
    multiplicationLastPracticeAt: null,
    shapesColorsLastPracticeAt: null,
    memoryLastPracticeAt: null,
  };
  const progressLogs = getStorageItem<ProgressLog[]>(LUMI_STORAGE_KEYS.progress, []) ?? [];
  const emotionLogs = getStorageItem<any[]>(LUMI_STORAGE_KEYS.emotionLogs, []) ?? [];
  const needLogs = getStorageItem<any[]>(LUMI_STORAGE_KEYS.needLogs, []) ?? [];
  const painReports = getStorageItem<PainReport[]>(LUMI_STORAGE_KEYS.painReports, []) ?? [];
  const planChangesState = getStorageItem<PlanChangesState>(LUMI_STORAGE_KEYS.planChanges, { items: [], activeId: null }) ?? { items: [], activeId: null };
  const learningProgress = getStorageItem<LearningProgress>(LUMI_STORAGE_KEYS.learningProgress, defaultLearningProgress) ?? defaultLearningProgress;

  const routinesCompleted = progressLogs.filter((log) => log.achievement === 'Completé una rutina.').length;
  const calmZoneUses = progressLogs.filter((log) => log.achievement === 'Usé la zona de calma.').length;
  const planChangesViewed = progressLogs.filter((log) => log.achievement === 'Intenté algo nuevo.').length;

  const learningActivityCounts = [
    learningProgress.vowelsSeen.length,
    learningProgress.lettersSeen?.length ?? 0,
    learningProgress.syllablesSeen?.length ?? 0,
    (learningProgress.readingWordsSeen?.length ?? 0) + (learningProgress.readingPhrasesSeen?.length ?? 0),
    learningProgress.numbersSeen?.length ?? 0,
    learningProgress.additionExercisesDone ?? 0,
    learningProgress.subtractionExercisesDone ?? 0,
    learningProgress.multiplicationExercisesDone ?? 0,
    (learningProgress.shapesSeen?.length ?? 0) + (learningProgress.colorsSeen?.length ?? 0),
    learningProgress.memoryGamesDone ?? 0,
  ];
  const activitiesPracticed = learningActivityCounts.filter((value) => value > 0).length;
  const totalLearningCorrectAnswers =
    (learningProgress.correctAnswers ?? 0) +
    (learningProgress.alphabetCorrectAnswers ?? 0) +
    (learningProgress.syllableCorrectAnswers ?? 0) +
    (learningProgress.readingCorrectAnswers ?? 0) +
    (learningProgress.numberCorrectAnswers ?? 0) +
    (learningProgress.additionCorrectAnswers ?? 0) +
    (learningProgress.subtractionCorrectAnswers ?? 0) +
    (learningProgress.multiplicationCorrectAnswers ?? 0) +
    (learningProgress.shapesColorsCorrectAnswers ?? 0) +
    (learningProgress.memoryCorrectAnswers ?? 0);
  const totalLearningAttempts =
    (learningProgress.attempts ?? 0) +
    (learningProgress.alphabetAttempts ?? 0) +
    (learningProgress.syllableAttempts ?? 0) +
    (learningProgress.readingAttempts ?? 0) +
    (learningProgress.numberAttempts ?? 0) +
    (learningProgress.additionAttempts ?? 0) +
    (learningProgress.subtractionAttempts ?? 0) +
    (learningProgress.multiplicationAttempts ?? 0) +
    (learningProgress.shapesColorsAttempts ?? 0) +
    (learningProgress.memoryAttempts ?? 0);
  const latestLearningActivity = [
    { label: 'Vocales', date: learningProgress.lastPracticeAt },
    { label: 'Alfabeto', date: learningProgress.alphabetLastPracticeAt },
    { label: 'Sílabas simples', date: learningProgress.syllableLastPracticeAt },
    { label: 'Lectura inicial', date: learningProgress.readingLastPracticeAt },
    { label: 'Números y conteo', date: learningProgress.numberLastPracticeAt },
    { label: 'Sumas visuales', date: learningProgress.additionLastPracticeAt },
    { label: 'Restas visuales', date: learningProgress.subtractionLastPracticeAt },
    { label: 'Multiplicaciones visuales', date: learningProgress.multiplicationLastPracticeAt },
    { label: 'Formas y colores', date: learningProgress.shapesColorsLastPracticeAt },
    { label: 'Memoria y atención', date: learningProgress.memoryLastPracticeAt },
  ]
    .filter((item): item is { label: string; date: string } => Boolean(item.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const learningSummary = [
    { label: 'Actividades practicadas', value: activitiesPracticed },
    { label: 'Última actividad realizada', value: latestLearningActivity?.label ?? 'Sin actividad registrada' },
    { label: 'Vocales practicadas', value: learningProgress.vowelsSeen.length },
    { label: 'Letras practicadas', value: learningProgress.lettersSeen?.length ?? 0 },
    { label: 'Números practicados', value: learningProgress.numbersSeen?.length ?? 0 },
    { label: 'Ejercicios de suma realizados', value: learningProgress.additionExercisesDone ?? 0 },
    { label: 'Ejercicios de resta realizados', value: learningProgress.subtractionExercisesDone ?? 0 },
    { label: 'Ejercicios de multiplicación realizados', value: learningProgress.multiplicationExercisesDone ?? 0 },
    { label: 'Juegos de memoria realizados', value: learningProgress.memoryGamesDone ?? 0 },
    { label: 'Aciertos totales', value: totalLearningCorrectAnswers },
    { label: 'Intentos totales', value: totalLearningAttempts },
  ];
  const hasLearningData = learningSummary.some((item) => typeof item.value === 'number' && item.value > 0);
  const resetLearningProgress = () => {
    setStorageItem(LUMI_STORAGE_KEYS.learningProgress, defaultLearningProgress);
    setLearningResetVersion((version) => version + 1);
  };

  const summary = [
    { label: 'Rutinas completadas', value: routinesCompleted },
    { label: 'Emociones registradas', value: emotionLogs.length },
    { label: 'Necesidades usadas', value: needLogs.length },
    { label: 'Veces que usó zona de calma', value: calmZoneUses },
    { label: 'Reportes de dolor', value: painReports.length },
    { label: 'Cambios de planes vistos', value: planChangesViewed || (planChangesState.activeId ? 1 : 0) },
    { label: 'Vocales practicadas', value: learningProgress.vowelsSeen.length },
    { label: 'Aciertos (aprendizaje)', value: learningProgress.correctAnswers },
    { label: 'Intentos (aprendizaje)', value: learningProgress.attempts },
    { label: 'Letras practicadas', value: learningProgress.lettersSeen?.length ?? 0 },
    { label: 'Aciertos (alfabeto)', value: learningProgress.alphabetCorrectAnswers ?? 0 },
    { label: 'Intentos (alfabeto)', value: learningProgress.alphabetAttempts ?? 0 },
    { label: 'Sílabas practicadas', value: learningProgress.syllablesSeen?.length ?? 0 },
    { label: 'Aciertos (sílabas)', value: learningProgress.syllableCorrectAnswers ?? 0 },
    { label: 'Intentos (sílabas)', value: learningProgress.syllableAttempts ?? 0 },
    { label: 'Palabras leídas', value: learningProgress.readingWordsSeen?.length ?? 0 },
    { label: 'Frases leídas', value: learningProgress.readingPhrasesSeen?.length ?? 0 },
    { label: 'Aciertos (lectura)', value: learningProgress.readingCorrectAnswers ?? 0 },
    { label: 'Intentos (lectura)', value: learningProgress.readingAttempts ?? 0 },
    { label: 'Números practicados', value: learningProgress.numbersSeen?.length ?? 0 },
    { label: 'Aciertos (números)', value: learningProgress.numberCorrectAnswers ?? 0 },
    { label: 'Intentos (números)', value: learningProgress.numberAttempts ?? 0 },
    { label: 'Sumas realizadas', value: learningProgress.additionExercisesDone ?? 0 },
    { label: 'Aciertos (sumas)', value: learningProgress.additionCorrectAnswers ?? 0 },
    { label: 'Intentos (sumas)', value: learningProgress.additionAttempts ?? 0 },
    { label: 'Restas realizadas', value: learningProgress.subtractionExercisesDone ?? 0 },
    { label: 'Aciertos (restas)', value: learningProgress.subtractionCorrectAnswers ?? 0 },
    { label: 'Intentos (restas)', value: learningProgress.subtractionAttempts ?? 0 },
    { label: 'Multiplicaciones realizadas', value: learningProgress.multiplicationExercisesDone ?? 0 },
    { label: 'Aciertos (multiplicaciones)', value: learningProgress.multiplicationCorrectAnswers ?? 0 },
    { label: 'Intentos (multiplicaciones)', value: learningProgress.multiplicationAttempts ?? 0 },
    { label: 'Formas practicadas', value: learningProgress.shapesSeen?.length ?? 0 },
    { label: 'Colores practicados', value: learningProgress.colorsSeen?.length ?? 0 },
    { label: 'Aciertos (formas y colores)', value: learningProgress.shapesColorsCorrectAnswers ?? 0 },
    { label: 'Intentos (formas y colores)', value: learningProgress.shapesColorsAttempts ?? 0 },
    { label: 'Juegos de memoria realizados', value: learningProgress.memoryGamesDone ?? 0 },
    { label: 'Aciertos (memoria)', value: learningProgress.memoryCorrectAnswers ?? 0 },
    { label: 'Intentos (memoria)', value: learningProgress.memoryAttempts ?? 0 },
    { label: 'Nivel usado (memoria)', value: learningProgress.memoryLevelUsed ?? 0 },
  ];

  const hasData = summary.some((item) => item.value > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Resumen simple</h2>
        <p className="text-slate-500">Vista rápida del uso reciente en este dispositivo.</p>
      </div>

      <section className="card-lumi bg-lumi-soft-green border-emerald-100 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-child font-bold text-emerald-800">Resumen de progreso educativo</h3>
            <p className="text-slate-600 mt-1">Uso de actividades educativas guardado en este dispositivo.</p>
          </div>
          <button onClick={resetLearningProgress} className="btn-child bg-white border-emerald-200 text-emerald-700 px-5 py-3 text-base">
            Reiniciar progreso educativo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningSummary.map((item) => (
            <div key={item.label} className="bg-white/90 border border-emerald-100 rounded-3xl p-4 text-center">
              <p className="text-xs uppercase tracking-widest text-emerald-600 font-bold">{item.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <p className="rounded-3xl bg-white/80 border border-emerald-100 p-4 text-emerald-800 font-semibold">Ha practicado varias actividades.</p>
          <p className="rounded-3xl bg-white/80 border border-emerald-100 p-4 text-emerald-800 font-semibold">Sigue reforzando poco a poco.</p>
          <p className="rounded-3xl bg-white/80 border border-emerald-100 p-4 text-emerald-800 font-semibold">Las rutinas cortas ayudan a mantener la práctica.</p>
        </div>

        {!hasLearningData && (
          <p className="text-center text-slate-600 bg-white/70 border border-emerald-100 rounded-3xl px-4 py-3">
            Aún no hay práctica educativa registrada. Cuando use Aprendizaje, aquí aparecerá el resumen.
          </p>
        )}
      </section>

      {!hasData ? (
        <div className="card-lumi text-center py-10">
          <p className="text-slate-700 font-semibold">Aún no hay registros de logros o actividad.</p>
          <p className="text-slate-500 mt-2">Cuando se empiece a usar la app, aquí verás un resumen amigable.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.map((item) => (
            <div key={item.label} className="card-lumi text-center">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">{item.label}</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Autism Info ---

const AutismInfo = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8">
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-slate-900">Entendiendo el Autismo</h2>
        <p className="text-xl text-slate-600 leading-relaxed">
          El Trastorno del Espectro Autista (TEA) es una condición del neurodesarrollo que acompaña a la persona a lo largo de su vida. 
          Influye en cómo las personas perciben el mundo e interactúan con los demás.
        </p>
      </section>

      <div className="grid gap-6">
        <div className="card-lumi bg-indigo-50/50 border-indigo-100">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-indigo-600" /> Comunicación y Lenguaje
          </h3>
          <p className="text-slate-600">Puede variar desde personas que no hablan hasta personas con un vocabulario muy amplio pero dificultades en el uso social del lenguaje.</p>
        </div>
        <div className="card-lumi bg-emerald-50/50 border-emerald-100">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-emerald-600" /> Interacción Social
          </h3>
          <p className="text-slate-600">Dificultad para entender normas sociales no escritas, expresiones faciales o tonos de voz.</p>
        </div>
        <div className="card-lumi bg-amber-50/50 border-amber-100">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-amber-600" /> Procesamiento Sensorial
          </h3>
          <p className="text-slate-600">Hipersensibilidad o hiposensibilidad a sonidos, luces, texturas, olores o sabores.</p>
        </div>
      </div>

      <div className="card-lumi border-l-8 border-l-lumi-olive">
        <h3 className="font-bold text-lg uppercase tracking-tight text-lumi-olive mb-2">Recordatorio importante</h3>
        <p className="text-slate-700 italic">"Si conoces a una persona con autismo, conoces solo a UNA persona con autismo." - Stephen Shore. No hay dos personas iguales en el espectro.</p>
      </div>
    </div>
  );
};

// --- Clinics Directory ---

const ClinicsDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClinics = clinics.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Directorio de Apoyo en México</h2>
          <p className="text-slate-500">Centros y asociaciones verificados informativamente.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por estado o nombre..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClinics.map((clinic) => (
          <motion.div 
            layout
            key={clinic.id} 
            className="card-lumi hover:border-blue-200 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold leading-tight">{clinic.name}</h3>
                <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                  {clinic.city}
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2"><MapPin size={14} /> {clinic.state}</div>
                <div className="flex items-center gap-2"><Phone size={14} /> {clinic.phone}</div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Servicios</p>
                <div className="flex flex-wrap gap-2">
                  {clinic.services.map((s, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <a 
              href={clinic.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl text-sm font-bold hover:bg-lumi-olive transition-all"
            >
              Visitar Sitio <ExternalLink size={14} />
            </a>
          </motion.div>
        ))}
      </div>

      <div className="bg-lumi-soft-blue p-8 rounded-[32px] border border-blue-200 text-sm text-blue-900">
        <p><strong>Aviso:</strong> Los datos presentados son para fines informativos. Lumi no tiene relación comercial con estas instituciones. Verifica siempre la información directamente.</p>
      </div>
    </div>
  );
};

// --- Resources ---

const Resources = () => {
  const items = [
    { title: 'Rutina Visual Diario', type: 'PDF', icon: <Calendar />, color: 'bg-orange-100' },
    { title: 'Tarjetas de Emociones', type: 'ZIP / PNG', icon: <HeartHandshake />, color: 'bg-pink-100' },
    { title: 'Guía para el Dentista', type: 'PDF', icon: <BookText />, color: 'bg-indigo-100' },
    { title: 'Plantilla Primero / Después', type: 'Imprimible', icon: <ArrowRightLeft />, color: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-12">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold">Recursos Descargables</h2>
        <p className="text-slate-500">Material especializado para usar en casa, escuela o consultorio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-800">
        {items.map((item, idx) => (
          <div key={idx} className="card-lumi flex items-center justify-between group cursor-pointer hover:border-lumi-olive transition-colors">
            <div className="flex items-center gap-6">
              <div className={cn("p-4 rounded-2xl", item.color)}>
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-sm opacity-50 font-medium">{item.type}</p>
              </div>
            </div>
            <div className="p-2 rounded-full border border-slate-200 group-hover:bg-lumi-olive group-hover:text-white transition-all">
              <Download size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Module Router ---

export default function ParentModule() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <Routes>
        <Route path="/" element={null} />
        <Route path="*" element={
          <button 
            onClick={() => navigate('/padres')}
            className="flex items-center gap-2 text-slate-400 hover:text-lumi-olive font-bold uppercase tracking-widest text-sm mb-10 transition-colors"
          >
            <ChevronLeft size={20} /> Regresar a la Guía
          </button>
        } />
      </Routes>

      <Routes>
        <Route path="/" element={<ParentHome />} />
        <Route path="/autismo" element={<AutismInfo />} />
        <Route path="/apoyo-casa" element={<div className="text-center py-20"><h2 className="text-3xl font-bold uppercase tracking-widest opacity-20">Contenido en construcción</h2></div>} />
        <Route path="/perfil-nino" element={<ChildProfilePage />} />
        <Route path="/accesibilidad" element={<AccessibilityPage />} />
        <Route path="/configuracion-aprendizaje" element={<LearningSettingsPage />} />
        <Route path="/historial-me-duele" element={<PainHistoryPage />} />
        <Route path="/cambio-planes" element={<PlanChangesPage />} />
        <Route path="/registro-detonantes" element={<TriggerLogsPage />} />
        <Route path="/resumen-logros" element={<ProgressSummaryPage />} />
        <Route path="/directorio" element={<ClinicsDirectory />} />
        <Route path="/recursos" element={<Resources />} />
      </Routes>
    </div>
  );
}
