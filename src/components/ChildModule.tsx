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
import { initialRoutines, emotions, needs, socialStories, gameScenarios, emotionChallenges, routineSequences, RoutineItem } from '../data/mockData';
import { SettingsContext } from '../App';

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
  const menuItems = [
    { path: 'rutina', label: 'Mi Rutina', icon: 'Calendar', color: 'bg-orange-100 text-orange-600 border-orange-200' },
    { path: 'primero-despues', label: 'Primero / Después', icon: 'ArrowRightLeft', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { path: 'emociones', label: '¿Cómo me siento?', icon: 'Laugh', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    { path: 'necesito', label: '¿Qué necesito?', icon: 'MessageCircle', color: 'bg-green-100 text-green-600 border-green-200' },
    { path: 'calma', label: 'Zona de Calma', icon: 'Wind', color: 'bg-purple-100 text-purple-600 border-purple-200' },
    { path: 'historias', label: 'Historias', icon: 'BookOpen', color: 'bg-pink-100 text-pink-600 border-pink-200' },
    { path: 'juegos', label: 'Juegos', icon: 'Gamepad2', color: 'bg-cyan-100 text-cyan-600 border-cyan-200' },
    { path: 'aprendizaje', label: 'Aprendizaje', icon: 'GraduationCap', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-child font-bold text-slate-800">¡Hola! ¿Qué quieres hacer hoy?</h2>
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
  const [selected, setSelected] = useState<typeof emotions[0] | null>(null);
  const { speak } = useSpeech();

  useEffect(() => {
    if (selected) {
      speak(`Me siento ${selected.label}. ${selected.advice.join('. ')}`);
    }
  }, [selected, speak]);

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-child font-bold">¿Cómo te sientes hoy?</h2>
        <p className="text-slate-500">Toca una emoción para ver qué podemos hacer</p>
      </div>

      {!selected ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {emotions.map((emotion) => (
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
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("p-10 rounded-[40px] border-4 relative", selected.color)}
        >
          <button 
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <X size={32} />
          </button>
          
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="bg-white/80 p-8 rounded-[40px] shadow-sm">
               <IconComponent name={selected.icon} size={120} />
            </div>
            
            <div className="space-y-6 flex-1">
              <h3 className="text-5xl font-child font-bold">Me siento {selected.label}</h3>
              <div className="space-y-4">
                <p className="font-bold text-xl opacity-80 uppercase tracking-widest">Podemos intentar:</p>
                <div className="flex flex-wrap gap-3">
                  {selected.advice.map((item, idx) => (
                    <div key={idx} className="bg-white/50 px-6 py-3 rounded-2xl font-bold text-lg border border-black/5">
                      {item}
                    </div>
                  ))}
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

  const handleSpeak = (phrase: string) => {
    setActivePhrase(phrase);
    // In a real app, browser speech synthesis would be used here
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {needs.map((need) => (
            <button
              key={need.id}
              onClick={() => handleSpeak(need.phrase)}
              className="btn-child flex flex-col gap-6 py-12 bg-white border-slate-100 text-slate-800 hover:border-emerald-300 hover:bg-emerald-50"
            >
              <div className="bg-slate-50 p-6 rounded-[32px] text-emerald-600">
                <IconComponent name={need.icon} size={64} />
              </div>
              <span className="text-3xl">{need.label}</span>
            </button>
          ))}
        </div>
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
  
  const sections = [
    { id: 'letras', title: 'Letras y Vocales', icon: 'SquareDashed', color: 'bg-indigo-100 text-indigo-600' },
    { id: 'numeros', title: 'Números', icon: 'Hash', color: 'bg-amber-100 text-amber-600' },
    { id: 'operaciones', title: 'Sumas y Restas', icon: 'Plus', color: 'bg-rose-100 text-rose-600' },
  ];

  if (activeSection === 'letras') {
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-4xl font-child font-bold">Vocales</h3>
          <p className="text-slate-500 mt-2">Toca las letras para escucharlas</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 max-w-4xl mx-auto">
          {vowels.map(v => (
            <button
              key={v}
              onClick={() => speak(v)}
              className="btn-child py-12 text-6xl font-black bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-50"
            >
              {v}
            </button>
          ))}
        </div>
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
        <p className="text-slate-500 mt-2">Divertirse y aprender juntos</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => { speak(s.title); setActiveSection(s.id); }}
            className={cn(
              "btn-child py-16 flex flex-col items-center gap-6",
              s.color
            )}
          >
            <div className="bg-white p-6 rounded-[32px] shadow-sm">
              <IconComponent name={s.icon} size={64} />
            </div>
            <span className="text-3xl">{s.title}</span>
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
      </Routes>
    </div>
  );
}
