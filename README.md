# ⚡ HookGen: Hook Framework Playground

[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://hook--gen.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**HookGen** is an ultra-premium, serverless social media automation tool designed to help short-form creators (TikTok, Reels, Shorts) write viral video hooks. 

It features interactive psychological frameworks, a real-time offline copywriting analyzer (grading curiosity, clarity, urgency, and emotion), a CapCut-style kinetic subtitle simulator inside a glassmorphic mobile phone mockup, and a dual-fallback **Google Gemini AI** rewriter.

### 🔗 Live Deployment: [https://hook--gen.vercel.app/](https://hook--gen.vercel.app/)

---

## 📖 Table of Contents
* [💡 Why HookGen? (Real-world Usefulness)](#-why-hookgen-real-world-usefulness)
* [✨ Core Features](#-core-features)
* [🛠️ Technical Architecture & Stack](#-technical-architecture--stack)
* [🤖 Gemini AI Co-Pilot & Uptime Fallbacks](#-gemini-ai-co-pilot--uptime-fallbacks)
* [🚀 Local Installation & Run](#-local-installation--run)
* [🏁 Hackathon Evaluation Criteria Compliance](#-hackathon-evaluation-criteria-compliance)

---

## 💡 Why HookGen? (Real-world Usefulness)

In short-form video algorithms (TikTok, YouTube Shorts, Instagram Reels), **retention in the first 3 seconds (the hook) is the single most important factor** in determining whether a video goes viral. 

However, creators face two major friction points:
1. **API Costs**: Existing AI scriptwriters charge expensive monthly subscription fees or run out of API credits.
2. **Writing Friction**: Creating engaging psychological hooks (like curiosity gaps or authority positioning) is difficult without copywriting expertise.

**HookGen solves this 100% for free.** It runs entirely client-side, featuring an offline heuristic analyzer that scores drafts instantly, combined with an optional Gemini AI Polish button that connects directly to the Google Gemini Free Tier API.

---

## ✨ Core Features

### 🎭 1. Interactive Psychological Frameworks Deck
Choose from 10 distinct, pre-coded copywriting frameworks (e.g. *The Secret Reveal, Negative Framing, The Authority Hook, FOMO*) with fill-in-the-blank text inputs that auto-generate combined hooks in real-time.

### 📈 2. Real-Time Copywriting Analyzer (Offline Heuristics)
Our offline scoring engine grades your draft from `0 to 100` and displays a dynamic **Letter Grade Badge (A+ to F)**. It scores hooks across four critical copywriting pillars:
* **Curiosity**: Intrigues the viewer via mystery hooks and questions.
* **Clarity**: Audits read-pace, word count (recommending 8-18 words), and readability.
* **Urgency**: Scans for command verbs and instant callouts.
* **Emotion**: Analyzes power adjectives and pain qualifiers.
* **Actionable Advice**: Displays dynamic warnings (e.g. *"Trim text to under 15 words to keep it snappy"*).

### 📱 3. Kinetic Caption Text Simulator
Spawns a background timer loop that splits your hook text and plays it word-by-word with active highlight styling inside a mobile phone mockup, previewing CapCut/TikTok caption reels. You can customize font styles, highlight colors, and select from four animated background gradients (Midnight, Amethyst, Emerald, and Ruby).

### ⚡ 4. Floating Word Cloud
A slide-out dashboard word cloud featuring high-CTR power words (Curiosity, Urgency, Power, Pain). Clicking any word automatically appends it to your active editor input field.

---

## 🛠️ Technical Architecture & Stack

HookGen is built to be lightweight, modular, and 100% serverless:

* **Frontend**: React (v18), Vite, HTML5, Vanilla CSS variables (frosted glassmorphism, drifting ambient background blobs, active neon glows).
* **AI Model**: Google Gemini API (Free Tier).
* **Copywriting Logic**: Custom offline heuristic parser (`src/utils/evaluator.js`).

```
hookgen/
├── src/
│   ├── data/
│   │   └── templates.js    # Pre-coded hook structures and trigger words
│   ├── utils/
│   │   └── evaluator.js    # Local heuristic grading formulas
│   ├── App.jsx             # Combined dashboard and state logic
│   ├── App.css             # Main styling, glow cards, and phone simulator
│   ├── index.css           # Core styling tokens, dark palette variables
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 🤖 Gemini AI Co-Pilot & Uptime Fallbacks

To ensure absolute reliability during judging and real-world usage, the AI Polish feature implements a **dual-model fallback chain**:

1. When clicking **Polish Hook with Gemini AI**, the client sends a browser-based request to **`gemini-flash-latest`**.
2. If Google's API returns a `503 Service Unavailable` (due to model overload) or a `404 Not Found` (due to model deprecation/naming changes), HookGen **automatically catches the error and retries the request using `gemini-flash-lite-latest`** (Gemini 1.5 Flash-8B).
3. The results are parsed using a regex array filter (`/\[[\s\S]*\]/`) to extract clean JSON variations, completely bypassing conversational filler text.

---

## 🚀 Local Installation & Run

### Prerequisites
* **Node.js (v18+)**

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/RaghavParasher/auto-hook-clipper.git
   cd auto-hook-clipper
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root folder to test the Gemini AI features:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to **[http://localhost:5173](http://localhost:5173)**!

---

## 🏁 Hackathon Evaluation Criteria Compliance

* **Creativity (20%)**: Replaces traditional input textboxes with an interactive card deck, floating trigger clouds, and an animated phone simulator showing live subtitle playbacks.
* **Technical Execution (20%)**: 100% serverless React application with zero backend databases or server components to fail. Implements robust JSON regex parsing and automatic API fallback chains to guarantee uptime.
* **Real-world Usefulness (30%)**: Solves the single most important factor for video algorithms (video hook retention) with zero API billing costs for the creator.
