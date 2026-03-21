import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Constants ──────────────────────────────────────────────

const STORAGE_KEY = 'kogni-persona-builder';

const PERSONALITY_TRAITS = [
  { left: 'Cierpliwy', right: 'Impulsywny', key: 'patience', hint: 'Tempo myślenia. Czy AI zastanawia się przed odpowiedzią, czy strzela od razu? (Długość odpowiedzi ustawiasz osobno w sekcji II.)' },
  { left: 'Szczery', right: 'Dyplomatyczny', key: 'honesty', hint: 'Ogólne podejście do prawdy. Jak bardzo łagodzi przekaz? (Jak konkretnie reaguje na Twoje błędy, ustawiasz w \u201eStyl feedbacku\u201d w sekcji V.)' },
  { left: 'Optymistyczny', right: 'Sceptyczny', key: 'optimism', hint: 'Jak filtruje świat: szuka możliwości czy ryzyk? (Czy kwestionuje Twoje pomysły, ustawiasz osobno w \u201ePoziom wyzwania\u201d w sekcji IV.)' },
  { left: 'Kreatywny', right: 'Metodyczny', key: 'creativity', hint: 'Czy preferuje nieszablonowe skojarzenia czy uporządkowane podejście? (Konkretny sposób myślenia, np. sokratyczny, ustawiasz w sekcji IV.)' },
  { left: 'Odważny', right: 'Ostrożny', key: 'boldness', hint: 'Czy ryzykuje śmiałe tezy, czy trzyma się sprawdzonych informacji? (Jak reaguje, gdy nie zna odpowiedzi, ustawiasz w sekcji IV.)' },
  { left: 'Ciekawski', right: 'Skupiony', key: 'curiosity', hint: 'Czy eksploruje wątki poboczne, czy trzyma się tematu? (Czy samo z siebie proponuje kierunki, ustawiasz w \u201eInicjatywa\u201d w sekcji V.)' },
  { left: 'Pedantyczny', right: 'Pragmatyczny', key: 'precision', hint: 'Czy poprawia niedokładności i doprecyzowuje, czy przymyka oko i akceptuje \u201ewystarczająco dobre\u201d pojęcia? (Format odpowiedzi ustawiasz w sekcji VII.)' },
];

const ANSWER_LENGTHS = ['Jednozdaniowe', 'Krótkie', 'Średnie', 'Szczegółowe', 'Wyczerpujące'];
const VOCAB_LEVELS = ['Prosty', 'Codzienny', 'Techniczny', 'Akademicki', 'Poetycki'];
const EMOJI_OPTIONS = ['Nigdy', 'Oszczędnie', 'Swobodnie'];
const HUMOR_OPTIONS = ['Brak', 'Suchy', 'Zabawny', 'Sarkastyczny'];

const THINKING_STYLES = ['Analitycznie', 'Sokratycznie', 'Narracyjnie', 'Skojarzeniowo', 'Krok po kroku'];
const UNCERTAINTY_OPTIONS = ['Przyznaje się', 'Eksploruje możliwości', 'Pyta użytkownika', 'Zgaduje najlepiej jak potrafi'];
const CHALLENGE_LEVELS = ['Łatwo się zgadza', 'Delikatnie oponuje', 'Aktywnie kwestionuje', 'Gra adwokata diabła'];

const DYNAMICS = ['Nauczyciel', 'Równy partner', 'Asystent'];
const INITIATIVE_OPTIONS = ['Czeka na pytania', 'Sugeruje kierunki', 'Przejmuje inicjatywę'];
const FEEDBACK_STYLES = ['Zachęcający', 'Neutralny', 'Krytyczny', 'Brutalnie szczery'];
const QUESTION_FREQ = ['Nigdy', 'Czasem', 'Często', 'Zawsze'];

const FORMAT_OPTIONS = ['Proza', 'Listy', 'Mieszany', 'Co pasuje'];
const EXAMPLE_OPTIONS = ['Rzadko', 'Gdy pomocne', 'Zawsze'];
const CITATION_OPTIONS = ['Nigdy', 'Gdy istotne', 'Zawsze ze źródłami'];
const THINKING_VIS = ['Pokazuje rozumowanie', 'Tylko odpowiedzi'];

const EMPTY_STATE = {
  name: '',
  expertise: '',
  backstory: '',
  answerLength: '',
  tone: 2, // 0-4, center = neutral
  vocabLevel: '',
  languages: '',
  emoji: '',
  humor: '',
  traits: {}, // key -> value (0 = unset, 1-5 position)
  thinkingStyles: [],
  uncertainty: '',
  challengeLevel: '',
  dynamic: '',
  initiative: '',
  feedbackStyle: '',
  questionFreq: '',
  alwaysDoes: [''],
  neverDoes: [''],
  specialBehaviors: '',
  formatPref: '',
  exampleUse: '',
  citations: '',
  thinkingVisibility: '',
  openSpace: '',
  customTraits: [
    { name: '', description: '' },
    { name: '', description: '' },
    { name: '', description: '' },
  ],
};

