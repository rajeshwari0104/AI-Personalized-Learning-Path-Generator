import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* Animated background */}
      <div style={s.bgOrb1} className="orb" />
      <div style={s.bgOrb2} className="orb2" />
      <div style={s.bgOrb3} className="orb3" />
      <div style={s.noise} />

      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navLogo}>
          <span style={s.logoEmoji}>⚡</span>
          <span style={s.logoText}>learnpath</span>
        </div>
        <div style={s.navLinks}>
          <button style={s.navSignIn} onClick={() => navigate('/login')}>sign in</button>
          <button style={s.navCta} className="cta-pulse" onClick={() => navigate('/register')}>get started →</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroBadge} className="badge-float">
          <span style={s.badgeDot} />
          ai-powered • free forever • no bs
        </div>

        <h1 style={s.heroH1}>
          <span style={s.heroLine1}>learn anything.</span>
          <br />
          <span style={s.heroLine2} className="gradient-text">master everything.</span>
        </h1>

        <p style={s.heroP}>
          drop your goal → get a 4-week roadmap → actually stick to it.<br />
          <span style={s.heroAccent}>the ai adapts when things get hard. no cap.</span>
        </p>

        <div style={s.heroBtns}>
          <button style={s.heroMainBtn} className="main-btn" onClick={() => navigate('/register')}>
            start for free ✨
          </button>
          <button style={s.heroSecBtn} onClick={() => navigate('/login')}>
            already have acc →
          </button>
        </div>

        {/* Floating cards */}
        <div style={s.floatCards}>
          {[
            { emoji: '🧠', text: 'Machine Learning', sub: '4-week plan' },
            { emoji: '⚛️', text: 'React Dev', sub: 'beginner → pro' },
            { emoji: '🔒', text: 'Cybersecurity', sub: 'hands-on labs' },
            { emoji: '📊', text: 'Data Science', sub: 'with Python' },
          ].map((c, i) => (
            <div key={i} style={{ ...s.floatCard, animationDelay: `${i * 0.5}s` }} className="float-card">
              <span style={s.floatCardEmoji}>{c.emoji}</span>
              <div>
                <div style={s.floatCardText}>{c.text}</div>
                <div style={s.floatCardSub}>{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={s.section}>
        <div style={s.sectionLabel}>how it works</div>
        <h2 style={s.sectionTitle}>3 steps to <span className="gradient-text">level up</span></h2>
        <div style={s.stepsGrid}>
          {[
            { num: '01', emoji: '🎯', title: 'drop your goal', desc: 'type literally anything. "learn guitar", "get into ML", "build apps". we got you.' },
            { num: '02', emoji: '🤖', title: 'ai builds your path', desc: 'a custom 4-week roadmap drops instantly. videos, articles, exercises — all lined up.' },
            { num: '03', emoji: '🔄', title: 'it adapts to you', desc: 'rate stuff too hard? the ai regenerates your week. it literally learns how you learn.' },
          ].map((step, i) => (
            <div key={i} style={s.stepCard} className="step-card">
              <div style={s.stepNum}>{step.num}</div>
              <div style={s.stepEmoji}>{step.emoji}</div>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features marquee */}
      <div style={s.marqueeWrap}>
        <div style={s.marquee} className="marquee">
          {['🎯 personalized', '🔄 adaptive', '✨ ai-powered', '📱 works everywhere', '🆓 free forever', '⚡ instant roadmaps', '🧠 smart learning', '💪 actually works'].map((t, i) => (
            <span key={i} style={s.marqueeItem}>{t}</span>
          ))}
          {['🎯 personalized', '🔄 adaptive', '✨ ai-powered', '📱 works everywhere', '🆓 free forever', '⚡ instant roadmaps', '🧠 smart learning', '💪 actually works'].map((t, i) => (
            <span key={`r${i}`} style={s.marqueeItem}>{t}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={s.ctaSection}>
        <div style={s.ctaGlass}>
          <h2 style={s.ctaTitle}>ready to actually learn something?</h2>
          <p style={s.ctaSub}>join the learners who stopped scrolling and started growing 🚀</p>
          <button style={s.ctaBtn} className="main-btn" onClick={() => navigate('/register')}>
            create free account ✨
          </button>
        </div>
      </div>

      <footer style={s.footer}>
        <span style={s.footerLogo}>⚡ learnpath</span>
        <span style={s.footerText}>made with 💜 for curious minds</span>
      </footer>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
  * { font-family: 'Space Grotesk', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
  h1,h2,h3 { font-family: 'Syne', sans-serif; }
  .gradient-text { background: linear-gradient(135deg, #a855f7, #ec4899, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .orb { position: absolute; border-radius: 50%; filter: blur(80px); animation: orbFloat 8s ease-in-out infinite; }
  .orb2 { animation: orbFloat 10s ease-in-out infinite reverse; }
  .orb3 { animation: orbFloat 12s ease-in-out infinite 2s; }
  @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-30px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.95)} }
  .badge-float { animation: badgeFloat 3s ease-in-out infinite; }
  @keyframes badgeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  .cta-pulse { animation: ctaPulse 2s ease-in-out infinite; }
  @keyframes ctaPulse { 0%,100%{box-shadow:0 0 0 0 rgba(168,85,247,0.4)} 50%{box-shadow:0 0 0 8px rgba(168,85,247,0)} }
  .main-btn { transition: all 0.25s ease; }
  .main-btn:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 20px 50px rgba(168,85,247,0.5); }
  .float-card { animation: floatCard 4s ease-in-out infinite; transition: all 0.2s ease; }
  .float-card:hover { transform: translateY(-8px) scale(1.05); }
  @keyframes floatCard { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .step-card { transition: all 0.2s ease; }
  .step-card:hover { transform: translateY(-8px); }
  .marquee { display: flex; gap: 2rem; animation: marqueeMove 20s linear infinite; width: max-content; }
  @keyframes marqueeMove { from{transform:translateX(0)} to{transform:translateX(-50%)} }
`;

const s = {
  page: { minHeight: '100vh', background: '#0a0a0f', color: 'white', overflow: 'hidden', position: 'relative' },
  bgOrb1: { position: 'absolute', width: 600, height: 600, background: 'rgba(168,85,247,0.15)', top: -200, right: -100, borderRadius: '50%', filter: 'blur(80px)' },
  bgOrb2: { position: 'absolute', width: 500, height: 500, background: 'rgba(236,72,153,0.1)', top: '20%', left: -150, borderRadius: '50%', filter: 'blur(80px)' },
  bgOrb3: { position: 'absolute', width: 400, height: 400, background: 'rgba(249,115,22,0.08)', bottom: '10%', right: '20%', borderRadius: '50%', filter: 'blur(80px)' },
  noise: { position: 'fixed', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")', pointerEvents: 'none', zIndex: 0 },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', position: 'relative', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' },
  navLogo: { display: 'flex', alignItems: 'center', gap: 8 },
  logoEmoji: { fontSize: 24 },
  logoText: { fontSize: 20, fontWeight: 800, fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  navLinks: { display: 'flex', gap: 12, alignItems: 'center' },
  navSignIn: { padding: '0.5rem 1.25rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 100, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' },
  navCta: { padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg, #a855f7, #ec4899)', border: 'none', borderRadius: 100, color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' },
  hero: { maxWidth: 900, margin: '0 auto', padding: '5rem 2rem 3rem', textAlign: 'center', position: 'relative', zIndex: 5 },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 100, padding: '0.4rem 1.25rem', fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: '2rem' },
  badgeDot: { width: 8, height: 8, borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 8px #a855f7' },
  heroH1: { fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1.05, marginBottom: '1.5rem' },
  heroLine1: { color: 'white', fontFamily: 'Syne, sans-serif' },
  heroLine2: { fontFamily: 'Syne, sans-serif' },
  heroP: { fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem' },
  heroAccent: { color: 'rgba(255,255,255,0.9)', fontWeight: 600 },
  heroBtns: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' },
  heroMainBtn: { padding: '0.9rem 2rem', background: 'linear-gradient(135deg, #a855f7, #ec4899)', border: 'none', borderRadius: 100, color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' },
  heroSecBtn: { padding: '0.9rem 2rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100, color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s ease' },
  floatCards: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  floatCard: { display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '0.75rem 1.25rem', backdropFilter: 'blur(20px)' },
  floatCardEmoji: { fontSize: 24 },
  floatCardText: { fontSize: 14, fontWeight: 700, color: 'white' },
  floatCardSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  section: { maxWidth: 1000, margin: '0 auto', padding: '5rem 2rem', position: 'relative', zIndex: 5 },
  sectionLabel: { textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#a855f7', marginBottom: '1rem' },
  sectionTitle: { textAlign: 'center', fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '3rem', fontFamily: 'Syne, sans-serif' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' },
  stepCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2rem', backdropFilter: 'blur(20px)' },
  stepNum: { fontSize: 48, fontWeight: 800, fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' },
  stepEmoji: { fontSize: 32, marginBottom: '0.75rem' },
  stepTitle: { fontSize: 20, fontWeight: 700, marginBottom: '0.75rem', fontFamily: 'Syne, sans-serif' },
  stepDesc: { color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: 15 },
  marqueeWrap: { overflow: 'hidden', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 5 },
  marquee: { display: 'flex', gap: '2rem' },
  marqueeItem: { fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', padding: '0 1rem' },
  ctaSection: { padding: '5rem 2rem', position: 'relative', zIndex: 5 },
  ctaGlass: { maxWidth: 700, margin: '0 auto', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 32, padding: '4rem 3rem', textAlign: 'center', backdropFilter: 'blur(30px)' },
  ctaTitle: { fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '1rem', fontFamily: 'Syne, sans-serif' },
  ctaSub: { color: 'rgba(255,255,255,0.6)', fontSize: 16, marginBottom: '2rem' },
  ctaBtn: { padding: '1rem 2.5rem', background: 'linear-gradient(135deg, #a855f7, #ec4899)', border: 'none', borderRadius: 100, color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' },
  footer: { padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 5 },
  footerLogo: { fontFamily: 'Syne, sans-serif', fontWeight: 800, background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  footerText: { color: 'rgba(255,255,255,0.3)', fontSize: 13 },
};
