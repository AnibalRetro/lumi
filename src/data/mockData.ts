/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RoutineItem {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  timeOfDay: 'mañana' | 'tarde' | 'noche';
}

export interface Emotion {
  id: string;
  label: string;
  icon: string;
  color: string;
  advice: string[];
}

export interface Need {
  id: string;
  label: string;
  icon: string;
  phrase: string;
}

export interface SocialStory {
  id: string;
  title: string;
  description: string;
  cards: { text: string; image?: string }[];
}

export interface Clinic {
  id: string;
  name: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  services: string[];
  notes: string;
}

export const initialRoutines: RoutineItem[] = [
  { id: '1', name: 'Despertar', icon: 'Sun', completed: false, timeOfDay: 'mañana' },
  { id: '2', name: 'Ir al baño', icon: 'Bath', completed: false, timeOfDay: 'mañana' },
  { id: '3', name: 'Lavarse los dientes', icon: 'Smile', completed: false, timeOfDay: 'mañana' },
  { id: '4', name: 'Desayunar', icon: 'Coffee', completed: false, timeOfDay: 'mañana' },
  { id: '5', name: 'Ir a la escuela', icon: 'School', completed: false, timeOfDay: 'mañana' },
  { id: '6', name: 'Comer', icon: 'Utensils', completed: false, timeOfDay: 'tarde' },
  { id: '7', name: 'Jugar', icon: 'Gamepad2', completed: false, timeOfDay: 'tarde' },
  { id: '8', name: 'Bañarse', icon: 'ShowerHead', completed: false, timeOfDay: 'noche' },
  { id: '9', name: 'Pijama', icon: 'Shirt', completed: false, timeOfDay: 'noche' },
  { id: '10', name: 'Dormir', icon: 'Moon', completed: false, timeOfDay: 'noche' },
];

export const emotions: Emotion[] = [
  { 
    id: 'happy', 
    label: 'Feliz', 
    icon: 'Smile', 
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    advice: ['¡Qué bien!', 'Disfruta este momento', 'Comparte tu alegría']
  },
  { 
    id: 'sad', 
    label: 'Triste', 
    icon: 'Frown', 
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    advice: ['Está bien estar triste', 'Pide un abrazo', 'Escucha música tranquila']
  },
  { 
    id: 'angry', 
    label: 'Enojado', 
    icon: 'Angry', 
    color: 'bg-red-100 border-red-300 text-red-700',
    advice: ['Respira profundo', 'Cuenta hasta 10', 'Usa tus audífonos']
  },
  { 
    id: 'scared', 
    label: 'Con miedo', 
    icon: 'Ghost', 
    color: 'bg-purple-100 border-purple-300 text-purple-700',
    advice: ['Busca a mamá o papá', 'Recuerda que estás seguro', 'Toma tu peluche']
  },
  { 
    id: 'tired', 
    label: 'Cansado', 
    icon: 'ZapOff', 
    color: 'bg-gray-100 border-gray-300 text-gray-700',
    advice: ['Cierra los ojos un momento', 'Bebe un poco de agua', 'Descansa en el sofá']
  },
];

export const needs: Need[] = [
  { id: 'water', label: 'Agua', icon: 'Droplets', phrase: 'Necesito agua' },
  { id: 'food', label: 'Comida', icon: 'Apple', phrase: 'Tengo hambre' },
  { id: 'bathroom', label: 'Baño', icon: 'Bath', phrase: 'Necesito ir al baño' },
  { id: 'help', label: 'Ayuda', icon: 'HelpingHand', phrase: 'Necesito ayuda' },
  { id: 'rest', label: 'Descansar', icon: 'Bed', phrase: 'Quiero descansar' },
  { id: 'silence', label: 'Silencio', icon: 'VolumeX', phrase: 'Mucho ruido' },
];

export const socialStories: SocialStory[] = [
  {
    id: 'doctor',
    title: 'Voy al doctor',
    description: 'Preparándonos para la visita médica',
    cards: [
      { text: 'Hoy voy al doctor.' },
      { text: 'Puede haber personas esperando en la sala.' },
      { text: 'El doctor me revisará para ver que esté sano.' },
      { text: 'Puedo usar mis audífonos si hay ruido.' },
      { text: 'Mamá o papá estarán conmigo siempre.' },
      { text: 'Al terminar, volveremos a casa.' },
    ]
  },
  {
    id: 'haircut',
    title: 'Me corto el cabello',
    description: 'Una visita a la peluquería',
    cards: [
      { text: 'Hoy iré a que corten mi cabello.' },
      { text: 'Usaré una capa para no ensuciar mi ropa.' },
      { text: 'Sentiré las tijeras o la máquina cerca.' },
      { text: 'Debo intentar estar muy quietecito.' },
      { text: '¡Me veré muy bien al terminar!' },
    ]
  }
];

export interface GameScenario {
  id: string;
  situation: string;
  options: { label: string; icon: string; isCorrect: boolean }[];
}

