/**
 * Official AON/EPST 4-Part Adaptive Cognitive Ability Battery
 * 
 * Part 1: Abstract Reasoning (3x3 Matrices & Sequential Series with 6 Options)
 * Part 2: Spatial Reasoning (Cube Net Folding & 3D Voxel Rotation with 4 Options)
 * Part 3: Numerical Reasoning (Number Series Sequences with 6 Options)
 * Part 4: Verbal Reasoning (Analogies, Odd-One-Out, Transitive & Syllogisms with 4 Options)
 */

import { Question } from '../types';

export interface CognitiveQuestion extends Question {
  cognitivePart: 1 | 2 | 3 | 4;
  svgVisual?: string;
  optionsSvg?: string[];
}

// -------------------------------------------------------------
// PART 1: ABSTRACT REASONING (3x3 Matrices & Series | 6 Options)
// -------------------------------------------------------------
export function generateAbstractQuestions(count: number = 8): CognitiveQuestion[] {
  const list: CognitiveQuestion[] = [];

  for (let i = 0; i < count; i++) {
    // 3x3 Matrix with shape progression and fill alternations
    const matrixSvg = `
      <svg viewBox="0 0 240 240" width="100%" height="100%">
        <!-- Grid Frame -->
        <rect width="240" height="240" rx="12" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
        <line x1="80" y1="0" x2="80" y2="240" stroke="#CBD5E1" stroke-width="2"/>
        <line x1="160" y1="0" x2="160" y2="240" stroke="#CBD5E1" stroke-width="2"/>
        <line x1="0" y1="80" x2="240" y2="80" stroke="#CBD5E1" stroke-width="2"/>
        <line x1="0" y1="160" x2="240" y2="160" stroke="#CBD5E1" stroke-width="2"/>

        <!-- Row 1: 1 Circle -> 2 Circles -> 3 Circles -->
        <circle cx="40" cy="40" r="14" fill="#2563EB" />
        <circle cx="110" cy="40" r="12" fill="#2563EB" /><circle cx="130" cy="40" r="12" fill="#2563EB" />
        <circle cx="180" cy="40" r="10" fill="#2563EB" /><circle cx="200" cy="40" r="10" fill="#2563EB" /><circle cx="220" cy="40" r="10" fill="#2563EB" />

        <!-- Row 2: 1 Square -> 2 Squares -> 3 Squares -->
        <rect x="26" y="106" width="28" height="28" fill="#F59E0B" />
        <rect x="96" y="108" width="22" height="22" fill="#F59E0B" /><rect x="122" y="108" width="22" height="22" fill="#F59E0B" />
        <rect x="172" y="110" width="18" height="18" fill="#F59E0B" /><rect x="194" y="110" width="18" height="18" fill="#F59E0B" /><rect x="216" y="110" width="18" height="18" fill="#F59E0B" />

        <!-- Row 3: 1 Diamond -> 2 Diamonds -> ? [3 Diamonds Target] -->
        <polygon points="40,170 55,190 40,210 25,190" fill="#10B981" />
        <polygon points="105,175 117,190 105,205 93,190" fill="#10B981" />
        <polygon points="135,175 147,190 135,205 123,190" fill="#10B981" />

        <!-- Cell (3,3): Question Mark -->
        <rect x="160" y="160" width="80" height="80" fill="#EFF6FF" />
        <text x="200" y="210" font-size="34" font-family="monospace" font-weight="bold" fill="#2563EB" text-anchor="middle">?</text>
      </svg>
    `;

    list.push({
      id: `cog-abstract-${i}`,
      track: 'ab-initio',
      module: 'cognitive',
      category: 'AON Cognitive: Abstract 3x3 Matrix',
      difficulty: 'Medium',
      cognitivePart: 1,
      question: 'Which of the 6 figures completes the logical progression in cell [Row 3, Col 3]?',
      svgVisual: matrixSvg,
      options: [
        'A: Three Diamonds (Horizontal Alignment)',
        'B: Two Circles (Inverted Colors)',
        'C: Four Squares (Grouped)',
        'D: Three Circles (Vertical Stack)',
        'E: Two Diamonds (Single Axis)',
        'F: One Solid Hexagon'
      ],
      correctAnswerIndex: 0,
      explanationEn: 'Row rule: Item count increments by +1 across each column (1 -> 2 -> 3). Shape identity is preserved across rows (Row 1 = Circles, Row 2 = Squares, Row 3 = Diamonds). Cell [3,3] must contain exactly 3 Diamonds.',
      explanationRu: 'Правило строк: количество фигур в каждой строке возрастает на +1 (1 -> 2 -> 3). Тип фигуры постоянен по строкам (1-я строка: круги, 2-я строка: квадраты, 3-я строка: ромбы). В ячейке [3,3] должны быть строго 3 ромба.',
      formulaShortcut: 'Matrix Law: Count = Col_index + 1; Shape = Row_invariant.',
      timeLimitSeconds: 60,
    });
  }

  return list;
}