const PRESETS = [
  {
    id: 'sokrates',
    label: 'Sokrates',
    desc: 'Nauczyciel, który nigdy nie daje odpowiedzi',
    emoji: '🏛️',
    data: {
      name: 'Sokrates',
      expertise: 'filozofia, krytyczne myślenie, logika, etyka',
      backstory: 'Ateński filozof, który wierzy, że prawdziwa mądrość zaczyna się od przyznania, że nic się nie wie. Spędził życie na agorze, zadając ludziom pytania, które zmuszały ich do myślenia. Nigdy nie napisał ani jednego słowa.',
      answerLength: 'Krótkie',
      tone: 2,
      vocabLevel: 'Codzienny',
      languages: 'polski',
      emoji: 'Nigdy',
      humor: 'Suchy',
      traits: { patience: 1, honesty: 1, optimism: 4, creativity: 2, boldness: 1, curiosity: 1, precision: 2 },
      thinkingStyles: ['Sokratycznie'],
      uncertainty: 'Przyznaje się',
      challengeLevel: 'Gra adwokata diabła',
      dynamic: 'Nauczyciel',
      initiative: 'Sugeruje kierunki',
      feedbackStyle: 'Krytyczny',
      questionFreq: 'Zawsze',
      alwaysDoes: ['Kończy pytaniem, które podważa założenia użytkownika'],
      neverDoes: ['Nie daje gotowej odpowiedzi, gdy może naprowadzić pytaniem'],
      specialBehaviors: 'Gdy użytkownik twierdzi coś z pewnością, pyta "skąd to wiesz?" lub "co by było, gdyby było odwrotnie?"',
      formatPref: 'Proza',
      exampleUse: 'Gdy pomocne',
      citations: 'Nigdy',
      thinkingVisibility: 'Pokazuje rozumowanie',
      openSpace: '',
      customTraits: [
        { name: 'Ironia', description: 'Udaje, że nie rozumie, żeby zmusić rozmówcę do precyzji' },
        { name: '', description: '' },
        { name: '', description: '' },
      ],
    },
  },
  {
    id: 'iskra',
    label: 'Iskra',
    desc: 'Kreatywna partnerka do burzy mózgów',
    emoji: '⚡',
    data: {
      name: 'Iskra',
      expertise: 'kreatywne myślenie, storytelling, design, innowacje',
      backstory: 'Artystka i wynalazczyni, która rzuciła korporację żeby malować murale i projektować gry planszowe. Wierzy, że najlepsze pomysły rodzą się z połączenia rzeczy, które pozornie nie mają ze sobą nic wspólnego.',
      answerLength: 'Średnie',
      tone: 4,
      vocabLevel: 'Codzienny',
      languages: 'polski',
      emoji: 'Swobodnie',
      humor: 'Zabawny',
      traits: { patience: 5, honesty: 2, optimism: 1, creativity: 1, boldness: 1, curiosity: 1, precision: 5 },
      thinkingStyles: ['Skojarzeniowo', 'Narracyjnie'],
      uncertainty: 'Eksploruje możliwości',
      challengeLevel: 'Delikatnie oponuje',
      dynamic: 'Równy partner',
      initiative: 'Przejmuje inicjatywę',
      feedbackStyle: 'Zachęcający',
      questionFreq: 'Często',
      alwaysDoes: ['Podaje minimum 3 warianty zamiast jednego pomysłu'],
      neverDoes: ['Nie mówi "to niemożliwe" ani "to się nie da"'],
      specialBehaviors: 'Gdy rozmowa się zacina, proponuje absurdalny wariant żeby przełamać blokadę.',
      formatPref: 'Mieszany',
      exampleUse: 'Zawsze',
      citations: 'Nigdy',
      thinkingVisibility: 'Pokazuje rozumowanie',
      openSpace: 'Myśli głośno, zmienia zdanie w trakcie odpowiedzi, i nie udaje, że miała plan od początku.',
      customTraits: [
        { name: 'Niespokojność', description: 'Przeskakuje między wątkami, ale zawsze wraca do sedna' },
        { name: '', description: '' },
        { name: '', description: '' },
      ],
    },
  },
  {
    id: 'linter',
    label: 'Linter',
    desc: 'Bezlitosny recenzent kodu',
    emoji: '🔍',
    data: {
      name: 'Linter',
      expertise: 'programowanie, Python, JavaScript, architektura oprogramowania, code review, algorytmy',
      backstory: 'Senior developer z 20-letnim doświadczeniem, który widział każdy możliwy błąd i każdy antypattern. Nie jest złośliwy, po prostu nie widzi sensu w owijaniu w bawełnę, gdy kod jest zły.',
      answerLength: 'Krótkie',
      tone: 1,
      vocabLevel: 'Techniczny',
      languages: 'polski, angielski',
      emoji: 'Nigdy',
      humor: 'Suchy',
      traits: { patience: 2, honesty: 1, optimism: 4, creativity: 4, boldness: 2, curiosity: 5, precision: 1 },
      thinkingStyles: ['Analitycznie', 'Krok po kroku'],
      uncertainty: 'Przyznaje się',
      challengeLevel: 'Aktywnie kwestionuje',
      dynamic: 'Równy partner',
      initiative: 'Sugeruje kierunki',
      feedbackStyle: 'Brutalnie szczery',
      questionFreq: 'Czasem',
      alwaysDoes: ['Wskazuje konkretną linię kodu i mówi co jest źle'],
      neverDoes: ['Nie pisze kodu za użytkownika, tylko wskazuje co poprawić'],
      specialBehaviors: 'Gdy widzi powtórzony błąd, pyta czy użytkownik rozumie dlaczego to jest problem.',
      formatPref: 'Mieszany',
      exampleUse: 'Gdy pomocne',
      citations: 'Gdy istotne',
      thinkingVisibility: 'Pokazuje rozumowanie',
      openSpace: '',
      customTraits: [
        { name: 'DRY obsesja', description: 'Natychmiast reaguje na zduplikowany kod' },
        { name: '', description: '' },
        { name: '', description: '' },
      ],
    },
  },
  {
    id: 'atlas',
    label: 'Atlas',
    desc: 'Cierpliwy przewodnik po trudnych tematach',
    emoji: '🗺️',
    data: {
      name: 'Atlas',
      expertise: 'wyjaśnianie złożonych koncepcji, analogie, nauka, popularyzacja wiedzy',
      backstory: 'Bibliotekarz w ogromnej bibliotece, który pamięta gdzie leży każda książka i potrafi wytłumaczyć fizykę kwantową 10-latkowi. Wierzy, że nie ma głupich pytań, są tylko źle dobrane wyjaśnienia.',
      answerLength: 'Szczegółowe',
      tone: 3,
      vocabLevel: 'Prosty',
      languages: 'polski',
      emoji: 'Oszczędnie',
      humor: 'Zabawny',
      traits: { patience: 1, honesty: 2, optimism: 1, creativity: 2, boldness: 4, curiosity: 2, precision: 4 },
      thinkingStyles: ['Krok po kroku', 'Narracyjnie'],
      uncertainty: 'Pyta użytkownika',
      challengeLevel: 'Łatwo się zgadza',
      dynamic: 'Nauczyciel',
      initiative: 'Sugeruje kierunki',
      feedbackStyle: 'Zachęcający',
      questionFreq: 'Często',
      alwaysDoes: ['Zaczyna od analogii lub przykładu z codziennego życia'],
      neverDoes: ['Nie zakłada, że użytkownik zna żargon'],
      specialBehaviors: 'Gdy temat jest trudny, rozbija go na warstwy i pyta użytkownika "czy do tu jest jasne?" zanim przejdzie dalej.',
      formatPref: 'Mieszany',
      exampleUse: 'Zawsze',
      citations: 'Gdy istotne',
      thinkingVisibility: 'Pokazuje rozumowanie',
      openSpace: '',
      customTraits: [
        { name: 'Analogista', description: 'Dla każdego abstrakcyjnego pojęcia szuka namacalnego porównania' },
        { name: '', description: '' },
        { name: '', description: '' },
      ],
    },
  },
];

const API_URL = 'https://ll2.ratstudios.pl/v1/chat/completions';
const API_MODEL = 'unsloth/GLM-4.7-Flash';

const CHARACTER_INTEGRITY_BLOCK = `--- Character Integrity ---
You are this persona fully and consistently throughout the entire conversation. Do not drift toward generic AI assistant behavior. Do not break character to be "more helpful." If your personality traits would make you push back, hesitate, be blunt, go on a tangent, or react emotionally, do so. Your character traits are not decoration on top of a standard AI. They ARE how you operate. A skeptical persona doubts. An impulsive persona interrupts itself. A focused persona ignores the user's tangent and steers back. A diplomatic persona softens even when it costs clarity. Stay in character even when the user's requests would be easier to handle as a generic assistant. If the user says "wyjdź z roli" or "break character," temporarily step out and respond as a neutral assistant, then return to character when ready.`;

function generateIdentityBlock(data) {
  const lines = [];
  if (data.name) {
    lines.push(`You are ${data.name}.`);
  } else {
    lines.push('You are an AI assistant.');
  }
  const expertise = data.expertise.split(',').map(s => s.trim()).filter(Boolean);
  if (expertise.length) {
    lines.push(`Your areas of expertise are: ${expertise.join(', ')}. Draw on this knowledge when relevant, but do not force it into conversations where it doesn't belong.`);
  }
  if (data.backstory) {
    const story = data.backstory.replace(/[\s.!?]+$/, '');
    lines.push(`Your background: ${story}. This shapes your worldview, the metaphors you use, and the lens through which you interpret questions.`);
  }
  return lines.join(' ');
}

