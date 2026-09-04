ExoNet --- AI-Enabled Exoplanet Detection from Noisy Astronomical Light Curves
Bharatiya Antariksh Hackathon 2026 · Problem Statement PS-07
An explainable, physics-grounded pipeline for turning noisy TESS light curves into candidate detections, astrophysical dispositions, fitted transit parameters, uncertainty estimates, and confidence-scored catalogues.
� � � � � �
🌌 What is ExoNet?
ExoNet is a proposed end-to-end exoplanet detection and vetting system designed for noisy astronomical light curves, with TESS data as the primary target.
The core idea is simple:
Raw Astronomical Light Curve
            │
            ▼
      Data Acquisition
            │
            ▼
        Detrending
            │
            ▼
      BLS / TLS Search
            │
            ▼
  Astrophysical Pre-Vetting
   ┌────────┼──────────┐
   │        │          │
Odd/Even  Secondary  Centroid
 Depth     Eclipse     Shift
   └────────┼──────────┘
            │
            ▼
      Feature Extraction
            │
            ▼
     AI Ensemble Model
     ┌──────┴──────┐
     │             │
    CNN         XGBoost
     │             │
     └──────┬──────┘
            ▼
       Disposition
            │
            ▼
   Transit Parameter Fit
      Mandel–Agol
            │
            ▼
        MCMC / Uncertainty
            │
            ▼
 Confidence + False Alarm
       Probability
            │
            ▼
 Classified Exoplanet
       Catalogue
Unlike a system that simply classifies phase-folded dips, ExoNet is designed around a more important astronomical challenge: distinguishing genuine transit-like signals from astrophysical and instrumental false positives.
🎯 Problem Statement
PS-07 --- AI-enabled Detection of Exoplanets from Noisy Astronomical Light Curves
Astronomical light curves contain noise, stellar variability, instrumental artifacts, eclipsing binaries, blends, starspots, and other signals that can resemble planetary transits.
A useful detection system therefore needs more than a classifier. It needs a reproducible pipeline that can:
Acquire astronomical light-curve data.
Remove or suppress unwanted variability and noise.
Detect periodic transit-like signals.
Vet candidates using physically meaningful tests.
Classify candidates into scientifically useful dispositions.
Estimate transit parameters.
Quantify uncertainty and detection confidence.
Present results in a researcher-friendly interface.
ExoNet is designed around these requirements.
✨ Why ExoNet is Different
1. Detection before classification
The system does not blindly send every light curve to a neural network.
A classical BLS/TLS search first identifies periodic transit-like candidates. Only candidates passing the configured detection threshold proceed to more expensive AI inference.
This reduces unnecessary computation and makes the ML stage easier to interpret.
2. Physics-aware false-positive rejection
Before final AI disposition, the candidate can be checked using:
Odd/even transit-depth consistency
Secondary-eclipse search
Centroid-shift proxy
Aperture-sensitivity checks
Periodic transit morphology
This creates a physics-grounded screening layer instead of treating the problem as pure image/signal classification.
3. Hybrid AI ensemble
ExoNet combines two complementary representations:
1D CNN - Learns morphology from phase-folded flux. - Captures the shape and local structure of transit-like events.
XGBoost - Operates on engineered/tabular features. - Uses signal-detection and astrophysical features that are difficult to encode efficiently in a raw waveform alone.
The two predictions can be ensembled for a final disposition.
4. Parameter estimation + uncertainty
Detection is not the end of the pipeline.
For promising candidates, ExoNet is designed to fit a Mandel--Agol transit model and estimate parameters such as:
Orbital period
Transit depth
Transit duration
MCMC-based inference is intended to provide posterior distributions and uncertainty bounds rather than reporting a single overconfident number.
5. Confidence is not just a probability
The proposed confidence layer combines:
BLS/TLS signal significance
AI classifier probability
Bootstrap-derived False Alarm Probability (FAP)
The objective is to distinguish:
"The model thinks this looks like a transit."
from
"The signal is statistically significant and the candidate also looks astrophysically plausible."
🧠 Candidate Disposition Classes
The target multi-class disposition is:
Class                               Meaning
🪐 Transit                      Transit-like planetary candidate
⭐ Eclipsing Binary             Stellar eclipse likely to mimic a planetary transit
🔀 Blend                        Contamination from another source / crowded-field blending
🌟 Starspot                     Stellar activity producing a transit-like modulation
📉 Noise                        Insufficient or non-astrophysical evidence
The exact class probabilities and decision thresholds should be calibrated on the training/validation catalogue rather than hard-coded arbitrarily.
🏗️ System Architecture
ExoNet is organized into four conceptual layers.
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│ Streamlit / Web Dashboard · Candidate Explorer · Reports   │
└───────────────────────────────▲─────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────┐
│                       AI / ML LAYER                         │
│  1D CNN · XGBoost · Ensemble Disposition · MCMC Inference  │
└───────────────────────────────▲─────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────┐
│                       PROCESSING LAYER                      │
│ Detrending · BLS/TLS · Vetting · Feature Engineering      │
└───────────────────────────────▲─────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────┐
│                         DATA LAYER                          │
│ TESS Light Curves · MAST · Lightkurve · Labelled Catalogue│
└─────────────────────────────────────────────────────────────┘
🔭 Scientific Pipeline
Stage 1 --- Data Acquisition
Primary data source:
NASA TESS public light curves
MAST archive
lightkurve
astroquery
The intended production pipeline should be able to fetch light curves by target identifier rather than relying on manually prepared samples.
Stage 2 --- Detrending & Cleaning
Typical preprocessing:
Raw Flux
   │
   ├── Remove invalid / missing samples
   ├── Sigma clipping
   ├── Normalize flux
   ├── Remove long-term stellar/instrumental trends
   └── Preserve short-duration transit morphology
            │
            ▼
      Cleaned Light Curve
