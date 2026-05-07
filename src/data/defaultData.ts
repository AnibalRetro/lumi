import { AppData } from '../types';

export const defaultData: AppData = {
  profile: { nickname: 'Peque', age: '7', favoriteTheme: '#dbeafe', favoriteThing: 'Dinosaurio', readingLevel: 'Reconoce letras', supportStyle: 'Imágenes + texto', sensitivities: ['Ruido','Cambios de rutina'], helpfulStrategies: ['Respirar','Tomar agua','Silencio'] },
  accessibility: { lowStimulus: false, soundEnabled: true, voiceEnabled: false, textSize: 'normal', movement: 'normal', contrast: 'suave', showTextWithImages: true, imagesOnly: false },
  routines: [
    { id: 'r1', name: 'Rutina mañana', tag: 'mañana', activities: ['Despertar','Ir al baño','Lavarse los dientes','Vestirse','Desayunar','Preparar mochila','Ir a la escuela'].map((n,i)=>({id:`r1-${i}`,name:n,icon:'Sun',description:n,status:'pendiente'})) },
    { id: 'r2', name: 'Rutina noche', tag: 'noche', activities: ['Guardar juguetes','Bañarse','Ponerse pijama','Cenar','Lavarse los dientes','Leer cuento','Dormir'].map((n,i)=>({id:`r2-${i}`,name:n,icon:'Moon',description:n,status:'pendiente'})) },
    { id: 'r3', name: 'Rutina escuela', tag: 'escuela', activities: ['Entrar al salón','Saludar','Sentarme','Escuchar instrucciones','Hacer actividad','Guardar materiales','Salir con calma'].map((n,i)=>({id:`r3-${i}`,name:n,icon:'School',description:n,status:'pendiente'})) },
    { id: 'r4', name: 'Rutina fin de semana', tag: 'fin de semana', activities: ['Desayuno tranquilo','Juego libre','Visita familiar','Descanso'].map((n,i)=>({id:`r4-${i}`,name:n,icon:'PartyPopper',description:n,status:'pendiente'})) },
  ],
  needs: [
    ['Agua','Necesidades básicas','Droplets','Necesito agua.'],['Comida','Necesidades básicas','Apple','Necesito comida.'],['Baño','Necesidades básicas','Bath','Necesito ir al baño.'],['Descanso','Necesidades básicas','Bed','Quiero descansar.'],
    ['Silencio','Sensorial','VolumeX','Necesito silencio.'],['Audífonos','Sensorial','Headphones','Quiero audífonos.'],['Lugar tranquilo','Sensorial','Home','Quiero un lugar tranquilo.'],
    ['Mamá','Social','User','Necesito a mamá.'],['Papá','Social','UserRound','Necesito a papá.'],['Ayuda','Social','HelpingHand','Necesito ayuda.'],['Estar solo','Social','Moon','Quiero estar solo.'],
    ['No entiendo','Escuela / aprendizaje','CircleHelp','No entiendo.'],['Repite por favor','Escuela / aprendizaje','Repeat','Repite por favor.'],['Terminé','Escuela / aprendizaje','Check','Terminé.'],['Necesito pausa','Escuela / aprendizaje','Pause','Necesito pausa.']
  ].map((n,i)=>({id:`n${i}` as string,name:n[0] as string,category:n[1] as string,icon:n[2] as string,phrase:n[3] as string,active:true})),
  emotions: [
    {id:'feliz',name:'Feliz',icon:'Smile',color:'bg-yellow-100',strategies:['Compartir alegría','Seguir jugando']},
    {id:'triste',name:'Triste',icon:'Frown',color:'bg-blue-100',strategies:['Abrazo','Hablar con alguien','Descansar']},
    {id:'enojado',name:'Enojado',icon:'Angry',color:'bg-red-100',strategies:['Respirar','Tomar agua','Lugar tranquilo']},
    {id:'asustado',name:'Asustado',icon:'ShieldAlert',color:'bg-purple-100',strategies:['Buscar a mamá/papá','Respirar']},
    {id:'nose',name:'No sé',icon:'CircleHelp',color:'bg-gray-100',strategies:['Pedir ayuda','Descansar']}
  ],
  painAreas: ['Cabeza','Ojos','Oído','Boca','Garganta','Dientes','Panza','Espalda','Brazo','Mano','Pierna','Pie','Todo el cuerpo','No sé'].map((n,i)=>({id:`p${i}`,name:n,icon:'CircleDot',basePhrase:`Me duele ${n.toLowerCase()}`})),
  painLogs: [],
  changePlans: [
    {id:'c1',before:'Parque',now:'Casa',same:'Mamá está contigo',canDo:'Respirar y elegir otra actividad',icon:'Trees',calmMessage:'Está bien, te acompaño.',active:true},
    {id:'c2',before:'Hoy hay clases',now:'Hoy no hay clases',same:'Seguimos juntos',canDo:'Tomar agua y planear actividad',icon:'School',calmMessage:'Podemos hacer otro plan.'}
  ],
  triggerLogs: [],
  progress: { routinesCompleted:0, emotionsLogged:0, needsUsed:0, calmZoneUsed:0, painReports:0, planChangesViewed:0, achievements:[] },
  lastModule: 'inicio'
};
