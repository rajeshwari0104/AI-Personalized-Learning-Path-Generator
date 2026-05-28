import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('wrong email or password, bestie 😬');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/dashboard');
    } catch {
      setError('google login failed, try again 😓');
    }
  };

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

        <h1 style={s.title}>welcome back 👋</h1>
        <p style={s.sub}>ready to keep grinding?</p>

        {error && <div style={s.error} className="shake">{error}</div>}

        <div style={s.googleWrap}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('google login failed 😓')}
            width="320" text="continue_with" shape="pill" size="large" />
        </div>

        <div style={s.divider}><div style={s.line}/><span style={s.or}>or</span><div style={s.line}/></div>

        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>email</label>
            <input style={s.input} className="inp" type="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div style={s.field}>
            <label style={s.label}>password</label>
            <input style={s.input} className="inp" type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button style={s.btn} className="btn" type="submit" disabled={loading}>
            {loading ? 'logging in...' : 'let\'s go →'}
          </button>
        </form>

        <p style={s.foot}>no account? <Link to="/register" style={s.link}>sign up free</Link></p>
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
  orb1: { position: 'absolute', width: 500, height: 500, background: 'rgba(168,85,247,0.12)', borderRadius: '50%', filter: 'blur(80px)', top: -150, right: -100 },
  orb2: { position: 'absolute', width: 400, height: 400, background: 'rgba(236,72,153,0.08)', borderRadius: '50%', filter: 'blur(80px)', bottom: -100, left: -100 },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, padding: '2.5rem', width: '100%', maxWidth: 400, backdropFilter: 'blur(30px)', position: 'relative', zIndex: 1 },
  backLink: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'block', marginBottom: '1.5rem', fontWeight: 600 },
  logoRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem', justifyContent: 'center' },
  logoEmoji: { fontSize: 26 },
  logoText: { fontSize: 20, fontWeight: 800, fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  title: { fontSize: 28, fontWeight: 800, color: 'white', textAlign: 'center', margin: '0 0 0.25rem' },
  sub: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '1.5rem', fontSize: 15 },
  error: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: 12, marginBottom: '1rem', fontSize: 14, fontWeight: 600 },
  googleWrap: { display: 'flex', justifyContent: 'center', marginBottom: '1rem' },
  divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '1.25rem 0' },
  line: { flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' },
  or: { color: 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 600 },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  input: { width: '100%', padding: '0.8rem 1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 15, background: 'rgba(255,255,255,0.05)', color: 'white' },
  btn: { width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  foot: { textAlign: 'center', marginTop: '1.25rem', fontSize: 14, color: 'rgba(255,255,255,0.4)' },
  link: { color: '#a855f7', fontWeight: 700, textDecoration: 'none' },
};