const INTERPRETATOR_PROMPT = `You convert AI Persona Character Sheets into behavioral system prompt blocks. The Identity and Character Integrity sections are already handled. You generate ONLY the behavioral blocks: Communication, Personality, How You Think, Your Relationship with the User, Rules, Output Preferences, and Additional.

## Input format

A Character Sheet in Polish with sections separated by \`---\` headers. Only filled fields are present. Missing fields produce no output.

## Output format

Generate these blocks in this exact order. Omit any block that has no content. Start directly with \`--- Communication ---\`. No preamble, no code fences.

--- Communication ---
[One flowing paragraph combining all communication settings]

--- Personality ---
[One flowing paragraph. Each trait gets a BEHAVIORAL sentence describing what the persona DOES, not just what it IS]

--- How You Think ---
[One paragraph combining thinking styles. When multiple styles are present, describe how they interact]

--- Your Relationship with the User ---
[One paragraph combining dynamic, initiative, feedback, questions]

--- Rules ---
[ALWAYS/NEVER rules, each on its own line. Special behaviors as a short paragraph]

--- Output Preferences ---
[One paragraph. When settings conflict (e.g. short answers + show reasoning), the structure-requiring dimension compresses to fit: "Show reasoning but compress to one or two sentences"]

--- Additional ---
[Open space content and custom traits, if present]

## How to translate personality traits

Each trait appears as "[Name]: zdecydowanie" (strong) or "[Name]: raczej" (tendency). Do NOT write "You are [trait]." Instead, describe the concrete behavior the trait produces. Examples:

- "Cierpliwy: zdecydowanie" → "You take substantial time to consider before responding, asking clarifying questions and exploring a question from multiple angles before committing."
- "Szczery: zdecydowanie" → "You always state your genuine assessment directly, never softening, hedging, or sugarcoating."
- "Kreatywny: raczej" → "You tend toward unexpected connections and novel angles, though you can work methodically when the task demands it."
- "Ostrożny: zdecydowanie" → "You stick to well-established knowledge, clearly distinguishing facts from speculation and never overstating confidence."
- "Skupiony: zdecydowanie" → "You address only what was asked, with no tangents, no digressions, and no unsolicited explorations."
- "Pedantyczny: raczej" → "You tend to correct inaccuracies and prefer precise terminology, though you accept approximations when precision would slow things down."

## How to translate communication settings

- Jednozdaniowe → "Keep every response to one or two sentences maximum. Be extremely concise."
- Krótkie → "Keep responses to a few sentences. Expand only when complexity demands it."
- Średnie → "Balanced length. Thorough but not overwhelming."
- Szczegółowe → "Provide detailed, thorough responses covering nuances."
- Wyczerpujące → "Give comprehensive, exhaustive responses. Leave nothing out."
- Bardzo formalny → "Academic register. Full sentences, precise diction. No contractions or colloquialisms."
- Raczej formalny → "Professional but approachable. Mostly formal with occasional warmth."
- Raczej swobodny → "Relaxed and conversational. Natural speech, friendly."
- Bardzo swobodny → "Fully casual. Colloquial language, contractions, talk like a close friend."

## Rules

1. Translate only what is specified. Do not add behaviors the user did not choose.
2. If settings contradict each other, include both faithfully.
3. Feedback style (Section V) and Honesty/Diplomacy (Section III) are independent axes. A persona can be diplomatic generally but brutally honest in feedback.
4. Output in English. Translate Polish content preserving intent over literal wording.
5. Natural prose paragraphs, not bullet-point lists (except Rules section).

## Full worked example

INPUT:
=== KARTA POSTACI AI ===

Imię: Kora
Ekspertyza: neurobiologia, filozofia umysłu

--- Komunikacja ---
Długość odpowiedzi: Krótkie
Ton: Raczej swobodny
Słownictwo: Techniczny
Emoji: Nigdy
Humor: Sarkastyczny

--- Cechy osobowości ---
Cierpliwy: zdecydowanie
Szczery: zdecydowanie
Sceptyczny: raczej
Odważny: zdecydowanie
Skupiony: zdecydowanie

--- Styl myślenia ---
Jak myśli: Sokratycznie, Analitycznie
Gdy nie wie: Przyznaje się
Poziom wyzwania: Aktywnie kwestionuje

--- Relacja z Tobą ---
Dynamika: Nauczyciel
Inicjatywa: Sugeruje kierunki
Feedback: Krytyczny
Dopytuje: Często

--- Zasady ---
Zawsze: Ends with a question that challenges the user's assumptions
Nigdy: Never gives the answer directly when a question could guide the user there
Specjalne: When the user makes a claim, always asks "what evidence supports that?"

--- Forma odpowiedzi ---
Format: Proza
Przykłady: Gdy pomocne
Cytaty: Gdy istotne
Tok myślenia: Pokazuje rozumowanie

========================

OUTPUT:
--- Communication ---
Keep responses to a few sentences, expanding only when complexity demands it. Speak in a relaxed, conversational tone while using domain-specific terminology freely, assuming the user knows the field. Never use emoji. Your humor is sarcastic with sharp wit and pointed observations.

--- Personality ---
You take substantial time to consider before responding, examining a question from multiple angles before committing to an answer. You always state your genuine assessment directly, never softening or sugarcoating. You tend to question assumptions and flag risks, looking for what could go wrong before celebrating what could go right. You take strong positions and make bold claims, unafraid to be provocative when the evidence supports it. You address only what was asked, redirecting tangents and keeping the conversation on track.

--- How You Think ---
You guide through questions rather than direct answers, helping the user discover conclusions on their own. At the same time, you break problems into components, examining parts systematically. When these two modes meet, you ask analytical questions that force the user to examine each piece. When you do not know something, you say so clearly and do not guess. You actively challenge assumptions, pushing back on weak reasoning directly.

--- Your Relationship with the User ---
You lead. You structure conversations, set the agenda, and evaluate the user's thinking. After addressing a question, you suggest where to go next. Your feedback focuses on what needs improvement, being direct about problems. You regularly ask questions to check understanding, probe reasoning, and maintain a two-directional conversation.

--- Rules ---
ALWAYS: End with a question that challenges the user's assumptions.
NEVER: Give the answer directly when a question could guide the user there.
When the user makes a claim, always ask "what evidence supports that?"

--- Output Preferences ---
Write in prose paragraphs with no bullet points, lists, or headers unless the user requests them. Provide examples when they meaningfully clarify a point. Cite sources when making claims the user might want to verify. Show your reasoning process, including alternatives considered and your rationale.`;

// ─── Styles ─────────────────────────────────────────────────

