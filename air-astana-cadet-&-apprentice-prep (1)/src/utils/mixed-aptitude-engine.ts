/**
 * High-Precision Procedural Generator for Official AON/EPST Mixed Aptitude Test
 * 15 Questions / 12 Minutes
 * 
 * 4 Core Archetypes:
 * 1. Rooftop Projection / Orthographic Top-Down View (Asymmetrical houses with gables)
 * 2. Non-Verbal Progressive Geometry (Concentric series with rotating arcs & brackets)
 * 3. 3-Statement Syllogisms & Relational Transitive Truth (True / False / Insufficient Info)
 * 4. Linear Positioning & Runway/Taxiway Arrangement Puzzles
 */

import { Question } from '../types';

export interface MixedAptitudeQuestion extends Question {
  archetype: 'rooftop' | 'concentric' | 'syllogism' | 'positioning';
  svgIllustration?: string;
  optionsSvg?: string[];
}

// -------------------------------------------------------------
// 1. ROOFTOP PROJECTION / ORTHOGRAPHIC GENERATOR
// -------------------------------------------------------------
export function generateRooftopQuestion(seed: number = 0): MixedAptitudeQuestion {
  const variants = [
    {
      name: 'T-Shaped Dual-Gable House',
      houseSvg: `
        <svg viewBox="0 0 200 160" width="100%" height="100%">
          <!-- Ground and shadow -->
          <ellipse cx="100" cy="140" rx="80" ry="15" fill="rgba(0,0,0,0.06)" />
          <!-- Main block front -->
          <polygon points="40,90 100,60 100,130 40,140" fill="#E2E8F0" stroke="#0F172A" stroke-width="2"/>
          <polygon points="100,60 160,90 160,140 100,130" fill="#CBD5E1" stroke="#0F172A" stroke-width="2"/>
          <!-- Front gable roof -->
          <polygon points="40,90 100,45 100,60" fill="#3B82F6" stroke="#0F172A" stroke-width="2"/>
          <polygon points="100,45 160,90 100,60" fill="#1D4ED8" stroke="#0F172A" stroke-width="2"/>
          <!-- Perpendicular Wing extending back-right -->
          <polygon points="100,45 140,25 180,60 140,80" fill="#60A5FA" stroke="#0F172A" stroke-width="2"/>
          <polygon points="140,80 180,60 180,110 140,120" fill="#94A3B8" stroke="#0F172A" stroke-width="2"/>
          <!-- Windows and Door -->
          <rect x="55" y="105" width="16" height="20" fill="#1E293B" rx="1"/>
          <rect x="120" y="105" width="16" height="20" fill="#1E293B" rx="1"/>
        </svg>
      `,
      // 4 Top-down roof blueprints (orthographic)
      correctPlanSvg: `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <!-- Correct T-Shape Roof with Ridge Lines and Valleys -->
          <rect x="15" y="45" width="70" height="40" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
          <line x1="15" y1="65" x2="85" y2="65" stroke="#0F172A" stroke-width="2.5"/> <!-- Main Ridge -->
          <polygon points="45,15 75,15 75,45 45,45" fill="#BFDBFE" stroke="#0F172A" stroke-width="2"/>
          <line x1="60" y1="15" x2="60" y2="65" stroke="#0F172A" stroke-width="2.5"/> <!-- Wing Ridge -->
          <!-- Roof valleys -->
          <line x1="45" y1="45" x2="60" y2="65" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="3,2"/>
          <line x1="75" y1="45" x2="60" y2="65" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="3,2"/>
        </svg>
      `,
      distractor1Svg: `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <!-- Distractor 1: Wing on wrong left side -->
          <rect x="15" y="45" width="70" height="40" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
          <line x1="15" y1="65" x2="85" y2="65" stroke="#0F172A" stroke-width="2.5"/>
          <polygon points="25,15 55,15 55,45 25,45" fill="#BFDBFE" stroke="#0F172A" stroke-width="2"/>
          <line x1="40" y1="15" x2="40" y2="65" stroke="#0F172A" stroke-width="2.5"/>
        </svg>
      `,
      distractor2Svg: `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <!-- Distractor 2: Flat rectangular roof without perpendicular wing -->
          <rect x="15" y="30" width="70" height="50" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
          <line x1="15" y1="55" x2="85" y2="55" stroke="#0F172A" stroke-width="2.5"/>
          <line x1="15" y1="30" x2="85" y2="80" stroke="#94A3B8" stroke-width="1.5"/>
        </svg>
      `,
      distractor3Svg: `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <!-- Distractor 3: Crossed X-ridge (Pyramid hip roof, incorrect) -->
          <rect x="20" y="20" width="60" height="60" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
          <line x1="20" y1="20" x2="80" y2="80" stroke="#0F172A" stroke-width="2.5"/>
          <line x1="80" y1="20" x2="20" y2="80" stroke="#0F172A" stroke-width="2.5"/>
        </svg>
      `,
    },
    {
      name: 'L-Shaped Asymmetrical Porch Villa',
      houseSvg: `
        <svg viewBox="0 0 200 160" width="100%" height="100%">
          <ellipse cx="100" cy="142" rx="85" ry="14" fill="rgba(0,0,0,0.06)" />
          <!-- Left tall section -->
          <polygon points="30,80 80,45 80,135 30,135" fill="#E2E8F0" stroke="#0F172A" stroke-width="2"/>
          <polygon points="30,80 80,45 60,35 15,65" fill="#2563EB" stroke="#0F172A" stroke-width="2"/>
          <!-- Right elongated wing -->
          <polygon points="80,95 170,95 170,135 80,135" fill="#CBD5E1" stroke="#0F172A" stroke-width="2"/>
          <polygon points="80,75 170,75 170,95 80,95" fill="#1E40AF" stroke="#0F172A" stroke-width="2"/>
          <!-- Dormer window on left -->
          <polygon points="45,50 60,40 60,60 45,65" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
        </svg>
      `,
      correctPlanSvg: `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <!-- Correct L-Shape Plan -->
          <polygon points="15,20 48,20 48,55 85,55 85,85 15,85" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
          <line x1="15" y1="52" x2="48" y2="52" stroke="#0F172A" stroke-width="2.5"/>
          <line x1="48" y1="70" x2="85" y2="70" stroke="#0F172A" stroke-width="2.5"/>
          <line x1="48" y1="55" x2="48" y2="85" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="2,2"/>
        </svg>
      `,
      distractor1Svg: `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <!-- Mirrored L shape -->
          <polygon points="85,20 52,20 52,55 15,55 15,85 85,85" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
          <line x1="52" y1="52" x2="85" y2="52" stroke="#0F172A" stroke-width="2.5"/>
        </svg>
      `,
      distractor2Svg: `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <!-- Equal square block -->
          <rect x="25" y="25" width="50" height="50" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
          <line x1="25" y1="50" x2="75" y2="50" stroke="#0F172A" stroke-width="2.5"/>
        </svg>
      `,
      distractor3Svg: `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <!-- U shape with dual courtyards -->
          <polygon points="20,20 80,20 80,80 60,80 60,45 40,45 40,80 20,80" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
        </svg>
      `,
    }
  ];

  const selected = variants[seed % variants.length];

  return {
    id: `mixed-rooftop-${seed}`,
    track: 'ab-initio',
    module: 'cognitive',
    category: 'Mixed Aptitude: Rooftop Projection',
    difficulty: 'Medium',
    archetype: 'rooftop',
    question: 'Which option (A, B, C, or D) depicts the exact orthographic rooftop blueprint of the house shown above?',
    svgIllustration: selected.houseSvg,
    optionsSvg: [selected.correctPlanSvg, selected.distractor1Svg, selected.distractor2Svg, selected.distractor3Svg],
    options: [
      'Option A (Orthographic Top-Down Blueprint)',
      'Option B (Mirrored Lateral Projection)',
      'Option C (Simplified Symmetrical Plan)',
      'Option D (Distorted Ridge Geometry)'
    ],
    correctAnswerIndex: 0,
    explanationEn: 'In orthographic projection, vertical heights compress into plane contours. The perpendicular wing and ridge lines must align on the right flank with corresponding valley diagonals.',
    explanationRu: 'В ортогональной проекции сверху вертикальные стены исчезают, а коньки крыш (ridge lines) и ендовы (valleys) образуют строгий чертеж. Боковое крыло расположено справа, поэтому на плане коньковая линия стыкуется строго в правой части.',
    formulaShortcut: 'Rule: Identify highest ridge line first, then verify lateral wing direction (Left vs Right).',
    timeLimitSeconds: 50,
  };
}