Candidate implementations include:
wotan
scipy
Savitzky--Golay filtering
astropy.timeseries
Important: detrending must not remove the transit signal itself. The production implementation should therefore evaluate multiple detrending windows and validate transit-depth preservation.
Stage 3 --- Periodic Transit Search
Two complementary approaches are planned:
BLS --- Box Least Squares
Useful for detecting box-shaped periodic transit signatures efficiently.
TLS --- Transit Least Squares
More physically informed transit-search modelling.
The proposed candidate threshold is:
SDE > 7
Candidates below the configured threshold can be rejected or retained as low-significance candidates depending on the operating mode.
🧪 Stage 4 --- Astrophysical Vetting
A key ExoNet design principle is:
Do not let the neural network be the first and only judge.
Odd--Even Depth Test
Compare alternating transit depths.
A significant mismatch can indicate an eclipsing binary rather than a planet.
Secondary Eclipse Search
Search for a second event at the expected orbital phase.
A strong secondary eclipse may indicate a stellar companion.
Centroid Shift Proxy
Check whether the apparent source position changes during the transit-like event.
A shift can indicate contamination or a nearby eclipsing source.
Aperture Sensitivity
Repeat the detection using different photometric apertures where possible.
A signal that changes dramatically with aperture selection deserves additional scrutiny.
🤖 Stage 5 --- AI Classification
1D CNN
Input:
Phase-folded normalized flux
        │
        ▼
   1D Convolution
        │
        ▼
 Non-linear Features
        │
        ▼
   Dense Layers
        │
        ▼
 Class Probabilities
The CNN focuses on signal morphology.
XGBoost
The tabular model consumes engineered features such as:
BLS/TLS significance
Transit depth
Transit duration
Period
Odd/even depth difference
Secondary-eclipse indicators
Centroid-related features
Shape/statistical descriptors
The final system can ensemble the outputs:
CNN probability
       +
XGBoost probability
       +
Physics-based vetting
       │
       ▼
Final candidate disposition
📐 Stage 6 --- Transit Parameter Estimation
Promising candidates proceed to transit-model fitting.
The planned model family is Mandel--Agol, implemented through packages such as:
batman-package
exoplanet
Primary fitted quantities include:
Period
Transit depth
Transit duration
The inference layer should return:
Best estimate
Lower uncertainty bound
Upper uncertainty bound
Posterior distribution
rather than only a point estimate.
🎲 Stage 7 --- Confidence & False Alarm Probability
ExoNet separates classification confidence from statistical significance.
Conceptually:
BLS/TLS SDE ─────────┐
                     ├──► Calibrated Confidence
