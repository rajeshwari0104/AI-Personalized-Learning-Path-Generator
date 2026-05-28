import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoadmap, rateResource, regenerateWeek, saveNotes, searchResource } from '../services/api';
import Confetti from '../components/Confetti';
import XPToast from '../components/XPToast';
import { exportPDF } from '../services/api';
export default function RoadmapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(null);
  const [activeWeek, setActiveWeek] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [toast, setToast] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [notesText, setNotesText] = useState({});
  const [savingNotes, setSavingNotes] = useState({});
  const [copied, setCopied] = useState(false);
  const [resourceLinks, setResourceLinks] = useState({});
  const [loadingLinks, setLoadingLinks] = useState({});
  const [exporting, setExporting] = useState(false);
  useEffect(() => {
    getRoadmap(id).then(res => setRoadmap(res.data)).finally(() => setLoading(false));
  }, [id]);

  const getProgress = (week) => {
    if (!week.resources.length) return 0;
    const completed = week.resources.filter(r => r.is_completed).length;
    return Math.round((completed / week.resources.length) * 100);
  };

  const getTotalProgress = (roadmap) => {
    const all = roadmap.weeks.flatMap(w => w.resources);
    if (!all.length) return 0;
    return Math.round((all.filter(r => r.is_completed).length / all.length) * 100);
  };

  const handleRate = async (resourceId, rating, completed) => {
    const res = await rateResource(resourceId, { difficulty_rating: rating, is_completed: completed });
    const data = res.data;
    if (data.xp_awarded > 0) setToast({ xp: data.xp_awarded, badge: data.new_badges?.[0] || null });
    if (completed && data.xp_awarded >= 50) setConfetti(true);
    if (data.suggest_regenerate) alert(`week average difficulty: ${data.avg_difficulty?.toFixed(1)}/5 — too hard! consider regenerating 🔄`);
    getRoadmap(id).then(res => setRoadmap(res.data));
  };

  const handleRegenerate = async (weekId) => {
    setRegenerating(weekId);
    try {
      await regenerateWeek(weekId);
      const res = await getRoadmap(id);
      setRoadmap(res.data);
    } finally {
      setRegenerating(null);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/share/${roadmap.share_token}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = async () => {
  setExporting(true);
  try {
    const res = await exportPDF(id);
    window.open(res.data.pdf_url, '_blank');
  } catch (err) {
    alert('Failed to export PDF. Try again!');
  } finally {
    setExporting(false);
  }
};

 const handleResourceClick = (e, resource) => {
  e.preventDefault();
  const { title, resource_type } = resource;
  const q = encodeURIComponent(title);

  let url;
  if (resource_type === 'video') {
    url = `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' tutorial')}`;
  } else if (resource_type === 'article') {
    // Use Google's "I'm Feeling Lucky" equivalent — opens top result directly
    url = `https://www.google.com/search?q=${encodeURIComponent(title + ' tutorial')}&btnI=1`;
  } else if (resource_type === 'exercise') {
    url = `https://www.google.com/search?q=${encodeURIComponent(title + ' practice problems exercises')}&btnI=1`;
  } else if (resource_type === 'book') {
    url = `https://www.goodreads.com/search?q=${q}`;
  } else {
    url = `https://www.google.com/search?q=${encodeURIComponent(title + ' tutorial')}&btnI=1`;
  }

  window.open(url, '_blank');
};
const handleSaveNotes = async (resourceId) => {
  setSavingNotes(prev => ({ ...prev, [resourceId]: true }));
  try {
    await saveNotes(resourceId, { notes: notesText[resourceId] || '' });
    setTimeout(() => setSavingNotes(prev => ({ ...prev, [resourceId]: false })), 1000);
  } catch {
    setSavingNotes(prev => ({ ...prev, [resourceId]: false }));
  }
};

const toggleNotes = (resourceId, existingNotes) => {
  setExpandedNotes(prev => ({ ...prev, [resourceId]: !prev[resourceId] }));
  if (!notesText[resourceId]) {
    setNotesText(prev => ({ ...prev, [resourceId]: existingNotes || '' }));
  }
};
  
  const typeConfig = {
    video:    { icon: '▶️', color: '#a855f7', bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', label: 'Video',    action: 'Watch Video' },
    article:  { icon: '📄', color: '#0ea5e9', bg: 'rgba(14,165,233,0.15)',  border: 'rgba(14,165,233,0.3)',  label: 'Article',  action: 'Read Article' },
    book:     { icon: '📖', color: '#10b981', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.3)',  label: 'Book',     action: 'Find Book' },
    exercise: { icon: '💪', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.3)',  label: 'Exercise', action: 'Practice Now' },
  };

  if (loading) return (
    <div style={s.loading}>
      <style>{css}</style>
      <div style={s.spinner} className="spin" />
      <p style={s.loadingText}>loading your roadmap...</p>
    </div>
  );

  if (!roadmap) return <div style={s.loading}><style>{css}</style><p style={{color:'white'}}>roadmap not found</p></div>;

  const totalProgress = getTotalProgress(roadmap);
  const week = roadmap.weeks[activeWeek];

  return (
    <div style={s.page}>
      <style>{css}</style>
      <div style={s.orb1}/><div style={s.orb2}/>

      {confetti && <Confetti active={confetti} onDone={() => setConfetti(false)} />}
      {toast && <XPToast xp={toast.xp} badge={toast.badge} onDone={() => setToast(null)} />}

      <nav style={s.nav}>
        <button style={s.backBtn} onClick={() => navigate('/dashboard')}>← back</button>
        <span style={s.navLogo}>⚡ learnpath</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            style={{ ...s.statsBtn, background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)', borderColor: copied ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)', color: copied ? '#10b981' : 'rgba(255,255,255,0.6)' }}
            onClick={handleShare}>
            {copied ? '✓ copied!' : '🔗 share'}
          </button>
          <button style={s.statsBtn} onClick={() => navigate('/stats')}>📊 my stats</button>
        </div>
        <button style={{ ...s.statsBtn, background: exporting ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)', borderColor: exporting ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.1)', color: exporting ? '#f59e0b' : 'rgba(255,255,255,0.6)' }}
  onClick={handleExportPDF} disabled={exporting}>
  {exporting ? '⏳ exporting...' : '📄 export PDF'}
</button>
      </nav>

      <div style={s.content}>
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.goalTag}>🎯 your goal</div>
            <h1 style={s.goalTitle}>{roadmap.goal}</h1>
            <span style={{
              ...s.levelBadge,
              background: roadmap.experience_level === 'beginner' ? 'rgba(16,185,129,0.2)' : roadmap.experience_level === 'intermediate' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
              color: roadmap.experience_level === 'beginner' ? '#10b981' : roadmap.experience_level === 'intermediate' ? '#f59e0b' : '#ef4444',
              border: `1px solid ${roadmap.experience_level === 'beginner' ? 'rgba(16,185,129,0.3)' : roadmap.experience_level === 'intermediate' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`
            }}>
              {roadmap.experience_level === 'beginner' ? '🌱' : roadmap.experience_level === 'intermediate' ? '🚀' : '⚡'} {roadmap.experience_level}
            </span>
          </div>
          <div style={s.progressWrap}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
              <circle cx="50" cy="50" r="42" fill="none"
                stroke={totalProgress === 100 ? '#10b981' : 'url(#grad)'}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - totalProgress / 100)}`}
                strokeLinecap="round" transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7"/>
                  <stop offset="100%" stopColor="#ec4899"/>
                </linearGradient>
              </defs>
              <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="900"
                fill={totalProgress === 100 ? '#10b981' : '#a855f7'} fontFamily="Syne, sans-serif">{totalProgress}%</text>
              <text x="50" y="62" textAnchor="middle" fontSize="10"
                fill="rgba(255,255,255,0.4)" fontFamily="Space Grotesk, sans-serif">done</text>
            </svg>
          </div>
        </div>

        {totalProgress === 100 && (
          <div style={s.congrats} className="congrats-pop">
            🎉 you completed the entire roadmap! absolute legend! 👑
          </div>
        )}

        <div style={s.weekTabs}>
          {roadmap.weeks.map((w, i) => {
            const prog = getProgress(w);
            return (
              <button key={w.id}
                style={{ ...s.weekTab, ...(activeWeek === i ? s.weekTabActive : {}) }}
                className="week-tab" onClick={() => setActiveWeek(i)}>
                <span style={s.weekTabNum}>week {w.week_number}</span>
                <div style={s.weekTabBarBg}>
                  <div style={{ ...s.weekTabBarFill, width: `${prog}%`, background: prog === 100 ? '#10b981' : 'linear-gradient(135deg, #a855f7, #ec4899)' }} />
                </div>
                <span style={{ ...s.weekTabPct, color: prog === 100 ? '#10b981' : 'rgba(255,255,255,0.4)' }}>{prog}%</span>
              </button>
            );
          })}
        </div>

        {week && (
          <div style={s.weekCard} key={week.id} className="week-slide">
            <div style={s.weekHeader}>
              <div style={{ flex: 1 }}>
                <h2 style={s.weekTitle}>week {week.week_number}: {week.title}</h2>
                <p style={s.weekObj}>{week.objective}</p>
              </div>
              <button style={s.regenBtn} className="regen-btn"
                onClick={() => handleRegenerate(week.id)} disabled={regenerating === week.id}>
                {regenerating === week.id ? '⏳ regenerating...' : '🔄 regenerate'}
              </button>
            </div>

            <div style={s.resources}>
              {week.resources.map((r, i) => {
                const tc = typeConfig[r.resource_type] || typeConfig.article;
                const isLoadingLink = loadingLinks[r.id];
                return (
                  <div key={r.id}
                    style={{ ...s.resourceCard, borderLeft: `4px solid ${r.is_completed ? '#10b981' : tc.color}`, opacity: r.is_completed ? 0.7 : 1, animationDelay: `${i * 0.08}s` }}
                    className="res-card">
                    <div style={s.resTop}>
                      <div style={{ ...s.resIconBox, background: tc.bg, border: `1px solid ${tc.border}` }}>
                        <span style={s.resIcon}>{tc.icon}</span>
                      </div>
                      <div style={s.resBody}>
                        <div style={s.resMetaRow}>
                          <span style={{ ...s.resTypeBadge, background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>{tc.label}</span>
                          {r.duration && <span style={s.resDur}>⏱ {r.duration}</span>}
                          {r.is_completed && <span style={s.completedTag}>✓ done</span>}
                        </div>
                        <h3 style={s.resTitle}>{r.title}</h3>
                        <p style={s.resDesc}>{r.description}</p>
                        <a href="#"
                          style={{ ...s.resActionBtn, background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`, opacity: isLoadingLink ? 0.7 : 1 }}
                          className="action-btn"
                          onClick={(e) => handleResourceClick(e, r)}>
                          {isLoadingLink ? '⏳ finding...' : `${tc.action} →`}
                        </a>
                      </div>
                      <div style={{ ...s.checkbox, background: r.is_completed ? '#10b981' : 'rgba(255,255,255,0.05)', border: r.is_completed ? '2px solid #10b981' : '2px solid rgba(255,255,255,0.15)' }}
                        className="checkbox"
                        onClick={() => handleRate(r.id, r.difficulty_rating || 3, !r.is_completed)}>
                        {r.is_completed && <span style={s.checkmark}>✓</span>}
                      </div>
                    </div>

                    <div style={s.ratingRow}>
                      <span style={s.ratingLabel}>difficulty:</span>
                      <div style={s.ratingBtns}>
                        {[1,2,3,4,5].map(n => (
                          <button key={n}
                            style={{ ...s.ratingBtn, background: r.difficulty_rating === n ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'rgba(255,255,255,0.06)', color: r.difficulty_rating === n ? 'white' : 'rgba(255,255,255,0.5)', border: r.difficulty_rating === n ? 'none' : '1px solid rgba(255,255,255,0.1)', transform: r.difficulty_rating === n ? 'scale(1.15)' : 'scale(1)' }}
                            className="rating-btn"
                            onClick={() => handleRate(r.id, n, r.is_completed)}>
                            {n}
                          </button>
                        ))}
                      </div>
                      <span style={s.ratingHint}>1 = easy · 5 = hard</span>
                    </div>

                    {/* Notes section */}
