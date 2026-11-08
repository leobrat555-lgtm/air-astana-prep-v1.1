/**
 * Comprehensive Encyclopedic Aviation & Engineering Theory Articles
 * Air Astana Fleet, Aerodynamics, EASA Part-66, Jet Engines & Regulations
 */

export interface TheoryArticle {
  id: string;
  category: 'flight' | 'systems' | 'fleet' | 'easa';
  title: string;
  badge: string;
  readingTime: string;
  summary: string;
  formulas: { label: string; formula: string; explanation: string }[];
  bulletPoints: string[];
  airAstanaContext: string;
}

export const AVIATION_THEORY_LIBRARY: TheoryArticle[] = [
  {
    id: 'aerodynamics-lift-drag',
    category: 'flight',
    title: 'Aerodynamics: Lift Formula, Inducted vs. Parasite Drag & V-Speeds',
    badge: '✈️ Flight Principles',
    readingTime: '4 min read',
    summary: 'The physical foundation of fixed-wing atmospheric flight based on Bernoulli pressure gradients and Newton third law. Critical for COMPASS and technical interviews.',
    formulas: [
      {
        label: 'Aerodynamic Lift Equation',
        formula: 'L = CL · (½ · ρ · V²) · S',
        explanation: 'CL = Lift coefficient (camber & angle of attack), ρ = air density (decreases with altitude), V = true airspeed, S = wing planform surface area.'
      },
      {
        label: 'Rate of Descent on 3° Glideslope',
        formula: 'ROD (ft/min) = Ground Speed (kts) × 5',
        explanation: 'Standard instrument glidepath: at 140 kts approach ground speed, target ROD = 140 × 5 = 700 ft/min.'
      },
      {
        label: 'Top of Descent (TOD) Rule of Thumb',
        formula: 'Distance (NM) = Altitude to Lose (ft) / 1000 × 3',
        explanation: 'From FL350 to 5,000 ft (lose 30,000 ft): 30 × 3 = 90 NM from airport (add 10 NM decelerate buffer).'
      }
    ],
    bulletPoints: [
      'Total Drag is the sum of Parasite Drag (increases with V²) and Induced Drag (inversely proportional to V²).',
      'The intersection of Induced and Parasite drag defines Vmd (minimum drag speed) and maximum endurance glide speed.',
      'Air Astana SOP: Clean approach stabilization criteria by 1,000 ft IMC or 500 ft VMC.'
    ],
    airAstanaContext: 'Air Astana operates Airbus A320neo and A321LR aircraft equipped with Fly-By-Wire flight envelope protection (Alpha Floor, high-angle of attack protection).'
  },
  {
    id: 'skydrol-hydraulics-systems',
    category: 'systems',
    title: 'Aircraft Hydraulics: Skydrol Phosphate-Ester & Pascal Law',
    badge: '🔧 Hydraulic Architecture',
    readingTime: '5 min read',
    summary: 'High-pressure 3,000 PSI fluid power transmission operating primary flight control surfaces, landing gear actuation, and braking assemblies.',
    formulas: [
      {
        label: 'Pascal Fluid Pressure Law',
        formula: 'P = F / A  ==>  F2 = F1 · (A2 / A1)',
        explanation: 'A small control force on master cylinder piston area A1 produces massive mechanical force at slave piston area A2.'
      },
      {
        label: 'Hydraulic Power Transfer Unit (PTU)',
        formula: 'P_green = P_yellow (Zero fluid transfer)',
        explanation: 'The PTU couples hydraulic pressure between Green and Yellow circuits mechanically without intermixing fluid volumes.'
      }
    ],
    bulletPoints: [
      'Commercial airliners use Skydrol (Phosphate-Ester base) for its extreme fire resistance and low freeze point (-65°C).',
      'Three independent circuits (Green, Blue, Yellow on Airbus; System A, B, Standby on Boeing) provide triple redundancy.',
      'Ram Air Turbine (RAT) deploys automatically into the slipstream if dual engine failure occurs to supply emergency 3,000 PSI pressure.'
    ],
    airAstanaContext: 'Air Astana EASA Part-145 hangar line engineers regularly conduct A-checks and hydraulic filtration testing in Almaty (ALA) and Astana (NQZ).'
  },
  {
    id: 'fleet-a321lr-b767',
    category: 'fleet',
    title: 'Air Astana Flagship Fleet: Airbus A321LR with ACT Tanks & Boeing 767',
    badge: '🇰🇿 Nomad Fleet',
    readingTime: '4 min read',
    summary: 'The operational engineering backbone of Air Astana long-range narrow-body operations connecting Central Asia, Europe, and Southeast Asia.',
    formulas: [
      {
        label: 'Specific Fuel Consumption (SFC)',
        formula: 'SFC = Fuel Mass Flow / Thrust Output',
        explanation: 'CFM LEAP-1A engines on Air Astana A321neo provide 15-20% fuel burn reduction compared to previous generation CFM56-5B.'
      }
    ],
    bulletPoints: [
      'The Airbus A321LR features up to 3 Additional Centre Tanks (ACT) in the lower cargo hold, extending range to 4,000 NM (7,400 km).',
      'Routes operated: Almaty to London Heathrow (non-stop), Frankfurt, Seoul Incheon, and Dubai.',
      'FlyArystan (low-cost subsidiary) operates high-density all-economy Airbus A320neo configurations.'
    ],
    airAstanaContext: 'Air Astana was named Best Airline in Central Asia and CIS by Skytrax multiple years in a row, emphasizing safety culture and fleet modernization.'
  },
  {
    id: 'easa-part66-safety-wiring',
    category: 'easa',
    title: 'EASA Part-66 Hangar Practice: Safety Lockwiring, Torque Limits & FOD',
    badge: '🔩 EASA Engineering',
    readingTime: '5 min read',
    summary: 'Mechanical fastening standards, wire-locking direction of pull, calibrated torque wrench techniques, and Foreign Object Debris prevention.',
    formulas: [
      {
        label: 'Safety Wire Twist Density',
        formula: '6 to 8 twists per inch (25.4 mm)',
        explanation: 'Standard MS20995 stainless steel safety wire (0.032 inch / 0.8 mm) requires 6-8 uniform twists per inch to prevent fastener loosening.'
      }
    ],
    bulletPoints: [
      'Positive pull direction: The safety wire must always be routed so that it pulls the bolt in the tightening (clockwise) direction.',
      'Pigtail finish: 3 to 6 twists at the end, bent back toward the bolt head to prevent injury to maintenance personnel.',
      'Just Culture: Air Astana promotes an open reporting culture where honest maintenance errors are reported immediately without punitive fear.'
    ],
    airAstanaContext: 'Air Astana Apprentice candidates undergo rigorous bench tests on safety wire lockwiring and sheet metal fabrication during hangar assessments.'
  }
];
