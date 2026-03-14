import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Constants ──────────────────────────────────────────────

const STORAGE_KEY = 'kogni-persona-builder';

const PERSONALITY_TRAITS = [
  { left: 'Cierpliwy', right: 'Impulsywny', key: 'patience' },
  { left: 'Szczery', right: 'Dyplomatyczny', key: 'honesty' },
  { left: 'Pewny siebie', right: 'Skromny', key: 'confidence' },
  { left: 'Optymistyczny', right: 'Sceptyczny', key: 'optimism' },
  { left: 'Współczujący', right: 'Zdystansowany', key: 'empathy' },
  { left: 'Kreatywny', right: 'Metodyczny', key: 'creativity' },
  { left: 'Odważny', right: 'Ostrożny', key: 'boldness' },
];

const ANSWER_LENGTHS = ['Jednozdaniowe', 'Krótkie', 'Średnie', 'Szczegółowe', 'Wyczerpujące'];
const VOCAB_LEVELS = ['Prosty', 'Codzienny', 'Techniczny', 'Akademicki', 'Poetycki'];
const EMOJI_OPTIONS = ['Nigdy', 'Oszczędnie', 'Swobodnie'];
const HUMOR_OPTIONS = ['Brak', 'Suchy', 'Zabawny', 'Sarkastyczny'];

const THINKING_STYLES = ['Analitycznie', 'Sokratycznie', 'Narracyjnie', 'Skojarzeniowo', 'Krok po kroku'];
const UNCERTAINTY_OPTIONS = ['Przyznaje się', 'Eksploruje możliwości', 'Pyta użytkownika', 'Zgaduje najlepiej jak potrafi'];
const CHALLENGE_LEVELS = ['Łatwo się zgadza', 'Delikatnie oponuje', 'Aktywnie kwestionuje', 'Gra adwokata diabła'];

const DYNAMICS = ['Nauczyciel', 'Równy partner', 'Asystent', 'Student uczący się razem'];
const INITIATIVE_OPTIONS = ['Czeka na pytania', 'Sugeruje kierunki', 'Przejmuje inicjatywę'];
const FEEDBACK_STYLES = ['Zachęcający', 'Neutralny', 'Krytyczny', 'Brutalnie szczery'];
const QUESTION_FREQ = ['Nigdy', 'Czasem', 'Często', 'Zawsze'];

const FORMAT_OPTIONS = ['Proza', 'Listy', 'Mieszany', 'Co pasuje'];
const EXAMPLE_OPTIONS = ['Rzadko', 'Gdy pomocne', 'Zawsze'];
const CITATION_OPTIONS = ['Nigdy', 'Gdy istotne', 'Zawsze ze źródłami'];
const THINKING_VIS = ['Pokazuje rozumowanie', 'Tylko odpowiedzi'];

