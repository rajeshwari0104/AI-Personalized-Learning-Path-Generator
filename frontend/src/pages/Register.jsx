import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', experience_level: 'beginner' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.email?.[0] || 'something went wrong 😬');
    } finally {
      setLoading(false);
    }
  };

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const levels = [
    { value: 'beginner', emoji: '🌱', label: 'newbie', desc: 'just starting' },
    { value: 'intermediate', emoji: '🚀', label: 'mid', desc: 'know basics' },
    { value: 'advanced', emoji: '⚡', label: 'pro', desc: 'send it' },
  ];

  return (
    <div style={s.page}>
      <style>{css}</style>
      <div style={s.orb1} /><div style={s.orb2} />

      <div style={s.card} className="card-in">
        <Link to="/" style={s.backLink}>← back</Link>

        <div style={s.logoRow}>
          <span style={s.logoEmoji}>⚡</span>
          <span style={s.logoText}>learnpath</span>
        </div>

        <h1 style={s.title}>join the grind 💪</h1>
        <p style={s.sub}>free forever. no credit card. just learning.</p>

        {error && <div style={s.error} className="shake">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>username</label>
              <input style={s.input} className="inp" value={form.username} onChange={update('username')} placeholder="coollearner99" required />
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>email</label>
            <input style={s.input} className="inp" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required />
          </div>
          <div style={s.field}>
            <label style={s.label}>password</label>
            <input style={s.input} className="inp" type="password" value={form.password} onChange={update('password')} placeholder="make it strong 💪" required />
          </div>

          <div style={s.field}>
            <label style={s.label}>your level rn</label>
            <div style={s.levelGrid}>
              {levels.map(l => (
                <div key={l.value}
                  style={{ ...s.levelCard, ...(form.experience_level === l.value ? s.levelActive : {}) }}
                  onClick={() => setForm({ ...form, experience_level: l.value })}>
                  <span style={s.levelEmoji}>{l.emoji}</span>
                  <span style={s.levelLabel}>{l.label}</span>
                  <span style={s.levelDesc}>{l.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <button style={s.btn} className="btn" type="submit" disabled={loading}>
            {loading ? 'creating acc...' : 'start learning free ✨'}
          </button>
        </form>

        <p style={s.foot}>already in? <Link to="/login" style={s.link}>sign in</Link></p>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
  * { font-family: 'Space Grotesk', sans-serif; box-sizing: border-box; }
  h1 { font-family: 'Syne', sans-serif; }
  .card-in { animation: cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes cardIn { from{opacity:0;transform:scale(0.9) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
  .shake { animation: shake 0.4s ease; }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
  .inp { transition: all 0.2s ease; }
  .inp:focus { outline:none; border-color:#a855f7 !important; box-shadow:0 0 0 4px rgba(168,85,247,0.2); }
  .btn { transition: all 0.2s ease; }
  .btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 35px rgba(168,85,247,0.5); }
`;

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', padding: '2rem', position: 'relative', overflow: 'hidden' },
  orb1: { position: 'absolute', width: 500, height: 500, background: 'rgba(168,85,247,0.12)', borderRadius: '50%', filter: 'blur(80px)', top: -150, left: -100 },
  orb2: { position: 'absolute', width: 400, height: 400, background: 'rgba(236,72,153,0.08)', borderRadius: '50%', filter: 'blur(80px)', bottom: -100, right: -100 },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, padding: '2.5rem', width: '100%', maxWidth: 420, backdropFilter: 'blur(30px)', position: 'relative', zIndex: 1 },
  backLink: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'block', marginBottom: '1.5rem', fontWeight: 600 },
  logoRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem', justifyContent: 'center' },
  logoEmoji: { fontSize: 24 },
  logoText: { fontSize: 18, fontWeight: 800, fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  title: { fontSize: 26, fontWeight: 800, color: 'white', textAlign: 'center', margin: '0 0 0.25rem' },
  sub: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '1.5rem', fontSize: 14 },
  error: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: 12, marginBottom: '1rem', fontSize: 14, fontWeight: 600 },
  row: { display: 'flex', gap: '1rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  input: { width: '100%', padding: '0.8rem 1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 15, background: 'rgba(255,255,255,0.05)', color: 'white' },
  levelGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 },
  levelCard: { border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '0.75rem 0.5rem', cursor: 'pointer', textAlign: 'center', background: 'rgba(255,255,255,0.03)', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 },
  levelActive: { border: '1px solid rgba(168,85,247,0.5)', background: 'rgba(168,85,247,0.15)', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(168,85,247,0.2)' },
  levelEmoji: { fontSize: 22 },
  levelLabel: { fontSize: 13, fontWeight: 700, color: 'white' },
  levelDesc: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  btn: { width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  foot: { textAlign: 'center', marginTop: '1.25rem', fontSize: 14, color: 'rgba(255,255,255,0.4)' },
  link: { color: '#a855f7', fontWeight: 700, textDecoration: 'none' },
};