// -------------------------------------------------------------
// PART 2: SPATIAL REASONING (Cube Nets & 3D Voxels | 4 Options)
// -------------------------------------------------------------
export function generateSpatialQuestions(count: number = 8): CognitiveQuestion[] {
  const list: CognitiveQuestion[] = [];

  for (let i = 0; i < count; i++) {
    // 2D Cross-pattern Cube Net with 6 unique faces
    const netSvg = `
      <svg viewBox="0 0 200 160" width="100%" height="100%">
        <!-- Top Face (Plus) -->
        <rect x="70" y="10" width="40" height="40" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
        <line x1="90" y1="18" x2="90" y2="42" stroke="#2563EB" stroke-width="4"/>
        <line x1="78" y1="30" x2="102" y2="30" stroke="#2563EB" stroke-width="4"/>

        <!-- Middle Row: Left (Dot), Center (Triangle), Right (Square), Far-Right (Circle) -->
        <rect x="30" y="50" width="40" height="40" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
        <circle cx="50" cy="70" r="6" fill="#0F172A"/>

        <rect x="70" y="50" width="40" height="40" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
        <polygon points="90,56 104,82 76,82" fill="#EF4444"/>

        <rect x="110" y="50" width="40" height="40" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
        <rect x="122" y="62" width="16" height="16" fill="#F59E0B"/>

        <rect x="150" y="50" width="40" height="40" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
        <circle cx="170" cy="70" r="10" fill="none" stroke="#10B981" stroke-width="3"/>

        <!-- Bottom Face (Colon) -->
        <rect x="70" y="90" width="40" height="40" fill="#DBEAFE" stroke="#0F172A" stroke-width="2"/>
        <circle cx="90" cy="100" r="4" fill="#0F172A"/>
        <circle cx="90" cy="120" r="4" fill="#0F172A"/>
      </svg>
    `;

    list.push({
      id: `cog-spatial-${i}`,
      track: 'ab-initio',
      module: 'cognitive',
      category: 'AON Cognitive: Cube Net Folding',
      difficulty: 'Hard',
      cognitivePart: 2,
      question: 'When the 2D cross pattern is folded into a 3D cube (folding faces away from you into the screen), which 3D cube is physically possible?',
      svgVisual: netSvg,
      options: [
        'Cube A: Top=Plus, Front=Triangle, Right=Square',
        'Cube B: Top=Plus, Front=Colon, Right=Triangle (Opposite faces cannot touch)',
        'Cube C: Top=Dot, Front=Square, Right=Circle (Opposites violation)',
        'Cube D: Top=Colon, Front=Plus, Right=Triangle (Inverted polarity)'
      ],
      correctAnswerIndex: 0,
      explanationEn: 'In a 2D net: (1) The Top (Plus) and Bottom (Colon) are opposites and can NEVER be seen simultaneously. (2) Left (Dot) and Right (Square) are opposites and can NEVER touch. In Cube A, Top=Plus, Front=Triangle, and Right=Square are all adjacent with correct vertex alignment.',
      explanationRu: 'Фундаментальный закон развертки куба: противоположные грани НИКОГДА не видны одновременно. Верх (Плюс) и Низ (Двоеточие) противоположны. Лево (Точка) и Право (Квадрат) противоположны. В кубе A грани Верх=Плюс, Лицо=Треугольник, Право=Квадрат сходятся в общей вершине с идеальной геометрией.',
      formulaShortcut: 'Opposite Faces Law: 1 step of separation in net = Opposite in 3D (mutually exclusive visibility).',
      timeLimitSeconds: 60,
    });
  }

  return list;
}