// -------------------------------------------------------------
// 2. NON-VERBAL PROGRESSIVE GEOMETRY (CONCENTRIC SERIES)
// -------------------------------------------------------------
export function generateConcentricQuestion(seed: number = 0): MixedAptitudeQuestion {
  return {
    id: `mixed-concentric-${seed}`,
    track: 'ab-initio',
    module: 'cognitive',
    category: 'Mixed Aptitude: Progressive Geometry',
    difficulty: 'Hard',
    archetype: 'concentric',
    question: 'Examine the concentric geometric transformation across the sequence (1 to 4). What is the missing 5th figure?',
    svgIllustration: `
      <svg viewBox="0 0 340 85" width="100%" height="100%">
        <!-- Frame 1: 1 Arc facing right -->
        <g transform="translate(10, 10)">
          <rect width="65" height="65" rx="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
          <path d="M42,20 A16,16 0 0,1 42,52" fill="none" stroke="#2563EB" stroke-width="3"/>
          <circle cx="28" cy="36" r="3" fill="#0F172A"/>
        </g>
        <!-- Frame 2: 2 Concentric Arcs facing left -->
        <g transform="translate(90, 10)">
          <rect width="65" height="65" rx="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
          <path d="M25,18 A18,18 0 0,0 25,54" fill="none" stroke="#2563EB" stroke-width="3"/>
          <path d="M32,24 A12,12 0 0,0 32,48" fill="none" stroke="#2563EB" stroke-width="3"/>
          <circle cx="44" cy="36" r="3" fill="#0F172A"/>
        </g>
        <!-- Frame 3: 3 Concentric Arcs facing right -->
        <g transform="translate(170, 10)">
          <rect width="65" height="65" rx="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
          <path d="M48,15 A22,22 0 0,1 48,57" fill="none" stroke="#2563EB" stroke-width="3"/>
          <path d="M42,21 A16,16 0 0,1 42,51" fill="none" stroke="#2563EB" stroke-width="3"/>
          <path d="M36,27 A10,10 0 0,1 36,45" fill="none" stroke="#2563EB" stroke-width="3"/>
          <circle cx="24" cy="36" r="3" fill="#0F172A"/>
        </g>
        <!-- Frame 4: 4 Concentric Arcs facing left -->
        <g transform="translate(250, 10)">
          <rect width="65" height="65" rx="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
          <path d="M22,12 A25,25 0 0,0 22,60" fill="none" stroke="#2563EB" stroke-width="3"/>
          <path d="M28,18 A19,19 0 0,0 28,54" fill="none" stroke="#2563EB" stroke-width="3"/>
          <path d="M34,24 A13,13 0 0,0 34,48" fill="none" stroke="#2563EB" stroke-width="3"/>
          <path d="M40,30 A7,7 0 0,0 40,42" fill="none" stroke="#2563EB" stroke-width="3"/>
          <circle cx="50" cy="36" r="3" fill="#0F172A"/>
        </g>
      </svg>
    `,
    optionsSvg: [
      // Option A: Correct (5 arcs facing right, dot on left)
      `
      <svg viewBox="0 0 70 70" width="100%" height="100%">
        <rect width="70" height="70" rx="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
        <path d="M50,10 A26,26 0 0,1 50,62" fill="none" stroke="#2563EB" stroke-width="2.5"/>
        <path d="M45,15 A21,21 0 0,1 45,57" fill="none" stroke="#2563EB" stroke-width="2.5"/>
        <path d="M40,20 A16,16 0 0,1 40,52" fill="none" stroke="#2563EB" stroke-width="2.5"/>
        <path d="M35,25 A11,11 0 0,1 35,47" fill="none" stroke="#2563EB" stroke-width="2.5"/>
        <path d="M30,30 A6,6 0 0,1 30,42" fill="none" stroke="#2563EB" stroke-width="2.5"/>
        <circle cx="18" cy="36" r="3.5" fill="#0F172A"/>
      </svg>
      `,
      // Option B: 5 arcs facing left (wrong direction)
      `
      <svg viewBox="0 0 70 70" width="100%" height="100%">
        <rect width="70" height="70" rx="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
        <path d="M20,10 A26,26 0 0,0 20,62" fill="none" stroke="#2563EB" stroke-width="2.5"/>
        <path d="M25,15 A21,21 0 0,0 25,57" fill="none" stroke="#2563EB" stroke-width="2.5"/>
        <circle cx="52" cy="36" r="3.5" fill="#0F172A"/>
      </svg>
      `,
      // Option C: 4 arcs facing right (wrong count)
      `
      <svg viewBox="0 0 70 70" width="100%" height="100%">
        <rect width="70" height="70" rx="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
        <path d="M48,15 A21,21 0 0,1 48,57" fill="none" stroke="#2563EB" stroke-width="2.5"/>
        <circle cx="20" cy="36" r="3.5" fill="#0F172A"/>
      </svg>
      `,
      // Option D: Missing dot
      `
      <svg viewBox="0 0 70 70" width="100%" height="100%">
        <rect width="70" height="70" rx="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
        <path d="M48,15 A21,21 0 0,1 48,57" fill="none" stroke="#EF4444" stroke-width="2.5"/>
      </svg>
      `
    ],
    options: [
      'Option A (5 Arcs Right + Left Dot)',
      'Option B (5 Arcs Left + Right Dot)',
      'Option C (4 Arcs Right)',
      'Option D (Inverted Polarity)'
    ],
    correctAnswerIndex: 0,
    explanationEn: 'Two interleaved rules operate: (1) Arc count increments by +1 per step (1, 2, 3, 4 -> 5). (2) Facing direction alternates (Right, Left, Right, Left -> Right). The reference dot alternates opposite to the arc curvature.',
    explanationRu: 'Два взаимосвязанных правила: 1) Количество дуг возрастает на +1 (1, 2, 3, 4 -> 5). 2) Направление раскрытия чередуется (Вправо, Влево, Вправо, Влево -> Вправо). Точка всегда находится с противоположной стороны от дуг.',
    formulaShortcut: 'Rule: Count = N + 1; Direction = (-1)^N orientation flip.',
    timeLimitSeconds: 45,
  };
}