<div style={s.notesSection}>
  <button style={s.notesToggle} onClick={() => toggleNotes(r.id, r.notes)}>
    {expandedNotes[r.id] ? '📝 hide notes' : `📝 ${r.notes ? 'edit notes ✏️' : 'add notes'}`}
  </button>
  {r.notes && !expandedNotes[r.id] && (
    <p style={s.notesPreview}>{r.notes.substring(0, 100)}{r.notes.length > 100 ? '...' : ''}</p>
  )}
  {expandedNotes[r.id] && (
    <div style={s.notesExpanded} className="notes-expand">
      <textarea
        style={s.notesTextarea}
        placeholder="jot down what you learned, key concepts, questions... 📚"
        value={notesText[r.id] !== undefined ? notesText[r.id] : (r.notes || '')}
        onChange={e => setNotesText(prev => ({ ...prev, [r.id]: e.target.value }))}
        rows={4}
      />
      <div style={s.notesBtns}>
        <button
          style={{ ...s.saveNotesBtn, background: savingNotes[r.id] ? '#10b981' : 'linear-gradient(135deg, #a855f7, #ec4899)' }}
          onClick={() => handleSaveNotes(r.id)}>
          {savingNotes[r.id] ? '✓ saved!' : '💾 save notes'}
        </button>
        <button style={s.clearNotesBtn}
          onClick={() => setNotesText(prev => ({ ...prev, [r.id]: '' }))}>
          clear
        </button>
      </div>
    </div>
  )}
