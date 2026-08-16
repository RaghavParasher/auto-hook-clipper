# ⚡ HookGen: Hook Framework Playground

**HookGen** is a local, serverless desktop web application designed to help social media creators master the art of writing viral video hooks. 

It provides interactive psychological templates, a real-time offline copywriting analyzer (grading curiosity, urgency, clarity, and emotion), and a CapCut-style kinetic text simulator inside a glassmorphic mobile phone mockup. 

It is also integrated with the **Google Gemini API** for generating advanced AI hook variations directly in the browser.

Developed for the **Social Media Automation Hackathon**.

---

## ✨ Features

* **🃏 Interactive Copywriting Templates**: Select from 10 high-converting psychological frameworks (Secret Reveal, Authority Hook, FOMO, Pain Bridge, etc.) with fill-in-the-blank text inputs that auto-generate hooks.
* **📈 Real-Time Copywriting Analyzer**: An offline scoring engine that grades your hook draft in real-time across four critical metrics:
  - **Curiosity**: Intrigues the viewer via mystery hooks and questions.
  - **Clarity**: Checks read-flow and prevents wordiness.
  - **Urgency**: Scans for instant click-triggers.
  - **Emotion**: Analyzes power verbs and emotional triggers.
* **📱 Live kinetic Text Simulator**: Loops your hook text word-by-word with active highlight styling inside a mobile phone mockup, mirroring CapCut/TikTok caption reels.
* **⚡ Quick Trigger Word Inserter**: Click-to-add power words from our curated glossary (Curiosity, Urgency, Power Adjectives, Pain Points) directly into your active editor slots.
* **🤖 Gemini AI Polish**: Connects directly from the browser to the free-tier Google Gemini API to instantly generate 3 high-converting hook variants.
* **📋 One-Click Export**: Quickly copy the finalized hook to your clipboard with clean notification feedback.

---

## 🛠️ Tech Stack

* **Frontend**: Vite + React, CSS Variables (harmonious slate/cyan dark theme).
* **AI Model**: Google Gemini API (Free Tier).
* **Copywriting Logic**: Custom offline heuristic analyzer.

---

## 🚀 Setup & Local Run

Ensure you have **Node.js (v18+)** installed.

1. Open a terminal in the root directory:
   ```bash
   npm install
   ```
2. Launch the local web server:
   ```bash
   npm run dev
   ```
3. Open **[http://localhost:5173](http://localhost:5173)** in your browser!
