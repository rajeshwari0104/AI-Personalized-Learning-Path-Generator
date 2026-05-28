import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useTheme, themes } from '../store/ThemeContext';
import { generateRoadmap, getRoadmaps } from '../services/api';

const TOPICS = [
  { emoji: '🤖', label: 'Machine Learning' },
  { emoji: '⚛️', label: 'React Dev' },
  { emoji: '📊', label: 'Data Science' },
  { emoji: '🔒', label: 'Cybersecurity' },
  { emoji: '🎨', label: 'UI/UX Design' },
  { emoji: '₿', label: 'Blockchain' },
  { emoji: '☁️', label: 'Cloud Computing' },
  { emoji: '🐍', label: 'Python' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, themeName, setTheme, themes } = useTheme();
  const navigate = useNavigate();
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('beginner');
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [showTheme, setShowTheme] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getRoadmaps().then(res => setRoadmaps(res.data)).finally(() => setFetching(false));
  }, []);

  const [loadingStep, setLoadingStep] = useState(0);

const handleGenerate = async (e) => {
  e.preventDefault();
  if (!goal.trim()) return;
  setLoading(true);
  setError('');
  setLoadingStep(0);

  const steps = [
    { text: 'analyzing your goal...', duration: 1500 },
    { text: 'building week 1...', duration: 1500 },
    { text: 'building week 2...', duration: 1500 },
    { text: 'finding best resources...', duration: 1500 },
    { text: 'finalizing your roadmap...', duration: 1000 },
  ];

  let stepIndex = 0;
  const stepInterval = setInterval(() => {
    stepIndex++;
    if (stepIndex < steps.length) setLoadingStep(stepIndex);
  }, 1500);

  try {
    const res = await generateRoadmap({ goal, experience_level: level });
    clearInterval(stepInterval);
    navigate(`/roadmap/${res.data.id}`);
  } catch {
    clearInterval(stepInterval);
    setError('failed to generate. check your api key 😬');
  } finally {
    setLoading(false);
  }
};

  const filtered = roadmaps.filter(r => r.goal.toLowerCase().includes(search.toLowerCase()));
  const levelColors = { beginner: '#10b981', intermediate: '#f59e0b', advanced: '#ef4444' };
  const levelEmoji = { beginner: '🌱', intermediate: '🚀', advanced: '⚡' };

  return (
    <div style={{ ...s.page, background: '#0a0a0f' }}>
      <style>{css}</style>
      <div style={s.orb1} /><div style={s.orb2} /><div style={s.orb3} />

      <div style={s.navRight}>
  {/* XP Bar */}
  <div style={s.xpWrap} onClick={() => navigate('/stats')}>
    <span style={s.xpIcon}>⚡</span>
    <div style={s.xpInfo}>
      <div style={s.xpBarBg}>
        <div style={{ ...s.xpBarFill, width: `${user?.xp_progress_pct || 0}%` }} />
      </div>
      <span style={s.xpLabel}>Lvl {user?.level} · {user?.xp} XP</span>
    </div>
    <span style={s.streakNav}>🔥{user?.streak}</span>
  </div>
  {/* Theme picker */}
  <div style={s.themeWrap}>
    <button style={s.themeBtn} onClick={() => setShowTheme(!showTheme)}>🎨</button>
    {showTheme && (
      <div style={s.themeDropdown}>
        {Object.entries(themes).map(([key, t]) => (
          <button key={key} style={{ ...s.themeOpt, background: themeName === key ? 'rgba(168,85,247,0.2)' : 'transparent' }}
            onClick={() => { setTheme(key); setShowTheme(false); }}>
            {t.name} {themeName === key ? '✓' : ''}
          </button>
        ))}
      </div>
    )}
  </div>
  <div style={s.avatar}>{user?.username?.[0]?.toUpperCase()}</div>
  <button style={s.logoutBtn} onClick={logout}>sign out</button>
</div>
      <div style={s.content}>
        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { icon: '🗺️', val: roadmaps.length, label: 'roadmaps' },
            { icon: '📅', val: roadmaps.length * 4, label: 'weeks' },
            { icon: '🎯', val: roadmaps.length > 0 ? 'active' : 'start!', label: 'status' },
            { icon: '⚡', val: roadmaps.length * 12, label: 'resources' },
          ].map((s2, i) => (
            <div key={i} style={s.statCard} className="stat-card">
              <span style={s.statIcon}>{s2.icon}</span>
              <span style={s.statVal}>{s2.val}</span>
              <span style={s.statLabel}>{s2.label}</span>
            </div>
          ))}
        </div>

        {/* Generate section */}
        <div style={s.genSection}>
          <div style={s.genLeft}>
            <div style={s.genTag}>✨ ai roadmap generator</div>
            <h2 style={s.genTitle}>what are you<br /><span style={s.genGradient}>learning today?</span></h2>
            <p style={s.genSub}>type your goal, pick your level, get a 4-week plan instantly</p>

            {error && <div style={s.error}>{error}</div>}

            <form onSubmit={handleGenerate}>
              <div style={s.inputWrap}>
                <span style={s.inputEmoji}>🎯</span>
                <input style={s.input} value={goal} onChange={e => setGoal(e.target.value)}
                  placeholder="e.g. learn machine learning from zero..." required />
              </div>

              <div style={s.levelRow}>
                {['beginner', 'intermediate', 'advanced'].map(l => (
                  <button key={l} type="button"
                    style={{ ...s.levelBtn, background: level === l ? levelColors[l] : 'rgba(255,255,255,0.06)', borderColor: level === l ? levelColors[l] : 'rgba(255,255,255,0.1)', color: 'white' }}
                    onClick={() => setLevel(l)}>
                    {levelEmoji[l]} {l}
                  </button>
                ))}
              </div>

             <button style={s.genBtn} className="gen-btn" type="submit" disabled={loading}>
  {loading ? (
    <div style={s.loadingInner}>
      <div style={s.loadingDots}>
        <span className="dot" /><span className="dot" /><span className="dot" />
      </div>
      <span>{['analyzing your goal...', 'building week 1...', 'building week 2...', 'finding best resources...', 'finalizing your roadmap...'][loadingStep]}</span>
    </div>
  ) : (
    '🚀 generate roadmap'
  )}
