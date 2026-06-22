export interface LightCurvePoint {
  time: number; // in days or phase
  rawFlux: number;
  cleanedFlux: number;
  isTransit: boolean;
}

export interface FeatureContribution {
  name: string;
  value: number;
}

export interface TargetStar {
  id: string; // e.g., TIC 88863
  name: string;
  status: "Planet Candidate" | "Eclipsing Binary" | "Blend" | "Starspot";
  confidence: number; // e.g., 91%
  falsePositiveRisk: "Low" | "Medium" | "High";
  period: number; // in days
  duration: number; // in hours
  depth: number; // in ppm
  snr: number;
  metallicity: number; // [Fe/H]
  stellarRadius: number; // R_sun
  stellarMass: number; // M_sun
  temp: number; // Kelvin
  notes: string;
  explanation: string;
  xaiHeatmap: string; // Feature importance description
  lightCurve: LightCurvePoint[];
  foldedCurve: LightCurvePoint[];
  reasons: string[];
  contributions: FeatureContribution[];
}

// Helper to generate Gaussian random numbers
function randomNormal(mean = 0, stdDev = 1) {
  const u1 = Math.random();
  const u2 = Math.random();
  const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + stdDev * randStdNormal;
}

// Generate TIC 88863 - Planet Candidate (Clear Box Transit)
const generateTIC88863 = (): TargetStar => {
  const lightCurve: LightCurvePoint[] = [];
  const foldedCurve: LightCurvePoint[] = [];
  const period = 4.21;
  const transitMidpoint = 2.0;
  const durationDays = 2.63 / 24; // ~0.11 days
  const depth = 1462 / 1e6; // 0.001462 relative flux drop
  const noiseStd = 0.0003;

  for (let i = 0; i < 150; i++) {
    const time = 0.5 + (i * 3) / 150; // time span: 0.5 to 3.5 days
    let cleanedFlux = 1.0;
    const dt = Math.abs(time - transitMidpoint);
    const isTransit = dt < durationDays / 2;

    if (isTransit) {
      // Box-like transit shape with slight limb darkening (curved bottom)
      const x = dt / (durationDays / 2);
      cleanedFlux = 1.0 - depth * (1.0 - 0.1 * x * x);
    }

    const rawFlux = cleanedFlux + randomNormal(0, noiseStd);
    lightCurve.push({ time: parseFloat(time.toFixed(4)), rawFlux, cleanedFlux, isTransit });
  }

  // Folded curve (phase from -0.2 to 0.2)
  for (let i = 0; i < 100; i++) {
    const phase = -0.2 + (i * 0.4) / 100;
    let cleanedFlux = 1.0;
    const isTransit = Math.abs(phase) < (durationDays / 2) / period;
    
    if (isTransit) {
      const x = Math.abs(phase) / ((durationDays / 2) / period);
      cleanedFlux = 1.0 - depth * (1.0 - 0.1 * x * x);
    }
    const rawFlux = cleanedFlux + randomNormal(0, noiseStd * 0.6); // phase folding reduces noise
    foldedCurve.push({ time: parseFloat(phase.toFixed(4)), rawFlux, cleanedFlux, isTransit });
  }

  return {
    id: "TIC 88863",
    name: "TOI-2048",
    status: "Planet Candidate",
    confidence: 91.4,
    falsePositiveRisk: "Low",
    period: 4.21,
    duration: 2.63,
    depth: 1462,
    snr: 11.8,
    metallicity: 0.08,
    stellarRadius: 0.94,
    stellarMass: 0.96,
    temp: 5640,
    notes: "Symmetric U-shaped transit with limb darkening. No secondary eclipse detected in phase fold, confirming planetary candidate nature rather than an eclipsing binary.",
    explanation: "Deep Neural Network (ExoNet-v2) flagged a periodic transit signature at 4.21 days. Vetting with Transit Least Squares (TLS) confirms high signal-to-noise ratio. Centroid motion is within 0.05 arcseconds, eliminating background eclipsing binaries.",
    xaiHeatmap: "The neural network attention map focuses heavily on the transit ingress and egress points, validating that the classification is based on physical transit features rather than high-frequency noise or spacecraft jitter.",
    lightCurve,
    foldedCurve,
    reasons: [
      "Strong periodic dip detected every 4.21 days matching planetary model templates.",
      "Symmetric U-shaped transit profile with standard stellar limb darkening.",
      "Absence of any secondary eclipses in out-of-transit phases.",
      "Low spatial pixel contamination risk (centroid offset < 0.05 arcseconds).",
      "Sufficiently high Signal-to-Noise Ratio (SNR = 11.8) confirming candidate detection."
    ],
    contributions: [
      { name: "Periodicity", value: 35 },
      { name: "Transit Shape", value: 28 },
      { name: "Depth Stability", value: 20 },
      { name: "Low Contamination", value: 17 }
    ]
  };
};

