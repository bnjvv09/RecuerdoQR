import { Experiencia } from '@/lib/bd';

export const EXPERIENCIAS_EJEMPLO: Record<string, Experiencia> = {
  anniversary: {
    id: 'demo-anniversary-id',
    slug: 'ejemplo-aniversario',
    title: 'Nuestra Vida Juntos ❤️',
    partner_name: 'María',
    user_name: 'Carlos',
    special_date: '2020-04-14',
    theme: 'anniversary',
    message: 'Cada segundo a tu lado me confirma que tomar tu mano fue la mejor decisión de mi vida. Eres mi hogar, mi paz y mi mayor alegría. Feliz aniversario, mi amor.',
    history_text: 'Nos conocimos en una cafetería un día de lluvia. Desde esa primera charla supe que nuestras almas estaban destinadas a caminar juntas.',
    song_url: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
    config: { 
      photoStyle: 'polaroid',
      customColors: { primary: '#a21232', bg: '#fffcfd', text: '#111827' }
    },
    created_at: new Date().toISOString(),
    photos: [
      { id: 'an-1', experience_id: 'demo-anniversary-id', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop', caption: 'Donde todo comenzó', order_index: 0 },
      { id: 'an-2', experience_id: 'demo-anniversary-id', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop', caption: 'Nuestro viaje al sur', order_index: 1 },
      { id: 'an-3', experience_id: 'demo-anniversary-id', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop', caption: 'Una cita inolvidable', order_index: 2 },
      { id: 'an-4', experience_id: 'demo-anniversary-id', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop', caption: 'Brindando por nuestro amor', order_index: 3 }
    ],
    milestones: [
      { id: 'm-an-1', experience_id: 'demo-anniversary-id', title: 'El Primer Beso', date: '2020-04-14', description: 'Bajo las luces de la ciudad, sellamos el inicio de todo.', order_index: 0, image_url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop' },
      { id: 'm-an-2', experience_id: 'demo-anniversary-id', title: 'Nuestro Primer Viaje', date: '2021-02-10', description: 'Una escapada perfecta al mar donde reímos sin parar.', order_index: 1, image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop' }
    ]
  },

  birthday: {
    id: 'demo-birthday-id',
    slug: 'ejemplo-cumpleanos',
    title: '¡Feliz Cumpleaños, Mi Amor! 🎂',
    partner_name: 'Valentina',
    user_name: 'Mateo',
    special_date: '1998-09-24',
    theme: 'birthday',
    message: 'Hoy celebro el día en que nació la persona más hermosa del universo. ¡Pide un deseo con el alma, sopla las velas virtuales y que todos tus sueños se cumplan!',
    history_text: 'Verte crecer y cumplir metas es mi mayor orgullo. Que este nuevo año de vida venga repleto de risas, viajes y momentos mágicos juntos.',
    song_url: 'https://www.youtube.com/watch?v=yP9vWj7R0xI',
    config: { 
      photoStyle: 'collage',
      customColors: { primary: '#ec4899', bg: '#fdf2f8', text: '#1f2937' }
    },
    created_at: new Date().toISOString(),
    photos: [
      { id: 'bd-1', experience_id: 'demo-birthday-id', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop', caption: 'Tu sonrisa ilumina todo', order_index: 0 },
      { id: 'bd-2', experience_id: 'demo-birthday-id', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop', caption: 'Celebrando con alegría', order_index: 1 },
      { id: 'bd-3', experience_id: 'demo-birthday-id', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop', caption: '¡Felicidades siempre!', order_index: 2 }
    ],
    milestones: []
  },

  'dating-proposal': {
    id: 'demo-dating-id',
    slug: 'ejemplo-noviazgo',
    title: 'Tengo una Pregunta Especial... 💌',
    partner_name: 'Camila',
    user_name: 'Sebastián',
    special_date: '2024-02-14',
    theme: 'dating-proposal',
    message: 'Desde el primer día que salimos, mi corazón supo que no quería volver a soltarte. Hoy quiero hacer oficial lo que los dos sentimos.',
    history_text: 'Nuestras charlas hasta la madrugada, los cafés compartidos y cada risa cómplice me confirmaron que eres la persona indicada.',
    song_url: 'https://www.youtube.com/watch?v=1fT2aB6FzFw',
    config: { 
      proposalQuestion: '¿Quieres ser mi novia oficialmente? ❤️',
      proposalYesText: '¡Sí, Acepto! ❤️',
      proposalCelebrationText: '¡Nuestra historia oficial comienza hoy! Prometo hacerte muy feliz.',
      photoStyle: 'polaroid',
      customColors: { primary: '#ec4899', bg: '#fff5f7', text: '#1f2937' }
    },
    created_at: new Date().toISOString(),
    photos: [
      { id: 'dp-1', experience_id: 'demo-dating-id', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop', caption: 'Nuestra primera salida', order_index: 0 },
      { id: 'dp-2', experience_id: 'demo-dating-id', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop', caption: 'Tus ojos hermosos', order_index: 1 },
      { id: 'dp-3', experience_id: 'demo-dating-id', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop', caption: 'Juntos es mejor', order_index: 2 }
    ],
    milestones: []
  },

  'marriage-proposal': {
    id: 'demo-marriage-id',
    slug: 'ejemplo-matrimonio',
    title: 'Una Promesa para Toda la Vida 💍',
    partner_name: 'Daniela',
    user_name: 'Nicolás',
    special_date: '2019-11-20',
    theme: 'marriage-proposal',
    message: 'He vivido los años más extraordinarios de mi vida a tu lado. No imagino un futuro sin tu mano tomada de la mía. ¿Damos este gran paso juntos?',
    history_text: 'Construimos un hogar, superamos tempestades y celebramos alegrías. Eres mi presente y quiero que seas mi eterno porvenir.',
    song_url: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
    config: { 
      proposalQuestion: '¿Te quieres casar conmigo? 💍',
      proposalYesText: '¡Sí, Acepto! 💍',
      proposalCelebrationText: '¡Dijo que Sí! Nos espera una vida entera de felicidad juntos.',
      ringBoxMessage: 'Prometo amarte, respetarte y hacerte sonreír cada día de mi vida 💍',
      photoStyle: 'album',
      customColors: { primary: '#b45309', bg: '#fafaf9', text: '#1c1917' }
    },
    created_at: new Date().toISOString(),
    photos: [
      { id: 'mp-1', experience_id: 'demo-marriage-id', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop', caption: 'El inicio del camino', order_index: 0 },
      { id: 'mp-2', experience_id: 'demo-marriage-id', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&auto=format&fit=crop', caption: 'Atardecer inolvidable', order_index: 1 },
      { id: 'mp-3', experience_id: 'demo-marriage-id', url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop', caption: 'Por siempre tú y yo', order_index: 2 }
    ],
    milestones: []
  },

  pregnancy: {
    id: 'demo-pregnancy-id',
    slug: 'ejemplo-embarazo',
    title: '¡Vamos a Ser Papás! 👶🍼',
    partner_name: 'Familia Querida',
    user_name: 'Mamá & Papá',
    special_date: '2026-11-20',
    theme: 'pregnancy',
    message: 'Nuestra familia crece y el amor se multiplica. Raspa la tarjeta interactiva con tu dedo para descubrir la hermosa noticia y la fecha en que llegará nuestro bebé.',
    history_text: 'Un pequeño corazón late con fuerza dentro de mí. Ya te amamos con toda nuestra alma antes de conocerte.',
    song_url: 'https://www.youtube.com/watch?v=K1j31Y8rU7I',
    config: { 
      photoStyle: 'polaroid',
      customColors: { primary: '#0891b2', bg: '#ecfeff', text: '#164e63' }
    },
    created_at: new Date().toISOString(),
    photos: [
      { id: 'pg-1', experience_id: 'demo-pregnancy-id', url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop', caption: 'Nuestro mayor milagro', order_index: 0 },
      { id: 'pg-2', experience_id: 'demo-pregnancy-id', url: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?w=800&auto=format&fit=crop', caption: 'Esperándote con ilusión', order_index: 1 }
    ],
    milestones: []
  },

  surprise: {
    id: 'demo-surprise-id',
    slug: 'ejemplo-sorpresa',
    title: '¡Tienes un Regalo Sorpresa! 🎁',
    partner_name: 'Martina',
    user_name: 'Joaquín',
    special_date: '2023-08-10',
    theme: 'surprise',
    message: 'Porque te mereces todo lo bueno de la vida y mucho más. Toca la cajita 3D para romper el lazo y abrir tu regalo sorpresa.',
    history_text: 'A veces los mejores momentos no se planean, simplemente se viven. Espero que esta sorpresa te dibuje una gran sonrisa.',
    song_url: 'https://www.youtube.com/watch?v=v2Xk_go2v3U',
    config: { 
      surpriseTitle: '¡Ticket Dorado para un Viaje Juntos!',
      surpriseDescription: 'Prepara las maletas porque este fin de semana nos escapamos frente al mar a desconectar y disfrutar.',
      surpriseCouponCode: 'ESCAPADA-PLAYA-2026',
      photoStyle: 'masonry',
      customColors: { primary: '#4f46e5', bg: '#eef2ff', text: '#1e1b4b' }
    },
    created_at: new Date().toISOString(),
    photos: [
      { id: 'sp-1', experience_id: 'demo-surprise-id', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop', caption: 'Nos espera el mar', order_index: 0 },
      { id: 'sp-2', experience_id: 'demo-surprise-id', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop', caption: 'Momentos inolvidables', order_index: 1 }
    ],
    milestones: []
  },

  'love-letter': {
    id: 'demo-letter-id',
    slug: 'ejemplo-carta',
    title: 'Carta para Quien Tiene Mi Corazón 📜',
    partner_name: 'Elena',
    user_name: 'Gabriel',
    special_date: '2020-06-03',
    theme: 'love-letter',
    message: 'Hay sentimientos tan profundos que solo encuentran calma cuando se plasman en palabras sinceras. Toca el sello de cera para desplegar mi pergamino.',
    history_text: 'Mi Elena hermosa:\n\nSi pudiera elegirte mil veces en mil vidas distintas, te buscaría en cada una de ellas sin dudarlo ni un instante. Eres mi calma en la tormenta, mi risa en los días grises y la certeza más bonita que jamás haya tenido.',
    song_url: 'https://www.youtube.com/watch?v=hKqN5fC60kU',
    config: { 
      waxSealSender: 'Gabriel, por siempre tuyo',
      photoStyle: 'vintage',
      customColors: { primary: '#78350f', bg: '#fefcbf', text: '#451a03' }
    },
    created_at: new Date().toISOString(),
    photos: [
      { id: 'll-1', experience_id: 'demo-letter-id', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop', caption: 'Nuestra historia escrita en el tiempo', order_index: 0 },
      { id: 'll-2', experience_id: 'demo-letter-id', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop', caption: 'La magia de tus ojos', order_index: 1 }
    ],
    milestones: []
  },

  'love-confession': {
    id: 'demo-confession-id',
    slug: 'ejemplo-declaracion',
    title: 'Lo que Mi Corazón Guardaba en Silencio 💖',
    partner_name: 'Isidora',
    user_name: 'Tomás',
    special_date: '2024-05-12',
    theme: 'love-confession',
    message: 'Llevo tiempo queriendo confesarte lo que siento cada vez que te veo sonreír. Toca el corazón de cristal para iluminar mi secreto.',
    history_text: 'Desde el momento en que nos cruzamos supe que eras diferente a todos. Te has vuelto mi primer pensamiento de cada mañana.',
    song_url: 'https://www.youtube.com/watch?v=yKNxeF4KMsY',
    config: { 
      crystalHeartTitle: 'Toca el Corazón de Cristal',
      crystalHeartSecret: 'Me enamoré de tu manera de ver la vida, de tu ternura y de la paz que me das. Eres la persona más especial que he conocido.',
      photoStyle: 'polaroid',
      customColors: { primary: '#db2777', bg: '#fff1f2', text: '#111827' }
    },
    created_at: new Date().toISOString(),
    photos: [
      { id: 'lc-1', experience_id: 'demo-confession-id', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop', caption: 'Esa tarde en el parque', order_index: 0 },
      { id: 'lc-2', experience_id: 'demo-confession-id', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop', caption: 'Tu luz única', order_index: 1 }
    ],
    milestones: []
  },

  valentines: {
    id: 'demo-valentines-id',
    slug: 'ejemplo-san-valentin',
    title: 'Feliz San Valentín, Mi Amor 🌹',
    partner_name: 'Francisca',
    user_name: 'Cristóbal',
    special_date: '2022-02-14',
    theme: 'valentines',
    message: 'En este día del amor quiero recordarte lo inmenso que es lo que siento por ti. Abre la caja de bombones para disfrutar una sorpresa dulce.',
    history_text: 'Amar no es solo mirarse el uno al otro, sino mirar juntos en la misma dirección. Gracias por ser mi San Valentín de todos los días.',
    song_url: 'https://www.youtube.com/watch?v=CFPLIaMpGrY',
    config: { 
      valentineBoxTitle: 'Caja de Bombones de San Valentín 🍫',
      valentineGiftVoucher: 'Vale por una cena romántica a la luz de las velas y besos ilimitados',
      photoStyle: 'polaroid',
      customColors: { primary: '#be123c', bg: '#fff1f2', text: '#111827' }
    },
    created_at: new Date().toISOString(),
    photos: [
      { id: 'vl-1', experience_id: 'demo-valentines-id', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop', caption: 'Rosas y momentos juntos', order_index: 0 },
      { id: 'vl-2', experience_id: 'demo-valentines-id', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop', caption: 'Amor verdadero', order_index: 1 }
    ],
    milestones: []
  },

  special: {
    id: 'demo-special-id',
    slug: 'ejemplo-felicitacion',
    title: '¡Orgullo Total por tu Gran Logro! 🎓⭐',
    partner_name: 'Benjamín',
    user_name: 'Familia con Orgullo',
    special_date: '2024-01-15',
    theme: 'special',
    message: 'Tantas noches de estudio, esfuerzo y perseverancia hoy tienen su recompensa. ¡Toca la pantalla para celebrar con fuegos artificiales!',
    history_text: 'Nunca dudamos de tu capacidad y tenacidad. Que este triunfo sea solo el inicio de una carrera y vida brillante.',
    song_url: 'https://www.youtube.com/watch?v=yP9vWj7R0xI',
    config: { 
      trophyTitle: 'Título Profesional Obtenido 🎓',
      trophyCategory: '¡Orgullo Total por tu Gran Meta Cumplida!',
      diplomaText: 'Reconocimiento oficial a la persona más tenaz, talentosa y perseverante.',
      photoStyle: 'collage',
      customColors: { primary: '#d97706', bg: '#fffbeb', text: '#451a03' }
    },
    created_at: new Date().toISOString(),
    photos: [
      { id: 'spc-1', experience_id: 'demo-special-id', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop', caption: '¡Lo lograste!', order_index: 0 },
      { id: 'spc-2', experience_id: 'demo-special-id', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop', caption: 'Celebrando tu triunfo', order_index: 1 }
    ],
    milestones: []
  },

  gratitude: {
    id: 'demo-gratitude-id',
    slug: 'ejemplo-agradecimiento',
    title: 'Gracias de Todo Corazón 🙏✨',
    partner_name: 'Mamá & Papá',
    user_name: 'Con Inmensa Gratitud',
    special_date: '2020-01-01',
    theme: 'gratitude',
    message: 'Las palabras se quedan cortas para agradecer todo el amor y apoyo incondicional que siempre me han brindado. Toquen las estrellas para ver mis motivos.',
    history_text: 'Gracias por ser mi refugio en los días difíciles y mi mayor impulso para volar alto. Todo lo bueno que soy se lo debo a ustedes.',
    song_url: 'https://www.youtube.com/watch?v=K1j31Y8rU7I',
    config: { 
      gratitudeStar1: 'Por su apoyo incondicional en cada paso 🌟',
      gratitudeStar2: 'Por creer en mí incluso cuando yo dudaba 💛',
      gratitudeStar3: 'Por su amor infinito y sus abrazos sanadores ✨',
      photoStyle: 'masonry',
      customColors: { primary: '#0d9488', bg: '#f0fdfa', text: '#115e59' }
    },
    created_at: new Date().toISOString(),
    photos: [
      { id: 'gt-1', experience_id: 'demo-gratitude-id', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop', caption: 'Familia unida siempre', order_index: 0 },
      { id: 'gt-2', experience_id: 'demo-gratitude-id', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop', caption: 'Momentos que atesoro', order_index: 1 }
    ],
    milestones: []
  },

  reconciliation: {
    id: 'demo-reconciliation-id',
    slug: 'ejemplo-reconciliacion',
    title: 'Hagamos las Paces 🕊️🤝',
    partner_name: 'Mi Amor',
    user_name: 'Quien Te Ama de Verdad',
    special_date: '2022-07-19',
    theme: 'reconciliation',
    message: 'Reconozco mis faltas con total sinceridad. Nuestro amor y cada momento compartido valen infinitamente más que cualquier orgullo.',
    history_text: 'Nuestras risas y abrazos son irremplazables. Toca el corazón roto para volver a unirlo y seguir escribiendo nuestra historia juntos.',
    song_url: 'https://www.youtube.com/watch?v=hKqN5fC60kU',
    config: { 
      photoStyle: 'polaroid',
      customColors: { primary: '#4b5563', bg: '#f9fafb', text: '#111827' }
    },
    created_at: new Date().toISOString(),
    photos: [
      { id: 'rc-1', experience_id: 'demo-reconciliation-id', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop', caption: 'Nuestros momentos felices', order_index: 0 },
      { id: 'rc-2', experience_id: 'demo-reconciliation-id', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop', caption: 'Por un nuevo comienzo', order_index: 1 }
    ],
    milestones: []
  }
};

/**
 * Mapeo de slugs a temas para resolver cualquier variante (inglés o español)
 */
export const MAPA_SLUG_A_TEMA: Record<string, string> = {
  // Aniversario
  'ejemplo-aniversario': 'anniversary',
  'ejemplo-anniversary': 'anniversary',
  'demo-aniversario': 'anniversary',
  'demo-anniversary': 'anniversary',

  // Cumpleaños
  'ejemplo-cumpleanos': 'birthday',
  'ejemplo-cumpleaños': 'birthday',
  'ejemplo-birthday': 'birthday',
  'demo-cumpleanos': 'birthday',
  'demo-birthday': 'birthday',

  // Pedir Noviazgo
  'ejemplo-noviazgo': 'dating-proposal',
  'ejemplo-pedir-noviazgo': 'dating-proposal',
  'ejemplo-dating-proposal': 'dating-proposal',
  'demo-noviazgo': 'dating-proposal',

  // Pedir Matrimonio
  'ejemplo-matrimonio': 'marriage-proposal',
  'ejemplo-pedir-matrimonio': 'marriage-proposal',
  'ejemplo-marriage-proposal': 'marriage-proposal',
  'demo-matrimonio': 'marriage-proposal',

  // Anunciar Embarazo
  'ejemplo-embarazo': 'pregnancy',
  'ejemplo-anunciar-embarazo': 'pregnancy',
  'ejemplo-pregnancy': 'pregnancy',
  'demo-embarazo': 'pregnancy',

  // Regalo Sorpresa
  'ejemplo-sorpresa': 'surprise',
  'ejemplo-regalo-sorpresa': 'surprise',
  'ejemplo-surprise': 'surprise',
  'demo-sorpresa': 'surprise',

  // Carta de Amor
  'ejemplo-carta': 'love-letter',
  'ejemplo-carta-de-amor': 'love-letter',
  'ejemplo-love-letter': 'love-letter',
  'demo-carta': 'love-letter',

  // Declaración de Amor
  'ejemplo-declaracion': 'love-confession',
  'ejemplo-declaracion-de-amor': 'love-confession',
  'ejemplo-love-confession': 'love-confession',
  'demo-declaracion': 'love-confession',

  // San Valentín
  'ejemplo-san-valentin': 'valentines',
  'ejemplo-valentines': 'valentines',
  'demo-san-valentin': 'valentines',

  // Felicitación Especial
  'ejemplo-felicitacion': 'special',
  'ejemplo-felicitacion-especial': 'special',
  'ejemplo-special': 'special',
  'demo-felicitacion': 'special',

  // Agradecimiento
  'ejemplo-agradecimiento': 'gratitude',
  'ejemplo-gratitude': 'gratitude',
  'demo-agradecimiento': 'gratitude',

  // Reconciliación
  'ejemplo-reconciliacion': 'reconciliation',
  'ejemplo-reconciliation': 'reconciliation',
  'demo-reconciliacion': 'reconciliation',

  // Slugs previos existentes
  'ejemplo-digital': 'birthday',
  'ejemplo-premium': 'anniversary'
};

export function obtenerExperienciaEjemploPorSlug(slug: string): Experiencia | null {
  const limpio = slug.toLowerCase().trim();
  const themeKey = MAPA_SLUG_A_TEMA[limpio];
  if (themeKey && EXPERIENCIAS_EJEMPLO[themeKey]) {
    return EXPERIENCIAS_EJEMPLO[themeKey];
  }
  return null;
}

export function obtenerSlugEjemploPorTema(temaId: string): string {
  const mapa: Record<string, string> = {
    anniversary: 'ejemplo-aniversario',
    birthday: 'ejemplo-cumpleanos',
    'dating-proposal': 'ejemplo-noviazgo',
    'marriage-proposal': 'ejemplo-matrimonio',
    pregnancy: 'ejemplo-embarazo',
    surprise: 'ejemplo-sorpresa',
    'love-letter': 'ejemplo-carta',
    'love-confession': 'ejemplo-declaracion',
    valentines: 'ejemplo-san-valentin',
    special: 'ejemplo-felicitacion',
    gratitude: 'ejemplo-agradecimiento',
    reconciliation: 'ejemplo-reconciliacion'
  };
  return mapa[temaId] || `ejemplo-${temaId}`;
}
