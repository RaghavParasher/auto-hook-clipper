import { triggerWords } from '../data/templates';

export function evaluateHook(text) {
  const cleanText = text.trim();
  if (!cleanText) {
    return {
      curiosity: 0,
      clarity: 0,
      urgency: 0,
      emotion: 0,
      overall: 0,
      tips: ['Start typing to analyze your hook strength!']
    };
  }

  const words = cleanText.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9\-]/g, ''));
  const wordCount = words.filter(w => w.length > 0).length;
  const lowercaseText = cleanText.toLowerCase();

  // Helper: check matches count from a list
  const countMatches = (list) => {
    let count = 0;
    list.forEach(trigger => {
      // Use boundary regex or simple include
      const regex = new RegExp('\\b' + trigger.toLowerCase() + '\\b', 'i');
      if (regex.test(lowercaseText)) {
        count++;
      }
    });
    return count;
  };

  // 1. Curiosity Score (Baseline 20, max 100)
  let curiosity = 20;
  const questionWords = ['why', 'how', 'what', 'which', 'secret', 'cheat', 'banned', 'hide', 'reveal', 'illegal', 'mystery', 'private'];
  const hasQuestionWord = questionWords.some(q => lowercaseText.includes(q)) || cleanText.includes('?');
  if (hasQuestionWord) curiosity += 20;
  
  const curiosityMatches = countMatches(triggerWords.curiosity);
  curiosity += curiosityMatches * 20;
  
  // Length adjustment
  if (cleanText.length > 110) curiosity -= 10;
  curiosity = Math.max(10, Math.min(curiosity, 100));

  // 2. Clarity Score (Baseline 80, max 100)
  let clarity = 80;
  if (wordCount > 18) {
    clarity -= (wordCount - 18) * 4; // Penalty for wordiness
  } else if (wordCount < 6 && wordCount > 0) {
    clarity -= (6 - wordCount) * 8; // Penalty for being too short
  }
  
  // Word complexity check (avg word length)
  if (wordCount > 0) {
    const totalChars = words.reduce((sum, w) => sum + w.length, 0);
    const avgLen = totalChars / wordCount;
    if (avgLen > 6.5) clarity -= 15; // Too many long words
  }
  
  // Spam trigger
  if (cleanText.replace(/[^A-Z]/g, '').length > cleanText.length * 0.3) {
    clarity -= 15; // Too many capital letters
  }
  clarity = Math.max(10, Math.min(clarity, 100));

  // 3. Urgency Score (Baseline 10, max 100)
  let urgency = 10;
  const urgencyMatches = countMatches(triggerWords.urgency);
  urgency += urgencyMatches * 25;
  if (cleanText.includes('!')) urgency += 15;
  urgency = Math.max(10, Math.min(urgency, 100));

  // 4. Emotional Score (Baseline 15, max 100)
  let emotion = 15;
  const powerMatches = countMatches(triggerWords.power);
  const painMatches = countMatches(triggerWords.pain);
  emotion += (powerMatches * 25) + (painMatches * 20);
  emotion = Math.max(10, Math.min(emotion, 100));

  // 5. Overall Weighted Score
  const overall = Math.round(
    (curiosity * 0.35) + (clarity * 0.20) + (urgency * 0.20) + (emotion * 0.25)
  );

  // 6. Generate Actionable Copywriting Tips
  const tips = [];
  
  if (curiosity < 50) {
    tips.push('💡 Add a mystery word (e.g., "secret", "banned", "cheat code") or ask a question to trigger curiosity.');
  }
  if (urgency < 50) {
    tips.push('⏳ Start with an urgency trigger (e.g., "Stop", "Never", "Before") to grab attention in the first second.');
  }
  if (emotion < 55) {
    tips.push('🔥 Inject a power adjective (e.g., "shocking", "insane", "unbelievable") to build excitement.');
  }
  if (wordCount > 18) {
    tips.push(`✂️ Your hook is a bit long (${wordCount} words). Try trimming it to under 15 words to keep it punchy.`);
  }
  if (wordCount > 0 && wordCount < 6) {
    tips.push('📝 Your hook is very short. Make sure it specifies a clear audience or value promise.');
  }
  if (clarity < 65) {
    tips.push('👁️ Simplify the vocabulary. Use short, high-impact words so it is read effortlessly.');
  }
  
  if (overall >= 80) {
    tips.push('🔥 Excellent work! This hook hits high copywriting benchmarks and is optimized for viewer retention.');
  } else if (tips.length === 0) {
    tips.push('👍 Good hook structure! Optimize further by playing with formatting or capitalization.');
  }

  return {
    curiosity,
    clarity,
    urgency,
    emotion,
    overall,
    tips
  };
}