// Generate TIC 41021 - Eclipsing Binary (Deep V-shape, secondary eclipse)
const generateTIC41021 = (): TargetStar => {
  const lightCurve: LightCurvePoint[] = [];
  const foldedCurve: LightCurvePoint[] = [];
  const period = 12.45;
  const transitMidpoint = 2.0;
  const durationDays = 4.12 / 24;
  const depth = 8500 / 1e6; // Deep primary eclipse
  const secondaryDepth = 1200 / 1e6; // Secondary eclipse at phase 0.5
  const noiseStd = 0.0002;

  for (let i = 0; i < 150; i++) {
    const time = 0.5 + (i * 3) / 150; // time span: 0.5 to 3.5 days
    let cleanedFlux = 1.0;
    const dt = Math.abs(time - transitMidpoint);
    const isTransit = dt < durationDays / 2;

    if (isTransit) {
      // V-shaped transit (triangular)
      const x = dt / (durationDays / 2);
      cleanedFlux = 1.0 - depth * (1.0 - x);
    }

    const rawFlux = cleanedFlux + randomNormal(0, noiseStd);
    lightCurve.push({ time: parseFloat(time.toFixed(4)), rawFlux, cleanedFlux, isTransit });
  }

  // Folded curve (phase from -0.1 to 0.6 to capture both primary and secondary)
  for (let i = 0; i < 120; i++) {
    const phase = -0.1 + (i * 0.7) / 120;
    let cleanedFlux = 1.0;
    
    // Primary eclipse at phase 0.0
    const isPrimary = Math.abs(phase) < (durationDays / 2) / period;
    // Secondary eclipse at phase 0.5
    const isSecondary = Math.abs(phase - 0.5) < (durationDays / 2) / period;

    if (isPrimary) {
      const x = Math.abs(phase) / ((durationDays / 2) / period);
      cleanedFlux = 1.0 - depth * (1.0 - x);
    } else if (isSecondary) {
      const x = Math.abs(phase - 0.5) / ((durationDays / 2) / period);
      cleanedFlux = 1.0 - secondaryDepth * (1.0 - x);
    }

    const rawFlux = cleanedFlux + randomNormal(0, noiseStd * 0.5);
    const isTransit = isPrimary || isSecondary;
    foldedCurve.push({ time: parseFloat(phase.toFixed(4)), rawFlux, cleanedFlux, isTransit });
  }

  return {
    id: "TIC 41021",
    name: "Stellar EB-410",
    status: "Eclipsing Binary",
    confidence: 98.2,
    falsePositiveRisk: "High",
    period: 12.45,
    duration: 4.12,
    depth: 8500,
    snr: 34.2,
    metallicity: -0.15,
    stellarRadius: 1.45,
    stellarMass: 1.32,
    temp: 6800,
    notes: "Deep V-shaped primary transit characteristic of grazing stellar eclipses. Secondary eclipse detected at phase 0.5 with 1200 ppm depth, confirming a binary star system.",
    explanation: "High confidence classification of Eclipsing Binary (EB) due to the distinct V-shape (sharp dip without flat bottom) indicating a non-planetary occultation. The presence of a secondary eclipse confirms the presence of a self-luminous secondary companion (smaller star).",
    xaiHeatmap: "Explainable AI maps highlight the primary transit shape AND the secondary eclipse region, noting the secondary dip as a crucial negative indicator for exoplanet status.",
    lightCurve,
    foldedCurve,
    reasons: [
      "Deep, sharp V-shaped transit profile pointing to grazing stellar occultations rather than spherical planets.",
      "Definitive secondary eclipse detected at phase 0.5 (1200 ppm depth) confirming self-luminous companion.",
      "Transit duration varies slightly across cycles due to binary gravitational perturbations.",
      "Very high SNR (34.2) showing stable stellar binary orbital alignment."
    ],
    contributions: [
      { name: "Secondary Eclipse", value: 42 },
      { name: "Transit Shape", value: 30 },
      { name: "Gravity Variations", value: 15 },
      { name: "Radius Model Fit", value: 13 }
    ]
  };
};

