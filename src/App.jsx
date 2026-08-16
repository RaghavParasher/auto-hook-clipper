import React, { useState, useEffect, useRef } from 'react';
import { templates, triggerWords } from './data/templates';
import { evaluateHook } from './utils/evaluator';
import './App.css';

export default function App() {
  // Config States
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  
  // App Modes: template or free
  const [mode, setMode] = useState('template'); 
  const [activeTemplateIdx, setActiveTemplateIdx] = useState(0);
  const [inputs, setInputs] = useState(['', '']);
  const [customHookText, setCustomHookText] = useState('Stop making this common editing mistake if you want to get 100k views!');
  
  // Active input ref for trigger word inserter
  const [activeInputIdx, setActiveInputIdx] = useState(0);
  const customInputRef = useRef(null);

  // Phone Simulator Settings
  const [captionFont, setCaptionFont] = useState('Arial Black');
  const [captionSize, setCaptionSize] = useState(26);
  const [captionColor, setCaptionColor] = useState('#FFFF00');
  const [captionStyle, setCaptionStyle] = useState('capitalized'); // capitalized, normal, uppercase
  const [bgPreset, setBgPreset] = useState(0); 
  const [activeWordIdx, setActiveWordIdx] = useState(0);

  // AI & Toast states
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Phone backgrounds list
  const phoneBackgrounds = [
    'linear-gradient(180deg, #181d26 0%, #0c0e14 100%)',
    'linear-gradient(135deg, #1f112e 0%, #0d0617 100%)',
    'linear-gradient(135deg, #092026 0%, #040d10 100%)',
    'linear-gradient(135deg, #261515 0%, #0d0606 100%)'
  ];

  // Helper: Combine template text with inputs
  const getHookText = () => {
    if (mode === 'free') return customHookText;
    const t = templates[activeTemplateIdx];
    let res = t.text;
    t.placeholders.forEach((p, idx) => {
      const val = inputs[idx] || '';
      res = res.replace(`{${idx}}`, val || `[${p}]`);
    });
    return res;
  };

  const hookText = getHookText();
  const evaluation = evaluateHook(hookText);

  // Reset inputs when template changes
  useEffect(() => {
    if (mode === 'template') {
      const t = templates[activeTemplateIdx];
      setInputs(t.placeholders.map(() => ''));
      setActiveInputIdx(0);
    }
  }, [activeTemplateIdx, mode]);

  // Simulated subtitle highlight playback loop
  useEffect(() => {
    const words = hookText.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return;

    setActiveWordIdx(0);
    let wordTimer;
    let loopTimer;

    const playWords = (startIdx) => {
      let currentIdx = startIdx;
      
      wordTimer = setInterval(() => {
        if (currentIdx < words.length - 1) {
          currentIdx++;
          setActiveWordIdx(currentIdx);
        } else {
          clearInterval(wordTimer);
          // Wait on the final word, then loop back
          loopTimer = setTimeout(() => {
            playWords(0);
          }, 1500);
        }
      }, 380); 
    };

    playWords(0);

    return () => {
      clearInterval(wordTimer);
      clearTimeout(loopTimer);
    };
  }, [hookText]);

  // Insert trigger word into active input
  const insertTriggerWord = (word) => {
    if (mode === 'template') {
      const newInputs = [...inputs];
      const currentVal = newInputs[activeInputIdx] || '';
      newInputs[activeInputIdx] = currentVal ? `${currentVal} ${word.toLowerCase()}` : word;
      setInputs(newInputs);
    } else {
      const currentVal = customHookText;
      setCustomHookText(currentVal ? `${currentVal} ${word}` : word);
      if (customInputRef.current) {
        customInputRef.current.focus();
      }
    }
    triggerToast(`Added "${word}" to editor!`);
  };

  // Toast notifier
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    triggerToast('Hook copied to clipboard! 📋');
  };

  // Call Gemini API to polish hooks
  const polishHookWithAI = async () => {
    if (!apiKey) {
      triggerToast('Configure VITE_GEMINI_API_KEY in your env to enable AI! 🤖');
      return;
    }

    setLoadingAi(true);
    setAiSuggestions([]);

    const prompt = `You are a viral copywriting expert. Take the following video hook: "${hookText}". Generate exactly 3 highly engaging, high-converting variations of this hook that leverage psychological curiosity gaps, negative framing, or authority. Keep each hook under 15 words. Format your output strictly as a JSON array of strings, for example: ["Variation 1", "Variation 2", "Variation 3"]. Output ONLY the raw JSON block without markdown formatting or surrounding explanation text.`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }

      const data = await res.json();
      const rawText = data.candidates[0].content.parts[0].text;
      
      // Bulletproof JSON array extraction using regex
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("API response did not contain a valid JSON list format.");
      }
      
      const variations = JSON.parse(jsonMatch[0]);
      if (Array.isArray(variations)) {
        setAiSuggestions(variations.slice(0, 3));
        triggerToast('AI recommendations loaded! 🤖');
      } else {
        throw new Error('Parsed response is not a valid list.');
      }
    } catch (err) {
      console.error(err);
      alert(`AI Polish Error: ${err.message}. Please check if your Gemini API key is valid.`);
    } finally {
      setLoadingAi(false);
    }
  };

  const selectSuggestedHook = (text) => {
    setMode('free');
    setCustomHookText(text);
    triggerToast('Applied AI hook to editor!');
  };

  const getMetricColor = (val) => {
    if (val >= 75) return 'var(--color-success)';
    if (val >= 45) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  // Format words list
  const getSubtitlesWords = () => {
    const rawWords = hookText.split(/\s+/).filter(w => w.length > 0);
    return rawWords.map(w => {
      if (captionStyle === 'uppercase') return w.toUpperCase();
      if (captionStyle === 'capitalized') return w.charAt(0).toUpperCase() + w.slice(1);
      return w.toLowerCase();
    });
  };

  const subtitleWords = getSubtitlesWords();

  return (
    <div className="app-layout">
      {/* Frosted Header */}
      <header className="header">
        <div className="brand">
          <div className="logo-icon">H</div>
          <span className="logo-text">HookGen</span>
          <span className="tagline">v1.0 Local</span>
        </div>
        <div className="header-actions">
          {apiKey ? (
            <span className="tagline" style={{color: 'var(--color-success)', border: '1px solid rgba(74, 222, 128, 0.2)'}}>🤖 AI CONNECTED</span>
          ) : (
            <span className="tagline" style={{color: 'var(--text-muted)'}}>OFFLINE MODE</span>
          )}
        </div>
      </header>

      {/* Main Scrollable Workspace Container */}
      <div className="workspace-container">
        
        {/* Hero Banner text */}
        <div className="hero-block">
          <h1 className="hero-title">Craft Viral Video Hooks</h1>
          <p className="hero-desc">
            Use psychological frameworks, test their copywriting metrics in real-time, and preview kinetic caption animations inside the simulator—all offline and serverless.
          </p>
        </div>

        {/* STEP 1: Inputs & Template Deck Card (Full Width) */}
        <section className="section-card">
          <div className="section-header">
            <div className="section-num">01</div>
            <h2 className="section-title">Draft Your Hook Angle</h2>
          </div>

          {/* Mode Selector tabs (Centered) */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '340px', margin: '0 auto', width: '100%'}}>
            <button 
              className={`btn ${mode === 'template' ? 'btn-accent' : 'btn-secondary'}`}
              onClick={() => setMode('template')}
            >
              Copywriting Deck
            </button>
            <button 
              className={`btn ${mode === 'free' ? 'btn-accent' : 'btn-secondary'}`}
              onClick={() => setMode('free')}
            >
              Custom Editor
            </button>
          </div>

          {mode === 'template' ? (
            <>
              <h4 className="blank-label" style={{color: 'var(--text-muted)'}}>Select a copywriting framework</h4>
              <div className="templates-carousel">
                {templates.map((t, idx) => (
                  <div 
                    key={t.id} 
                    className={`template-card ${activeTemplateIdx === idx ? 'active' : ''}`}
                    onClick={() => setActiveTemplateIdx(idx)}
                  >
                    <span className="card-tag">{t.tag}</span>
                    <h5 className="card-title">{t.name}</h5>
                    <p className="card-desc">{t.description}</p>
                  </div>
                ))}
              </div>

              <h4 className="blank-label" style={{color: 'var(--text-muted)'}}>Fill in the blanks</h4>
              <div className="inputs-grid">
                {templates[activeTemplateIdx].placeholders.map((ph, idx) => (
                  <div key={idx} className="blank-group">
                    <label className="blank-label">
                      Field #{idx + 1}: {ph}
                      {activeInputIdx === idx && <span style={{color: 'var(--color-primary)', marginLeft: '8px', fontSize: '10px'}}>● Editing</span>}
                    </label>
                    <input 
                      type="text" 
                      className="blank-input" 
                      placeholder={`e.g. ${ph}`}
                      value={inputs[idx] || ''}
                      onFocus={() => setActiveInputIdx(idx)}
                      onChange={(e) => {
                        const newInputs = [...inputs];
                        newInputs[idx] = e.target.value;
                        setInputs(newInputs);
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h4 className="blank-label" style={{color: 'var(--text-muted)'}}>Custom Video Hook Input</h4>
              <div className="blank-group">
                <textarea
                  ref={customInputRef}
                  className="blank-input custom-editor-text"
                  value={customHookText}
                  onChange={(e) => setCustomHookText(e.target.value)}
                  placeholder="Type your own custom hook here..."
                />
              </div>
            </>
          )}

          {/* Quick Insert Word Cloud at bottom of card */}
          <div style={{borderTop: '1px solid var(--border-color)', paddingTop: '20px'}}>
            <h5 className="blank-label" style={{marginBottom: '12px'}}>
              ⚡ Quick Insert High-CTR Words (Click to append to your active field)
            </h5>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
              <div>
                <span style={{fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)'}}>Curiosity Multipliers:</span>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px'}}>
                  {triggerWords.curiosity.slice(0, 7).map(w => (
                    <span key={w} className="word-pill" onClick={() => insertTriggerWord(w)}>{w}</span>
                  ))}
                </div>
              </div>
              <div>
                <span style={{fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)'}}>Urgency & Command Cues:</span>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px'}}>
                  {triggerWords.urgency.slice(0, 7).map(w => (
                    <span key={w} className="word-pill" onClick={() => insertTriggerWord(w)}>{w}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2: Phone simulator & Analytics cards side-by-side */}
        <div className="results-grid">
          
          {/* Left Column: Phone simulator panel inside a Glassmorphic card */}
          <div className="phone-panel section-card">
            <div className="section-header" style={{width: '100%'}}>
              <div className="section-num">02</div>
              <h2 className="section-title">Kinetic Subtitle Preview</h2>
            </div>

            <div 
              className="phone-mockup"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop')`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="phone-notch"></div>
              
              <div className="simulated-caption-wrapper">
                <div 
                  className="simulated-caption"
                  style={{
                    fontFamily: captionFont === 'Impact' ? 'Impact, sans-serif' : captionFont === 'Comic Sans MS' ? '"Comic Sans MS", cursive' : captionFont === 'Trebuchet MS' ? '"Trebuchet MS", sans-serif' : '"Arial Black", sans-serif',
                    fontSize: `${captionSize}px`,
                    color: captionColor
                  }}
                >
                  {subtitleWords.map((word, idx) => {
                    const isActive = activeWordIdx === idx;
                    return (
                      <span 
                        key={idx}
                        className={isActive ? 'word-highlight' : ''}
                        style={{
                          color: isActive ? captionColor : '#FFFFFF'
                        }}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{width: '320px', display: 'flex', gap: '10px'}}>
              <button className="btn btn-secondary" style={{flex: 1}} onClick={() => setBgPreset((bgPreset + 1) % phoneBackgrounds.length)}>
                🔄 Background
              </button>
              <button className="btn btn-secondary" style={{flex: 1}} onClick={() => {
                const styles = ['capitalized', 'uppercase', 'lowercase'];
                const currentIdx = styles.indexOf(captionStyle);
                setCaptionStyle(styles[(currentIdx + 1) % styles.length]);
              }}>
                Aa Text Case
              </button>
            </div>
          </div>

          {/* Right Column: Analytics, Gemini AI Polish & Customizers */}
          <div className="analytics-panel section-card">
            <div className="section-header">
              <div className="section-num">03</div>
              <h2 className="section-title">Copywriting Analytics & AI</h2>
            </div>

            {/* Overal scoring dial banner */}
            <div className="score-summary-card">
              <div className="overall-score-circle" style={{border: `4px solid ${getMetricColor(evaluation.overall)}`}}>
                <span className="overall-score-num" style={{color: getMetricColor(evaluation.overall)}}>{evaluation.overall}</span>
                <span className="overall-score-label">Score</span>
              </div>
              <div className="score-stats">
                <span className="score-title">Hook Performance</span>
                <span className="score-rating" style={{color: getMetricColor(evaluation.overall)}}>
                  {evaluation.overall >= 80 ? '🔥 Highly Optimized (Viral)' : evaluation.overall >= 55 ? '⚡ Strong Draft' : '⚠️ Needs Tuning'}
                </span>
              </div>
            </div>

            {/* Core grading progress bars */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div className="metric-row">
                <div className="metric-meta">
                  <span className="metric-name">Curiosity (Psychological Loop)</span>
                  <span className="metric-val" style={{color: getMetricColor(evaluation.curiosity)}}>{evaluation.curiosity}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{width: `${evaluation.curiosity}%`, backgroundColor: getMetricColor(evaluation.curiosity)}}></div>
                </div>
              </div>
              <div className="metric-row">
                <div className="metric-meta">
                  <span className="metric-name">Clarity (Readability Index)</span>
                  <span className="metric-val" style={{color: getMetricColor(evaluation.clarity)}}>{evaluation.clarity}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{width: `${evaluation.clarity}%`, backgroundColor: getMetricColor(evaluation.clarity)}}></div>
                </div>
              </div>
              <div className="metric-row">
                <div className="metric-meta">
                  <span className="metric-name">Urgency (Instant Attention)</span>
                  <span className="metric-val" style={{color: getMetricColor(evaluation.urgency)}}>{evaluation.urgency}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{width: `${evaluation.urgency}%`, backgroundColor: getMetricColor(evaluation.urgency)}}></div>
                </div>
              </div>
              <div className="metric-row">
                <div className="metric-meta">
                  <span className="metric-name">Emotional Appeal</span>
                  <span className="metric-val" style={{color: getMetricColor(evaluation.emotion)}}>{evaluation.emotion}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{width: `${evaluation.emotion}%`, backgroundColor: getMetricColor(evaluation.emotion)}}></div>
                </div>
              </div>
            </div>

            {/* Simulated subtitle controls */}
            <div style={{borderTop: '1px solid var(--border-color)', paddingTop: '16px'}}>
              <h5 className="blank-label" style={{marginBottom: '12px'}}>Customize Simulated Caption</h5>
              <div className="config-grid">
                <div className="form-group">
                  <label className="blank-label" style={{fontSize: '9px'}}>Font Style</label>
                  <select className="form-select" value={captionFont} onChange={(e) => setCaptionFont(e.target.value)}>
                    <option value="Arial Black">Arial Black</option>
                    <option value="Impact">Impact</option>
                    <option value="Trebuchet MS">Trebuchet MS</option>
                    <option value="Comic Sans MS">Comic Sans</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="blank-label" style={{fontSize: '9px'}}>Highlight color</label>
                  <select className="form-select" value={captionColor} onChange={(e) => setCaptionColor(e.target.value)}>
                    <option value="#FFFF00">Yellow</option>
                    <option value="#00FF00">Green</option>
                    <option value="#FF007F">Hot Pink</option>
                    <option value="#00FFFF">Cyan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AI polish & copywriting recommendations */}
            <div style={{borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <button className="btn btn-accent" onClick={polishHookWithAI} disabled={loadingAi}>
                {loadingAi ? (
                  <>
                    <div className="spinner"></div>
                    Polishing Hook with AI...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Polish Hook with Gemini AI
                  </>
                )}
              </button>

              {aiSuggestions.length > 0 && (
                <div style={{backgroundColor: 'rgba(135, 90, 255, 0.04)', border: '1px solid rgba(135, 90, 255, 0.15)', padding: '16px', borderRadius: 'var(--radius-lg)'}}>
                  <h6 className="blank-label" style={{color: 'var(--color-secondary)', marginBottom: '10px'}}>AI Recommended Variations (Click to Use):</h6>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    {aiSuggestions.map((s, idx) => (
                      <div key={idx} style={{display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px', background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)'}}>
                        <p style={{flex: 1, color: 'var(--text-primary)', fontWeight: '500'}}>{s}</p>
                        <button className="word-pill" style={{padding: '4px 8px', fontSize: '11px', fontWeight: '600'}} onClick={() => selectSuggestedHook(s)}>Use</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable offline copywriting advice */}
              <div className="tips-list">
                <h5 className="blank-label">Offline Copywriting Feedback</h5>
                {evaluation.tips.map((tip, idx) => (
                  <div key={idx} className="tip-item">
                    <div className="tip-text">{tip}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export buttons */}
            <div style={{marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '20px'}}>
              <button className="btn" onClick={() => copyToClipboard(hookText)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Final Hook to Clipboard
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Modal removed: API Key configured via environment variables */}

      {/* Toast Notification */}
      <div className={`toast ${showToast ? 'show' : ''}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {toastMessage}
      </div>
    </div>
  );
}