// -------------------------------------------------------------
// 3. 3-STATEMENT SYLLOGISMS & RELATIONAL TRUTH
// -------------------------------------------------------------
export function generateSyllogismQuestion(seed: number = 0): MixedAptitudeQuestion {
  const pilots = ['Capt. Giovanni', 'FO Paola', 'Cadet Luis', 'Cadet Kompal', 'FO Arman'];
  const p1 = pilots[seed % pilots.length];
  const p2 = pilots[(seed + 1) % pilots.length];
  const p3 = pilots[(seed + 2) % pilots.length];
  const p4 = pilots[(seed + 3) % pilots.length];

  return {
    id: `mixed-syllogism-${seed}`,
    track: 'ab-initio',
    module: 'cognitive',
    category: 'Mixed Aptitude: Relational Syllogism',
    difficulty: 'Medium',
    archetype: 'syllogism',
    question: `Examine the statements regarding flight crew experience ranking:
1. ${p2} has more flight hours than ${p1} and fewer flight hours than ${p3}.
2. ${p4} has fewer flight hours than ${p3} and more flight hours than ${p2}.
3. Statement to evaluate: «${p1} has more flight hours than ${p4}».

If the first two statements are true, the third statement is:`,
    options: [
      'True',
      'False',
      'Insufficient information'
    ],
    correctAnswerIndex: 1, // False
    explanationEn: `Order established: Statement 1 gives ${p1} < ${p2} < ${p3}. Statement 2 gives ${p2} < ${p4} < ${p3}. Combining both yields: ${p1} < ${p2} < ${p4} < ${p3}. Therefore, ${p1} has LESS flight time than ${p4}. The statement that ${p1} has more is strictly FALSE.`,
    explanationRu: `Устанавливаем транзитивный порядок: из утверждения 1: ${p1} < ${p2} < ${p3}. Из утверждения 2: ${p2} < ${p4} < ${p3}. Объединенная цепочка: ${p1} < ${p2} < ${p4} < ${p3}. Следовательно, ${p1} имеет МЕНЬШЕ налета, чем ${p4}. Утверждение категорически ЛОЖНО (False).`,
    formulaShortcut: 'Transitive chain: Map elements on a linear line A < B < C before answering.',
    timeLimitSeconds: 45,
  };
}

