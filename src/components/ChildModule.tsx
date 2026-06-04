/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useContext, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  ArrowRightLeft, 
  Laugh, 
  MessageCircle, 
  Wind, 
  BookOpen, 
  Gamepad2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  RefreshCcw,
  Volume2,
  Trophy,
  Star,
  ThumbsUp,
  Sparkles,
  GraduationCap,
  Hash,
  SquareDashed,
  Plus,
  Minus
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';
import { initialRoutines, emotions, socialStories, gameScenarios, emotionChallenges, routineSequences, learningCategories, RoutineItem } from '../data/mockData';
import { SettingsContext } from '../App';
import { getStorageItem, setStorageItem, LUMI_STORAGE_KEYS } from '../utils/storage';

interface ChildProfile {
  nickname?: string;
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

interface ProgressLog {
  id: string;
  achievement: string;
  message: string;
  timestamp: string;
}

interface LearningSettings {
  practiceAreas: string[];
}

interface LearningProgress {
  vowelsSeen: string[];
  lettersSeen?: string[];
  syllablesSeen?: string[];
  attempts: number;
  alphabetAttempts?: number;
  syllableAttempts?: number;
  correctAnswers: number;
  alphabetCorrectAnswers?: number;
  syllableCorrectAnswers?: number;
  lastPracticeAt: string | null;
  alphabetLastPracticeAt?: string | null;
  syllableLastPracticeAt?: string | null;
}

// --- Helpers ---

const useSpeech = () => {
  const { settings } = useContext(SettingsContext);
  
  const speak = useCallback((text: string) => {
    if (!settings.soundEnabled) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX'; // Mexican Spanish if available
    window.speechSynthesis.speak(utterance);
  }, [settings.soundEnabled]);

  return { speak };
};

const IconComponent = ({ name, size = 24 }: { name: string; size?: number }) => {
  const Icon = (Icons as any)[name] || Icons.HelpCircle;
  return <Icon size={size} />;
};

// --- Child Home ---

const ChildHome = () => {
  const { speak } = useSpeech();
  const childProfile = getStorageItem<ChildProfile>(LUMI_STORAGE_KEYS.childProfile);
  const childName = childProfile?.nickname?.trim();
  const menuItems = [
    { path: 'rutina', label: 'Mi Rutina', icon: 'Calendar', color: 'bg-orange-100 text-orange-600 border-orange-200' },
    { path: 'primero-despues', label: 'Primero / Después', icon: 'ArrowRightLeft', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { path: 'emociones', label: '¿Cómo me siento?', icon: 'Laugh', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    { path: 'necesito', label: '¿Qué necesito?', icon: 'MessageCircle', color: 'bg-green-100 text-green-600 border-green-200' },
    { path: 'calma', label: 'Zona de Calma', icon: 'Wind', color: 'bg-purple-100 text-purple-600 border-purple-200' },
    { path: 'historias', label: 'Historias', icon: 'BookOpen', color: 'bg-pink-100 text-pink-600 border-pink-200' },
    { path: 'juegos', label: 'Juegos', icon: 'Gamepad2', color: 'bg-cyan-100 text-cyan-600 border-cyan-200' },
    { path: 'aprendizaje', label: 'Aprendizaje', icon: 'GraduationCap', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
    { path: 'me-duele', label: 'Me duele', icon: 'Heart', color: 'bg-rose-100 text-rose-600 border-rose-200' },
    { path: 'cambio-planes', label: 'Cambio de planes', icon: 'RefreshCcw', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { path: 'mis-logros', label: 'Mis logros', icon: 'Trophy', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-child font-bold text-slate-800">¡Hola! ¿Qué quieres hacer hoy?</h2>
        {childName && <p className="text-slate-500 mt-2 font-medium">Hola, {childName}</p>}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            onClick={() => speak(item.label)}
            className={cn(
              "btn-child flex items-center gap-6 group hover:scale-[1.02]",
              item.color
            )}
          >
            <div className="bg-white p-4 rounded-2xl shadow-sm transition-transform group-hover:rotate-6">
              <IconComponent name={item.icon} size={40} />
            </div>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const PainModule = () => {
  const [bodyPart, setBodyPart] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<PainReport['intensity'] | null>(null);
  const { speak } = useSpeech();

  const bodyParts = ['Cabeza', 'Ojos', 'Oído', 'Boca', 'Garganta', 'Dientes', 'Panza', 'Espalda', 'Brazo', 'Mano', 'Pierna', 'Pie', 'Todo el cuerpo', 'No sé'];
  const actions = ['Pedir ayuda', 'Avisar a mamá/papá', 'Descansar', 'Tomar agua', 'Ir a un lugar tranquilo'];

  const finalPhrase = bodyPart && intensity ? `Me duele ${bodyPart === 'No sé' ? 'no sé dónde' : `la ${bodyPart.toLowerCase()}`} ${intensity.toLowerCase()}.` : '';

  const saveReport = (selectedIntensity: PainReport['intensity']) => {
    if (!bodyPart) return;
    const currentReports = getStorageItem<PainReport[]>(LUMI_STORAGE_KEYS.painReports, []) ?? [];
    const newReport: PainReport = {
      timestamp: new Date().toISOString(),
      bodyPart,
      intensity: selectedIntensity,
    };
    setStorageItem(LUMI_STORAGE_KEYS.painReports, [newReport, ...currentReports]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-child font-bold text-rose-700">¿Dónde te duele?</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {bodyParts.map((part) => (
          <button
            key={part}
            onClick={() => {
              setBodyPart(part);
              setIntensity(null);
              speak(part);
            }}
            className={cn(
              'btn-child py-8 bg-white border-2',
              bodyPart === part ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-100 text-slate-800'
            )}
          >
            {part}
          </button>
        ))}
      </div>

      {bodyPart && (
        <div className="space-y-6">
          <h3 className="text-3xl font-child font-bold text-center">¿Cuánto te duele?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {(['Poquito', 'Medio', 'Mucho'] as PainReport['intensity'][]).map((level) => (
              <button
                key={level}
                onClick={() => {
                  setIntensity(level);
                  saveReport(level);
                }}
                className={cn(
                  'btn-child py-8 border-2',
                  intensity === level ? 'bg-rose-500 text-white border-rose-600' : 'bg-white border-slate-100 text-slate-800'
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {finalPhrase && (
        <div className="card-lumi bg-rose-50 border-rose-200 space-y-5">
          <p className="text-3xl font-child font-bold text-rose-800 text-center">{finalPhrase}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {actions.map((action) => (
              <div key={action} className="bg-white border border-rose-100 rounded-2xl px-4 py-3 text-center font-bold text-rose-700">
                {action}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PlanChangeModule = () => {
  const planChanges = getStorageItem<PlanChangesState>(LUMI_STORAGE_KEYS.planChanges, { items: [], activeId: null }) ?? { items: [], activeId: null };
  const activeChange = planChanges.items.find((item) => item.id === planChanges.activeId) || null;
  const supportButtons = ['Estoy triste', 'Estoy enojado', 'Necesito ayuda', 'Quiero respirar', 'Quiero descansar'];
  const { speak } = useSpeech();

  if (!activeChange) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 space-y-4">
        <h2 className="text-4xl font-child font-bold text-indigo-800">Cambio de planes</h2>
        <p className="text-slate-500">No hay un cambio activo por ahora.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-child font-bold text-indigo-800">Cambio de planes</h2>
        <p className="text-slate-500">Te explicamos el cambio paso a paso.</p>
      </div>

      <div className="card-lumi bg-indigo-50 border-indigo-100 space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-indigo-100">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Antes íbamos a:</p>
          <p className="text-2xl font-child font-bold text-indigo-900 mt-1">{activeChange.beforeGoingTo}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-indigo-100">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Ahora vamos a:</p>
          <p className="text-2xl font-child font-bold text-indigo-900 mt-1">{activeChange.nowGoingTo}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-indigo-100">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Esto sigue igual:</p>
          <p className="text-xl font-bold text-slate-700 mt-1">{activeChange.stillTheSame}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-indigo-100">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Puedes hacer esto:</p>
          <p className="text-xl font-bold text-slate-700 mt-1">{activeChange.canDoThis}</p>
        </div>
        <div className="bg-indigo-600 rounded-2xl p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Mensaje de calma</p>
          <p className="text-xl font-bold mt-1">{activeChange.calmMessage}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {supportButtons.map((button) => (
          <button key={button} onClick={() => speak(button)} className="btn-child py-4 bg-white border-slate-100 text-slate-700">
            {button}
          </button>
        ))}
      </div>
    </div>
  );
};

const AchievementsModule = () => {
  const achievements = [
    'Completé una rutina.',
    'Pedí ayuda.',
    'Dije cómo me siento.',
    'Usé la zona de calma.',
    'Practiqué una actividad.',
    'Terminé una historia.',
    'Intenté algo nuevo.',
  ];
  const positiveMessages = ['Buen intento.', 'Lo lograste.', 'Gracias por intentarlo.', 'Puedes volver a intentarlo.'];
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const addAchievement = (achievement: string) => {
    const message = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
    setSelectedMessage(message);
    const current = getStorageItem<ProgressLog[]>(LUMI_STORAGE_KEYS.progress, []) ?? [];
    const nextLog: ProgressLog = {
      id: crypto.randomUUID(),
      achievement,
      message,
      timestamp: new Date().toISOString(),
    };
    setStorageItem(LUMI_STORAGE_KEYS.progress, [nextLog, ...current]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-child font-bold text-amber-800">Mis logros</h2>
        <p className="text-slate-500">Cada paso cuenta. Elige tu logro de hoy.</p>
      </div>

      {selectedMessage && (
        <div className="card-lumi bg-amber-50 border-amber-200 text-center">
          <p className="text-3xl font-child font-bold text-amber-800">{selectedMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((item) => (
          <button
            key={item}
            onClick={() => addAchievement(item)}
            className="btn-child bg-white border-slate-100 text-slate-800 hover:border-amber-300 hover:bg-amber-50 text-left"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Rutina Visual ---

const VisualRoutine = () => {
  const [routines, setRoutines] = useState<RoutineItem[]>(initialRoutines);
  const { speak } = useSpeech();

  const toggleRoutine = (id: string) => {
    const r = routines.find(x => x.id === id);
    if (r && !r.completed) speak(`¡Listo! ${r.name}`);
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const resetRoutines = () => {
    setRoutines(prev => prev.map(r => ({ ...r, completed: false })));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-lumi-sand shadow-sm">
        <div className="flex items-center gap-4">
          <Calendar size={32} className="text-orange-500" />
          <h2 className="text-3xl font-child font-bold">Mi Rutina</h2>
        </div>
        <button 
          onClick={resetRoutines}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <RefreshCcw size={16} /> Reiniciar día
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {routines.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => toggleRoutine(item.id)}
            className={cn(
              "flex items-center justify-between p-4 rounded-[28px] border-2 transition-all active:scale-[0.98]",
              item.completed 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800 opacity-60" 
                : "bg-white border-slate-100 hover:border-orange-200"
            )}
          >
            <div className="flex items-center gap-6">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                item.completed ? "bg-emerald-100" : "bg-orange-50"
              )}>
                <IconComponent name={item.icon} size={32} />
              </div>
              <span className={cn("text-xl font-bold font-child", item.completed && "line-through")}>
                {item.name}
              </span>
            </div>
            
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center border-2",
              item.completed 
                ? "bg-emerald-500 border-emerald-500 text-white" 
                : "bg-white border-slate-200"
            )}>
              {item.completed && <CheckCircle2 size={24} />}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// --- Primero / Después ---

const FirstThen = () => {
  const [first, setFirst] = useState({ name: 'Lavarse los dientes', icon: 'Smile' });
  const [then, setThen] = useState({ name: 'Jugar', icon: 'Gamepad2' });

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-child font-bold">Plan del momento</h2>
        <p className="text-slate-500 font-medium">Hacemos una cosa a la vez</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        <div className="flex-1 w-full max-w-sm space-y-4">
          <div className="bg-orange-500 text-white text-center py-2 rounded-2xl font-bold text-xl uppercase tracking-widest">Primero</div>
          <div className="card-lumi flex flex-col items-center justify-center py-16 aspect-square gap-8">
            <div className="p-10 bg-orange-50 rounded-[40px] text-orange-500">
               <IconComponent name={first.icon} size={80} />
            </div>
            <span className="text-3xl font-child font-bold text-center leading-tight">{first.name}</span>
          </div>
        </div>

        <div className="bg-lumi-sand p-4 rounded-full">
           <ArrowRightLeft size={40} className="text-slate-300 md:rotate-0 rotate-90" />
        </div>

        <div className="flex-1 w-full max-w-sm space-y-4">
          <div className="bg-blue-500 text-white text-center py-2 rounded-2xl font-bold text-xl uppercase tracking-widest">Después</div>
          <div className="card-lumi flex flex-col items-center justify-center py-16 aspect-square gap-8">
            <div className="p-10 bg-blue-50 rounded-[40px] text-blue-500">
               <IconComponent name={then.icon} size={80} />
            </div>
            <span className="text-3xl font-child font-bold text-center leading-tight">{then.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Emociones ---

const EmotionsBoard = () => {
  const [selected, setSelected] = useState<{ id: string; label: string; icon: string; color: string } | null>(null);
  const [intensity, setIntensity] = useState<'Poquito' | 'Medio' | 'Mucho' | null>(null);
  const [strategy, setStrategy] = useState<string | null>(null);
  const { speak } = useSpeech();

  const emotionOptions = [
    ...emotions.map((e) => ({ id: e.id, label: e.label, icon: e.icon, color: e.color })),
    { id: 'confused', label: 'Confundido', icon: 'CircleHelp', color: 'bg-slate-100 border-slate-300 text-slate-700' },
    { id: 'nervous', label: 'Nervioso', icon: 'Zap', color: 'bg-violet-100 border-violet-300 text-violet-700' },
    { id: 'bored', label: 'Aburrido', icon: 'Clock3', color: 'bg-zinc-100 border-zinc-300 text-zinc-700' },
    { id: 'excited', label: 'Emocionado', icon: 'PartyPopper', color: 'bg-emerald-100 border-emerald-300 text-emerald-700' },
    { id: 'frustrated', label: 'Frustrado', icon: 'TriangleAlert', color: 'bg-rose-100 border-rose-300 text-rose-700' },
    { id: 'calm', label: 'Tranquilo', icon: 'Leaf', color: 'bg-teal-100 border-teal-300 text-teal-700' },
    { id: 'dontknow', label: 'No sé', icon: 'HelpCircle', color: 'bg-gray-100 border-gray-300 text-gray-700' },
  ];
  const strategies = ['Respirar', 'Descansar', 'Pedir ayuda', 'Ir a lugar tranquilo', 'Tomar agua', 'Pedir abrazo', 'Estar solo', 'Dibujar'];

  useEffect(() => {
    if (selected && !intensity) {
      speak(`Me siento ${selected.label}`);
    }
  }, [selected, speak]);

  const saveEmotionLog = (logStrategy: string) => {
    if (!selected || !intensity) return;
    const current = getStorageItem<any[]>(LUMI_STORAGE_KEYS.emotionLogs, []) ?? [];
    const nextLog = {
      timestamp: new Date().toISOString(),
      emotion: selected.label,
      intensity,
      strategy: logStrategy,
    };
    setStorageItem(LUMI_STORAGE_KEYS.emotionLogs, [nextLog, ...current]);
  };

  const finalPhrase = selected && intensity && strategy
    ? `Estoy ${selected.label.toLowerCase()} ${intensity.toLowerCase()} y necesito ${strategy.toLowerCase()}.`
    : null;

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-child font-bold">¿Cómo te sientes hoy?</h2>
        <p className="text-slate-500">Paso 1: elige emoción · Paso 2: intensidad · Paso 3: estrategia</p>
      </div>

      {!selected ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {emotionOptions.map((emotion) => (
            <button
              key={emotion.id}
              onClick={() => setSelected(emotion)}
              className={cn(
                "btn-child flex flex-col gap-4 py-10",
                emotion.color
              )}
            >
              <IconComponent name={emotion.icon} size={64} />
              <span>{emotion.label}</span>
            </button>
          ))}
        </div>
      ) : !intensity ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("p-10 rounded-[40px] border-4 relative", selected.color)}
        >
          <button
            onClick={() => {
              setSelected(null);
              setIntensity(null);
              setStrategy(null);
            }}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <X size={32} />
          </button>
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-5xl font-child font-bold">Me siento {selected.label}</h3>
              <p className="font-bold uppercase tracking-widest opacity-70">¿Cuánto te sientes así?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['Poquito', 'Medio', 'Mucho'] as const).map((level) => (
                <button key={level} onClick={() => setIntensity(level)} className="btn-child bg-white/80 border-white/60">
                  {level}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      ) : !strategy ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("p-10 rounded-[40px] border-4 relative", selected.color)}
        >
          <button
            onClick={() => setIntensity(null)}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <X size={32} />
          </button>
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-4xl font-child font-bold">Me siento {selected.label} {intensity.toLowerCase()}</h3>
              <p className="font-bold uppercase tracking-widest opacity-70">¿Qué te ayudaría?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {strategies.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setStrategy(item);
                    saveEmotionLog(item);
                  }}
                  className="btn-child bg-white/80 border-white/60"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("p-10 rounded-[40px] border-4 relative", selected.color)}
        >
          <button 
            onClick={() => {
              setSelected(null);
              setIntensity(null);
              setStrategy(null);
            }}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <X size={32} />
          </button>
          
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="bg-white/80 p-8 rounded-[40px] shadow-sm">
               <IconComponent name={selected.icon} size={120} />
            </div>
            
            <div className="space-y-6 flex-1">
              <h3 className="text-5xl font-child font-bold">{finalPhrase}</h3>
              <div className="space-y-4">
                <p className="font-bold text-xl opacity-80 uppercase tracking-widest">Estrategia elegida:</p>
                <div className="bg-white/50 px-6 py-3 rounded-2xl font-bold text-lg border border-black/5 inline-block">
                  {strategy}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// --- Necesidades ---

const NeedsBoard = () => {
  const [activePhrase, setActivePhrase] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Necesidades básicas');

  const categorizedNeeds = [
    {
      category: 'Necesidades básicas',
      items: [
        { label: 'Agua', phrase: 'Necesito agua.', icon: 'Droplets' },
        { label: 'Comida', phrase: 'Necesito comida.', icon: 'Apple' },
        { label: 'Baño', phrase: 'Necesito ir al baño.', icon: 'Bath' },
        { label: 'Dormir', phrase: 'Necesito dormir.', icon: 'Bed' },
        { label: 'Descanso', phrase: 'Necesito descansar.', icon: 'Moon' },
      ],
    },
    {
      category: 'Sensorial',
      items: [
        { label: 'Silencio', phrase: 'Necesito silencio.', icon: 'VolumeX' },
        { label: 'Audífonos', phrase: 'Necesito audífonos.', icon: 'Headphones' },
        { label: 'Luz baja', phrase: 'Necesito luz baja.', icon: 'LightbulbOff' },
        { label: 'No tocar', phrase: 'No me toques, por favor.', icon: 'Hand' },
        { label: 'Lugar tranquilo', phrase: 'Necesito un lugar tranquilo.', icon: 'TentTree' },
      ],
    },
    {
      category: 'Social',
      items: [
        { label: 'Mamá', phrase: 'Necesito a mamá.', icon: 'UserRound' },
        { label: 'Papá', phrase: 'Necesito a papá.', icon: 'UserRound' },
        { label: 'Maestro', phrase: 'Necesito al maestro.', icon: 'GraduationCap' },
        { label: 'Ayuda', phrase: 'Necesito ayuda.', icon: 'HelpingHand' },
        { label: 'Abrazo', phrase: 'Necesito un abrazo.', icon: 'Heart' },
        { label: 'Estar solo', phrase: 'Necesito estar solo.', icon: 'DoorClosed' },
      ],
    },
    {
      category: 'Escuela / aprendizaje',
      items: [
        { label: 'No entiendo', phrase: 'No entiendo.', icon: 'CircleHelp' },
        { label: 'Repite por favor', phrase: 'Repite por favor.', icon: 'Repeat' },
        { label: 'Terminé', phrase: 'Terminé.', icon: 'CheckCircle2' },
        { label: 'Quiero intentar otra vez', phrase: 'Quiero intentar otra vez.', icon: 'RotateCcw' },
        { label: 'Necesito pausa', phrase: 'Necesito pausa.', icon: 'PauseCircle' },
      ],
    },
  ];

  const currentNeeds = categorizedNeeds.find((c) => c.category === activeCategory)?.items ?? categorizedNeeds[0].items;

  const handleSpeak = (category: string, label: string, phrase: string) => {
    setActivePhrase(phrase);
    const currentLogs = getStorageItem<any[]>(LUMI_STORAGE_KEYS.needLogs, []) ?? [];
    setStorageItem(LUMI_STORAGE_KEYS.needLogs, [
      {
        timestamp: new Date().toISOString(),
        category,
        need: label,
        phrase,
      },
      ...currentLogs,
    ]);
    setTimeout(() => setActivePhrase(null), 3000);
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-4xl font-child font-bold">¿Necesitas algo?</h2>
      </div>

      <AnimatePresence>
        {activePhrase && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-slate-900 text-white p-12 rounded-[40px] text-center shadow-xl mb-12"
          >
            <Volume2 className="mx-auto mb-4 opacity-50" size={48} />
            <h3 className="text-6xl font-child font-bold">{activePhrase}</h3>
          </motion.div>
        )}
      </AnimatePresence>

      {!activePhrase && (
        <>
          <div className="flex flex-wrap gap-3 justify-center">
            {categorizedNeeds.map((section) => (
              <button
                key={section.category}
                onClick={() => setActiveCategory(section.category)}
                className={cn(
                  'px-4 py-2 rounded-full border text-sm font-bold transition-all',
                  activeCategory === section.category
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-600'
                )}
              >
                {section.category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {currentNeeds.map((need) => (
            <button
              key={`${activeCategory}-${need.label}`}
              onClick={() => handleSpeak(activeCategory, need.label, need.phrase)}
              className="btn-child flex flex-col gap-6 py-12 bg-white border-slate-100 text-slate-800 hover:border-emerald-300 hover:bg-emerald-50"
            >
              <div className="bg-slate-50 p-6 rounded-[32px] text-emerald-600">
                <IconComponent name={need.icon} size={64} />
              </div>
              <span className="text-3xl">{need.label}</span>
            </button>
          ))}
        </div>
        </>
      )}
    </div>
  );
};

// --- Zona de Calma ---

const CalmZone = () => {
  const [breathing, setBreathing] = useState(false);
  const [timer, setTimer] = useState(0);

  return (
    <div className="max-w-4xl mx-auto py-12 flex flex-col items-center justify-center min-h-[70vh] bg-indigo-50/30 rounded-[60px] border-4 border-indigo-100">
      <h2 className="text-4xl font-child font-bold mb-12 text-indigo-900">Zona de Calma</h2>
      
      {!breathing ? (
        <div className="text-center space-y-8">
          <div className="p-12 bg-white rounded-full shadow-lg inline-block text-indigo-500">
            <Wind size={120} />
          </div>
          <p className="text-2xl text-indigo-700 max-w-md font-medium">Este es un lugar tranquilo para descansar y respirar.</p>
          <button 
            onClick={() => setBreathing(true)}
            className="btn-child bg-indigo-600 text-white border-indigo-700 px-12 py-6"
          >
            Empezar a respirar
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-16">
          <motion.div 
            animate={{ 
              scale: [1, 1.4, 1],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-48 h-48 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(99,102,241,0.3)]"
          >
            <div className="text-white font-bold text-2xl uppercase tracking-widest text-center leading-tight">
               Respira<br/>Suave
            </div>
          </motion.div>
          
          <div className="text-center space-y-6">
            <p className="text-3xl font-child font-bold text-indigo-900">Sigue el círculo...</p>
            <button 
              onClick={() => setBreathing(false)}
              className="text-slate-400 font-bold uppercase tracking-widest text-sm hover:text-slate-600"
            >
              Salir de aquí
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Social Stories ---

const StoriesModule = () => {
  const [selectedStory, setSelectedStory] = useState<typeof socialStories[0] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { speak } = useSpeech();

  const startStory = (story: typeof socialStories[0]) => {
    setSelectedStory(story);
    setCurrentStep(0);
    speak(story.title);
  };

  useEffect(() => {
    if (selectedStory) {
      speak(selectedStory.cards[currentStep].text);
    }
  }, [selectedStory, currentStep, speak]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-4xl font-child font-bold">Historias Sociales</h2>
        <p className="text-slate-500 mt-2">Aprendemos sobre situaciones nuevas</p>
      </div>

      {!selectedStory ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {socialStories.map((story) => (
            <button
              key={story.id}
              onClick={() => startStory(story)}
              className="btn-child flex items-center justify-between bg-white border-slate-100 text-slate-800 hover:border-pink-300 hover:bg-pink-50"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-pink-100 rounded-2xl text-pink-600">
                  <BookOpen size={32} />
                </div>
                <div className="text-left">
                  <span className="block">{story.title}</span>
                  <span className="text-sm font-normal opacity-50">{story.description}</span>
                </div>
              </div>
              <ChevronRight />
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
             <button onClick={() => setSelectedStory(null)} className="text-slate-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
               <ChevronLeft size={16} /> Ver otras historias
             </button>
             <span className="font-bold text-slate-400">{currentStep + 1} / {selectedStory.cards.length}</span>
          </div>

          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-lumi py-16 px-10 flex flex-col items-center justify-center min-h-[400px] gap-8 bg-pink-50/30 border-pink-100"
          >
             <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-pink-500 shadow-sm">
                <BookOpen size={48} />
             </div>
             <p className="text-4xl font-child font-bold text-center leading-tight">
               {selectedStory.cards[currentStep].text}
             </p>
          </motion.div>

          <div className="flex justify-between gap-4">
            <button 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex-1 py-4 bg-white border-2 border-slate-100 rounded-[28px] font-bold disabled:opacity-30 disabled:pointer-events-none"
            >
              Anterior
            </button>
            {currentStep < selectedStory.cards.length - 1 ? (
              <button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex-1 py-4 bg-pink-600 text-white rounded-[28px] font-bold shadow-lg"
              >
                Siguiente
              </button>
            ) : (
              <button 
                onClick={() => setSelectedStory(null)}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-[28px] font-bold shadow-lg"
              >
                ¡Terminé!
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Games Module ---

const GamesMenu = ({ onSelect }: { onSelect: (game: string) => void }) => {
  const games = [
    { id: 'que-hago', title: '¿Qué hago si...?', icon: 'HelpCircle', color: 'bg-cyan-100 text-cyan-600' },
    { id: 'emociones', title: 'Reconoce la emoción', icon: 'Smile', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'ordenar', title: 'Ordena la rutina', icon: 'ListOrdered', color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {games.map(game => (
        <button
          key={game.id}
          onClick={() => onSelect(game.id)}
          className={cn(
            "btn-child py-16 flex flex-col items-center gap-6",
            game.color
          )}
        >
          <div className="bg-white p-6 rounded-[32px] shadow-sm">
            <IconComponent name={game.icon} size={64} />
          </div>
          <span className="text-3xl">{game.title}</span>
        </button>
      ))}
    </div>
  );
};

const EmotionsGame = ({ onExit }: { onExit: () => void }) => {
  const [idx, setIdx] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const { speak } = useSpeech();

  const current = emotionChallenges[idx];
  const options = ['Feliz', 'Triste', 'Enojado', 'Con miedo', 'Cansado'];

  useEffect(() => {
    if (showSuccess) {
      speak(`¡Eso es! Se siente ${current.correctEmotion}`);
    } else {
      speak("¿Cómo se siente?");
    }
  }, [showSuccess, current, speak]);

  const handleSelect = (emotion: string) => {
    if (emotion === current.correctEmotion) {
      setShowSuccess(true);
      setSelected(null);
    } else {
      speak(`No es ${emotion}. Intenta otra vez.`);
      setSelected(emotion);
      setTimeout(() => setSelected(null), 1000);
    }
  };

  const nextChallenge = () => {
    setShowSuccess(false);
    if (idx < emotionChallenges.length - 1) {
      setIdx(idx + 1);
    } else {
      onExit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-child font-bold">¿Cómo se siente?</h2>
        <button onClick={onExit} className="text-slate-400 font-bold uppercase tracking-widest text-sm">Salir</button>
      </div>

      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-lumi py-16 text-center space-y-8 bg-emerald-50 border-emerald-200"
          >
            <Trophy size={80} className="mx-auto text-yellow-500" />
            <h3 className="text-5xl font-child font-bold text-emerald-800">¡Eso es!</h3>
            <p className="text-2xl text-emerald-600 font-medium">Se siente {current.correctEmotion}</p>
            <button onClick={nextChallenge} className="btn-child bg-emerald-600 text-white px-12">
              {idx < emotionChallenges.length - 1 ? '¡Otro más!' : '¡Terminar juego!'}
            </button>
          </motion.div>
        ) : (
          <motion.div key="game" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div className="card-lumi bg-white py-12 flex justify-center">
              <div className="text-yellow-500">
                <IconComponent name={current.icon} size={150} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={cn(
                    "p-6 rounded-3xl font-bold border-2 transition-all active:scale-95 text-lg",
                    selected === opt ? "bg-red-50 border-red-300 shake" : "bg-white border-slate-100 hover:border-yellow-300"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OrderRoutineGame = ({ onExit }: { onExit: () => void }) => {
  const [idx, setIdx] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [wrong, setWrong] = useState(false);
  const { speak } = useSpeech();

  const current = routineSequences[idx];
  // Stable shuffled steps for the current challenge
  const [shuffledSteps, setShuffledSteps] = useState<{id: string, label: string, icon: string}[]>([]);

  useState(() => {
    setShuffledSteps([...current.steps].sort(() => Math.random() - 0.5));
  });

  useEffect(() => {
    if (showSuccess) {
      speak(`¡Lo lograste! Ordenaste correctamente ${current.title}`);
    } else if (userSequence.length === 0) {
      speak(`Ordena la rutina: ${current.title}`);
    }
  }, [showSuccess, userSequence.length, current.title, speak]);

  const handleSelectStep = (stepId: string) => {
    if (userSequence.includes(stepId)) return;

    const nextIdx = userSequence.length;
    if (current.steps[nextIdx].id === stepId) {
      const step = current.steps[nextIdx];
      speak(`¡Bien! ${step.label}`);
      const newSeq = [...userSequence, stepId];
      setUserSequence(newSeq);
      if (newSeq.length === current.steps.length) {
        setShowSuccess(true);
      }
    } else {
      speak("Ese no es el paso siguiente. Intenta otra vez.");
      setWrong(true);
      setTimeout(() => setWrong(false), 500);
    }
  };

  const nextChallenge = () => {
    setShowSuccess(false);
    setUserSequence([]);
    if (idx < routineSequences.length - 1) {
      const nextIdx = idx + 1;
      setIdx(nextIdx);
      setShuffledSteps([...routineSequences[nextIdx].steps].sort(() => Math.random() - 0.5));
    } else {
      onExit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-child font-bold">Ordena la rutina</h2>
        <button onClick={onExit} className="text-slate-400 font-bold uppercase tracking-widest text-sm">Salir</button>
      </div>

      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="card-lumi py-16 text-center space-y-8 bg-emerald-50 border-emerald-200">
             <Trophy size={80} className="mx-auto text-yellow-500" />
             <h3 className="text-5xl font-child font-bold text-emerald-800">¡Lo lograste!</h3>
             <p className="text-2xl text-emerald-600 font-medium whitespace-pre-wrap">Ordenaste correctamente: {current.title}</p>
             <button onClick={nextChallenge} className="btn-child bg-emerald-600 text-white px-12">
               {idx < routineSequences.length - 1 ? '¡Siguiente!' : '¡Terminar juego!'}
             </button>
          </motion.div>
        ) : (
          <motion.div key="game" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div className="text-center">
              <h3 className="text-3xl font-child font-bold mb-4">{current.title}</h3>
              <p className="text-slate-500">¿Qué va primero? Selecciona en orden</p>
            </div>

            <div className="flex justify-center gap-4 min-h-[140px] items-center bg-white/50 p-6 rounded-[40px] border-2 border-dashed border-slate-200">
              {userSequence.map((stepId, i) => {
                const step = current.steps.find(s => s.id === stepId);
                return (
                  <motion.div key={stepId} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <IconComponent name={step?.icon || ''} size={40} />
                    </div>
                    <span className="font-bold text-emerald-700">{step?.label}</span>
                  </motion.div>
                );
              })}
              {userSequence.length < current.steps.length && (
                <div className="w-20 h-20 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-300 font-bold text-2xl">
                   {userSequence.length + 1}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6">
              {shuffledSteps.map(step => (
                <button
                  key={step.id}
                  disabled={userSequence.includes(step.id)}
                  onClick={() => handleSelectStep(step.id)}
                  className={cn(
                    "btn-child py-10 flex flex-col items-center gap-4 bg-white border-slate-100 transition-all",
                    userSequence.includes(step.id) && "opacity-20 scale-90",
                    (wrong && !userSequence.includes(step.id)) && "shake border-red-200"
                  )}
                >
                  <IconComponent name={step.icon} size={48} />
                  <span className="text-xl">{step.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WhatDoIDoGame = ({ onExit }: { onExit: () => void }) => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [wrongSelection, setWrongSelection] = useState<string | null>(null);
  const { speak } = useSpeech();

  const current = gameScenarios[scenarioIdx];

  useEffect(() => {
    if (showSuccess) {
      speak(`¡Excelente! ${current.options.find(o => o.isCorrect)?.label} es la respuesta correcta.`);
    } else {
      speak(current.situation);
    }
  }, [showSuccess, current, speak]);

  const handleOptionClick = (option: typeof current.options[0]) => {
    if (option.isCorrect) {
      setShowSuccess(true);
      setWrongSelection(null);
    } else {
      speak(`No, eso no está bien. Intenta otra vez.`);
      setWrongSelection(option.label);
      setTimeout(() => setWrongSelection(null), 1000);
    }
  };

  const nextScenario = () => {
    setShowSuccess(false);
    if (scenarioIdx < gameScenarios.length - 1) {
      setScenarioIdx(prev => prev + 1);
    } else {
      onExit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-child font-bold">¿Qué hago si...?</h2>
        <button onClick={onExit} className="text-slate-400 font-bold uppercase tracking-widest text-sm">Salir</button>
      </div>

      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="card-lumi py-16 px-10 flex flex-col items-center justify-center text-center gap-8 bg-emerald-50 border-emerald-200"
          >
            <div className="flex gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="text-yellow-500"
              >
                <Trophy size={80} />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-amber-400"
              >
                <Sparkles size={80} />
              </motion.div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-5xl font-child font-bold text-emerald-800">¡Excelente!</h3>
              <p className="text-2xl text-emerald-600 font-medium whitespace-pre-wrap">
                {current.options.find(o => o.isCorrect)?.label} es la respuesta correcta.
              </p>
            </div>

            <button
              onClick={nextScenario}
              className="btn-child bg-emerald-600 text-white border-emerald-700 px-12 py-6 mt-4 shadow-xl"
            >
              {scenarioIdx < gameScenarios.length - 1 ? '¡Siguiente situación!' : '¡Terminar juego!'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="card-lumi bg-cyan-50 border-cyan-100 py-12 text-center">
              <h3 className="text-5xl font-child font-bold text-cyan-900">{current.situation}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {current.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleOptionClick(option)}
                  className={cn(
                    "btn-child py-12 flex flex-col items-center gap-6 bg-white border-slate-100 hover:border-cyan-300 transition-all",
                    wrongSelection === option.label && "border-red-300 bg-red-50 shake"
                  )}
                >
                  <div className="bg-slate-50 p-6 rounded-[32px] text-cyan-600">
                    <IconComponent name={option.icon} size={64} />
                  </div>
                  <span className="text-2xl">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GamesModule = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  if (activeGame === 'que-hago') {
    return <WhatDoIDoGame onExit={() => setActiveGame(null)} />;
  }
  
  if (activeGame === 'emociones') {
    return <EmotionsGame onExit={() => setActiveGame(null)} />;
  }

  if (activeGame === 'ordenar') {
    return <OrderRoutineGame onExit={() => setActiveGame(null)} />;
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-child font-bold">Juegos Didácticos</h2>
        <p className="text-slate-500 mt-2">Divertirse y aprender juntos</p>
      </div>
      <GamesMenu onSelect={setActiveGame} />
    </div>
  );
};

// --- Learning Module ---

const LearningModule = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { speak } = useSpeech();
  const learningSettings = getStorageItem<LearningSettings>(LUMI_STORAGE_KEYS.learningSettings);
  const recommendedActivity = learningSettings?.practiceAreas?.includes('Vocales')
    ? 'Vocales'
    : learningSettings?.practiceAreas?.includes('Números')
      ? 'Conteo'
      : null;
  
  const sections = [
    { id: 'letras', title: 'Letras y lectura', icon: 'SquareDashed', color: 'bg-indigo-100 text-indigo-600', status: 'disponible' },
    { id: 'numeros', title: 'Números y conteo', icon: 'Hash', color: 'bg-amber-100 text-amber-600', status: 'disponible' },
    { id: 'calendario', title: 'Días y meses', icon: 'Calendar', color: 'bg-sky-100 text-sky-600', status: 'disponible' },
    { id: 'operaciones', title: 'Sumas y Restas', icon: 'Plus', color: 'bg-rose-100 text-rose-600', status: 'proximamente' },
  ] as const;

  const vowels = [
    { letter: 'A', word: 'Avión', emoji: '✈️', phrase: 'A de avión.' },
    { letter: 'E', word: 'Elefante', emoji: '🐘', phrase: 'E de elefante.' },
    { letter: 'I', word: 'Iguana', emoji: '🦎', phrase: 'I de iguana.' },
    { letter: 'O', word: 'Oso', emoji: '🐻', phrase: 'O de oso.' },
    { letter: 'U', word: 'Uva', emoji: '🍇', phrase: 'U de uva.' },
  ];
  const [vowelMode, setVowelMode] = useState<'conoce' | 'toca' | 'empieza'>('conoce');
  const [letterActivity, setLetterActivity] = useState<'vocales' | 'alfabeto' | 'silabas'>('vocales');
  const [targetVowel, setTargetVowel] = useState('A');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [startWord, setStartWord] = useState(vowels[0]);
  const alphabetLetters = [
    { upper: 'A', lower: 'a', word: 'avión', emoji: '✈️' }, { upper: 'B', lower: 'b', word: 'barco', emoji: '🚢' },
    { upper: 'C', lower: 'c', word: 'casa', emoji: '🏠' }, { upper: 'D', lower: 'd', word: 'dado', emoji: '🎲' },
    { upper: 'E', lower: 'e', word: 'elefante', emoji: '🐘' }, { upper: 'F', lower: 'f', word: 'flor', emoji: '🌸' },
    { upper: 'G', lower: 'g', word: 'gato', emoji: '🐱' }, { upper: 'H', lower: 'h', word: 'helado', emoji: '🍦' },
    { upper: 'I', lower: 'i', word: 'iguana', emoji: '🦎' }, { upper: 'J', lower: 'j', word: 'jugo', emoji: '🧃' },
    { upper: 'K', lower: 'k', word: 'kiwi', emoji: '🥝' }, { upper: 'L', lower: 'l', word: 'luna', emoji: '🌙' },
    { upper: 'M', lower: 'm', word: 'mamá', emoji: '👩' }, { upper: 'N', lower: 'n', word: 'nube', emoji: '☁️' },
    { upper: 'Ñ', lower: 'ñ', word: 'ñu', emoji: '🦬' }, { upper: 'O', lower: 'o', word: 'oso', emoji: '🐻' },
    { upper: 'P', lower: 'p', word: 'pelota', emoji: '⚽' }, { upper: 'Q', lower: 'q', word: 'queso', emoji: '🧀' },
    { upper: 'R', lower: 'r', word: 'rana', emoji: '🐸' }, { upper: 'S', lower: 's', word: 'sol', emoji: '☀️' },
    { upper: 'T', lower: 't', word: 'tren', emoji: '🚂' }, { upper: 'U', lower: 'u', word: 'uva', emoji: '🍇' },
    { upper: 'V', lower: 'v', word: 'vaca', emoji: '🐮' }, { upper: 'W', lower: 'w', word: 'waffle', emoji: '🧇' },
    { upper: 'X', lower: 'x', word: 'xilófono', emoji: '🎼' }, { upper: 'Y', lower: 'y', word: 'yoyo', emoji: '🪀' },
    { upper: 'Z', lower: 'z', word: 'zorro', emoji: '🦊' },
  ];
  const [alphabetMode, setAlphabetMode] = useState<'explorar' | 'encuentra' | 'empieza'>('explorar');
  const [targetLetter, setTargetLetter] = useState('M');
  const [alphabetWord, setAlphabetWord] = useState(alphabetLetters.find((item) => item.upper === 'S') ?? alphabetLetters[0]);
  const [alphabetOptions, setAlphabetOptions] = useState<string[]>(['S', 'M', 'P', 'L']);
  const syllableFamilies = [
    { family: 'ma', items: ['ma', 'me', 'mi', 'mo', 'mu'], example: 'mamá', emoji: '👩' },
    { family: 'pa', items: ['pa', 'pe', 'pi', 'po', 'pu'], example: 'papá', emoji: '👨' },
    { family: 'sa', items: ['sa', 'se', 'si', 'so', 'su'], example: 'sapo', emoji: '🐸' },
    { family: 'la', items: ['la', 'le', 'li', 'lo', 'lu'], example: 'luna', emoji: '🌙' },
    { family: 'ta', items: ['ta', 'te', 'ti', 'to', 'tu'], example: 'taza', emoji: '☕' },
  ];
  const syllableWordPairs = [
    { syllable: 'ma', word: 'mamá', emoji: '👩' },
    { syllable: 'pa', word: 'papá', emoji: '👨' },
    { syllable: 'sa', word: 'sapo', emoji: '🐸' },
    { syllable: 'la', word: 'luna', emoji: '🌙' },
    { syllable: 'ta', word: 'taza', emoji: '☕' },
  ];
  const allSyllables = syllableFamilies.flatMap((family) => family.items);
  const [syllableMode, setSyllableMode] = useState<'ver' | 'encuentra' | 'une'>('ver');
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const [targetSyllable, setTargetSyllable] = useState('ma');
  const [syllableOptions, setSyllableOptions] = useState<string[]>(['ma', 'me', 'mi', 'mo']);
  const [syllableWord, setSyllableWord] = useState(syllableWordPairs[0]);
  const [syllableWordOptions, setSyllableWordOptions] = useState<string[]>(['ma', 'pa', 'sa', 'la']);

  if (activeSection === 'letras') {


    const updateLearningProgress = (isCorrect: boolean, seenVowel?: string) => {
      const current = getStorageItem<LearningProgress>(LUMI_STORAGE_KEYS.learningProgress, {
        vowelsSeen: [],
        attempts: 0,
        correctAnswers: 0,
        lastPracticeAt: null,
      }) ?? {
        vowelsSeen: [],
        attempts: 0,
        correctAnswers: 0,
        lastPracticeAt: null,
      };

      const nextSeen = seenVowel && !current.vowelsSeen.includes(seenVowel) ? [...current.vowelsSeen, seenVowel] : current.vowelsSeen;
      const nextProgress: LearningProgress = {
        vowelsSeen: nextSeen,
        lettersSeen: current.lettersSeen ?? [],
        syllablesSeen: current.syllablesSeen ?? [],
        attempts: current.attempts + 1,
        alphabetAttempts: current.alphabetAttempts ?? 0,
        syllableAttempts: current.syllableAttempts ?? 0,
        correctAnswers: current.correctAnswers + (isCorrect ? 1 : 0),
        alphabetCorrectAnswers: current.alphabetCorrectAnswers ?? 0,
        syllableCorrectAnswers: current.syllableCorrectAnswers ?? 0,
        lastPracticeAt: new Date().toISOString(),
        alphabetLastPracticeAt: current.alphabetLastPracticeAt ?? null,
        syllableLastPracticeAt: current.syllableLastPracticeAt ?? null,
      };
      setStorageItem(LUMI_STORAGE_KEYS.learningProgress, nextProgress);
    };

    const updateAlphabetProgress = (isCorrect: boolean, seenLetter?: string) => {
      const current = getStorageItem<LearningProgress>(LUMI_STORAGE_KEYS.learningProgress, {
        vowelsSeen: [],
        lettersSeen: [],
        attempts: 0,
        alphabetAttempts: 0,
        correctAnswers: 0,
        alphabetCorrectAnswers: 0,
        lastPracticeAt: null,
        alphabetLastPracticeAt: null,
      }) ?? {
        vowelsSeen: [],
        lettersSeen: [],
        attempts: 0,
        alphabetAttempts: 0,
        correctAnswers: 0,
        alphabetCorrectAnswers: 0,
        lastPracticeAt: null,
        alphabetLastPracticeAt: null,
      };
      const currentLetters = current.lettersSeen ?? [];
      const nextLetters = seenLetter && !currentLetters.includes(seenLetter) ? [...currentLetters, seenLetter] : currentLetters;
      setStorageItem(LUMI_STORAGE_KEYS.learningProgress, {
        ...current,
        lettersSeen: nextLetters,
        alphabetAttempts: (current.alphabetAttempts ?? 0) + 1,
        alphabetCorrectAnswers: (current.alphabetCorrectAnswers ?? 0) + (isCorrect ? 1 : 0),
        alphabetLastPracticeAt: new Date().toISOString(),
      });
    };

    const updateSyllableProgress = (isCorrect: boolean, seenSyllable?: string, countAttempt = true) => {
      const current = getStorageItem<LearningProgress>(LUMI_STORAGE_KEYS.learningProgress, {
        vowelsSeen: [],
        lettersSeen: [],
        syllablesSeen: [],
        attempts: 0,
        alphabetAttempts: 0,
        syllableAttempts: 0,
        correctAnswers: 0,
        alphabetCorrectAnswers: 0,
        syllableCorrectAnswers: 0,
        lastPracticeAt: null,
        alphabetLastPracticeAt: null,
        syllableLastPracticeAt: null,
      }) ?? {
        vowelsSeen: [],
        lettersSeen: [],
        syllablesSeen: [],
        attempts: 0,
        alphabetAttempts: 0,
        syllableAttempts: 0,
        correctAnswers: 0,
        alphabetCorrectAnswers: 0,
        syllableCorrectAnswers: 0,
        lastPracticeAt: null,
        alphabetLastPracticeAt: null,
        syllableLastPracticeAt: null,
      };
      const currentSyllables = current.syllablesSeen ?? [];
      const nextSyllables = seenSyllable && !currentSyllables.includes(seenSyllable) ? [...currentSyllables, seenSyllable] : currentSyllables;
      setStorageItem(LUMI_STORAGE_KEYS.learningProgress, {
        ...current,
        syllablesSeen: nextSyllables,
        syllableAttempts: (current.syllableAttempts ?? 0) + (countAttempt ? 1 : 0),
        syllableCorrectAnswers: (current.syllableCorrectAnswers ?? 0) + (countAttempt && isCorrect ? 1 : 0),
        syllableLastPracticeAt: new Date().toISOString(),
      });
    };

    const handleTouchMode = (selected: string) => {
      if (selected === targetVowel) {
        setFeedback('Lo lograste');
        updateLearningProgress(true, selected);
      } else {
        setFeedback('Buen intento, probemos otra vez');
        updateLearningProgress(false);
      }
      const next = vowels[Math.floor(Math.random() * vowels.length)];
      setTargetVowel(next.letter);
    };

    const handleStartsWith = (selected: string) => {
      if (selected === startWord.letter) {
        setFeedback('Lo lograste');
        updateLearningProgress(true, selected);
      } else {
        setFeedback('Buen intento, probemos otra vez');
        updateLearningProgress(false);
      }
      setStartWord(vowels[Math.floor(Math.random() * vowels.length)]);
    };

    const pickAlphabetChallenge = () => {
      const picked = alphabetLetters[Math.floor(Math.random() * alphabetLetters.length)];
      setTargetLetter(picked.upper);
      const pool = alphabetLetters.filter((item) => item.upper !== picked.upper).sort(() => Math.random() - 0.5).slice(0, 3).map((item) => item.upper);
      setAlphabetOptions([picked.upper, ...pool].sort(() => Math.random() - 0.5));
    };

    const handleFindLetter = (selected: string) => {
      if (selected === targetLetter) {
        setFeedback('Lo lograste');
        updateAlphabetProgress(true, selected);
      } else {
        setFeedback('Buen intento, probemos otra vez');
        updateAlphabetProgress(false);
      }
      pickAlphabetChallenge();
    };

    const pickStartWordChallenge = () => {
      const picked = alphabetLetters[Math.floor(Math.random() * alphabetLetters.length)];
      setAlphabetWord(picked);
      const pool = alphabetLetters.filter((item) => item.upper !== picked.upper).sort(() => Math.random() - 0.5).slice(0, 3).map((item) => item.upper);
      setAlphabetOptions([picked.upper, ...pool].sort(() => Math.random() - 0.5));
    };

    const handleAlphabetStartsWith = (selected: string) => {
      if (selected === alphabetWord.upper) {
        setFeedback('Lo lograste');
        updateAlphabetProgress(true, selected);
      } else {
        setFeedback('Buen intento, probemos otra vez');
        updateAlphabetProgress(false);
      }
      pickStartWordChallenge();
    };

    const currentSyllable = allSyllables[currentSyllableIndex % allSyllables.length];
    const currentSyllableFamily = syllableFamilies.find((family) => family.items.includes(currentSyllable)) ?? syllableFamilies[0];

    const pickSyllableChallenge = () => {
      const pickedFamily = syllableFamilies[Math.floor(Math.random() * syllableFamilies.length)];
      const picked = pickedFamily.items[Math.floor(Math.random() * pickedFamily.items.length)];
      setTargetSyllable(picked);
      setSyllableOptions(pickedFamily.items.slice(0, 4));
    };

    const handleFindSyllable = (selected: string) => {
      if (selected === targetSyllable) {
        setFeedback('Lo lograste');
        updateSyllableProgress(true, selected);
      } else {
        setFeedback('Buen intento, probemos otra vez');
        updateSyllableProgress(false);
      }
      pickSyllableChallenge();
    };

    const pickSyllableWordChallenge = () => {
      const picked = syllableWordPairs[Math.floor(Math.random() * syllableWordPairs.length)];
      const pool = syllableWordPairs.filter((item) => item.syllable !== picked.syllable).slice(0, 3).map((item) => item.syllable);
      setSyllableWord(picked);
      setSyllableWordOptions([picked.syllable, ...pool].sort(() => Math.random() - 0.5));
    };

    const handleSyllableWordMatch = (selected: string) => {
      if (selected === syllableWord.syllable) {
        setFeedback('Lo lograste');
        updateSyllableProgress(true, selected);
      } else {
        setFeedback('Buen intento, probemos otra vez');
        updateSyllableProgress(false);
      }
      pickSyllableWordChallenge();
    };

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-4xl font-child font-bold">Letras y lectura</h3>
          <p className="text-slate-500 mt-2">Aprendamos vocales, letras y sílabas paso a paso</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <button onClick={() => setLetterActivity('vocales')} className={cn('btn-child py-4 text-xl', letterActivity === 'vocales' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-100')}>
            Vocales
          </button>
          <button onClick={() => setLetterActivity('alfabeto')} className={cn('btn-child py-4 text-xl', letterActivity === 'alfabeto' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-100')}>
            Alfabeto
          </button>
          <button onClick={() => setLetterActivity('silabas')} className={cn('btn-child py-4 text-xl', letterActivity === 'silabas' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-100')}>
            Sílabas simples
          </button>
        </div>

        {letterActivity === 'vocales' && (
          <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <button onClick={() => setVowelMode('conoce')} className={cn('btn-child py-4 text-xl', vowelMode === 'conoce' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-100')}>
            Conoce las vocales
          </button>
          <button onClick={() => setVowelMode('toca')} className={cn('btn-child py-4 text-xl', vowelMode === 'toca' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-100')}>
            Toca la vocal
          </button>
          <button onClick={() => setVowelMode('empieza')} className={cn('btn-child py-4 text-xl', vowelMode === 'empieza' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-100')}>
            ¿Con qué vocal empieza?
          </button>
        </div>

        {vowelMode === 'conoce' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {vowels.map((v) => (
              <button
                key={v.letter}
                onClick={() => {
                  speak(v.phrase);
                  const current = getStorageItem<LearningProgress>(LUMI_STORAGE_KEYS.learningProgress, { vowelsSeen: [], attempts: 0, correctAnswers: 0, lastPracticeAt: null }) ?? { vowelsSeen: [], attempts: 0, correctAnswers: 0, lastPracticeAt: null };
                  if (!current.vowelsSeen.includes(v.letter)) {
                    setStorageItem(LUMI_STORAGE_KEYS.learningProgress, { ...current, vowelsSeen: [...current.vowelsSeen, v.letter], lastPracticeAt: new Date().toISOString() });
                  }
                }}
                className="card-lumi bg-white border-indigo-100 text-left space-y-3 hover:bg-indigo-50 transition-colors"
              >
                <p className="text-6xl font-black text-indigo-600">{v.letter}</p>
                <p className="text-2xl font-child font-bold text-slate-800">{v.word} {v.emoji}</p>
                <p className="text-lg text-slate-600">{v.phrase}</p>
              </button>
            ))}
          </div>
        )}

        {vowelMode === 'toca' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="card-lumi text-center bg-indigo-50 border-indigo-100">
              <p className="text-3xl font-child font-bold text-indigo-800">Toca la vocal {targetVowel}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {vowels.map((v) => (
                <button key={v.letter} onClick={() => handleTouchMode(v.letter)} className="btn-child py-10 text-5xl font-black bg-white border-indigo-100 text-indigo-600">
                  {v.letter}
                </button>
              ))}
            </div>
          </div>
        )}

        {vowelMode === 'empieza' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="card-lumi text-center bg-indigo-50 border-indigo-100">
              <p className="text-3xl font-child font-bold text-indigo-800">{startWord.word}</p>
              <p className="text-slate-500 mt-2">¿Con qué vocal empieza?</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {vowels.map((v) => (
                <button key={v.letter} onClick={() => handleStartsWith(v.letter)} className="btn-child py-10 text-5xl font-black bg-white border-indigo-100 text-indigo-600">
                  {v.letter}
                </button>
              ))}
            </div>
          </div>
        )}

        {feedback && (
          <div className="max-w-3xl mx-auto text-center bg-lumi-soft-yellow border border-amber-200 rounded-3xl px-6 py-4">
            <p className="text-amber-800 font-bold text-2xl">{feedback}</p>
          </div>
        )}
          </>
        )}
        {letterActivity === 'alfabeto' && (
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-3xl font-child font-bold">Alfabeto</h4>
              <p className="text-slate-500">Reconozcamos letras y palabras</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <button onClick={() => setAlphabetMode('explorar')} className={cn('btn-child py-4 text-xl', alphabetMode === 'explorar' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-100')}>Explorar letras</button>
              <button onClick={() => { setAlphabetMode('encuentra'); pickAlphabetChallenge(); }} className={cn('btn-child py-4 text-xl', alphabetMode === 'encuentra' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-100')}>Encuentra la letra</button>
              <button onClick={() => { setAlphabetMode('empieza'); pickStartWordChallenge(); }} className={cn('btn-child py-4 text-xl', alphabetMode === 'empieza' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-100')}>¿Con qué letra empieza?</button>
            </div>
            {alphabetMode === 'explorar' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {alphabetLetters.map((item) => (
                  <button key={item.upper} onClick={() => { speak(`${item.upper} de ${item.word}`); updateAlphabetProgress(true, item.upper); }} className="card-lumi bg-white border-indigo-100 text-left space-y-2 hover:bg-indigo-50 transition-colors">
                    <p className="text-5xl font-black text-indigo-600">{item.upper} <span className="text-3xl font-bold text-slate-500">{item.lower}</span></p>
                    <p className="text-2xl font-child font-bold text-slate-800">{item.word} {item.emoji}</p>
                  </button>
                ))}
              </div>
            )}
            {alphabetMode === 'encuentra' && (
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="card-lumi text-center bg-indigo-50 border-indigo-100"><p className="text-3xl font-child font-bold text-indigo-800">Toca la letra {targetLetter}</p></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {alphabetOptions.map((opt) => <button key={opt} onClick={() => handleFindLetter(opt)} className="btn-child py-8 text-4xl font-black bg-white border-indigo-100 text-indigo-600">{opt}</button>)}
                </div>
              </div>
            )}
            {alphabetMode === 'empieza' && (
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="card-lumi text-center bg-indigo-50 border-indigo-100">
                  <p className="text-4xl font-child font-bold text-indigo-800">{alphabetWord.word}</p>
                  <p className="text-slate-500 mt-2">¿Con qué letra empieza?</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {alphabetOptions.map((opt) => <button key={opt} onClick={() => handleAlphabetStartsWith(opt)} className="btn-child py-8 text-4xl font-black bg-white border-indigo-100 text-indigo-600">{opt}</button>)}
                </div>
              </div>
            )}
          </div>
        )}
        {letterActivity === 'silabas' && (
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-3xl font-child font-bold">Sílabas simples</h4>
              <p className="text-slate-500">Unimos sonidos cortos para empezar a leer</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <button onClick={() => setSyllableMode('ver')} className={cn('btn-child py-4 text-xl', syllableMode === 'ver' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-100')}>Ver y repetir</button>
              <button onClick={() => { setSyllableMode('encuentra'); pickSyllableChallenge(); }} className={cn('btn-child py-4 text-xl', syllableMode === 'encuentra' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-100')}>Encuentra la sílaba</button>
              <button onClick={() => { setSyllableMode('une'); pickSyllableWordChallenge(); }} className={cn('btn-child py-4 text-xl', syllableMode === 'une' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-100')}>Une con palabra</button>
            </div>

            {syllableMode === 'ver' && (
              <div className="max-w-3xl mx-auto card-lumi bg-indigo-50 border-indigo-100 text-center space-y-4">
                <p className="text-7xl font-black text-indigo-700">{currentSyllable}</p>
                <p className="text-3xl font-child font-bold text-slate-800">{currentSyllable} como {currentSyllableFamily.example} {currentSyllableFamily.emoji}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button onClick={() => speak(`${currentSyllable}. ${currentSyllable} como ${currentSyllableFamily.example}`)} className="bg-white text-indigo-700 px-5 py-3 rounded-2xl font-bold border border-indigo-100">
                    Escuchar
                  </button>
                  <button onClick={() => { updateSyllableProgress(true, currentSyllable, false); setCurrentSyllableIndex((current) => (current + 1) % allSyllables.length); }} className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold">
                    Siguiente sílaba
                  </button>
                </div>
              </div>
            )}

            {syllableMode === 'encuentra' && (
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="card-lumi text-center bg-indigo-50 border-indigo-100"><p className="text-3xl font-child font-bold text-indigo-800">Toca {targetSyllable}</p></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {syllableOptions.map((option) => <button key={option} onClick={() => handleFindSyllable(option)} className="btn-child py-8 text-4xl font-black bg-white border-indigo-100 text-indigo-600">{option}</button>)}
                </div>
              </div>
            )}

            {syllableMode === 'une' && (
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="card-lumi text-center bg-indigo-50 border-indigo-100">
                  <p className="text-4xl font-child font-bold text-indigo-800">{syllableWord.word} {syllableWord.emoji}</p>
                  <p className="text-slate-500 mt-2">¿Con qué sílaba empieza?</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {syllableWordOptions.map((option) => <button key={option} onClick={() => handleSyllableWordMatch(option)} className="btn-child py-8 text-4xl font-black bg-white border-indigo-100 text-indigo-600">{option}</button>)}
                </div>
              </div>
            )}

            {feedback && (
              <div className="max-w-3xl mx-auto text-center bg-lumi-soft-yellow border border-amber-200 rounded-3xl px-6 py-4">
                <p className="text-amber-800 font-bold text-2xl">{feedback}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (activeSection === 'numeros') {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-4xl font-child font-bold">Números</h3>
          <p className="text-slate-500 mt-2">¿Cuánto es?</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 max-w-4xl mx-auto">
          {nums.map(n => (
            <button
              key={n}
              onClick={() => speak(String(n))}
              className="btn-child py-12 text-6xl font-black bg-white border-amber-100 text-amber-600 hover:bg-amber-50"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (activeSection === 'calendario') {
    const weekDays = [
      { name: 'Lunes', emoji: '🌱', phrase: 'Lunes inicia una nueva semana.' },
      { name: 'Martes', emoji: '🎨', phrase: 'Martes podemos aprender algo nuevo.' },
      { name: 'Miércoles', emoji: '📚', phrase: 'Miércoles está a la mitad de la semana.' },
      { name: 'Jueves', emoji: '🌼', phrase: 'Jueves seguimos paso a paso.' },
      { name: 'Viernes', emoji: '⭐', phrase: 'Viernes termina la semana escolar.' },
      { name: 'Sábado', emoji: '🧸', phrase: 'Sábado puede ser día de descanso o juego.' },
      { name: 'Domingo', emoji: '☀️', phrase: 'Domingo puede ser día tranquilo en familia.' },
    ];
    const months = [
      { name: 'Enero', emoji: '❄️', phrase: 'Enero empieza el año.' },
      { name: 'Febrero', emoji: '💛', phrase: 'Febrero es el segundo mes.' },
      { name: 'Marzo', emoji: '🌷', phrase: 'Marzo trae cambios de estación.' },
      { name: 'Abril', emoji: '🌧️', phrase: 'Abril es el cuarto mes.' },
      { name: 'Mayo', emoji: '🌸', phrase: 'Mayo llega con flores.' },
      { name: 'Junio', emoji: '🌤️', phrase: 'Junio está a la mitad del año.' },
      { name: 'Julio', emoji: '🏖️', phrase: 'Julio es el séptimo mes.' },
      { name: 'Agosto', emoji: '🌻', phrase: 'Agosto sigue en verano.' },
      { name: 'Septiembre', emoji: '🍂', phrase: 'Septiembre inicia una nueva parte del año.' },
      { name: 'Octubre', emoji: '🎃', phrase: 'Octubre es el décimo mes.' },
      { name: 'Noviembre', emoji: '🕯️', phrase: 'Noviembre está cerca del final del año.' },
      { name: 'Diciembre', emoji: '🎁', phrase: 'Diciembre cierra el año.' },
    ];

    return (
      <div className="space-y-10">
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-4xl font-child font-bold">Días y meses</h3>
          <p className="text-slate-500 mt-2">Aprendamos el tiempo con tarjetas tranquilas y visuales</p>
        </div>

        <section className="space-y-4">
          <div className="card-lumi bg-sky-50 border-sky-100 text-center max-w-3xl mx-auto">
            <Calendar size={44} className="mx-auto text-sky-600 mb-3" />
            <h4 className="text-3xl font-child font-bold text-sky-800">Días de la semana</h4>
            <p className="text-slate-600 mt-2">Los días se repiten: uno después de otro.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {weekDays.map((day) => (
              <button
                key={day.name}
                onClick={() => speak(`${day.name}. ${day.phrase}`)}
                className="card-lumi bg-white border-sky-100 text-left space-y-2 hover:bg-sky-50 transition-colors"
              >
                <p className="text-4xl" aria-hidden="true">{day.emoji}</p>
                <h5 className="text-2xl font-child font-bold text-sky-800">{day.name}</h5>
                <p className="text-slate-600">{day.phrase}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="card-lumi bg-emerald-50 border-emerald-100 text-center max-w-3xl mx-auto">
            <h4 className="text-3xl font-child font-bold text-emerald-800">Meses del año</h4>
            <p className="text-slate-600 mt-2">Doce meses forman un año completo.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {months.map((month, index) => (
              <button
                key={month.name}
                onClick={() => speak(`${month.name}. ${month.phrase}`)}
                className="card-lumi bg-white border-emerald-100 text-left space-y-2 hover:bg-emerald-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-4xl" aria-hidden="true">{month.emoji}</p>
                  <span className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">Mes {index + 1}</span>
                </div>
                <h5 className="text-2xl font-child font-bold text-emerald-800">{month.name}</h5>
                <p className="text-slate-600">{month.phrase}</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }


  if (activeSection === 'operaciones') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-4xl font-child font-bold">Operaciones</h3>
          <p className="text-slate-500 mt-2">Aprendamos a sumar y restar</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card-lumi bg-rose-50 border-rose-200 p-12 text-center space-y-6">
            <Plus size={64} className="mx-auto text-rose-500" />
            <h4 className="text-4xl font-bold">Suma</h4>
            <p className="text-xl">Cuando juntamos cosas y tenemos más.</p>
            <button onClick={() => speak("Suma. Cuando juntamos cosas y tenemos más.")} className="p-3 bg-white rounded-full text-rose-500 shadow-sm mx-auto">
              <Volume2 size={32} />
            </button>
          </div>
          <div className="card-lumi bg-slate-50 border-slate-200 p-12 text-center space-y-6">
            <Minus size={64} className="mx-auto text-slate-500" />
            <h4 className="text-4xl font-bold">Resta</h4>
            <p className="text-xl">Cuando quitamos algo y tenemos menos.</p>
            <button onClick={() => speak("Resta. Cuando quitamos algo y tenemos menos.")} className="p-3 bg-white rounded-full text-slate-500 shadow-sm mx-auto">
              <Volume2 size={32} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-child font-bold">Aprendizaje</h2>
          <p className="text-slate-500 mt-2">Divertirse y aprender paso a paso</p>
        </div>
        {recommendedActivity && (
          <div className="max-w-3xl mx-auto bg-lumi-soft-green border border-emerald-200 rounded-3xl px-6 py-4 text-center">
            <p className="text-emerald-800 font-bold text-lg">Actividad recomendada para hoy: {recommendedActivity}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {learningCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                speak(category.title);
                if (category.status === 'disponible' && category.sectionId) {
                  setActiveSection(category.sectionId);
                } else {
                  speak('Próximamente');
                }
              }}
              className={cn(
                "btn-child p-8 text-left border-2 transition-all",
                category.color,
                category.status === 'proximamente' && 'opacity-90'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <IconComponent name={category.icon} size={40} />
                </div>
                <span className={cn(
                  "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border bg-white",
                  category.status === 'disponible' ? 'text-emerald-700 border-emerald-200' : 'text-slate-500 border-slate-200'
                )}>
                  {category.status === 'disponible' ? 'Disponible' : 'Próximamente'}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-3xl font-child font-bold">{category.title}</h3>
                <p className="text-base font-medium opacity-80">{category.description}</p>
                <p className="text-sm font-bold uppercase tracking-wide opacity-70">{category.level}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {sections.filter((s) => s.id !== 'letras').map(s => (
            <button
              key={s.id}
              onClick={() => {
                speak(s.title);
                if (s.status === 'disponible') {
                  setActiveSection(s.id);
                } else {
                  speak('Próximamente');
                }
              }}
              className={cn(
                "btn-child py-8 flex flex-col items-center gap-4 opacity-70 hover:opacity-100",
                s.color,
                s.status === 'proximamente' && 'opacity-50'
              )}
            >
              <div className="bg-white p-5 rounded-[24px] shadow-sm">
                <IconComponent name={s.icon} size={40} />
              </div>
              <span className="text-2xl">{s.title}</span>
              <span className="text-xs font-bold uppercase tracking-widest">
                {s.status === 'disponible' ? 'Disponible' : 'Próximamente'}
              </span>
            </button>
          ))}
        </div>
    </div>
  );
};

// --- Module Router ---

export default function ChildModule() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Dynamic Sub-header for navigation back */}
      <Routes>
        <Route path="/" element={null} />
        <Route path="*" element={
          <button 
            onClick={() => navigate('/nino')}
            className="flex items-center gap-2 text-slate-400 hover:text-lumi-olive font-bold uppercase tracking-widest text-sm mb-6 transition-colors"
          >
            <ChevronLeft size={20} /> Volver al menú
          </button>
        } />
      </Routes>

      <Routes>
        <Route path="/" element={<ChildHome />} />
        <Route path="/rutina" element={<VisualRoutine />} />
        <Route path="/primero-despues" element={<FirstThen />} />
        <Route path="/emociones" element={<EmotionsBoard />} />
        <Route path="/necesito" element={<NeedsBoard />} />
        <Route path="/calma" element={<CalmZone />} />
        <Route path="/historias" element={<StoriesModule />} />
        <Route path="/juegos" element={<GamesModule />} />
        <Route path="/aprendizaje" element={<LearningModule />} />
        <Route path="/me-duele" element={<PainModule />} />
        <Route path="/cambio-planes" element={<PlanChangeModule />} />
        <Route path="/mis-logros" element={<AchievementsModule />} />
      </Routes>
    </div>
  );
}