// -------------------------------------------------------------
// PART 3: NUMERICAL REASONING (Number Series Sequences | 6 Options)
// -------------------------------------------------------------
export function generateNumericalQuestions(count: number = 8): CognitiveQuestion[] {
  const archetypes = [
    {
      seq: [3, 7, 13, 21, 31],
      next: 43,
      distractors: [41, 45, 39, 47, 49],
      rule: 'Accelerating additions: +4, +6, +8, +10 -> +12 (31 + 12 = 43).'
    },
    {
      seq: [64, 32, 16, 8, 4],
      next: 2,
      distractors: [1, 0, 3, -2, 0.5],
      rule: 'Geometric division by 2: 64/2, 32/2, 16/2, 8/2, 4/2 = 2.'
    },
    {
      seq: [4, 7, 11, 18, 29],
      next: 47,
      distractors: [45, 48, 51, 43, 38],
      rule: 'Fibonacci summation: each term is the sum of previous two: 18 + 29 = 47.'
    },
    {
      seq: [2, 5, 4, 10, 8, 20, 16],
      next: 40,
      distractors: [32, 24, 36, 42, 48],
      rule: 'Interleaved two-tier series: Odd terms x2 (2, 4, 8, 16). Even terms x2 (5, 10, 20 -> 40).'
    },
    {
      seq: [1, 4, 9, 16, 25, 36],
      next: 49,
      distractors: [45, 48, 52, 64, 42],
      rule: 'Squares sequence: 1^2, 2^2, 3^2, 4^2, 5^2, 6^2 -> 7^2 = 49.'
    }
  ];

  const list: CognitiveQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const item = archetypes[i % archetypes.length];
    const options = [
      String(item.next),
      String(item.distractors[0]),
      String(item.distractors[1]),
      String(item.distractors[2]),
      String(item.distractors[3]),
      String(item.distractors[4])
    ];

    list.push({
      id: `cog-numerical-${i}`,
      track: 'ab-initio',
      module: 'cognitive',
      category: 'AON Cognitive: Numerical Series',
      difficulty: 'Medium',
      cognitivePart: 3,
      question: `Determine the missing mathematical term («?») in the sequence:\n\n${item.seq.join(', ')}, ?`,
      options,
      correctAnswerIndex: 0,
      explanationEn: `Mathematical rule: ${item.rule}`,
      explanationRu: `Математическое правило: ${item.rule}`,
      formulaShortcut: 'Look for first differences (d1 = x2 - x1) and interleaved odd/even sub-chains.',
      timeLimitSeconds: 60,
    });
  }

  return list;
}

// -------------------------------------------------------------
// PART 4: VERBAL REASONING (Semantic Analogies & Deductions | 4 Options)
// -------------------------------------------------------------
export function generateVerbalQuestions(count: number = 8): CognitiveQuestion[] {
  const verbalBank = [
    {
      prompt: 'ALTIMETER is to ALTITUDE as ANEMOMETER is to:',
      options: ['Wind Speed', 'Atmospheric Pressure', 'Fuel Mass', 'Compass Heading'],
      correct: 0,
      en: 'An altimeter measures altitude; an anemometer measures wind / airspeed velocity.',
      ru: 'Альтиметр измеряет высоту; анемометр измеряет скорость ветра и воздушного потока.'
    },
    {
      prompt: 'Which word is the ODD ONE OUT based on physical principles?',
      options: ['Titanium', 'Hydraulic Fluid', 'Kerosene', 'Liquid Nitrogen'],
      correct: 0,
      en: 'Titanium is a solid metal; Hydraulic Fluid, Kerosene, and Liquid Nitrogen are liquids/fluids.',
      ru: 'Титан — твердый конструкционный металл; гидрожидкость, авиакеросин и жидкий азот — жидкости.'
    },
    {
      prompt: 'Premise 1: Aircraft KC-901 is faster than KC-902.\nPremise 2: Aircraft KC-903 is slower than KC-902.\nConclusion: KC-901 is faster than KC-903.',
      options: ['True (Logically Follows)', 'False', 'Cannot Say / Insufficient Information', 'Invalid Premise'],
      correct: 0,
      en: 'Transitive inequality: KC-901 > KC-902 > KC-903. Therefore, KC-901 > KC-903 is strictly True.',
      ru: 'Транзитивное неравенство: KC-901 > KC-902 > KC-903. Следовательно, KC-901 строго быстрее KC-903 (True).'
    },
    {
      prompt: 'WING is to LIFT as RUDDER is to:',
      options: ['Yaw / Directional Control', 'Thrust Acceleration', 'Pitch Up', 'Cabin Pressurization'],
      correct: 0,
      en: 'The wing generates lift force; the rudder generates aerodynamic yaw (directional heading control).',
      ru: 'Крыло создает подъемную силу; руль направления (Rudder) создает управляющий момент рыскания (Yaw).'
    }
  ];

  const list: CognitiveQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const item = verbalBank[i % verbalBank.length];

    list.push({
      id: `cog-verbal-${i}`,
      track: 'ab-initio',
      module: 'cognitive',
      category: 'AON Cognitive: Verbal Reasoning',
      difficulty: 'Medium',
      cognitivePart: 4,
      question: item.prompt,
      options: item.options,
      correctAnswerIndex: item.correct,
      explanationEn: item.en,
      explanationRu: item.ru,
      formulaShortcut: 'Strict deduction: Isolate the semantic relation (Instrument : Measurement; Cause : Effect).',
      timeLimitSeconds: 50,
    });
  }

  return list;
}
