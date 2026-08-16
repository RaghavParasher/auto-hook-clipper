export const templates = [
  {
    id: 'secret-reveal',
    name: 'The Secret Reveal',
    tag: 'Curiosity',
    description: 'Hook the viewer by promising a hidden shortcut or insider information.',
    placeholders: ['viral video hooks', 'famous editors'],
    text: 'The hidden trick to {0} that {1} doesn\'t want you to know...'
  },
  {
    id: 'negative-framing',
    name: 'Negative Framing',
    tag: 'Pain Point',
    description: 'Create urgency by calling out a critical error they are likely making.',
    placeholders: ['thumbnail editing', 'get 100k views'],
    text: 'Stop making this {0} mistake if you want to {1}!'
  },
  {
    id: 'authority-hook',
    name: 'The Authority Hook',
    tag: 'Authority',
    description: 'Establish high credibility by sharing research or analytical results.',
    placeholders: ['TikTok shorts', 'retention scripting'],
    text: 'I analyzed 100 viral {0} so you can copy their {1} secrets.'
  },
  {
    id: 'curiosity-gap',
    name: 'The Curiosity Gap',
    tag: 'Intrigue',
    description: 'Produce high tension by framing a hack or rule as almost illegal.',
    placeholders: ['video editing', 'organic traffic'],
    text: 'This one {0} cheat code feels illegal to know for {1}.'
  },
  {
    id: 'contrast-call',
    name: 'The Contrast Call',
    tag: 'Debunking',
    description: 'Destroy popular assumptions to show a better, unexpected way.',
    placeholders: ['long-form scripting', 'repurposing clips'],
    text: 'Why {0} is actually a waste of time unless you do {1}.'
  },
  {
    id: 'fomo-hook',
    name: 'The FOMO Warning',
    tag: 'FOMO',
    description: 'Stir up fear of falling behind competitors who adapt early.',
    placeholders: ['social automation', 'views and engagement'],
    text: 'If you are not doing {0} in 2026, you are losing {1} every day.'
  },
  {
    id: 'shock-value',
    name: 'The Shock Value',
    tag: 'Shock',
    description: 'Share a dramatic, almost unbelievable conversion result.',
    placeholders: ['caption preset', 'watch time'],
    text: 'You won\'t believe how easily this {0} hack doubled my {1}!'
  },
  {
    id: 'pain-bridge',
    name: 'The Pain Bridge',
    tag: 'Solution',
    description: 'Address their biggest frustration directly and promise a simple fix.',
    placeholders: ['creator burnout', 'fast script drafting'],
    text: 'Are you struggling with {0}? Here is the exact fix for {1}.'
  },
  {
    id: 'cheat-code',
    name: 'The Ultimate Guide',
    tag: 'Value',
    description: 'Offer a direct download check-list or template bundle.',
    placeholders: ['short-form captioning', 'getting 50k followers'],
    text: 'The ultimate {0} checklist to hit {1} this week.'
  },
  {
    id: 'direct-callout',
    name: 'Direct Callout',
    tag: 'Targeting',
    description: 'Filter your audience immediately by naming their specific role.',
    placeholders: ['Premiere editor', 'submitting your next draft'],
    text: 'If you are a {0}, you need to watch this before {1}!'
  }
];

export const triggerWords = {
  curiosity: [
    'Secret', 'Cheat code', 'Banned', 'Hidden', 'Revealed', 
    'Confession', 'Steal', 'Hack', 'Mystery', 'Illegal',
    'Underground', 'Private', 'Unexplored', 'Buried'
  ],
  urgency: [
    'Stop', 'Never', 'Fast', 'Warning', 'Immediate', 
    'Quick', 'Now', 'Alert', 'Deadline', 'Instantly',
    'Hurry', 'Before', 'Critical', 'Avoid'
  ],
  power: [
    'Mind-blowing', 'Shocking', 'Insane', 'Unbelievable', 'Viral', 
    'Powerful', 'Flawless', 'Ultimate', 'Perfect', 'Stunning',
    'Sensational', 'Masterclass', 'Legendary', 'Game-changing'
  ],
  pain: [
    'Mistake', 'Failing', 'Waste', 'Ruining', 'Hate', 
    'Losing', 'Struggling', 'Broke', 'Useless', 'Regret',
    'Dangerous', 'Costly', 'Terrible', 'Flawed'
  ]
};