</button>
            </form>
          </div>

          <div style={s.genRight}>
            <p style={s.topicsTitle}>⚡ quick topics</p>
            <div style={s.topicsGrid}>
              {TOPICS.map(t => (
                <button key={t.label} style={s.topicChip} className="topic-chip"
                  onClick={() => setGoal(t.label)}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmaps */}
        <div style={s.roadmapsSection}>
          <div style={s.roadmapsHeader}>
            <h3 style={s.roadmapsTitle}>your journeys 🗺️</h3>
            <div style={s.searchBox}>
              <span>🔍</span>
              <input style={s.searchInput} placeholder="search..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {fetching ? (
            <div style={s.skeletonGrid}>
              {[1,2,3,4].map(i => <div key={i} style={s.skeleton} className="skeleton" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}>{search ? '🔍' : '🗺️'}</div>
              <h4 style={s.emptyTitle}>{search ? 'nothing found' : 'no roadmaps yet!'}</h4>
              <p style={s.emptyText}>{search ? `no results for "${search}"` : 'generate your first one above ↑'}</p>
            </div>
          ) : (
            <div style={s.grid}>
              {filtered.map((r, i) => (
                <div key={r.id} style={{ ...s.roadmapCard, animationDelay: `${i * 0.08}s` }}
                  className="roadmap-card"
                  onClick={() => navigate(`/roadmap/${r.id}`)}>
                  <div style={s.cardTop}>
                    <span style={{ ...s.cardLevel, color: levelColors[r.experience_level] }}>
                      {levelEmoji[r.experience_level]} {r.experience_level}
                    </span>
                    <span style={s.cardDate}>
                      {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 style={s.cardGoal}>{r.goal}</h4>
                  <div style={s.cardBottom}>
                    <div style={s.cardDots}>
                      {[1,2,3,4].map(w => <div key={w} style={{ ...s.dot, opacity: 0.2 + w * 0.2 }} />)}
                      <span style={s.cardWeeks}>4 weeks</span>
                    </div>
                    <span style={s.cardArrow}>→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {loading && (
  <div style={s.loadingOverlay}>
    <div style={s.loadingCard}>
      <div style={s.overlayEmoji}>🧠</div>
      <h3 style={s.overlayTitle}>building your roadmap</h3>
      <p style={s.overlayStep}>
        {['analyzing your goal...', 'building week 1...', 'building week 2...', 'finding best resources...', 'finalizing your roadmap...'][loadingStep]}
      </p>
      <div style={s.overlayBar}>
        <div style={{ ...s.overlayFill, width: `${(loadingStep + 1) * 20}%` }} className="overlay-fill" />
      </div>
      <p style={s.overlayHint}>this takes about 10-15 seconds ⚡</p>
    </div>
  </div>
)}
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
  * { font-family: 'Space Grotesk', sans-serif; box-sizing: border-box; }
  h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }
  .stat-card { transition: all 0.2s ease; }
  .stat-card:hover { transform: translateY(-4px); border-color: rgba(168,85,247,0.4) !important; }
  .gen-btn { transition: all 0.25s ease; }
  .gen-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(168,85,247,0.4); }
  .gen-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .topic-chip { transition: all 0.15s ease; }
  .topic-chip:hover { background: rgba(168,85,247,0.3) !important; border-color: rgba(168,85,247,0.5) !important; transform: translateY(-2px); }
  .roadmap-card { transition: all 0.2s ease; animation: fadeUp 0.4s ease both; }
  .roadmap-card:hover { transform: translateY(-6px); border-color: rgba(168,85,247,0.4) !important; box-shadow: 0 20px 50px rgba(168,85,247,0.15); }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .skeleton { animation: shimmer 1.5s infinite; background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%); background-size: 200% 100%; }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .dot { width: 8px; height: 8px; background: rgba(255,255,255,0.8); border-radius: 50%; display: inline-block; animation: dotBounce 1.2s ease-in-out infinite; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes dotBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
.overlay-fill { transition: width 1.2s ease; }
`;

const s = {
  page: { minHeight: '100vh', color: 'white', position: 'relative', overflow: 'hidden' },
  orb1: { position: 'fixed', width: 600, height: 600, background: 'rgba(168,85,247,0.1)', borderRadius: '50%', filter: 'blur(100px)', top: -200, right: -100, pointerEvents: 'none' },
  orb2: { position: 'fixed', width: 500, height: 500, background: 'rgba(236,72,153,0.07)', borderRadius: '50%', filter: 'blur(100px)', bottom: -100, left: -100, pointerEvents: 'none' },
  orb3: { position: 'fixed', width: 400, height: 400, background: 'rgba(249,115,22,0.05)', borderRadius: '50%', filter: 'blur(100px)', top: '40%', left: '40%', pointerEvents: 'none' },
  nav: { padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)', zIndex: 100 },
  navLogo: { fontSize: 18, fontWeight: 800, fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  themeWrap: { position: 'relative' },
  themeBtn: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: 16 },
  themeDropdown: { position: 'absolute', top: '110%', right: 0, background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '0.5rem', minWidth: 180, zIndex: 200, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  themeOpt: { width: '100%', padding: '0.6rem 1rem', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'white', textAlign: 'left', fontFamily: 'Space Grotesk, sans-serif' },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15 },
  username: { fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' },
  logoutBtn: { padding: '0.35rem 0.9rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.15s ease' },
  content: { maxWidth: 1100, margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 1 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' },
  statCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, backdropFilter: 'blur(10px)' },
  statIcon: { fontSize: 26 },
  statVal: { fontSize: 22, fontWeight: 800, color: 'white', fontFamily: 'Syne, sans-serif' },
  statLabel: { fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)' },
  genSection: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, padding: '2.5rem', marginBottom: '2rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap', backdropFilter: 'blur(20px)' },
  genLeft: { flex: 1, minWidth: 280 },
  genTag: { display: 'inline-block', background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc', padding: '0.3rem 0.9rem', borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: '1rem', letterSpacing: 0.5 },
  genTitle: { fontSize: 28, fontWeight: 800, color: 'white', margin: '0 0 0.5rem', lineHeight: 1.2 },
  genGradient: { background: 'linear-gradient(135deg, #a855f7, #ec4899, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  genSub: { color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', fontSize: 14, lineHeight: 1.6 },
  error: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: 12, marginBottom: '1rem', fontSize: 14, fontWeight: 600 },
  inputWrap: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '0.5rem 1rem', marginBottom: '1rem', transition: 'all 0.2s ease' },
  inputEmoji: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, border: 'none', outline: 'none', fontSize: 15, fontWeight: 600, color: 'white', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif' },
  levelRow: { display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' },
  levelBtn: { padding: '0.4rem 1rem', border: '1px solid', borderRadius: 100, cursor: 'pointer', fontSize: 13, fontWeight: 700, transition: 'all 0.15s ease', fontFamily: 'Space Grotesk, sans-serif' },
  genBtn: { width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' },
  genRight: { minWidth: 220 },
  topicsTitle: { color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 13, marginBottom: '0.75rem', letterSpacing: 0.5 },
  topicsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  topicChip: { padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: 12, fontWeight: 700, textAlign: 'left', fontFamily: 'Space Grotesk, sans-serif' },
  roadmapsSection: {},
  roadmapsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' },
  roadmapsTitle: { fontSize: 20, fontWeight: 800, color: 'white', margin: 0 },
  searchBox: { display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '0.4rem 1rem' },
  searchInput: { border: 'none', outline: 'none', background: 'transparent', color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', minWidth: 150 },
  skeletonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '1rem' },
  skeleton: { height: 150, borderRadius: 20 },
  empty: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: '4rem 2rem', textAlign: 'center' },
  emptyIcon: { fontSize: 52, marginBottom: '1rem' },
  emptyTitle: { fontSize: 18, fontWeight: 800, color: 'white', margin: '0 0 0.5rem' },
  emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '1rem' },
  roadmapCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '1.5rem', cursor: 'pointer', backdropFilter: 'blur(10px)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  cardLevel: { fontSize: 12, fontWeight: 800, textTransform: 'capitalize' },
  cardDate: { fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600 },
  cardGoal: { fontSize: 15, fontWeight: 700, color: 'white', margin: '0 0 1rem', lineHeight: 1.4 },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardDots: { display: 'flex', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: '50%', background: '#a855f7' },
  cardWeeks: { fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginLeft: 6 },
  cardArrow: { fontSize: 18, color: '#a855f7', fontWeight: 800 },
  xpWrap: { display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '0.4rem 1rem', cursor: 'pointer', transition: 'all 0.2s ease' },
xpIcon: { fontSize: 16 },
xpInfo: { display: 'flex', flexDirection: 'column', gap: 3 },
xpBarBg: { width: 80, height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' },
xpBarFill: { height: '100%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: 100, transition: 'width 0.5s ease' },
xpLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700 },
streakNav: { fontSize: 13, fontWeight: 800, color: '#f97316' },
loadingInner: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 },
loadingDots: { display: 'flex', gap: 5 },
loadingOverlay: { position: 'fixed', inset: 0, background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(20px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' },
loadingCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, padding: '3rem 2.5rem', textAlign: 'center', maxWidth: 400, width: '90%' },
overlayEmoji: { fontSize: 56, marginBottom: '1rem', display: 'block', animation: 'pulse 1.5s ease-in-out infinite' },
overlayTitle: { fontSize: 22, fontWeight: 800, color: 'white', margin: '0 0 0.75rem', fontFamily: 'Syne, sans-serif' },
overlayStep: { color: '#a855f7', fontWeight: 700, fontSize: 15, margin: '0 0 1.5rem' },
overlayBar: { height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden', marginBottom: '1rem' },
overlayFill: { height: '100%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: 100, transition: 'width 1.2s ease' },
overlayHint: { color: 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 600 },
};
