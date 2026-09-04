# ExoNet --- AI-Enabled Exoplanet Detection from Noisy Astronomical Light Curves

> **Bharatiya Antariksh Hackathon 2026 · Problem Statement PS-07**\
> An explainable, physics-grounded pipeline for turning noisy TESS light
> curves into candidate detections, astrophysical dispositions, fitted
> transit parameters, uncertainty estimates, and confidence-scored
> catalogues.

[![Hackathon](https://img.shields.io/badge/Bharatiya%20Antariksh%20Hackathon-2026-ff6f00)](#)
[![Problem
Statement](https://img.shields.io/badge/PS--07-Exoplanet%20Detection-263b63)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-TBD-lightgrey)](#license)

------------------------------------------------------------------------

## 🌌 What is ExoNet?

**ExoNet** is a proposed end-to-end exoplanet detection and vetting
system designed for **noisy astronomical light curves**, with TESS data
as the primary target.

The core idea is simple:

``` text
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
```

Unlike a system that simply classifies phase-folded dips, ExoNet is
designed around a more important astronomical challenge:
**distinguishing genuine transit-like signals from astrophysical and
instrumental false positives.**

------------------------------------------------------------------------

## 🎯 Problem Statement

**PS-07 --- AI-enabled Detection of Exoplanets from Noisy Astronomical
Light Curves**

Astronomical light curves contain noise, stellar variability,
instrumental artifacts, eclipsing binaries, blends, starspots, and other
signals that can resemble planetary transits.

A useful detection system therefore needs more than a classifier. It
needs a reproducible pipeline that can:

1.  Acquire astronomical light-curve data.
2.  Remove or suppress unwanted variability and noise.
3.  Detect periodic transit-like signals.
4.  Vet candidates using physically meaningful tests.
5.  Classify candidates into scientifically useful dispositions.
6.  Estimate transit parameters.
7.  Quantify uncertainty and detection confidence.
8.  Present results in a researcher-friendly interface.

ExoNet is designed around these requirements.

------------------------------------------------------------------------

# ✨ Why ExoNet is Different

### 1. Detection before classification

The system does not blindly send every light curve to a neural network.

A classical **BLS/TLS search** first identifies periodic transit-like
candidates. Only candidates passing the configured detection threshold
proceed to more expensive AI inference.

This reduces unnecessary computation and makes the ML stage easier to
interpret.

### 2. Physics-aware false-positive rejection

Before final AI disposition, the candidate can be checked using:

-   Odd/even transit-depth consistency
-   Secondary-eclipse search
-   Centroid-shift proxy
-   Aperture-sensitivity checks
-   Periodic transit morphology

This creates a **physics-grounded screening layer** instead of treating
the problem as pure image/signal classification.

### 3. Hybrid AI ensemble

ExoNet combines two complementary representations:

**1D CNN** - Learns morphology from phase-folded flux. - Captures the
shape and local structure of transit-like events.

**XGBoost** - Operates on engineered/tabular features. - Uses
signal-detection and astrophysical features that are difficult to encode
efficiently in a raw waveform alone.

The two predictions can be ensembled for a final disposition.

### 4. Parameter estimation + uncertainty

Detection is not the end of the pipeline.

For promising candidates, ExoNet is designed to fit a **Mandel--Agol
transit model** and estimate parameters such as:

-   Orbital period
-   Transit depth
-   Transit duration

MCMC-based inference is intended to provide posterior distributions and
uncertainty bounds rather than reporting a single overconfident number.

### 5. Confidence is not just a probability

The proposed confidence layer combines:

-   BLS/TLS signal significance
-   AI classifier probability
-   Bootstrap-derived False Alarm Probability (FAP)

The objective is to distinguish:

> **"The model thinks this looks like a transit."**

from

> **"The signal is statistically significant and the candidate also
> looks astrophysically plausible."**

------------------------------------------------------------------------

# 🧠 Candidate Disposition Classes

The target multi-class disposition is:

  -----------------------------------------------------------------------
  Class                               Meaning
  ----------------------------------- -----------------------------------
  🪐 **Transit**                      Transit-like planetary candidate

  ⭐ **Eclipsing Binary**             Stellar eclipse likely to mimic a
                                      planetary transit

  🔀 **Blend**                        Contamination from another source /
                                      crowded-field blending

  🌟 **Starspot**                     Stellar activity producing a
                                      transit-like modulation

  📉 **Noise**                        Insufficient or non-astrophysical
                                      evidence
  -----------------------------------------------------------------------

The exact class probabilities and decision thresholds should be
calibrated on the training/validation catalogue rather than hard-coded
arbitrarily.

------------------------------------------------------------------------

# 🏗️ System Architecture

ExoNet is organized into four conceptual layers.

``` text
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
```

------------------------------------------------------------------------

# 🔭 Scientific Pipeline

## Stage 1 --- Data Acquisition

Primary data source:

-   NASA TESS public light curves
-   MAST archive
-   `lightkurve`
-   `astroquery`

The intended production pipeline should be able to fetch light curves by
target identifier rather than relying on manually prepared samples.

------------------------------------------------------------------------

## Stage 2 --- Detrending & Cleaning

Typical preprocessing:

``` text
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
```

Candidate implementations include:

-   `wotan`
-   `scipy`
-   Savitzky--Golay filtering
-   `astropy.timeseries`

**Important:** detrending must not remove the transit signal itself. The
production implementation should therefore evaluate multiple detrending
windows and validate transit-depth preservation.

------------------------------------------------------------------------

## Stage 3 --- Periodic Transit Search

Two complementary approaches are planned:

### BLS --- Box Least Squares

Useful for detecting box-shaped periodic transit signatures efficiently.

### TLS --- Transit Least Squares

More physically informed transit-search modelling.

The proposed candidate threshold is:

``` text
SDE > 7
```

Candidates below the configured threshold can be rejected or retained as
low-significance candidates depending on the operating mode.

------------------------------------------------------------------------

# 🧪 Stage 4 --- Astrophysical Vetting

A key ExoNet design principle is:

> **Do not let the neural network be the first and only judge.**

### Odd--Even Depth Test

Compare alternating transit depths.

A significant mismatch can indicate an eclipsing binary rather than a
planet.

### Secondary Eclipse Search

Search for a second event at the expected orbital phase.

A strong secondary eclipse may indicate a stellar companion.

### Centroid Shift Proxy

Check whether the apparent source position changes during the
transit-like event.

A shift can indicate contamination or a nearby eclipsing source.

### Aperture Sensitivity

Repeat the detection using different photometric apertures where
possible.

A signal that changes dramatically with aperture selection deserves
additional scrutiny.

------------------------------------------------------------------------

# 🤖 Stage 5 --- AI Classification

## 1D CNN

Input:

``` text
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
```

The CNN focuses on signal morphology.

## XGBoost

The tabular model consumes engineered features such as:

-   BLS/TLS significance
-   Transit depth
-   Transit duration
-   Period
-   Odd/even depth difference
-   Secondary-eclipse indicators
-   Centroid-related features
-   Shape/statistical descriptors

The final system can ensemble the outputs:

``` text
CNN probability
       +
XGBoost probability
       +
Physics-based vetting
       │
       ▼
Final candidate disposition
```

------------------------------------------------------------------------

# 📐 Stage 6 --- Transit Parameter Estimation

Promising candidates proceed to transit-model fitting.

The planned model family is **Mandel--Agol**, implemented through
packages such as:

-   `batman-package`
-   `exoplanet`

Primary fitted quantities include:

``` text
Period
Transit depth
Transit duration
```

The inference layer should return:

``` text
Best estimate
Lower uncertainty bound
Upper uncertainty bound
Posterior distribution
```

rather than only a point estimate.

------------------------------------------------------------------------

# 🎲 Stage 7 --- Confidence & False Alarm Probability

ExoNet separates **classification confidence** from **statistical
significance**.

Conceptually:

``` text
BLS/TLS SDE ─────────┐
                     ├──► Calibrated Confidence
CNN probability ─────┤
XGBoost probability ┘

Bootstrap / null tests ───► False Alarm Probability
```

### Why this matters

A model can be highly confident about a signal that is actually caused
by a systematic artifact.

Therefore:

**High ML probability ≠ confirmed planet.**

The dashboard should make this distinction explicit.

------------------------------------------------------------------------

# 📊 Validation Strategy

The proposed ground truth includes:

-   Confirmed TESS planets
-   Known eclipsing binaries
-   Catalogue false positives
-   ExoFOP-labelled dispositions

### Classification Metrics

Report:

-   Precision
-   Recall
-   F1-score
-   ROC-AUC
-   Confusion matrix
-   Per-class recall

Accuracy alone should **not** be the primary metric because the classes
can be highly imbalanced.

### Parameter Validation

For confirmed targets:

``` text
| fitted value − published value |
---------------------------------- × 100
        published value
```

Compare fitted:

-   Period
-   Transit depth
-   Duration

against trusted published values.

### Uncertainty Calibration

MCMC posterior widths should be compared with published uncertainty
ranges.

The goal is to avoid a system that produces precise-looking but
unjustified estimates.

------------------------------------------------------------------------

# ⚠️ Risk Mitigation

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  Stellar blends                      Centroid proxy + aperture
                                      sensitivity

  Eclipsing binaries                  Odd/even + secondary-eclipse tests

  Class imbalance                     SMOTE + class-weighted loss

  Overfitting                         K-fold validation across
                                      targets/sectors

  Single-sector bias                  Cross-sector evaluation

  Expensive inference                 TLS/BLS pre-filter before CNN

  Overconfident AI                    Probability calibration + FAP

  Detrending removes transit          Transit-preservation tests

  Noisy labels                        Separate training labels from
                                      independent validation labels
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 🖥️ Current Repository: Web Demonstration

The repository supplied with this project is currently a **Next.js-based
interactive frontend/demo**, not the complete scientific backend.

Current frontend stack:

-   Next.js `16.2.9`
-   React `19.2.4`
-   TypeScript
-   Tailwind CSS 4
-   Framer Motion
-   Recharts
-   Lucide React
-   jsPDF

The current interface contains components for:

``` text
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
```

### Current demo capabilities

The frontend is designed to communicate the ExoNet concept through:

-   Astronomer-style dashboard UI
-   Candidate/target exploration
-   Pipeline visualization
-   AI insight presentation
-   Technology roadmap
-   Interactive charts
-   PDF report generation
-   Responsive web interface

### Important implementation status

The current repository **does not contain the full Python scientific
pipeline described above**. In particular, the supplied codebase does
not currently include the actual BLS/TLS engine, trained CNN/XGBoost
models, MCMC inference service, MAST ingestion service, or a production
database.

Those are backend/scientific implementation stages required to turn the
current demonstration layer into the complete operational ExoNet system.

This distinction is intentional and should be preserved in technical
documentation and judging demos.

------------------------------------------------------------------------

# 🚀 Quick Start --- Web Demo

## Requirements

-   Node.js 20+ recommended
-   npm
-   Modern browser

## Installation

``` bash
git clone <YOUR_REPOSITORY_URL>
cd ExoNet-main
npm install
```

## Development

``` bash
npm run dev
```

Open:

``` text
http://localhost:3000
```

## Production Build

``` bash
npm run build
npm start
```

## Lint

``` bash
npm run lint
```

------------------------------------------------------------------------

# 🧩 Recommended Full Production Architecture

To evolve the current frontend into a real detection platform:

``` text
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
```

------------------------------------------------------------------------

# 🗂️ Recommended Backend Repository Structure

When implementing the scientific backend, a clean separation is
preferable:

``` text
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
```

------------------------------------------------------------------------

# 🔌 Suggested API Contract

A production implementation can expose an API such as:

### Submit target

``` http
POST /api/v1/targets
```

``` json
{
  "target_id": "TIC-XXXXXXXXX",
  "sector": 42
}
```

### Run detection

``` http
POST /api/v1/detect
```

``` json
{
  "target_id": "TIC-XXXXXXXXX",
  "method": "tls"
}
```

### Candidate response

``` json
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
```

These values are an **example API shape**, not measured results from the
current frontend.

------------------------------------------------------------------------

# 📈 Performance Evaluation

A serious implementation should maintain separate datasets for:

``` text
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
```

Avoid training and testing on different rows from the same target
without grouping by target. Otherwise, leakage can produce deceptively
strong results.

For astronomical data, evaluation should preferably include:

-   Target-level splits
-   Sector-aware splits
-   Class-balanced reporting
-   Per-class confusion matrices
-   Calibration curves
-   False-positive analysis
-   Robustness to injected transit signals
-   Performance under different noise levels

------------------------------------------------------------------------

# 🧬 Synthetic Transit Injection

A powerful next step for validating detection sensitivity is
**injection-and-recovery testing**.

Conceptually:

``` text
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
```

This allows measurement of detection completeness as a function of:

-   Transit depth
-   Period
-   Duration
-   Signal-to-noise ratio
-   Stellar noise
-   Number of observed transits

This should become a major scientific validation component before
claiming operational performance.

------------------------------------------------------------------------

# 🔐 Reproducibility Principles

Every scientific inference should be traceable.

A candidate record should ideally preserve:

``` text
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
```

This transforms the system from a visual demo into an auditable research
workflow.

------------------------------------------------------------------------

# ☁️ Deployment Strategy

## Prototype

Recommended for hackathon demonstration:

``` text
Next.js frontend
      +
Python inference backend
      +
Local / small cloud storage
```

## Research deployment

``` text
Next.js
   │
   ▼
FastAPI
   │
   ├── Redis / Queue
   │
   ├── CPU workers → BLS/TLS/vetting
   │
   ├── GPU workers → CNN/XGBoost
   │
   └── MCMC workers
   │
   ▼
PostgreSQL / Object Storage
```

## Large-scale processing

For sector-scale processing:

``` text
Scheduler
   │
   ▼
Target Queue
   │
   ├── Worker 1
   ├── Worker 2
   ├── Worker 3
   └── Worker N
          │
          ▼
Candidate Store
          │
          ▼
Dashboard
```

This allows expensive MCMC fitting to be reserved for high-priority
candidates rather than every observed target.

------------------------------------------------------------------------

# 💰 Cost Model

The project proposal estimates:

### Prototype / Idea Stage

Approximately **₹0** using:

-   Public TESS data
-   MAST / lightkurve
-   Open-source Python stack
-   Colab/Kaggle-style free GPU resources
-   Free/open-source frontend tooling

### Proposed Operational Scale

Approximately **₹7,000--₹12,000/month**, depending on infrastructure and
workload.

The proposal breaks this into approximate categories:

  Component             Estimated monthly range
  ------------------- -------------------------
  Storage                          ₹800--₹1,200
  Batch CPU compute              ₹3,000--₹6,000
  GPU retraining                 ₹1,500--₹3,000
  Dashboard hosting                ₹800--₹1,500
  **Total**               **\~₹7,000--₹12,000**

These are proposal-stage estimates, not measured production costs.

------------------------------------------------------------------------

# 🧭 Development Roadmap

## Phase 1 --- Demonstration

-   [x] Interactive ExoNet frontend
-   [x] Dashboard concept
-   [x] Pipeline visualization
-   [x] Candidate-oriented UI
-   [x] AI insights interface
-   [x] Technology roadmap
-   [x] PDF report generation

## Phase 2 --- Scientific MVP

-   [ ] MAST/TESS ingestion
-   [ ] Lightkurve preprocessing
-   [ ] Robust detrending
-   [ ] BLS implementation
-   [ ] TLS implementation
-   [ ] Candidate table
-   [ ] Odd/even test
-   [ ] Secondary eclipse test
-   [ ] Centroid proxy
-   [ ] Feature extraction

## Phase 3 --- ML

-   [ ] Labelled training dataset
-   [ ] 1D CNN
-   [ ] XGBoost
-   [ ] Class imbalance strategy
-   [ ] Cross-validation
-   [ ] Probability calibration
-   [ ] Model registry/checkpointing

## Phase 4 --- Scientific Inference

-   [ ] Mandel--Agol fitting
-   [ ] MCMC posterior estimation
-   [ ] Parameter uncertainty
-   [ ] FAP estimation
-   [ ] Injection/recovery experiments

## Phase 5 --- Production

-   [ ] FastAPI inference service
-   [ ] Background workers
-   [ ] Database
-   [ ] Object storage
-   [ ] Authentication
-   [ ] Monitoring/logging
-   [ ] Model/version tracking
-   [ ] Automated evaluation pipeline

------------------------------------------------------------------------

# 🏆 Hackathon Value Proposition

ExoNet is not positioned as:

> "A CNN that finds planets."

It is positioned as:

> **An end-to-end, explainable candidate detection and vetting pipeline
> that combines classical astronomical signal processing, astrophysical
> false-positive tests, machine learning, transit modelling, uncertainty
> estimation, and researcher-facing visualization.**

That distinction matters because real exoplanet discovery is not simply
a classification problem.

A useful system must answer:

1.  **Was there a periodic signal?**
2.  **Is the signal transit-like?**
3.  **Could an eclipsing binary explain it?**
4.  **Could contamination explain it?**
5.  **How likely is the AI to be correct?**
6.  **How statistically significant is the detection?**
7.  **What are the estimated transit parameters?**
8.  **How uncertain are those parameters?**
9.  **Can another researcher reproduce the result?**

ExoNet is designed around those questions.

------------------------------------------------------------------------

# ⚠️ Scientific Limitations

ExoNet should **not** be described as automatically discovering or
confirming exoplanets from a single AI prediction.

A candidate classified as `Transit` remains a **candidate** until
appropriate scientific confirmation.

Potential limitations include:

-   Incomplete or noisy labels
-   TESS instrumental systematics
-   Stellar variability
-   Crowded fields
-   Blended sources
-   Class imbalance
-   Dataset shift between sectors/targets
-   Bias in training catalogues
-   Imperfect centroid proxies
-   Sensitivity limits for shallow/long-period planets
-   Computational cost of MCMC inference

The system should therefore communicate uncertainty explicitly and avoid
presenting model output as definitive planetary confirmation.

------------------------------------------------------------------------

# 📚 Scientific Technology Stack

  Layer                Technology
  -------------------- ----------------------------------------------
  Data access          `lightkurve`, MAST, `astroquery`
  Astronomy            `astropy`
  Detrending           `wotan`, `scipy`, Savitzky--Golay
  Transit search       BLS, `transitleastsquares`
  Deep learning        PyTorch
  Tabular ML           XGBoost, scikit-learn
  Transit fitting      `batman-package`, `exoplanet`
  Bayesian inference   PyMC/MCMC through the selected fitting stack
  Visualization        Matplotlib, Plotly, Recharts
  Current frontend     Next.js, React, TypeScript
  UI animation         Framer Motion
  Reports              jsPDF
  Deployment target    Web + Python inference services

------------------------------------------------------------------------

# 🧪 Example End-to-End Candidate

A future production run could look like:

``` text
Target: TESS target
        │
        ▼
Download public light curve
        │
        ▼
Clean + detrend
        │
        ▼
TLS finds periodic signal
        │
        ▼
SDE = 11.7
        │
        ▼
Astrophysical vetting
 ├── Odd/even: PASS
 ├── Secondary eclipse: PASS
 ├── Centroid proxy: PASS
 └── Aperture sensitivity: PASS
        │
        ▼
CNN = 0.94 Transit
XGBoost = 0.91 Transit
        │
        ▼
Ensemble disposition
        │
        ▼
Mandel–Agol fit
        │
        ▼
MCMC posterior
        │
        ▼
Confidence + FAP
        │
        ▼
Researcher reviews candidate
```

The numerical values above are illustrative only and must not be
interpreted as benchmark results.

------------------------------------------------------------------------

# 🧑‍🚀 Team

**Team ExoNet**

  -----------------------------------------------------------------------
  Role                    Member                  Institution
  ----------------------- ----------------------- -----------------------
  Team Leader             Om Jadhav               Amrutvahini College of
                                                  Engineering, Sangamner

  Team Member             Rutuja Jadhav           Amrutvahini College of
                                                  Engineering, Sangamner

  Team Member             Sukanya Adsure          Amrutvahini College of
                                                  Engineering, Sangamner

  Team Member             Kartik Chavan           Amrutvahini College of
                                                  Engineering, Sangamner
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 📜 Project Status

**Current status:** Interactive hackathon demonstration / frontend
prototype.

**Scientific backend status:** Planned architecture; implementation
should be added before representing the complete pipeline as
operational.

This README deliberately separates **implemented frontend capabilities**
from **proposed scientific/backend capabilities** so that the project
remains technically credible.

------------------------------------------------------------------------

# 🤝 Contributing

Contributions should preserve scientific reproducibility.

Before submitting a change:

``` bash
npm install
npm run lint
npm run build
```

For future scientific modules, add:

-   Unit tests
-   Dataset/version information
-   Configuration used for experiments
-   Reproducible seeds where appropriate
-   Evaluation metrics
-   Clear separation between training and test data

------------------------------------------------------------------------

# 📄 License

No project license was specified in the supplied repository.

Before public redistribution, choose and add an appropriate license, for
example:

-   MIT
-   Apache-2.0
-   BSD-3-Clause

Do not claim an open-source license until a `LICENSE` file has actually
been added.

------------------------------------------------------------------------

# 🙏 Acknowledgements

ExoNet is designed around publicly accessible astronomical data and
open-source scientific software, including the TESS/MAST ecosystem and
the Python astronomy/ML ecosystem.

The project is developed for the **Bharatiya Antariksh Hackathon 2026,
PS-07**.

------------------------------------------------------------------------

## ⭐ Final Vision

``` text
                   EXONET
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
   SIGNAL         PHYSICS          AI
   SEARCH         VETTING       CLASSIFICATION
       │             │             │
       └─────────────┼─────────────┘
                     ▼
              TRANSIT FITTING
                     │
                     ▼
             UNCERTAINTY + FAP
                     │
                     ▼
          EXPLAINABLE CANDIDATE
                     │
                     ▼
             RESEARCHER REVIEW
                     │
                     ▼
             EXOPLANET CATALOGUE
```

**ExoNet's goal is not to replace astronomers.\
Its goal is to reduce the distance between a noisy light curve and a
scientifically useful candidate.** 🚀