</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Syne:wght@700;800&display=swap');
  * { font-family: 'Space Grotesk', sans-serif; box-sizing: border-box; }
  h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }
  .spin { animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .week-tab { transition: all 0.2s ease; }
  .week-tab:hover { transform: translateY(-2px); border-color: rgba(168,85,247,0.4) !important; }
  .week-slide { animation: slideIn 0.35s ease both; }
  @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  .res-card { animation: fadeUp 0.3s ease both; transition: all 0.2s ease; }
  .res-card:hover { transform: translateX(4px); }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .action-btn { transition: all 0.15s ease; cursor: pointer; }
  .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .checkbox { transition: all 0.2s ease; cursor: pointer; }
  .checkbox:hover { transform: scale(1.1); }
  .rating-btn { transition: all 0.15s ease; cursor: pointer; }
  .rating-btn:hover { transform: scale(1.15); }
  .regen-btn { transition: all 0.2s ease; }
  .regen-btn:hover:not(:disabled) { background: rgba(168,85,247,0.2) !important; border-color: rgba(168,85,247,0.4) !important; color: #c084fc !important; }
  .congrats-pop { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes popIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
  .notes-expand { animation: slideDown 0.3s ease; }
  @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
`;

const s = {
  page: { minHeight: '100vh', background: '#0a0a0f', color: 'white', position: 'relative', overflow: 'hidden' },
  loading: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  spinner: { width: 44, height: 44, border: '4px solid rgba(168,85,247,0.2)', borderTopColor: '#a855f7', borderRadius: '50%' },
  loadingText: { color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 15 },
  orb1: { position: 'fixed', width: 500, height: 500, background: 'rgba(168,85,247,0.08)', borderRadius: '50%', filter: 'blur(100px)', top: -100, right: -100, pointerEvents: 'none' },
  orb2: { position: 'fixed', width: 400, height: 400, background: 'rgba(236,72,153,0.06)', borderRadius: '50%', filter: 'blur(100px)', bottom: -100, left: -100, pointerEvents: 'none' },
  nav: { padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', zIndex: 100 },
  backBtn: { padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.15s ease' },
  navLogo: { fontSize: 18, fontWeight: 800, fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  statsBtn: { padding: '0.4rem 1rem', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 20, color: '#c084fc', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.15s ease' },
  content: { maxWidth: 860, margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 1 },
  header: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  headerLeft: { flex: 1 },
  goalTag: { fontSize: 11, fontWeight: 800, color: '#a855f7', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)', padding: '0.2rem 0.7rem', borderRadius: 100, display: 'inline-block', marginBottom: '0.75rem', letterSpacing: 1, textTransform: 'uppercase' },
  goalTitle: { fontSize: 24, fontWeight: 800, color: 'white', margin: '0 0 0.75rem', lineHeight: 1.3 },
  levelBadge: { padding: '0.3rem 0.9rem', borderRadius: 100, fontSize: 13, fontWeight: 700 },
  progressWrap: { flexShrink: 0 },
  congrats: { background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: 16, padding: '1rem 1.5rem', textAlign: 'center', fontSize: 15, fontWeight: 700, marginBottom: '1.5rem' },
  weekTabs: { display: 'flex', gap: 10, marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: 4 },
  weekTab: { flex: 1, minWidth: 110, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '0.75rem 1rem', cursor: 'pointer', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif' },
  weekTabActive: { background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.35)' },
  weekTabNum: { display: 'block', fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 6 },
  weekTabBarBg: { height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden', marginBottom: 4 },
  weekTabBarFill: { height: '100%', borderRadius: 100, transition: 'width 0.5s ease' },
  weekTabPct: { fontSize: 11, fontWeight: 700 },
  weekCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '2rem' },
  weekHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' },
  weekTitle: { fontSize: 20, fontWeight: 800, color: 'white', margin: '0 0 0.5rem' },
  weekObj: { color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0, lineHeight: 1.6 },
  regenBtn: { padding: '0.55rem 1.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', fontFamily: 'Space Grotesk, sans-serif' },
  resources: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  resourceCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' },
  resTop: { display: 'flex', gap: '1rem', marginBottom: '0.9rem', alignItems: 'flex-start' },
  resIconBox: { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  resIcon: { fontSize: 20 },
  resBody: { flex: 1 },
  resMetaRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  resTypeBadge: { padding: '0.15rem 0.6rem', borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 },
  resDur: { fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 },
  completedTag: { fontSize: 11, fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '0.15rem 0.6rem', borderRadius: 8 },
  resTitle: { fontSize: 16, fontWeight: 700, color: 'white', margin: '0 0 0.4rem' },
  resDesc: { fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 0.75rem', lineHeight: 1.6 },
  resActionBtn: { display: 'inline-block', padding: '0.35rem 0.9rem', borderRadius: 20, fontSize: 13, fontWeight: 700, textDecoration: 'none' },
  checkbox: { width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  checkmark: { color: 'white', fontWeight: 900, fontSize: 16 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 10, paddingTop: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' },
  ratingLabel: { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' },
  ratingBtns: { display: 'flex', gap: 6 },
  ratingBtn: { width: 30, height: 30, borderRadius: 8, fontSize: 13, fontWeight: 800 },
  ratingHint: { fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 600 },
  notesSection: { marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
  notesToggle: { background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', padding: 0, transition: 'color 0.15s ease' },
  notesExpanded: { marginTop: '0.75rem' },
  notesTextarea: { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.75rem 1rem', color: 'white', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif', resize: 'vertical', marginBottom: '0.5rem', outline: 'none', lineHeight: 1.6 },
  saveNotesBtn: { padding: '0.5rem 1.25rem', border: 'none', borderRadius: 20, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.3s ease' },
  notesSection: { marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
notesToggle: { background: 'transparent', border: 'none', color: '#a855f7', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', padding: 0 },
notesPreview: { fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0.5rem 0 0', fontStyle: 'italic', lineHeight: 1.5 },
notesExpanded: { marginTop: '0.75rem' },
notesTextarea: { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.75rem 1rem', color: 'white', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif', resize: 'vertical', marginBottom: '0.5rem', outline: 'none', lineHeight: 1.6 },
notesBtns: { display: 'flex', gap: 8 },
saveNotesBtn: { padding: '0.5rem 1.25rem', border: 'none', borderRadius: 20, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.3s ease' },
clearNotesBtn: { padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' },
};