// Generate TIC 27744 - Blend (Shallow dip, high background noise, centroid offset)
const generateTIC27744 = (): TargetStar => {
  const lightCurve: LightCurvePoint[] = [];
  const foldedCurve: LightCurvePoint[] = [];
  const period = 8.82;
  const transitMidpoint = 2.0;
  const durationDays = 3.2 / 24;
  const depth = 320 / 1e6; // very shallow
  const noiseStd = 0.00065; // noisy signal, masks shallow transit

  for (let i = 0; i < 150; i++) {
    const time = 0.5 + (i * 3) / 150;
    let cleanedFlux = 1.0;
    const dt = Math.abs(time - transitMidpoint);
    const isTransit = dt < durationDays / 2;

    if (isTransit) {
      const x = dt / (durationDays / 2);
      cleanedFlux = 1.0 - depth * (1.0 - 0.2 * x * x);
    }

    const rawFlux = cleanedFlux + randomNormal(0, noiseStd);
    lightCurve.push({ time: parseFloat(time.toFixed(4)), rawFlux, cleanedFlux, isTransit });
  }

  // Folded curve (phase from -0.15 to 0.15)
  for (let i = 0; i < 100; i++) {
    const phase = -0.15 + (i * 0.3) / 100;
    let cleanedFlux = 1.0;
    const isTransit = Math.abs(phase) < (durationDays / 2) / period;

    if (isTransit) {
      const x = Math.abs(phase) / ((durationDays / 2) / period);
      cleanedFlux = 1.0 - depth * (1.0 - 0.2 * x * x);
    }

    const rawFlux = cleanedFlux + randomNormal(0, noiseStd * 0.35); // noise reduced by 1/sqrt(N)
    foldedCurve.push({ time: parseFloat(phase.toFixed(4)), rawFlux, cleanedFlux, isTransit });
  }

  return {
    id: "TIC 27744",
    name: "Background EB Blend",
    status: "Blend",
    confidence: 76.5,
    falsePositiveRisk: "Medium",
    period: 8.82,
    duration: 3.20,
    depth: 320,
    snr: 4.5,
    metallicity: 0.02,
    stellarRadius: 0.81,
    stellarMass: 0.78,
    temp: 4950,
    notes: "Shallow transit signal. Vetting pipeline detected a centroid offset of 1.4 arcseconds during transit, indicating the dip originates from a nearby background star.",
    explanation: "Although the folded light curve shows a valid planet-like dip, spatial pixel vetting shows the center-of-light shifts towards a background star during the dip. This indicates the signal is blended light from a background eclipsing binary.",
    xaiHeatmap: "The model flags the centroid position variance profile rather than the light curve itself as the primary contributor to the 'Blend' class classification.",
    lightCurve,
    foldedCurve,
    reasons: [
      "Spatial pixel centroid offset of 1.4 arcseconds detected during transit, mapping the signal source to a background star.",
      "Extremely shallow transit depth (320 ppm) consistent with diluted background binary light.",
      "Low signal-to-noise ratio (SNR = 4.5) indicating high background star contamination."
    ],
    contributions: [
      { name: "Centroid Offset", value: 50 },
      { name: "Transit Dilution", value: 25 },
      { name: "Pixel Correlation", value: 15 },
      { name: "Stellar Context", value: 10 }
    ]
  };
};

// Generate TIC 50932 - Starspot / Stellar Active rotation (sinusoidal)
const generateTIC50932 = (): TargetStar => {
  const lightCurve: LightCurvePoint[] = [];
  const foldedCurve: LightCurvePoint[] = [];
  const noiseStd = 0.0009; // High instrument or stellar noise
  const period = 2.45; // Stellar rotation period

  for (let i = 0; i < 150; i++) {
    const time = 0.5 + (i * 3) / 150;
    // Stellar variability (sine wave with spots decay)
    const stellarVariability = 0.0007 * Math.sin((time * 2 * Math.PI) / 1.5);
    const cleanedFlux = 1.0 + stellarVariability;
    const rawFlux = cleanedFlux + randomNormal(0, noiseStd);
    lightCurve.push({
      time: parseFloat(time.toFixed(4)),
      rawFlux,
      cleanedFlux,
      isTransit: false,
    });
  }

  // Folded curve
  for (let i = 0; i < 100; i++) {
    const phase = -0.2 + (i * 0.8) / 100;
    // Stellar spot modulation
    const cleanedFlux = 1.0 + 0.0007 * Math.sin(phase * 2 * Math.PI);
    const rawFlux = cleanedFlux + randomNormal(0, noiseStd * 0.4);
    foldedCurve.push({
      time: parseFloat(phase.toFixed(4)),
      rawFlux,
      cleanedFlux,
      isTransit: false,
    });
  }

  return {
    id: "TIC 50932",
    name: "Active Star Var",
    status: "Starspot",
    confidence: 92.1,
    falsePositiveRisk: "High",
    period: 2.45,
    duration: 0.0,
    depth: 0,
    snr: 1.5,
    metallicity: 0.12,
    stellarRadius: 1.15,
    stellarMass: 1.08,
    temp: 5900,
    notes: "Stellar rotation and starspots causing sinusoidal flux variability. Instrumental spacecraft pointing noise (jitter) dominates the light curve.",
    explanation: "Vetting algorithms (BLS/TLS) did not identify any statistically significant periodic transits. The raw signal contains high-frequency thermal variations and low-frequency stellar activity.",
    xaiHeatmap: "The neural network shows random and dispersed attention weights across the entire light curve sequence, confirming the absence of localized physical transit signatures.",
    lightCurve,
    foldedCurve,
    reasons: [
      "Sinusoidal flux variation matching typical starspot rotational modulation (1.5 day period).",
      "No sharp transit-like ingress/egress profiles detected.",
      "Highly irregular scatter and low signal-to-noise ratio (SNR = 1.5).",
      "Lack of clean phase folding alignment at any candidate period."
    ],
    contributions: [
      { name: "Rotational Period", value: 45 },
      { name: "Irregular Scatter", value: 30 },
      { name: "Absence of Ingress", value: 20 },
      { name: "Pointing Jitter", value: 5 }
    ]
  };
};

export const TARGET_STARS: TargetStar[] = [
  generateTIC88863(),
  generateTIC41021(),
  generateTIC27744(),
  generateTIC50932(),
];