CNN probability ─────┤
XGBoost probability ┘

Bootstrap / null tests ───► False Alarm Probability
Why this matters
A model can be highly confident about a signal that is actually caused by a systematic artifact.
Therefore:
High ML probability ≠ confirmed planet.
The dashboard should make this distinction explicit.
📊 Validation Strategy
The proposed ground truth includes:
Confirmed TESS planets
Known eclipsing binaries
Catalogue false positives
ExoFOP-labelled dispositions
Classification Metrics
Report:
Precision
Recall
F1-score
ROC-AUC
Confusion matrix
Per-class recall
Accuracy alone should not be the primary metric because the classes can be highly imbalanced.
Parameter Validation
For confirmed targets:
| fitted value − published value |
---------------------------------- × 100
        published value
Compare fitted:
Period
Transit depth
Duration
against trusted published values.
Uncertainty Calibration
MCMC posterior widths should be compared with published uncertainty ranges.
The goal is to avoid a system that produces precise-looking but unjustified estimates.
⚠️ Risk Mitigation
Risk                                Mitigation
Stellar blends                      Centroid proxy + aperture sensitivity
Eclipsing binaries                  Odd/even + secondary-eclipse tests
Class imbalance                     SMOTE + class-weighted loss
Overfitting                         K-fold validation across targets/sectors
Single-sector bias                  Cross-sector evaluation
Expensive inference                 TLS/BLS pre-filter before CNN
Overconfident AI                    Probability calibration + FAP
Detrending removes transit          Transit-preservation tests
Noisy labels                        Separate training labels from independent validation labels
🖥️ Current Repository: Web Demonstration
The repository supplied with this project is currently a Next.js-based interactive frontend/demo, not the complete scientific backend.
Current frontend stack:
Next.js 16.2.9
React 19.2.4
TypeScript
Tailwind CSS 4
Framer Motion
Recharts
Lucide React
jsPDF
The current interface contains components for:
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── AIInsights.tsx
│   ├── ChatAssistant.tsx
│   ├── DashboardSection.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── PipelineSection.tsx
│   ├── ProjectOverview.tsx
│   └── TechnologyRoadmap.tsx
│
├── data/
│   └── stars.ts
│
└── utils/
    └── pdfGenerator.ts
Current demo capabilities
The frontend is designed to communicate the ExoNet concept through:
Astronomer-style dashboard UI
Candidate/target exploration
Pipeline visualization
AI insight presentation
Technology roadmap
Interactive charts
PDF report generation
Responsive web interface
Important implementation status
The current repository does not contain the full Python scientific pipeline described above. In particular, the supplied codebase does not currently include the actual BLS/TLS engine, trained CNN/XGBoost models, MCMC inference service, MAST ingestion service, or a production database.
Those are backend/scientific implementation stages required to turn the current demonstration layer into the complete operational ExoNet system.
This distinction is intentional and should be preserved in technical documentation and judging demos.
🚀 Quick Start --- Web Demo
Requirements
Node.js 20+ recommended
npm
Modern browser
Installation
git clone <YOUR_REPOSITORY_URL>
cd ExoNet-main
npm install
Development
npm run dev
Open:
http://localhost:3000
Production Build
npm run build
npm start
Lint
npm run lint
🧩 Recommended Full Production Architecture
To evolve the current frontend into a real detection platform:
┌─────────────────────┐
                         │     TESS / MAST     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Data Ingestion API  │
                         │ lightkurve/astroquery│
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Preprocessing Worker │
                         │ cleaning/detrending  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ BLS / TLS Candidate │
                         │       Search        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Physics Vetting    │
                         │ odd/even · secondary│
                         │ centroid · aperture │
                         └──────────┬──────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │       ML Inference API       │
                    │   CNN + XGBoost Ensemble     │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │  Transit Fit / MCMC Worker   │
                    │       batman / exoplanet     │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │ Confidence + FAP Calibration │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
              ┌──────────────────────────────────────────┐
              │            Candidate Database            │
              │ results · parameters · uncertainty · FAP│
              └───────────────────┬──────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────────┐
                    │      ExoNet Web Console       │
                    │        Next.js frontend       │
                    └──────────────────────────────┘