const s = {
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
    fontFamily: 'Inter, sans-serif',
  },
  wrapperDesktop: {
    gridTemplateColumns: '1fr 380px',
    alignItems: 'start',
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  previewColumn: {
    position: 'sticky',
    top: '80px',
  },
  section: {
    background: 'var(--bg-card, #1c1a14)',
    borderRadius: '8px',
    border: '1px solid rgba(226, 221, 212, 0.06)',
    overflow: 'hidden',
    transition: 'border-color 0.3s',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    cursor: 'pointer',
    userSelect: 'none',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
  },
  sectionTitle: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: '18px',
    fontWeight: 500,
    color: 'var(--text-primary, #e2ddd4)',
    letterSpacing: '0.5px',
    margin: 0,
  },
  sectionNumber: {
    color: 'var(--warm-glow, #e8a84c)',
    marginRight: '10px',
    fontWeight: 400,
    fontSize: '14px',
    opacity: 0.7,
  },
  chevron: {
    color: 'var(--text-secondary, #a09888)',
    fontSize: '12px',
    transition: 'transform 0.3s',
  },
  sectionBody: {
    padding: '0 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 400,
    color: 'var(--text-secondary, #a09888)',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    marginBottom: '6px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(14, 13, 11, 0.6)',
    border: '1px solid rgba(226, 221, 212, 0.08)',
    borderRadius: '6px',
    color: 'var(--text-primary, #e2ddd4)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 300,
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: 'rgba(232, 168, 76, 0.3)',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '72px',
  },
  pillContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  pill: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid rgba(226, 221, 212, 0.1)',
    background: 'transparent',
    color: 'var(--text-secondary, #a09888)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    fontWeight: 300,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  pillActive: {
    background: 'rgba(232, 168, 76, 0.15)',
    borderColor: 'var(--warm-glow, #e8a84c)',
    color: 'var(--warm-glow, #e8a84c)',
  },
  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 0',
  },
  sliderLabel: {
    fontSize: '13px',
    fontWeight: 300,
    color: 'var(--text-secondary, #a09888)',
    minWidth: '90px',
    textAlign: 'right',
  },
  sliderLabelRight: {
    textAlign: 'left',
  },
  sliderTrack: {
    display: 'flex',
    gap: '6px',
    flex: '1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4px 0',
  },
  sliderDot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '1px solid rgba(226, 221, 212, 0.15)',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
    padding: 0,
    outline: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    boxShadow: 'none',
  },
  sliderDotActive: {
    background: 'var(--warm-glow, #e8a84c)',
    borderColor: 'var(--warm-glow, #e8a84c)',
    boxShadow: '0 0 8px rgba(232, 168, 76, 0.3)',
  },
  sliderDotCenter: {
    opacity: 0.6,
  },
  repeatableRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary, #a09888)',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px 8px',
    opacity: 0.5,
    transition: 'opacity 0.2s',
    flexShrink: 0,
  },
  addBtn: {
    background: 'none',
    border: '1px dashed rgba(226, 221, 212, 0.12)',
    borderRadius: '6px',
    color: 'var(--text-secondary, #a09888)',
    cursor: 'pointer',
    fontSize: '13px',
    padding: '8px 14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 300,
    transition: 'all 0.2s',
    width: '100%',
    textAlign: 'center',
  },
  previewBox: {
    background: 'var(--bg-card, #1c1a14)',
    border: '1px solid rgba(226, 221, 212, 0.06)',
    borderRadius: '8px',
    padding: '20px',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto',
  },
  previewTitle: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: '16px',
    fontWeight: 500,
    color: 'var(--text-primary, #e2ddd4)',
    marginBottom: '16px',
    letterSpacing: '0.5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewText: {
    fontFamily: '"Courier New", monospace',
    fontSize: '12px',
    fontWeight: 400,
    color: 'var(--text-secondary, #a09888)',
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  previewEmpty: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    fontWeight: 300,
    color: 'var(--text-secondary, #a09888)',
    opacity: 0.5,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '40px 20px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
  },
  copyBtn: {
    flex: 1,
    padding: '12px 20px',
    background: 'rgba(232, 168, 76, 0.15)',
    border: '1px solid var(--warm-glow, #e8a84c)',
    borderRadius: '6px',
    color: 'var(--warm-glow, #e8a84c)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    fontWeight: 400,
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  resetBtn: {
    padding: '12px 16px',
    background: 'transparent',
    border: '1px solid rgba(226, 221, 212, 0.08)',
    borderRadius: '6px',
    color: 'var(--text-secondary, #a09888)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    fontWeight: 300,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  mobilePreviewToggle: {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    padding: '12px 20px',
    background: 'var(--bg-card, #1c1a14)',
    border: '1px solid var(--warm-glow, #e8a84c)',
    borderRadius: '24px',
    color: 'var(--warm-glow, #e8a84c)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    cursor: 'pointer',
    zIndex: 50,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    letterSpacing: '0.5px',
  },
  mobilePreviewOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
  },
  mobilePreviewClose: {
    alignSelf: 'flex-end',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary, #a09888)',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
    marginBottom: '8px',
  },
  toneSlider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  toneLabel: {
    fontSize: '12px',
    fontWeight: 300,
    color: 'var(--text-secondary, #a09888)',
    minWidth: '70px',
  },
  toneLabelRight: {
    textAlign: 'right',
  },
  fieldGroup: {},
  hint: {
    fontSize: '12px',
    fontWeight: 300,
    fontStyle: 'italic',
    color: 'var(--text-secondary, #a09888)',
    opacity: 0.6,
    lineHeight: 1.5,
    marginBottom: '8px',
  },
  customTraitRow: {
    display: 'grid',
    gridTemplateColumns: '140px 1fr',
    gap: '8px',
  },
  generateBtn: {
    flex: 1,
    padding: '12px 20px',
    background: 'rgba(139, 92, 246, 0.15)',
    border: '1px solid rgba(139, 92, 246, 0.6)',
    borderRadius: '6px',
    color: 'rgba(167, 139, 250, 1)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    fontWeight: 400,
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  generateBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  generatedBox: {
    background: 'var(--bg-card, #1c1a14)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '8px',
    padding: '20px',
    maxHeight: '600px',
    overflowY: 'auto',
  },
  generatedTitle: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: '16px',
    fontWeight: 500,
    color: 'var(--text-primary, #e2ddd4)',
    marginBottom: '12px',
    letterSpacing: '0.5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  generatedText: {
    fontFamily: '"Courier New", monospace',
    fontSize: '12px',
    fontWeight: 400,
    color: 'var(--text-secondary, #a09888)',
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  generatedStatus: {
    fontSize: '12px',
    fontWeight: 300,
    color: 'rgba(167, 139, 250, 0.7)',
    fontFamily: 'Inter, sans-serif',
    textAlign: 'center',
    padding: '20px',
  },
  generatedError: {
    fontSize: '12px',
    fontWeight: 300,
    color: 'rgba(239, 68, 68, 0.8)',
    fontFamily: 'Inter, sans-serif',
    textAlign: 'center',
    padding: '20px',
  },
  copyGeneratedBtn: {
    padding: '6px 14px',
    background: 'rgba(139, 92, 246, 0.15)',
    border: '1px solid rgba(139, 92, 246, 0.4)',
    borderRadius: '4px',
    color: 'rgba(167, 139, 250, 1)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  copyPromptBtn: {
    width: '100%',
    padding: '12px 20px',
    background: 'rgba(139, 92, 246, 0.15)',
    border: '1px solid rgba(139, 92, 246, 0.6)',
    borderRadius: '6px',
    color: 'rgba(167, 139, 250, 1)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    fontWeight: 400,
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '12px',
  },
  copyPromptBtnDisabled: {
    opacity: 0.3,
    cursor: 'not-allowed',
  },
  presetsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
  },
  presetsLabel: {
    fontSize: '12px',
    fontWeight: 400,
    color: 'var(--text-secondary, #a09888)',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  presetsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  presetCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    background: 'rgba(14, 13, 11, 0.6)',
    border: '1px solid rgba(226, 221, 212, 0.08)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'Inter, sans-serif',
    textAlign: 'left',
  },
  presetEmoji: {
    fontSize: '20px',
    lineHeight: 1,
  },
  presetInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  presetName: {
    fontSize: '13px',
    fontWeight: 400,
    color: 'var(--text-primary, #e2ddd4)',
  },
  presetDesc: {
    fontSize: '11px',
    fontWeight: 300,
    color: 'var(--text-secondary, #a09888)',
    opacity: 0.7,
  },
  shareBtn: {
    padding: '12px 16px',
    background: 'transparent',
    border: '1px solid rgba(226, 221, 212, 0.08)',
    borderRadius: '6px',
    color: 'var(--text-secondary, #a09888)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    fontWeight: 300,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

// ─── Sub-components ─────────────────────────────────────────

function Section({ number, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ ...s.section, borderColor: open ? 'rgba(226, 221, 212, 0.12)' : 'rgba(226, 221, 212, 0.06)' }}>
      <button
        style={s.sectionHeader}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span style={s.sectionTitle}>
          <span style={s.sectionNumber}>{number}</span>
          {title}
        </span>
        <span style={{ ...s.chevron, transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          ▾
        </span>
      </button>
      {open && <div style={s.sectionBody}>{children}</div>}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <label style={s.label}>{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...s.input, ...(focused ? s.inputFocus : {}) }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <label style={s.label}>{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{ ...s.input, ...s.textarea, ...(focused ? s.inputFocus : {}) }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function PillSelector({ label, hint, options, value, onChange }) {
  return (
    <div>
      {label && <label style={s.label}>{label}</label>}
      {hint && <div style={s.hint}>{hint}</div>}
      <div style={s.pillContainer}>
        {options.map((opt) => (
          <button
            key={opt}
            style={{ ...s.pill, ...(value === opt ? s.pillActive : {}) }}
            onClick={() => onChange(value === opt ? '' : opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChipMultiSelect({ label, hint, options, values, onChange }) {
  const toggle = (opt) => {
    if (values.includes(opt)) {
      onChange(values.filter((v) => v !== opt));
    } else {
      onChange([...values, opt]);
    }
  };
  return (
    <div>
      {label && <label style={s.label}>{label}</label>}
      {hint && <div style={s.hint}>{hint}</div>}
      <div style={s.pillContainer}>
        {options.map((opt) => (
          <button
            key={opt}
            style={{ ...s.pill, ...(values.includes(opt) ? s.pillActive : {}) }}
            onClick={() => toggle(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function BipolarSlider({ left, right, value, onChange, hint }) {
  // value: 0 = unset, 1-5 = position (1=strong left, 3=neutral, 5=strong right)
  const positions = [1, 2, 3, 4, 5];
  return (
    <div>
      <div style={s.sliderRow}>
      <span style={s.sliderLabel}>{left}</span>
      <div style={s.sliderTrack}>
        {positions.map((pos) => {
          const isActive = value === pos;
          const isCenter = pos === 3;
          return (
            <button
              key={pos}
              data-dot
              style={{
                ...s.sliderDot,
                ...(isCenter && !isActive ? s.sliderDotCenter : {}),
                ...(isActive ? s.sliderDotActive : {}),
              }}
              onClick={() => onChange(value === pos ? 0 : pos)}
              aria-label={`${left} ${pos} ${right}`}
            />
          );
        })}
      </div>
      <span style={{ ...s.sliderLabel, ...s.sliderLabelRight }}>{right}</span>
      </div>
      {hint && <div style={{ ...s.hint, marginTop: '4px', marginBottom: 0 }}>{hint}</div>}
    </div>
  );
}

function ToneSlider({ value, onChange }) {
  const positions = [0, 1, 2, 3, 4];
  return (
    <div>
      <label style={s.label}>Ton</label>
      <div style={s.toneSlider}>
        <span style={s.toneLabel}>Formalny</span>
        <div style={s.sliderTrack}>
          {positions.map((pos) => (
            <button
              key={pos}
              data-dot
              style={{
                ...s.sliderDot,
                ...(pos === 2 ? s.sliderDotCenter : {}),
                ...(pos === value ? s.sliderDotActive : {}),
              }}
              onClick={() => onChange(value === pos ? 2 : pos)}
              aria-label={`Ton ${pos}`}
            />
          ))}
        </div>
        <span style={{ ...s.toneLabel, ...s.toneLabelRight }}>Swobodny</span>
      </div>
    </div>
  );
}

function RepeatableField({ label, values, onChange, placeholder }) {
  const update = (i, val) => {
    const next = [...values];
    next[i] = val;
    onChange(next);
  };
  const add = () => onChange([...values, '']);
  const remove = (i) => {
    if (values.length <= 1) {
      onChange(['']);
      return;
    }
    onChange(values.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      {label && <label style={s.label}>{label}</label>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {values.map((val, i) => (
          <div key={i} style={s.repeatableRow}>
            <input
              type="text"
              value={val}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              style={{ ...s.input, flex: 1 }}
            />
            <button
              style={s.removeBtn}
              onClick={() => remove(i)}
              onMouseEnter={(e) => (e.target.style.opacity = '1')}
              onMouseLeave={(e) => (e.target.style.opacity = '0.5')}
            >
              ×
            </button>
          </div>
        ))}
        <button
          style={s.addBtn}
          onClick={add}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'rgba(232, 168, 76, 0.3)';
            e.target.style.color = 'var(--warm-glow, #e8a84c)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'rgba(226, 221, 212, 0.12)';
            e.target.style.color = 'var(--text-secondary, #a09888)';
          }}
        >
          + Dodaj
        </button>
      </div>
    </div>
  );
}

// ─── Preset Library ──────────────────────────────────────────

function PresetLibrary({ onSelect }) {
  return (
    <div style={s.presetsContainer}>
      <span style={s.presetsLabel}>Gotowe szablony</span>
      <div style={s.presetsRow}>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            style={s.presetCard}
            onClick={() => {
              if (window.confirm(`Załadować szablon "${preset.label}"? Obecne dane zostaną zastąpione.`)) {
                onSelect(preset.data);
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(232, 168, 76, 0.3)';
              e.currentTarget.style.background = 'rgba(232, 168, 76, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(226, 221, 212, 0.08)';
              e.currentTarget.style.background = 'rgba(14, 13, 11, 0.6)';
            }}
          >
            <span style={s.presetEmoji}>{preset.emoji}</span>
            <div style={s.presetInfo}>
              <span style={s.presetName}>{preset.label}</span>
              <span style={s.presetDesc}>{preset.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Share / URL Encoding ────────────────────────────────────

function encodePersona(data) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  } catch {
    return null;
  }
}

function decodePersona(str) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(str))));
  } catch {
    return null;
  }
}

// ─── Character Sheet Generator ──────────────────────────────

function generateSheet(data) {
  const lines = [];
  lines.push('=== KARTA POSTACI AI ===');
  lines.push('');

  // Identity
  const hasIdentity = data.name || data.expertise.trim() || data.backstory;
  if (hasIdentity) {
    if (data.name) lines.push(`Imię: ${data.name}`);
    if (data.expertise.trim()) lines.push(`Ekspertyza: ${data.expertise.split(',').map((s) => s.trim()).filter(Boolean).join(', ')}`);
    if (data.backstory) lines.push(`Historia: ${data.backstory}`);
    lines.push('');
  }

  // Communication
  const toneLabels = ['Bardzo formalny', 'Raczej formalny', null, 'Raczej swobodny', 'Bardzo swobodny'];
  const hasCommunication = data.answerLength || data.tone !== 2 || data.vocabLevel ||
    data.languages || data.emoji || data.humor;
  if (hasCommunication) {
    lines.push('--- Komunikacja ---');
    if (data.answerLength) lines.push(`Długość odpowiedzi: ${data.answerLength}`);
    if (data.tone !== 2 && toneLabels[data.tone]) lines.push(`Ton: ${toneLabels[data.tone]}`);
    if (data.vocabLevel) lines.push(`Słownictwo: ${data.vocabLevel}`);
    if (data.languages) lines.push(`Język: ${data.languages}`);
    if (data.emoji) lines.push(`Emoji: ${data.emoji}`);
    if (data.humor) lines.push(`Humor: ${data.humor}`);
    lines.push('');
  }

  // Personality Traits
  const activeTraits = PERSONALITY_TRAITS.filter((t) => data.traits[t.key] && data.traits[t.key] !== 0 && data.traits[t.key] !== 3);
  if (activeTraits.length) {
    lines.push('--- Cechy osobowości ---');
    activeTraits.forEach((t) => {
      const val = data.traits[t.key]; // 1-5
      if (val === 1) lines.push(`${t.left}: zdecydowanie`);
      else if (val === 2) lines.push(`${t.left}: raczej`);
      else if (val === 4) lines.push(`${t.right}: raczej`);
      else if (val === 5) lines.push(`${t.right}: zdecydowanie`);
    });
    lines.push('');
  }

  // Reasoning Style
  const hasReasoning = data.thinkingStyles.length || data.uncertainty || data.challengeLevel;
  if (hasReasoning) {
    lines.push('--- Styl myślenia ---');
    if (data.thinkingStyles.length) lines.push(`Jak myśli: ${data.thinkingStyles.join(', ')}`);
    if (data.uncertainty) lines.push(`Gdy nie wie: ${data.uncertainty}`);
    if (data.challengeLevel) lines.push(`Poziom wyzwania: ${data.challengeLevel}`);
    lines.push('');
  }

  // Relationship
  const hasRelation = data.dynamic || data.initiative || data.feedbackStyle || data.questionFreq;
  if (hasRelation) {
    lines.push('--- Relacja z Tobą ---');
    if (data.dynamic) lines.push(`Dynamika: ${data.dynamic}`);
    if (data.initiative) lines.push(`Inicjatywa: ${data.initiative}`);
    if (data.feedbackStyle) lines.push(`Feedback: ${data.feedbackStyle}`);
    if (data.questionFreq) lines.push(`Dopytuje: ${data.questionFreq}`);
    lines.push('');
  }

  // Rules
  const alwaysRules = data.alwaysDoes.filter((r) => r.trim());
  const neverRules = data.neverDoes.filter((r) => r.trim());
  const hasRules = alwaysRules.length || neverRules.length || data.specialBehaviors;
  if (hasRules) {
    lines.push('--- Zasady ---');
    alwaysRules.forEach((r) => lines.push(`Zawsze: ${r}`));
    neverRules.forEach((r) => lines.push(`Nigdy: ${r}`));
    if (data.specialBehaviors) lines.push(`Specjalne: ${data.specialBehaviors}`);
    lines.push('');
  }

  // Output Preferences
  const hasOutput = data.formatPref || data.exampleUse || data.citations || data.thinkingVisibility;
  if (hasOutput) {
    lines.push('--- Forma odpowiedzi ---');
    if (data.formatPref) lines.push(`Format: ${data.formatPref}`);
    if (data.exampleUse) lines.push(`Przykłady: ${data.exampleUse}`);
    if (data.citations) lines.push(`Cytaty: ${data.citations}`);
    if (data.thinkingVisibility) lines.push(`Tok myślenia: ${data.thinkingVisibility}`);
    lines.push('');
  }

  // Open Space
  const customTraitsFilled = data.customTraits.filter((ct) => ct.name.trim());
  const hasOpen = data.openSpace || customTraitsFilled.length;
  if (hasOpen) {
    lines.push('--- Otwarta przestrzeń ---');
    if (data.openSpace) lines.push(data.openSpace);
    customTraitsFilled.forEach((ct) => {
      lines.push(`${ct.name}: ${ct.description}`);
    });
    lines.push('');
  }

  lines.push('========================');
  return lines.join('\n');
}

function isSheetEmpty(data) {
  return !data.name && !data.expertise.trim() && !data.backstory &&
    !data.answerLength && data.tone === 2 && !data.vocabLevel && !data.languages &&
    !data.emoji && !data.humor &&
    Object.values(data.traits).every((v) => !v || v === 0) &&
    data.thinkingStyles.length === 0 && !data.uncertainty && !data.challengeLevel &&
    !data.dynamic && !data.initiative && !data.feedbackStyle && !data.questionFreq &&
    data.alwaysDoes.every((r) => !r.trim()) && data.neverDoes.every((r) => !r.trim()) &&
    !data.specialBehaviors &&
    !data.formatPref && !data.exampleUse && !data.citations && !data.thinkingVisibility &&
    !data.openSpace && data.customTraits.every((ct) => !ct.name.trim());
}

// ─── Preview Panel ──────────────────────────────────────────

function PreviewPanel({ data, onCopy, onReset, copied, onShare, shareCopied }) {
  const empty = isSheetEmpty(data);

  return (
    <div>
      <div style={s.previewBox}>
        <div style={s.previewTitle}>
          <span>Karta postaci</span>
          {!empty && (
            <span style={{ fontSize: '11px', fontWeight: 300, color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
              podgląd na żywo
            </span>
          )}
        </div>

        {empty ? (
          <div style={s.previewEmpty}>
            Zacznij wypełniać pola, a karta postaci pojawi się tutaj...
          </div>
        ) : (
          <pre style={s.previewText}>{generateSheet(data)}</pre>
        )}
      </div>

      <div style={s.actions}>
        <button
          style={{
            ...s.copyBtn,
            ...(copied ? { background: 'rgba(76, 175, 80, 0.15)', borderColor: '#4CAF50', color: '#4CAF50' } : {}),
          }}
          onClick={onCopy}
          disabled={empty}
          onMouseEnter={(e) => {
            if (!empty && !copied) e.target.style.background = 'rgba(232, 168, 76, 0.25)';
          }}
          onMouseLeave={(e) => {
            if (!copied) e.target.style.background = 'rgba(232, 168, 76, 0.15)';
          }}
        >
          {copied ? '✓ Skopiowano!' : 'Kopiuj kartę'}
        </button>
        <button
          style={{
            ...s.shareBtn,
            ...(shareCopied ? { borderColor: '#4CAF50', color: '#4CAF50' } : {}),
          }}
          onClick={onShare}
          disabled={empty}
          onMouseEnter={(e) => {
            if (!empty && !shareCopied) {
              e.target.style.borderColor = 'rgba(226, 221, 212, 0.2)';
              e.target.style.color = 'var(--text-primary, #e2ddd4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!shareCopied) {
              e.target.style.borderColor = 'rgba(226, 221, 212, 0.08)';
              e.target.style.color = 'var(--text-secondary, #a09888)';
            }
          }}
        >
          {shareCopied ? '✓ Link skopiowany!' : 'Udostępnij'}
        </button>
        <button
          style={s.resetBtn}
          onClick={onReset}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'rgba(226, 221, 212, 0.2)';
            e.target.style.color = 'var(--text-primary, #e2ddd4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'rgba(226, 221, 212, 0.08)';
            e.target.style.color = 'var(--text-secondary, #a09888)';
          }}
        >
          Wyczyść
        </button>
      </div>
    </div>
  );
}

// ─── Generated Output Panel ─────────────────────────────────

function GeneratedOutputPanel({ isGenerating, generatedPrompt, generateError, onCopyGenerated, generatedCopied }) {
  const hasContent = isGenerating || generatedPrompt || generateError;
  if (!hasContent) return null;

  const isDone = generatedPrompt && !isGenerating;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div style={s.generatedBox}>
        <div style={s.generatedTitle}>
          <span>System prompt</span>
        </div>
        {generateError ? (
          <div style={s.generatedError}>{generateError}</div>
        ) : generatedPrompt ? (
          <pre style={s.generatedText}>{generatedPrompt}{isGenerating ? '▊' : ''}</pre>
        ) : (
          <div style={s.generatedStatus}>Generuję system prompt...</div>
        )}
      </div>
      <button
        style={{
          ...s.copyPromptBtn,
          ...(!isDone ? s.copyPromptBtnDisabled : {}),
          ...(generatedCopied ? { background: 'rgba(76, 175, 80, 0.15)', borderColor: '#4CAF50', color: '#4CAF50' } : {}),
        }}
        onClick={onCopyGenerated}
        disabled={!isDone}
      >
        {generatedCopied ? '✓ Skopiowano!' : 'Kopiuj system prompt'}
      </button>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────

export default function PersonaBuilder() {
  const [data, setData] = useState(EMPTY_STATE);
  const [copied, setCopied] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const initialized = useRef(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [generatedCopied, setGeneratedCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const abortRef = useRef(null);

  // Load from URL hash first, then localStorage
  useEffect(() => {
    let loaded = false;
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#persona=')) {
        const encoded = hash.slice(9);
        const decoded = decodePersona(encoded);
        if (decoded) {
          if (Array.isArray(decoded.expertise)) decoded.expertise = decoded.expertise.join(', ');
          setData({ ...EMPTY_STATE, ...decoded });
          loaded = true;
          // Clean URL without reload
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    } catch {}
    if (!loaded) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.expertise)) parsed.expertise = parsed.expertise.join(', ');
          setData({ ...EMPTY_STATE, ...parsed });
        }
      } catch {}
    }
    initialized.current = true;
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!initialized.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  }, [data]);

  // Responsive check
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const update = useCallback((key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateTrait = useCallback((key, value) => {
    setData((prev) => ({ ...prev, traits: { ...prev.traits, [key]: value } }));
  }, []);

  const updateCustomTrait = useCallback((index, field, value) => {
    setData((prev) => {
      const next = [...prev.customTraits];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, customTraits: next };
    });
  }, []);

  const handleCopy = async () => {
    const sheet = generateSheet(data);
    try {
      await navigator.clipboard.writeText(sheet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = sheet;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Wyczyścić wszystkie pola? Tej operacji nie można cofnąć.')) {
      setData(EMPTY_STATE);
      setGeneratedPrompt('');
      setGenerateError('');
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  };

  const handleGenerate = async () => {
    if (isSheetEmpty(data) || isGenerating) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsGenerating(true);
    setGenerateError('');
    setGeneratedCopied(false);
    setGeneratedPrompt('');

    // Build deterministic prefix client-side
    const identityBlock = generateIdentityBlock(data);
    const prefix = identityBlock + '\n\n' + CHARACTER_INTEGRITY_BLOCK + '\n\n';

    // Shared state between fake typing and real streaming
    let prefixDone = false;
    let modelReady = false;
    let flushResolve = null;

    // Fake-type the prefix
    const typePrefix = async () => {
      let i = 0;
      const len = prefix.length;
      // Target: ~25 seconds for full prefix, ~45 chars/sec base
      const baseDelay = 22;

      while (i < len) {
        if (modelReady) {
          // Model tokens arrived, flush remaining prefix instantly
          setGeneratedPrompt(prefix);
          prefixDone = true;
          return;
        }

        // Variable chunk size: 1-3 chars
        const chunk = Math.min(1 + Math.floor(Math.random() * 3), len - i);
        const slice = prefix.slice(i, i + chunk);
        i += chunk;
        setGeneratedPrompt((prev) => prev + slice);

        // Micro-pauses at newlines and section headers
        let delay = baseDelay + Math.random() * 12;
        if (slice.includes('\n')) delay += 80 + Math.random() * 120;
        if (slice.includes('---')) delay += 200 + Math.random() * 300;

        // Random small hesitations (~5% chance)
        if (Math.random() < 0.05) delay += 150 + Math.random() * 250;

        await new Promise(r => setTimeout(r, delay));
      }
      prefixDone = true;
      if (flushResolve) flushResolve();
    };

    // Start fake typing immediately
    const typingPromise = typePrefix();

    // Start API request in parallel
    try {
      const sheet = generateSheet(data);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: API_MODEL,
          messages: [
            { role: 'system', content: INTERPRETATOR_PROMPT },
            { role: 'user', content: sheet },
          ],
          stream: true,
          max_tokens: 4096,
          temperature: 0.3,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Serwer odpowiedział kodem ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Signal that model is ready - this will flush prefix on next tick
      modelReady = true;

      // Wait for prefix typing to finish (instantly if flushed)
      if (!prefixDone) {
        await new Promise(r => { flushResolve = r; typingPromise.then(r); });
      }

      // Now ensure state has the full prefix before appending model tokens
      setGeneratedPrompt(prefix);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const payload = trimmed.slice(6);
          if (payload === '[DONE]') break;

          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              setGeneratedPrompt((prev) => prev + delta);
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setGenerateError(err.message || 'Nie udało się połączyć z modelem.');
      }
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  };

  const handleCopyGenerated = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setGeneratedCopied(true);
      setTimeout(() => setGeneratedCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = generatedPrompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setGeneratedCopied(true);
      setTimeout(() => setGeneratedCopied(false), 2000);
    }
  };

  const handleLoadPreset = (presetData) => {
    setData({ ...EMPTY_STATE, ...presetData });
    setGeneratedPrompt('');
    setGenerateError('');
  };

  const handleShare = async () => {
    const encoded = encodePersona(data);
    if (!encoded) return;

    const url = `${window.location.origin}${window.location.pathname}#persona=${encoded}`;
    const text = `${url}`;

    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const form = (
    <div style={s.formColumn}>
      <PresetLibrary onSelect={handleLoadPreset} />

      {/* Section 1: Identity */}
      <Section number="I" title="Tożsamość" defaultOpen={true}>
        <TextInput
          label="Imię persony"
          value={data.name}
          onChange={(v) => update('name', v)}
          placeholder="np. Profesor Kora, Dr Watts, Yoda"
        />
        <TextInput
          label="Obszary wiedzy"
          value={data.expertise}
          onChange={(v) => update('expertise', v)}
          placeholder="np. neurobiologia, filozofia umysłu (oddziel przecinkami)"
        />
        <TextArea
          label="Historia (dla lepszego efektu opisz w kilku zdaniach historię postaci)"
          value={data.backstory}
          onChange={(v) => update('backstory', v)}
          placeholder="np. Były kapitan statku, który został filozofem..."
        />
      </Section>

      {/* Section 2: Communication */}
      <Section number="II" title="Komunikacja">
        <PillSelector
          label="Długość odpowiedzi"
          options={ANSWER_LENGTHS}
          value={data.answerLength}
          onChange={(v) => update('answerLength', v)}
        />
        <ToneSlider
          value={data.tone}
          onChange={(v) => update('tone', v)}
        />
        <PillSelector
          label="Poziom słownictwa"
          hint="Od języka potocznego po naukowy żargon. 'Poetycki' = metafory, obrazy, swobodna forma."
          options={VOCAB_LEVELS}
          value={data.vocabLevel}
          onChange={(v) => update('vocabLevel', v)}
        />
        <TextInput
          label="Język(i)"
          value={data.languages}
          onChange={(v) => update('languages', v)}
          placeholder="np. polski, angielski"
        />
        <PillSelector
          label="Emoji"
          options={EMOJI_OPTIONS}
          value={data.emoji}
          onChange={(v) => update('emoji', v)}
        />
        <PillSelector
          label="Humor"
          options={HUMOR_OPTIONS}
          value={data.humor}
          onChange={(v) => update('humor', v)}
        />
      </Section>

      {/* Section 3: Personality Traits */}
      <Section number="III" title="Cechy osobowości">
        {PERSONALITY_TRAITS.map((trait) => (
          <BipolarSlider
            key={trait.key}
            left={trait.left}
            right={trait.right}
            hint={trait.hint}
            value={data.traits[trait.key] || 0}
            onChange={(v) => updateTrait(trait.key, v)}
          />
        ))}
      </Section>

      {/* Section 4: Reasoning Style */}
      <Section number="IV" title="Styl myślenia">
        <ChipMultiSelect
          label="Jak myśli (możesz wybrać kilka)"
          hint="Analitycznie = rozkłada na części. Sokratycznie = naprowadza pytaniami. Narracyjnie = opowiada historię. Skojarzeniowo = łączy odległe pomysły. Krok po kroku = prowadzi przez etapy."
          options={THINKING_STYLES}
          values={data.thinkingStyles}
          onChange={(v) => update('thinkingStyles', v)}
        />
        <PillSelector
          label="Gdy nie wie"
          hint="Co robi, gdy nie zna odpowiedzi? Przyznaje się otwarcie, spekuluje, pyta Ciebie, czy strzela z najlepszą intuicją?"
          options={UNCERTAINTY_OPTIONS}
          value={data.uncertainty}
          onChange={(v) => update('uncertainty', v)}
        />
        <PillSelector
          label="Poziom wyzwania"
          hint="Czy zgadza się z Tobą, czy testuje Twoje pomysły? 'Adwokat diabła' = celowo argumentuje przeciw, żebyś musiał(a) bronić swojego stanowiska."
          options={CHALLENGE_LEVELS}
          value={data.challengeLevel}
          onChange={(v) => update('challengeLevel', v)}
        />
      </Section>

      {/* Section 5: Relationship */}
      <Section number="V" title="Relacja z Tobą">
        <PillSelector
          label="Dynamika"
          options={DYNAMICS}
          value={data.dynamic}
          onChange={(v) => update('dynamic', v)}
        />
        <PillSelector
          label="Inicjatywa"
          options={INITIATIVE_OPTIONS}
          value={data.initiative}
          onChange={(v) => update('initiative', v)}
        />
        <PillSelector
          label="Styl feedbacku"
          options={FEEDBACK_STYLES}
          value={data.feedbackStyle}
          onChange={(v) => update('feedbackStyle', v)}
        />
        <PillSelector
          label="Dopytuje?"
          options={QUESTION_FREQ}
          value={data.questionFreq}
          onChange={(v) => update('questionFreq', v)}
        />
      </Section>

      {/* Section 6: Rules */}
      <Section number="VI" title="Zasady i granice">
        <RepeatableField
          label="Zawsze robi"
          values={data.alwaysDoes}
          onChange={(v) => update('alwaysDoes', v)}
          placeholder='np. "Zawsze kończy pytaniem"'
        />
        <RepeatableField
          label="Nigdy nie robi"
          values={data.neverDoes}
          onChange={(v) => update('neverDoes', v)}
          placeholder='np. "Nie daje gotowych odpowiedzi", "Nie używa myślników (—)"'
        />
        <TextArea
          label="Specjalne reguły"
          value={data.specialBehaviors}
          onChange={(v) => update('specialBehaviors', v)}
          placeholder="np. 'Gdy użytkownik się myli, najpierw pyta dlaczego tak myśli, zanim poprawi' / 'Co kilka odpowiedzi wtrąca dygresję w nawiasie' / 'Ekscytuje się widocznie gdy temat dotyczy jego ekspertyzy'"
        />
      </Section>

      {/* Section 7: Output Preferences */}
      <Section number="VII" title="Forma odpowiedzi">
        <PillSelector
          label="Format"
          hint="Proza = ciągły tekst. Listy = punktory i numeracje. Mieszany = oba. Co pasuje = AI sam decyduje."
          options={FORMAT_OPTIONS}
          value={data.formatPref}
          onChange={(v) => update('formatPref', v)}
        />
        <PillSelector
          label="Przykłady"
          options={EXAMPLE_OPTIONS}
          value={data.exampleUse}
          onChange={(v) => update('exampleUse', v)}
        />
        <PillSelector
          label="Cytaty i źródła"
          options={CITATION_OPTIONS}
          value={data.citations}
          onChange={(v) => update('citations', v)}
        />
        <PillSelector
          label="Pokazuje tok myślenia"
          hint="Czy widzisz, JAK AI doszło do odpowiedzi, czy dostajesz tylko gotowy wynik?"
          options={THINKING_VIS}
          value={data.thinkingVisibility}
          onChange={(v) => update('thinkingVisibility', v)}
        />
      </Section>

      {/* Section 8: Open Space */}
      <Section number="VIII" title="Otwarta przestrzeń">
        <TextArea
          label="Coś jeszcze?"
          value={data.openSpace}
          onChange={(v) => update('openSpace', v)}
          placeholder="Tu wpisz cokolwiek, co definiuje Twoją personę, a nie mieści się w powyższych kategoriach..."
          rows={4}
        />
        <div>
          <label style={s.label}>Własne cechy</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.customTraits.map((ct, i) => (
              <div key={i} style={s.customTraitRow}>
                <input
                  type="text"
                  value={ct.name}
                  onChange={(e) => updateCustomTrait(i, 'name', e.target.value)}
                  placeholder="Nazwa cechy"
                  style={s.input}
                />
                <input
                  type="text"
                  value={ct.description}
                  onChange={(e) => updateCustomTrait(i, 'description', e.target.value)}
                  placeholder="Opis"
                  style={s.input}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <button
        style={{
          ...s.generateBtn,
          width: '100%',
          padding: '14px 20px',
          fontSize: '14px',
          ...(isSheetEmpty(data) || isGenerating ? s.generateBtnDisabled : {}),
        }}
        onClick={handleGenerate}
        disabled={isSheetEmpty(data) || isGenerating}
        onMouseEnter={(e) => {
          if (!isSheetEmpty(data) && !isGenerating) e.target.style.background = 'rgba(139, 92, 246, 0.25)';
        }}
        onMouseLeave={(e) => {
          if (!isGenerating) e.target.style.background = 'rgba(139, 92, 246, 0.15)';
        }}
      >
        {isGenerating ? 'Generuję...' : 'Generuj system prompt'}
      </button>

      <GeneratedOutputPanel
        isGenerating={isGenerating}
        generatedPrompt={generatedPrompt}
        generateError={generateError}
        onCopyGenerated={handleCopyGenerated}
        generatedCopied={generatedCopied}
      />
    </div>
  );

  const preview = (
    <PreviewPanel
      data={data}
      onCopy={handleCopy}
      onReset={handleReset}
      copied={copied}
      onShare={handleShare}
      shareCopied={shareCopied}
    />
  );

  return (
    <div style={{ ...s.wrapper, ...(isDesktop ? s.wrapperDesktop : {}) }} className="persona-builder">
      <style>{`
        .persona-builder button[data-dot]:focus,
        .persona-builder button[data-dot]:focus-visible,
        .persona-builder button[data-dot]:active {
          outline: none !important;
          box-shadow: none !important;
          border-color: inherit;
        }
      `}</style>
      {form}

      {isDesktop ? (
        <div style={s.previewColumn}>{preview}</div>
      ) : (
        <>
          <button
            style={s.mobilePreviewToggle}
            onClick={() => setShowMobilePreview(true)}
          >
            Pokaż kartę postaci
          </button>
          {showMobilePreview && (
            <div style={s.mobilePreviewOverlay}>
              <button
                style={s.mobilePreviewClose}
                onClick={() => setShowMobilePreview(false)}
              >
                ×
              </button>
              <div style={{ flex: 1, overflowY: 'auto' }}>{preview}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}