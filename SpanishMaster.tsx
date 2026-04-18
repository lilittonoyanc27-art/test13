import React, { useState, useEffect } from 'react';
import { Layers, Venus, Mars, Star, RotateCcw, ChevronRight, CheckCircle2, XCircle, Info, LayoutTemplate, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

// --- Types & Data ---

type GameMode = 'singular-plural' | 'gender';

interface Task {
  word: string;
  translation: string;
  options: string[];
  answer: string;
}

const SINGULAR_PLURAL_TASKS: Task[] = [
  { word: "la casa", translation: "տուն", options: ["las casa", "las casas", "los casas"], answer: "las casas" },
  { word: "el libro", translation: "գիրք", options: ["los libros", "las libros", "el libros"], answer: "los libros" },
  { word: "la flor", translation: "ծաղիկ", options: ["las flors", "las flores", "los flores"], answer: "las flores" },
  { word: "el lápiz", translation: "մատիտ", options: ["los lápizes", "los lápices", "las lápices"], answer: "los lápices" },
  { word: "el rey", translation: "թագավոր", options: ["los reyes", "los reys", "las reyes"], answer: "los reyes" },
  { word: "la luz", translation: "լույս", options: ["las luzes", "las luces", "los luces"], answer: "las luces" },
  { word: "el árbol", translation: "ծառ", options: ["los árbols", "los árboles", "las árboles"], answer: "los árboles" },
  { word: "el mes", translation: "ամիս", options: ["los meses", "los mess", "las meses"], answer: "los meses" },
  { word: "la ciudad", translation: "քաղաք", options: ["las ciudads", "las ciudades", "los ciudades"], answer: "las ciudades" },
  { word: "el camión", translation: "բեռնատար", options: ["los camións", "los camiones", "los caminones"], answer: "los camiones" },
  { word: "la mujer", translation: "կին", options: ["las mujers", "las mujeres", "las mujer"], answer: "las mujeres" },
  { word: "el papel", translation: "թուղթ", options: ["los papels", "los papeles", "las papeles"], answer: "los papeles" },
  { word: "la canción", translation: "երգ", options: ["las cancións", "las canciones", "los canciones"], answer: "las canciones" },
  { word: "el ordenador", translation: "համակարգիչ", options: ["los ordenadors", "los ordenadores", "los ordenador"], answer: "los ordenadores" },
  { word: "la clase", translation: "դաս", options: ["las clases", "las clasis", "los clases"], answer: "las clases" },
  { word: "el chico", translation: "տղա", options: ["los chicos", "los chicas", "las chicos"], answer: "los chicos" },
  { word: "la mano", translation: "ձեռք", options: ["las manos", "los manos", "las manes"], answer: "las manos" },
  { word: "el problema", translation: "խնդիր", options: ["los problemas", "las problemas", "los problemes"], answer: "los problemas" },
  { word: "el pie", translation: "ոտք", options: ["los pies", "los pez", "las pies"], answer: "los pies" },
  { word: "la noche", translation: "գիշեր", options: ["las noches", "las nochis", "los noches"], answer: "las noches" }
];

const GENDER_TASKS: Task[] = [
  { word: "Perro", translation: "շուն", options: ["el", "la"], answer: "el" },
  { word: "Mesa", translation: "սեղան", options: ["el", "la"], answer: "la" },
  { word: "Día", translation: "օր", options: ["el", "la"], answer: "el" },
  { word: "Mapa", translation: "քարտեզ", options: ["el", "la"], answer: "el" },
  { word: "Mano", translation: "ձեռք", options: ["el", "la"], answer: "la" },
  { word: "Radio", translation: "ռադիո", options: ["el", "la"], answer: "la" },
  { word: "Sofá", translation: "բազմոց", options: ["el", "la"], answer: "el" },
  { word: "Lección", translation: "դաս", options: ["el", "la"], answer: "la" },
  { word: "Ciudad", translation: "քաղաք", options: ["el", "la"], answer: "la" },
  { word: "Agua", translation: "ջուր", options: ["el", "la"], answer: "el" }, // Grammatically masculine el agua (feminine word)
  { word: "Foto", translation: "լուսանկար", options: ["el", "la"], answer: "la" },
  { word: "Idioma", translation: "լեզու", options: ["el", "la"], answer: "el" },
  { word: "Tarea", translation: "առաջադրանք", options: ["el", "la"], answer: "la" },
  { word: "Planeta", translation: "մոլորակ", options: ["el", "la"], answer: "el" },
  { word: "Mar", translation: "ծով", options: ["el", "la"], answer: "el" },
  { word: "Libertad", translation: "ազատություն", options: ["el", "la"], answer: "la" },
  { word: "Clima", translation: "կլիմա", options: ["el", "la"], answer: "el" },
  { word: "Noche", translation: "գիշեր", options: ["el", "la"], answer: "la" },
  { word: "Ojo", translation: "աչք", options: ["el", "la"], answer: "el" },
  { word: "Playa", translation: "լողափ", options: ["el", "la"], answer: "la" }
];

// --- Sub-components ---

const TaskCard = ({ task, onAnswer, feedback, mode }: { task: Task, onAnswer: (opt: string) => void, feedback: 'correct' | 'wrong' | null, mode: GameMode }) => (
  <motion.div 
    key={task.word}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.1 }}
    className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-16 text-center space-y-12 shadow-2xl relative overflow-hidden backdrop-blur-sm"
  >
     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
     
     <div className="space-y-4">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 italic">
          {mode === 'singular-plural' ? 'Գտիր հոգնակի ձևը' : 'Գտիր հոդը (el/la)'}
        </p>
        <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white">
          {task.word}
        </h2>
        <p className="text-xl font-bold italic text-slate-600">({task.translation})</p>
     </div>

     <div className="flex flex-wrap gap-4 justify-center">
        {task.options.map(opt => (
          <button 
            key={opt}
            onClick={() => onAnswer(opt)}
            disabled={!!feedback}
            className={`px-8 py-5 bg-slate-950 border-4 border-slate-800 rounded-3xl font-black text-2xl md:text-3xl uppercase tracking-tighter transition-all hover:scale-105 active:scale-95 ${
              feedback === 'correct' && opt === task.answer ? 'border-emerald-500 text-emerald-500' :
              feedback === 'wrong' && opt !== task.answer ? 'opacity-30' :
              'hover:border-sky-500'
            }`}
          >
            {opt}
          </button>
        ))}
     </div>

     {/* Feedback */}
     <AnimatePresence>
       {feedback && (
         <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className={`absolute inset-0 flex flex-col items-center justify-center p-12 backdrop-blur-xl z-20 ${feedback === 'correct' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}
         >
            {feedback === 'correct' ? <CheckCircle2 size={100} className="text-emerald-500 mb-6" /> : <XCircle size={100} className="text-rose-500 mb-6" />}
            <div className={`text-5xl font-black uppercase italic tracking-tighter ${feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {feedback === 'correct' ? 'Ճիշտ է!' : 'Սխալ է!'}
            </div>
         </motion.div>
       )}
     </AnimatePresence>
  </motion.div>
);

// --- Main App ---

export default function SpanishMaster() {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);

  const tasks = mode === 'singular-plural' ? SINGULAR_PLURAL_TASKS : GENDER_TASKS;

  const handleAnswer = (option: string) => {
    const isCorrect = option === tasks[currentIdx].answer;
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 10);
      setTimeout(nextTask, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const nextTask = () => {
    setFeedback(null);
    if (currentIdx + 1 < tasks.length) {
      setCurrentIdx(i => i + 1);
    } else {
      setFinished(true);
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
    }
  };

  const reset = () => {
    setMode(null);
    setCurrentIdx(0);
    setScore(0);
    setFinished(false);
  };

  if (!mode) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center space-y-12">
        <div className="space-y-4">
           <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">
             Spanish <span className="text-sky-500">Master</span>
           </h1>
           <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-sm">Ընտրեք խաղի տեսակը</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
           <button 
             onClick={() => setMode('singular-plural')}
             className="group relative p-12 bg-slate-900 border-2 border-slate-800 rounded-[3rem] overflow-hidden transition-all hover:border-sky-500 hover:scale-105"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-sky-500/20 transition-all" />
              <Layers size={64} className="text-sky-500 mb-6 mx-auto" />
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Հոգնակի թիվ</h3>
              <p className="text-slate-500 text-sm font-bold uppercase italic">Singular to Plural</p>
           </button>

           <button 
             onClick={() => setMode('gender')}
             className="group relative p-12 bg-slate-900 border-2 border-slate-800 rounded-[3rem] overflow-hidden transition-all hover:border-rose-500 hover:scale-105"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-rose-500/20 transition-all" />
              <div className="flex justify-center gap-4 mb-6">
                <Mars size={48} className="text-sky-400" />
                <Venus size={48} className="text-rose-400" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Արական թե Իգական</h3>
              <p className="text-slate-500 text-sm font-bold uppercase italic">El o La</p>
           </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center space-y-12">
        <Trophy size={160} className="text-yellow-400 animate-bounce" />
        <div className="space-y-4">
           <h1 className="text-7xl font-black uppercase italic tracking-tighter">Ավարտ!</h1>
           <div className="text-4xl font-black italic text-sky-400">Քո միավորները: {score}</div>
        </div>
        <button 
          onClick={reset}
          className="flex items-center gap-4 px-12 py-6 bg-slate-900 border-2 border-slate-800 rounded-full font-black text-xl uppercase tracking-widest hover:border-sky-500 transition-all"
        >
          <RotateCcw /> Մենյու
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8 flex flex-col items-center">
       <div className="max-w-4xl w-full flex-1 flex flex-col justify-center space-y-12">
          
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
                <button 
                  onClick={reset}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:border-sky-500 transition-all"
                >
                  <LayoutTemplate size={20} />
                </button>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Ռեժիմ</p>
                   <p className="text-sm font-black text-sky-500 uppercase italic">{mode === 'singular-plural' ? 'Singular/Plural' : 'Gender (El/La)'}</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Միավորներ</p>
                <p className="text-3xl font-black italic text-white leading-none">{score}</p>
             </div>
          </div>

          <AnimatePresence mode="wait">
            <TaskCard 
              mode={mode}
              task={tasks[currentIdx]} 
              onAnswer={handleAnswer} 
              feedback={feedback} 
            />
          </AnimatePresence>

          <div className="flex justify-center items-center gap-2">
             <Star size={14} className="text-yellow-500" />
             <div className="w-64 h-2 bg-slate-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIdx + 1) / tasks.length) * 100}%` }}
                  className="h-full bg-sky-500"
                />
             </div>
             <span className="text-xs font-black uppercase tracking-widest text-slate-500 italic ml-4">Քայլ {currentIdx + 1} / {tasks.length}</span>
          </div>
       </div>
    </div>
  );
}