🗂️ Recommended Backend Repository Structure
When implementing the scientific backend, a clean separation is preferable:
exonet/
├── frontend/
│   └── Next.js application
│
├── backend/
│   ├── api/
│   │   ├── routes/
│   │   └── schemas/
│   │
│   ├── ingestion/
│   │   ├── mast.py
│   │   └── lightkurve_loader.py
│   │
│   ├── preprocessing/
│   │   ├── cleaning.py
│   │   └── detrending.py
│   │
│   ├── detection/
│   │   ├── bls.py
│   │   └── tls.py
│   │
│   ├── vetting/
│   │   ├── odd_even.py
│   │   ├── secondary.py
│   │   ├── centroid.py
│   │   └── aperture.py
│   │
│   ├── features/
│   │   └── extraction.py
│   │
│   ├── models/
│   │   ├── cnn.py
│   │   ├── xgboost_model.py
│   │   └── ensemble.py
│   │
│   ├── fitting/
│   │   ├── transit_model.py
│   │   └── mcmc.py
│   │
│   ├── confidence/
│   │   ├── calibration.py
│   │   └── false_alarm.py
│   │
│   ├── evaluation/
│   │   ├── metrics.py
│   │   └── benchmark.py
│   │
│   └── tests/
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── metadata/
│
├── models/
│   ├── checkpoints/
│   └── scalers/
│
├── notebooks/
├── configs/
├── scripts/
├── docs/
└── README.md
🔌 Suggested API Contract
A production implementation can expose an API such as:
Submit target
POST /api/v1/targets
{
  "target_id": "TIC-XXXXXXXXX",
  "sector": 42
}
Run detection
POST /api/v1/detect
{
  "target_id": "TIC-XXXXXXXXX",
  "method": "tls"
}
Candidate response
{
  "target_id": "TIC-XXXXXXXXX",
  "period_days": 3.421,
  "transit_depth": 0.0081,
  "duration_hours": 2.14,
  "sde": 11.7,
  "cnn_probability": 0.94,
  "xgb_probability": 0.91,
  "disposition": "Transit",
  "confidence": 0.92,
  "false_alarm_probability": 0.003,
  "uncertainty": {
    "period": [-0.012, 0.015],
    "depth": [-0.0007, 0.0008],
    "duration": [-0.18, 0.21]
  }
}
These values are an example API shape, not measured results from the current frontend.
📈 Performance Evaluation
A serious implementation should maintain separate datasets for:
Training
   │
   ├── Model development
   │
Validation
   │
   ├── Hyperparameter / threshold selection
   │
Test
   │
   └── Final unbiased evaluation
Avoid training and testing on different rows from the same target without grouping by target. Otherwise, leakage can produce deceptively strong results.
For astronomical data, evaluation should preferably include:
Target-level splits
Sector-aware splits
Class-balanced reporting
Per-class confusion matrices
Calibration curves
False-positive analysis
Robustness to injected transit signals
Performance under different noise levels
🧬 Synthetic Transit Injection
A powerful next step for validating detection sensitivity is injection-and-recovery testing.
Conceptually:
Real TESS Light Curve
        │
        ▼
Inject synthetic transit
        │
        ▼
Run complete ExoNet pipeline
        │
        ▼
Did the pipeline recover it?
       / \
     YES  NO
      │    │
      ▼    ▼
Record  Record
period  miss
depth
SNR
This allows measurement of detection completeness as a function of:
Transit depth
Period
Duration
Signal-to-noise ratio
Stellar noise
Number of observed transits
This should become a major scientific validation component before claiming operational performance.
🔐 Reproducibility Principles
Every scientific inference should be traceable.
A candidate record should ideally preserve:
Target ID
Sector
Data source
Data release/version
Preprocessing configuration
Detrending configuration
Search algorithm
Search threshold
Detected period
Vetting outputs
Feature vector
Model version
Model checkpoint
Model probabilities
Fitted parameters
MCMC configuration
Confidence calibration version
FAP calculation
Timestamp
This transforms the system from a visual demo into an auditable research workflow.
☁️ Deployment Strategy
Prototype
Recommended for hackathon demonstration:
Next.js frontend
      +
Python inference backend
      +
Local / small cloud storage
Research deployment
Next.js
   │
   ▼
FastAPI
   │
   ├── Redis / Queue
   │
   