// -------------------------------------------------------------
// 4. LINEAR POSITIONING & ARRANGEMENT PUZZLES
// -------------------------------------------------------------
export function generatePositioningQuestion(seed: number = 0): MixedAptitudeQuestion {
  return {
    id: `mixed-positioning-${seed}`,
    track: 'ab-initio',
    module: 'cognitive',
    category: 'Mixed Aptitude: Linear Positioning',
    difficulty: 'Medium',
    archetype: 'positioning',
    question: `Five aircraft (Flight KC-101, KC-202, KC-303, KC-404, KC-505) are queued in a linear holding line on Taxiway Bravo for Runway 05R:
• KC-202 is positioned behind KC-101 but is NOT positioned immediately next to KC-303.
• KC-505 is positioned directly between KC-101 and KC-202.
• KC-404 is positioned at the very front of the queue.
• KC-303 is holding immediately behind KC-202.

Which aircraft does NOT have any aircraft positioned ahead of it?`,
    options: [
      'Flight KC-404',
      'Flight KC-101',
      'Flight KC-505',
      'Flight KC-202',
      'Flight KC-303'
    ],
    correctAnswerIndex: 0,
    explanationEn: 'Following the positioning logic: KC-404 is at the very front (Position 1). KC-101 is ahead of KC-505, which is ahead of KC-202. KC-303 is behind KC-202. Full queue from front to back: [KC-404] -> [KC-101] -> [KC-505] -> [KC-202] -> [KC-303]. Thus, KC-404 has no aircraft ahead of it.',
    explanationRu: 'Пошаговый разбор очереди: KC-404 стоит самым первым (Позиция 1). За ним идут KC-101, затем KC-505, затем KC-202, и замыкает очередь KC-303. Полный порядок: [KC-404] -> [KC-101] -> [KC-505] -> [KC-202] -> [KC-303]. Перед бортом KC-404 нет других самолетов.',
    formulaShortcut: 'Linear constraint mapping: Fix absolute anchors (first/last) first, then insert relative clusters.',
    timeLimitSeconds: 45,
  };
}

/**
 * Generate full official 15-question Mixed Aptitude Test battery
 */
export function generateOfficialMixedAptitudeBatch(): MixedAptitudeQuestion[] {
  const batch: MixedAptitudeQuestion[] = [];
  
  // 15 strictly structured questions balancing all 4 archetypes
  for (let i = 0; i < 15; i++) {
    const typeMod = i % 4;
    if (typeMod === 0) batch.push(generateRooftopQuestion(i));
    else if (typeMod === 1) batch.push(generateConcentricQuestion(i));
    else if (typeMod === 2) batch.push(generateSyllogismQuestion(i));
    else batch.push(generatePositioningQuestion(i));
  }

  return batch;
}