export const gameScenarios: GameScenario[] = [
  {
    id: 'thirst',
    situation: 'Si tengo mucha sed...',
    options: [
      { label: 'Pido agua', icon: 'Droplets', isCorrect: true },
      { label: 'Me escondo', icon: 'Ghost', isCorrect: false },
      { label: 'Grito fuerte', icon: 'Megaphone', isCorrect: false },
    ]
  },
  {
    id: 'anger',
    situation: 'Si me siento enojado...',
    options: [
      { label: 'Respiro profundo', icon: 'Wind', isCorrect: true },
      { label: 'Rompo algo', icon: 'Hammer', isCorrect: false },
      { label: 'Empujo a alguien', icon: 'Hand', isCorrect: false },
    ]
  },
  {
    id: 'noise',
    situation: 'Si hay mucho ruido...',
    options: [
      { label: 'Me tapo los oídos', icon: 'EarOff', isCorrect: true },
      { label: 'Corro a la calle', icon: 'MoveRight', isCorrect: false },
      { label: 'Pido dulces', icon: 'Candy', isCorrect: false },
    ]
  },
  {
    id: 'play',
    situation: 'Si quiero jugar con alguien...',
    options: [
      { label: 'Pregunto: ¿puedo jugar?', icon: 'MessageCircle', isCorrect: true },
      { label: 'Le quito su juguete', icon: 'Hand', isCorrect: false },
      { label: 'Me pongo a llorar', icon: 'Frown', isCorrect: false },
    ]
  },
  {
    id: 'pain',
    situation: 'Si me duele algo...',
    options: [
      { label: 'Le digo a un adulto', icon: 'UserRound', isCorrect: true },
      { label: 'Me guardo el secreto', icon: 'Lock', isCorrect: false },
      { label: 'Sigo jugando como si nada', icon: 'Gamepad2', isCorrect: false },
    ]
  },
  {
    id: 'lose',
    situation: 'Si pierdo en un juego...',
    options: [
      { label: 'Digo "buen juego"', icon: 'Handshake', isCorrect: true },
      { label: 'Aviento los juguetes', icon: 'Unplug', isCorrect: false },
      { label: 'Grito muy fuerte', icon: 'Megaphone', isCorrect: false },
    ]
  },
  {
    id: 'sick',
    situation: 'Si me siento enfermo...',
    options: [
      { label: 'Le digo a un adulto', icon: 'UserRound', isCorrect: true },
      { label: 'Descanso en mi cama', icon: 'Bed', isCorrect: true },
      { label: 'Tomo agua', icon: 'Droplets', isCorrect: true },
    ]
  }
];

export interface EmotionChallenge {
  id: string;
  icon: string;
  correctEmotion: string;
}

export const emotionChallenges: EmotionChallenge[] = [
  { id: '1', icon: 'Smile', correctEmotion: 'Feliz' },
  { id: '2', icon: 'Frown', correctEmotion: 'Triste' },
  { id: '3', icon: 'Angry', correctEmotion: 'Enojado' },
  { id: '4', icon: 'Ghost', correctEmotion: 'Con miedo' },
  { id: '5', icon: 'ZapOff', correctEmotion: 'Cansado' },
];

export interface RoutineSequence {
  id: string;
  title: string;
  steps: { id: string; label: string; icon: string }[];
}

export interface LearningCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  level: string;
  status: 'disponible' | 'proximamente';
  sectionId?: 'letras' | 'numeros' | 'operaciones' | 'formas-colores' | 'memoria-atencion';
}

export const learningCategories: LearningCategory[] = [
  {
    id: 'letras-lectura',
    title: 'Letras y lectura',
    description: 'Reconoce vocales y primeras palabras.',
    icon: 'BookOpen',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    level: 'Nivel sugerido: Inicial (4+)',
    status: 'disponible',
    sectionId: 'letras',
  },
  {
    id: 'numeros-matematicas',
    title: 'Números y matemáticas',
    description: 'Conteo básico y reconocimiento de números.',
    icon: 'Hash',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    level: 'Nivel sugerido: Inicial (4+)',
    status: 'disponible',
    sectionId: 'numeros',
  },
  {
    id: 'formas-colores',
    title: 'Formas y colores',
    description: 'Identifica figuras y colores cotidianos.',
    icon: 'Palette',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    level: 'Nivel sugerido: Inicial (4-6)',
    status: 'disponible',
    sectionId: 'formas-colores',
  },
  {
    id: 'memoria-atencion',
    title: 'Memoria y atención',
    description: 'Actividades breves para enfocar y recordar.',
    icon: 'Brain',
    color: 'bg-rose-100 text-rose-700 border-rose-200',
    level: 'Nivel sugerido: Intermedio (5+)',
    status: 'disponible',
    sectionId: 'memoria-atencion',
  },
];

export const routineSequences: RoutineSequence[] = [
  {
    id: 'brush-teeth',
    title: 'Lavar los dientes',
    steps: [
      { id: '1', label: 'Pasta', icon: 'Smile' },
      { id: '2', label: 'Cepillo', icon: 'Hand' },
      { id: '3', label: 'Agua', icon: 'Droplets' },
    ]
  },
  {
    id: 'wash-hands',
    title: 'Lavar las manos',
    steps: [
      { id: '1', label: 'Jabón', icon: 'Sparkles' },
      { id: '2', label: 'Agua', icon: 'Droplets' },
      { id: '3', label: 'Toalla', icon: 'Wind' },
    ]
  }
];

export const clinics: Clinic[] = [
  {
    id: '1',
    name: 'Centro de Autismo Teletón',
    city: 'Ecatepec',
    state: 'Estado de México',
    phone: '55 5836 4500',
    website: 'https://teleton.org',
    services: ['Diagnóstico', 'Terapia de lenguaje', 'Integración sensorial'],
    notes: 'Requiere valoración previa.'
  },
  {
    id: '2',
    name: 'Clínica Mexicana de Autismo (CLIMA)',
    city: 'CDMX',
    state: 'Ciudad de México',
    phone: '55 5523 4900',
    website: 'https://clima.org.mx',
    services: ['Evaluación', 'Capacitación a padres', 'Modelo educativo'],
    notes: 'Institución líder en México.'
  },
  {
    id: '3',
    name: 'Instituto Domus',
    city: 'CDMX',
    state: 'Ciudad de México',
    phone: '55 5573 8025',
    website: 'https://autismo.org.mx',
    services: ['Escuela especializada', 'Terapia individual'],
    notes: 'Dedicada a la atención integral del autismo.'
  }
];