const EMPTY_STATE = {
  name: '',
  role: '',
  expertise: [],
  backstory: '',
  answerLength: '',
  tone: 2, // 0-4, center = neutral
  vocabLevel: '',
  languages: '',
  emoji: '',
  humor: '',
  traits: {}, // key -> value (-2 to 2, 0 = neutral)
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
  sectionHover: {
    borderColor: 'rgba(232, 168, 76, 0.15)',
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
  },
  sliderDotActive: {
    background: 'var(--warm-glow, #e8a84c)',
    borderColor: 'var(--warm-glow, #e8a84c)',
    boxShadow: '0 0 8px rgba(232, 168, 76, 0.3)',
  },
  sliderDotCenter: {
    width: '10px',
    height: '10px',
    opacity: 0.5,
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
    marginTop: '8px',
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
  customTraitRow: {
    display: 'grid',
    gridTemplateColumns: '140px 1fr',
    gap: '8px',
  },
};

// ─── Sub-components ─────────────────────────────────────────

function Section({ number, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ ...s.section, ...(hovered ? s.sectionHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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

function PillSelector({ label, options, value, onChange }) {
  return (
    <div>
      {label && <label style={s.label}>{label}</label>}
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

function ChipMultiSelect({ label, options, values, onChange }) {
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

function BipolarSlider({ left, right, value, onChange }) {
  // value: -2, -1, 0, 1, 2 (0 = neutral/unset)
  const positions = [-2, -1, 0, 1, 2];
  return (
    <div style={s.sliderRow}>
      <span style={s.sliderLabel}>{left}</span>
      <div style={s.sliderTrack}>
        {positions.map((pos) => {
          const isActive = value !== undefined && value !== 0 && (
            (value < 0 && pos <= value && pos < 0) ||
            (value > 0 && pos >= value && pos > 0) ||
            pos === value
          );
          const isCenter = pos === 0;
          return (
            <button
              key={pos}
              style={{
                ...s.sliderDot,
                ...(isCenter ? s.sliderDotCenter : {}),
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

// ─── Character Sheet Generator ──────────────────────────────

function generateSheet(data) {
  const lines = [];
  lines.push('=== KARTA POSTACI AI ===');
  lines.push('');

  // Identity
  const hasIdentity = data.name || data.role || data.expertise.length || data.backstory;
  if (hasIdentity) {
    if (data.name) lines.push(`Imię: ${data.name}`);
    if (data.role) lines.push(`Rola: ${data.role}`);
    if (data.expertise.length) lines.push(`Ekspertyza: ${data.expertise.join(', ')}`);
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
  const activeTraits = PERSONALITY_TRAITS.filter((t) => data.traits[t.key] && data.traits[t.key] !== 0);
  if (activeTraits.length) {
    lines.push('--- Cechy osobowości ---');
    activeTraits.forEach((t) => {
      const val = data.traits[t.key];
      const dots = [0, 0, 0, 0, 0]; // 5 positions
      // val: -2,-1,0,1,2. Map to visual representation
      // -2 = strong left, 2 = strong right
      if (val < 0) {
        for (let i = 0; i < Math.abs(val); i++) dots[i] = 1;
      } else if (val > 0) {
        for (let i = 4; i > 4 - val; i--) dots[i] = 1;
      }
      const visual = dots.map((d) => (d ? '●' : '○')).join('');
      lines.push(`${t.left} ${visual} ${t.right}`);
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
  return !data.name && !data.role && data.expertise.length === 0 && !data.backstory &&
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

function PreviewPanel({ data, onCopy, onReset, copied }) {
  const empty = isSheetEmpty(data);

  return (
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
          {copied ? '✓ Skopiowano!' : 'Kopiuj kartę postaci'}
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

// ─── Main Component ─────────────────────────────────────────

export default function PersonaBuilder() {
  const [data, setData] = useState(EMPTY_STATE);
  const [copied, setCopied] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const initialized = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData({ ...EMPTY_STATE, ...parsed });
      }
    } catch {
      // Ignore parse errors
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
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  };

  const expertiseAsText = data.expertise.join(', ');
  const handleExpertiseChange = (text) => {
    update('expertise', text.split(',').map((s) => s.trim()).filter(Boolean));
  };

  const form = (
    <div style={s.formColumn}>
      {/* Section 1: Identity */}
      <Section number="I" title="Tożsamość" defaultOpen={true}>
        <TextInput
          label="Imię persony"
          value={data.name}
          onChange={(v) => update('name', v)}
          placeholder="np. Profesor Kora, Dr Watts, Yoda"
        />
        <TextInput
          label="Rola / archetyp"
          value={data.role}
          onChange={(v) => update('role', v)}
          placeholder="np. tutor, adwokat diabła, partner laboratoryjny"
        />
        <TextInput
          label="Obszary wiedzy"
          value={expertiseAsText}
          onChange={handleExpertiseChange}
          placeholder="np. neurobiologia, filozofia umysłu (oddziel przecinkami)"
        />
        <TextArea
          label="Historia (opcjonalnie)"
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
            value={data.traits[trait.key] || 0}
            onChange={(v) => updateTrait(trait.key, v)}
          />
        ))}
      </Section>

      {/* Section 4: Reasoning Style */}
      <Section number="IV" title="Styl myślenia">
        <ChipMultiSelect
          label="Jak myśli"
          options={THINKING_STYLES}
          values={data.thinkingStyles}
          onChange={(v) => update('thinkingStyles', v)}
        />
        <PillSelector
          label="Gdy nie wie"
          options={UNCERTAINTY_OPTIONS}
          value={data.uncertainty}
          onChange={(v) => update('uncertainty', v)}
        />
        <PillSelector
          label="Poziom wyzwania"
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
          placeholder='np. "Nie daje gotowych odpowiedzi"'
        />
        <TextArea
          label="Specjalne reguły"
          value={data.specialBehaviors}
          onChange={(v) => update('specialBehaviors', v)}
          placeholder="Opisz specjalne reguły..."
        />
      </Section>

      {/* Section 7: Output Preferences */}
      <Section number="VII" title="Forma odpowiedzi">
        <PillSelector
          label="Format"
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
    </div>
  );

  const preview = (
    <PreviewPanel
      data={data}
      onCopy={handleCopy}
      onReset={handleReset}
      copied={copied}
    />
  );

  return (
    <div style={{ ...s.wrapper, ...(isDesktop ? s.wrapperDesktop : {}) }}>
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
