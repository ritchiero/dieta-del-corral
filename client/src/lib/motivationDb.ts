// Base de datos de "Hard Truths" para el Coach
// Categorizadas para futura expansión, aunque por ahora se usarán aleatoriamente sin repetición.

export const hardTruths = [
  "Nadie va a venir a salvarte. Eres tú contra ti.",
  "Tu mente está diseñada para mantenerte vivo, no para hacerte grande. Ignórala.",
  "El dolor de la disciplina pesa onzas. El dolor del arrepentimiento pesa toneladas.",
  "No negocies contigo mismo. La negociación es el principio de la derrota.",
  "Tus sentimientos son irrelevantes. Tus acciones son lo único que cuenta.",
  "Si fuera fácil, cualquier mediocre lo haría. Tú no eres mediocre.",
  "La comodidad es una droga. Y tú estás en rehabilitación.",
  "No te detengas cuando estés cansado. Detente cuando hayas terminado.",
  "Tu 'yo' del futuro te está mirando con vergüenza o con orgullo. Tú decides.",
  "Una excusa es una mentira bien vestida que te cuentas a ti mismo.",
  "El hambre que sientes es la grasa muriendo. Déjala morir.",
  "No tienes que querer hacerlo. Tienes que hacerlo.",
  "La motivación es para aficionados. La disciplina es para profesionales.",
  "Cada vez que dices 'no puedo', estás eligiendo fallar.",
  "El éxito es alquilado, y la renta se paga todos los días.",
  "No eres especial. Trabaja más duro.",
  "Cállate la boca y ponte a trabajar.",
  "¿Estás cansado? Qué pena. Sigue.",
  "La vida no te debe nada. Levántate y gánatelo.",
  "El único día fácil fue ayer.",
  "No busques atajos. Busca el camino difícil, ahí no hay tráfico.",
  "Tu cuerpo puede aguantar casi cualquier cosa. Es tu mente a la que tienes que convencer.",
  "El sufrimiento es el precio de la entrada a la grandeza.",
  "No cuentes los días. Haz que los días cuenten.",
  "Si te rindes ahora, ¿para qué empezaste?",
  "La disciplina es hacer lo que odias hacer, pero hacerlo como si lo amaras.",
  "No esperes a 'sentirte bien' para actuar. Actúa para sentirte bien.",
  "El fracaso no es caerse. El fracaso es quedarse tirado.",
  "Tu cama caliente es la primera prueba del día. Gánala.",
  "Comer basura te hace sentir basura. Respétate.",
  "No eres un perro para premiarte con comida.",
  "La fuerza de voluntad es un músculo. El tuyo está flácido. Entrénalo.",
  "Deja de llorar y empieza a sudar.",
  "El mundo no se detiene por tus excusas.",
  "Sé la persona que dijiste que ibas a ser.",
  "Controla tu mente o ella te controlará a ti.",
  "La mediocridad es una enfermedad contagiosa. Aléjate de ella.",
  "No hay gloria en la comodidad.",
  "Sufre ahora y vive el resto de tu vida como un campeón.",
  "Tu potencial está al otro lado de tu miedo.",
  "No te traiciones a ti mismo por un momento de placer.",
  "Mantén el estándar. No bajes la barra.",
  "Eres el arquitecto de tu propio destino. Deja de construir ruinas.",
  "La duda mata más sueños que el fracaso.",
  "Hazlo con miedo, pero hazlo.",
  "No necesitas más tiempo, necesitas más enfoque.",
  "La consistencia es la clave. La intensidad es el adorno.",
  "No seas víctima de tus circunstancias. Sé dueño de tus decisiones.",
  "El respeto se gana, no se regala. Gánate tu propio respeto.",
  "Hoy es un buen día para morir... de esfuerzo."
];

const STORAGE_KEY = 'manus_motivation_history';

export function getUniqueMotivation(): string {
  // Recuperar historial de frases mostradas
  const historyJson = localStorage.getItem(STORAGE_KEY);
  let history: string[] = historyJson ? JSON.parse(historyJson) : [];

  // Filtrar frases disponibles (las que no están en el historial)
  const available = hardTruths.filter(phrase => !history.includes(phrase));

  // Si se acabaron las frases, reiniciar el historial (pero mantener la última para no repetirla inmediatamente)
  if (available.length === 0) {
    const lastShown = history[history.length - 1];
    history = [lastShown]; // Mantener solo la última para evitar repetición inmediata
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    // Recalcular disponibles (todas menos la última)
    const resetAvailable = hardTruths.filter(phrase => phrase !== lastShown);
    const randomIndex = Math.floor(Math.random() * resetAvailable.length);
    const newPhrase = resetAvailable[randomIndex];
    
    // Guardar la nueva en el historial reiniciado
    history.push(newPhrase);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    
    return newPhrase;
  }

  // Seleccionar una frase aleatoria de las disponibles
  const randomIndex = Math.floor(Math.random() * available.length);
  const selectedPhrase = available[randomIndex];

  // Agregar al historial
  history.push(selectedPhrase);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

  return selectedPhrase;
}
