'use client'
import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const [dark, setDark] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [counters, setCounters] = useState({ clients: 0, sets: 0, dancers: 0 })
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', date: '', time: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [danceSlide, setDanceSlide] = useState(0)
  const aboutRef = useRef<HTMLDivElement>(null)
  const counted = useRef(false)

  const danceCount = 6

  useEffect(() => {
    const interval = setInterval(() => setDanceSlide(p => (p + 1) % danceCount), 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        io.unobserve(el)
        el.classList.add('in-view')
        el.addEventListener('animationend', () => {
          el.classList.add('revealed')
          el.classList.remove('reveal', 'in-view')
        }, { once: true })
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true
        let c = 0, s = 0, d = 0
        const timer = setInterval(() => {
          c = Math.min(c + 6, 300)
          s = Math.min(s + 10, 450)
          d = Math.min(d + 2, 80)
          setCounters({ clients: c, sets: s, dancers: d })
          if (c === 300 && s === 450 && d === 80) clearInterval(timer)
        }, 30)
      }
    }, { threshold: 0.3 })
    if (aboutRef.current) observer.observe(aboutRef.current)
    return () => observer.disconnect()
  }, [])

  const buildWaUrl = () => {
    const msg = `Hello Dove! I'd like to book an appointment.\n\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Service: ${form.service}\n` +
      `Date: ${form.date || 'Flexible'}\n` +
      `Time: ${form.time || 'Flexible'}\n` +
      `Notes: ${form.notes || 'None'}`
    return `https://wa.me/2348103452135?text=${encodeURIComponent(msg)}`
  }

  const handleBooking = async () => {
    if (!form.name || !form.phone || !form.service) {
      alert('Please fill your name, phone, and the service you want.')
      return
    }
    window.open(buildWaUrl(), '_blank')
    setSubmitting(true)
    try {
      await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    } catch {
      // Supabase save is a backup record — the WhatsApp message is the actual booking
    }
    setSubmitting(false)
    setSubmitted(true)
  }

  const navLinks = ['Home', 'About', 'Nails', 'Dance', 'Influence', 'Gallery', 'Booking', 'Visit']

  const t = {
    bg: dark ? '#120524' : '#F5EEFD',
    surface: dark ? '#1d0a38' : '#ffffff',
    card: dark ? '#2a1153' : '#EBE0F8',
    text: dark ? '#f3eaff' : '#1d0a38',
    muted: dark ? 'rgba(243,234,255,0.6)' : 'rgba(29,10,56,0.6)',
    gold: dark ? '#E5C158' : '#A37C12',
    purple: dark ? '#A074E0' : '#6B3FA0',
    deepPurple: '#3D1B6B',
    border: dark ? 'rgba(229,193,88,0.22)' : 'rgba(107,63,160,0.2)',
    navBg: scrolled ? (dark ? 'rgba(18,5,36,0.95)' : 'rgba(245,238,253,0.95)') : 'transparent',
  }

  return (
    <main style={{ background: t.bg, color: t.text, fontFamily: "'Poppins', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${t.bg}; }
        ::-webkit-scrollbar-thumb { background: ${t.purple}; border-radius: 3px; }
        @keyframes slideDown { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes fadeUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 25px rgba(229,193,88,0.35)} 50%{box-shadow:0 0 55px rgba(229,193,88,0.7)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        @keyframes slideInLeft { from{transform:translateX(-60px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes slideInRight { from{transform:translateX(60px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes sparkle { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes revealUp { from{opacity:0;transform:translateY(42px)} to{opacity:1;transform:translateY(0)} }
        .reveal { opacity: 0; }
        .reveal.in-view { animation: revealUp 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .revealed { opacity: 1; }
        .hover-lift { transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease; }
        .hover-lift:hover { transform: translateY(-6px); border-color: ${t.gold}; box-shadow: 0 16px 40px rgba(123,79,166,0.3); }
        .service-card img { transition: transform 0.55s cubic-bezier(0.22,1,0.36,1); }
        .service-card:hover img { transform: scale(1.08); }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; }
          .reveal.in-view { animation: none; }
          .sparkle, .book-btn, .float-book, .whatsapp-btn { animation: none; }
        }
        .nav-link { color: ${t.muted}; text-decoration: none; font-size: 14px; font-weight: 500; position: relative; padding: 4px 0; transition: color 0.3s; letter-spacing: 0.5px; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px; background: linear-gradient(90deg, ${t.purple}, ${t.gold}); transition: width 0.35s ease; border-radius: 2px; }
        .nav-link:hover { color: ${t.gold}; }
        .nav-link:hover::after { width: 100%; }
        .service-card { background: ${t.card}; border: 1px solid ${t.border}; border-radius: 20px; padding: 30px 24px; transition: all 0.4s ease; position: relative; overflow: hidden; }
        .service-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, ${t.purple}, ${t.gold}); transform: scaleX(0); transition: transform 0.4s ease; }
        .service-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(123,79,166,0.3); border-color: ${t.gold}; }
        .service-card:hover::before { transform: scaleX(1); }
        .gallery-item { border-radius: 16px; overflow: hidden; position: relative; cursor: pointer; transition: transform 0.4s ease; }
        .gallery-item:hover { transform: scale(1.03); }
        .gallery-item .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(18,5,36,0.9), transparent 60%); opacity: 0; transition: opacity 0.4s; display: flex; align-items: flex-end; padding: 20px; color: white; font-size: 14px; font-weight: 600; }
        .gallery-item:hover .overlay { opacity: 1; }
        .review-card { background: ${t.card}; border: 1px solid ${t.border}; border-radius: 20px; padding: 28px; transition: all 0.3s; min-width: 300px; flex-shrink: 0; max-width: 380px; }
        .review-card:hover { border-color: ${t.gold}; box-shadow: 0 10px 30px rgba(123,79,166,0.25); }
        .book-btn { background: linear-gradient(135deg, ${t.purple}, ${t.gold}); color: white; border: none; padding: 16px 36px; border-radius: 50px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s; letter-spacing: 0.5px; animation: glow 3s ease-in-out infinite; }
        .book-btn:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 15px 35px rgba(123,79,166,0.55); }
        .book-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .ghost-btn { background: transparent; color: ${t.text}; border: 1.5px solid ${t.gold}; padding: 14px 32px; border-radius: 50px; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.3s; }
        .ghost-btn:hover { background: ${t.gold}; color: ${dark ? '#1d0a38' : '#ffffff'}; }
        .float-book { position: fixed; bottom: 32px; right: 32px; z-index: 999; background: linear-gradient(135deg, ${t.purple}, ${t.gold}); color: white; border: none; padding: 14px 24px; border-radius: 50px; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 8px 30px rgba(123,79,166,0.55); animation: pulse 2.5s ease-in-out infinite; transition: all 0.3s; }
        .float-book:hover { transform: translateY(-3px); }
        .whatsapp-btn { position: fixed; bottom: 32px; left: 32px; z-index: 999; background: #25D366; color: white; border: none; width: 56px; height: 56px; border-radius: 50%; font-size: 26px; cursor: pointer; box-shadow: 0 8px 24px rgba(37,211,102,0.45); display: flex; align-items: center; justify-content: center; transition: all 0.3s; text-decoration: none; }
        .whatsapp-btn:hover { transform: scale(1.12); }
        .input-field { width: 100%; padding: 14px 18px; border-radius: 12px; border: 1px solid ${t.border}; background: ${t.card}; color: ${t.text}; font-size: 14px; font-family: 'Poppins', sans-serif; outline: none; transition: border-color 0.3s; }
        .input-field:focus { border-color: ${t.purple}; }
        .input-field::placeholder { color: ${t.muted}; }
        .section-tag { display: inline-block; background: linear-gradient(135deg, rgba(160,116,224,0.18), rgba(229,193,88,0.18)); border: 1px solid ${t.border}; color: ${t.gold}; padding: 6px 18px; border-radius: 50px; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; }
        .gold-text { background: linear-gradient(135deg, ${t.gold}, #f5d97a, ${t.gold}); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
        .hamburger span { display: block; width: 24px; height: 2px; background: ${t.text}; margin: 5px 0; border-radius: 2px; transition: all 0.3s; }
        .sparkle { position: absolute; font-size: 14px; color: ${t.gold}; animation: sparkle 2.5s ease-in-out infinite; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-btns { justify-content: center !important; flex-wrap: wrap; }
          .services-grid { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .dance-grid { grid-template-columns: 1fr !important; }
          .counters-row { grid-template-columns: 1fr 1fr 1fr !important; gap: 8px !important; }
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .hero-title { font-size: 38px !important; }
          .section-pad { padding: 70px 24px !important; }
          .nav-pad { padding: 16px 24px !important; }
          .float-book { bottom: 20px; right: 20px; padding: 12px 20px; font-size: 13px; }
          .whatsapp-btn { bottom: 20px; left: 20px; width: 48px; height: 48px; font-size: 22px; }
          .booking-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <button className="float-book" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
        ✦ Book Dove
      </button>
      <a className="whatsapp-btn" href="https://wa.me/2348103452135" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Dove">💬</a>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', transition: 'all 0.4s ease',
        background: t.navBg, backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${t.border}` : 'none',
        animation: 'slideDown 0.6s ease forwards'
      }} className="nav-pad">
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 700 }}>
          Dove <span className="gold-text">Glitters</span>
        </div>
        <div className="desktop-nav" style={{ display: 'flex', gap: '32px' }}>
          {navLinks.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="nav-link">{link}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={() => setDark(!dark)} style={{
            background: t.card, border: `1px solid ${t.border}`,
            color: t.text, padding: '8px 16px', borderRadius: '50px',
            cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.3s'
          }}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button className="mobile-menu-btn hamburger" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <span style={{ transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: '70px', left: 0, right: 0, zIndex: 99,
          background: dark ? 'rgba(18,5,36,0.97)' : 'rgba(245,238,253,0.97)',
          backdropFilter: 'blur(20px)', padding: '24px',
          borderBottom: `1px solid ${t.border}`,
          animation: 'fadeUp 0.3s ease'
        }}>
          {navLinks.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: '14px 0',
                color: t.text, textDecoration: 'none',
                fontSize: '16px', fontWeight: 500,
                borderBottom: `1px solid ${t.border}`
              }}>{link}</a>
          ))}
        </div>
      )}

      <section id="home" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        {/* Hero background: Dove's shop-sign video drops in at /dove-hero.mp4. Gradient is the fallback until she sends it. */}
        <video
          autoPlay loop muted playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
         >
          <source src="/dove-hero.mp4" type="video/mp4" />
        </video>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(135deg, rgba(61,27,107,0.45) 0%, rgba(18,5,36,0.65) 100%)',
        }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse at top right, rgba(229,193,88,0.2), transparent 60%)' }} />

        <div style={{ position: 'absolute', top: '18%', left: '12%', zIndex: 2 }}><span className="sparkle">✦</span></div>
        <div style={{ position: 'absolute', top: '70%', left: '8%', zIndex: 2 }}><span className="sparkle" style={{ animationDelay: '0.7s' }}>✧</span></div>
        <div style={{ position: 'absolute', top: '30%', right: '15%', zIndex: 2 }}><span className="sparkle" style={{ animationDelay: '1.4s', fontSize: '20px' }}>✦</span></div>
        <div style={{ position: 'absolute', bottom: '25%', right: '10%', zIndex: 2 }}><span className="sparkle" style={{ animationDelay: '0.3s' }}>✧</span></div>

        <div className="hero-grid section-pad" style={{ display: 'grid', gridTemplateColumns: '1fr', alignItems: 'center', gap: '60px', padding: '120px 80px', width: '100%', position: 'relative', zIndex: 3, textAlign: 'center', justifyItems: 'center' }}>
          <div style={{ animation: 'slideInLeft 0.9s ease 0.2s both', maxWidth: '820px' }}>
            <div className="section-tag" style={{ color: '#f5d97a' }}>✦ Nail Artistry · Dance Academy</div>
            <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '72px', fontWeight: 700, lineHeight: 1.05, marginBottom: '24px', color: '#ffffff' }}>
              Where every <em className="gold-text">glitter</em> tells a story
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 40px' }}>
              Luxury nails, expert nail training, and the home of Wonderland Dance Academy — all under one roof in Ogbomosho.
            </p>
            <div className="hero-btns" style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center' }}>
              <button className="book-btn" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
                Book an Appointment
              </button>
              <a href="https://wa.me/2348103452135" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button className="ghost-btn" style={{ color: '#ffffff', borderColor: '#E5C158' }}>
                  DM on WhatsApp
                </button>
              </a>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'float 2s ease-in-out infinite', zIndex: 3 }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(229,193,88,0.8), transparent)' }} />
        </div>
      </section>

      <section id="about" ref={aboutRef} className="section-pad" style={{ padding: '110px 80px', background: t.surface }}>
        <div className="about-grid reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <div className="section-tag">✦ Meet Dove</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '46px', fontWeight: 700, lineHeight: 1.15, marginBottom: '24px' }}>
              The hands behind <em className="gold-text">Dove Glitters</em>
            </h2>
            <p style={{ color: t.muted, lineHeight: 1.9, fontSize: '16px', marginBottom: '20px' }}>
              Hi, I'm Dove — nail artist, nail trainer, and founder of Wonderland Dance Academy. From luxury manicures to choreographing weekend dance classes, my craft is about helping people feel beautiful, confident, and free.
            </p>
            <p style={{ color: t.muted, lineHeight: 1.9, fontSize: '16px', marginBottom: '36px' }}>
              Based in Ogbomosho, OYO State. Slide into my DMs <a href="https://tiktok.com/@dove_glitters" target="_blank" rel="noopener noreferrer" style={{ color: t.gold, textDecoration: 'none', fontWeight: 600 }}>@dove_glitters</a> or call <strong style={{ color: t.text }}>08103452135</strong> to book.
            </p>
            <button className="book-btn" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
              Reserve your slot
            </button>
          </div>
          <div>
            <div style={{
              width: '100%', aspectRatio: '3/4',
              background: `linear-gradient(145deg, ${t.deepPurple}, #2a1153)`,
              borderRadius: '24px', border: `1px solid ${t.border}`,
              position: 'relative', overflow: 'hidden'
            }}>
              <img
                src="/Dove_herself.jpg"
                alt="Dove — nail artist and founder of Wonderland Dance Academy"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${t.deepPurple}66 0%, transparent 35%)` }} />
              <div className="counters-row" style={{
                position: 'absolute', bottom: '-30px', left: '50%', transform: 'translateX(-50%)',
                display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', width: '92%'
              }}>
                {[
                  { num: counters.clients + '+', label: 'Happy Clients' },
                  { num: counters.sets + '+', label: 'Nail Sets' },
                  { num: counters.dancers + '+', label: 'Dancers Trained' },
                ].map(({ num, label }) => (
                  <div key={label} style={{
                    background: dark ? '#1d0a38' : 'white',
                    border: `1px solid ${t.border}`,
                    borderRadius: '16px', padding: '16px 10px', textAlign: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
                  }}>
                    <div className="gold-text" style={{ fontFamily: "'Playfair Display',serif", fontSize: '24px', fontWeight: 700 }}>{num}</div>
                    <div style={{ fontSize: '11px', color: t.muted, marginTop: '4px' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="nails" className="section-pad" style={{ padding: '120px 80px', background: t.bg }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-tag">✦ Nail Studio</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 700 }}>
            Nails that <em className="gold-text">glitter</em>
          </h2>
          <p style={{ color: t.muted, marginTop: '14px', fontSize: '16px', maxWidth: '560px', margin: '14px auto 0' }}>
            Custom nail sets, repairs, soft glam and detailed nail art — every set crafted to make your hands glitter.
          </p>
        </div>
        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', maxWidth: '820px', margin: '0 auto' }}>
          {[
            { img: '/gallery1.jpg', fallback: '💎', name: 'Brand Full Nail Set', desc: 'A complete custom set — sculpted, shaped and finished exactly how you want it.' },
            { img: '/gallery3.jpg', fallback: '💅', name: 'Nail Repair', desc: 'Fix a broken, chipped or lifted nail and restore your set to flawless.' },
            { img: '/gallery5.jpg', fallback: '✨', name: 'Soft Glam Manicure', desc: 'Clean, polished and effortlessly elegant — the soft glam everyone loves.' },
            { img: '/gallery7.jpg', fallback: '🎨', name: 'Nail Art Design', desc: 'Hand-painted designs, gems, chrome and fine detail — your nails as art.' },
          ].map((s, i) => (
            <div key={i} className="service-card reveal" style={{ padding: 0, display: 'flex', flexDirection: 'column', animationDelay: `${i * 90}ms` }}>
              <div style={{ height: '200px', position: 'relative', background: `linear-gradient(135deg, ${t.deepPurple}, #5b2bb5)`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>
                <span aria-hidden="true">{s.fallback}</span>
                <img
                  src={s.img}
                  alt={s.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div style={{ padding: '24px 24px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '21px', fontWeight: 700, marginBottom: '10px' }}>{s.name}</h3>
                <p style={{ color: t.muted, fontSize: '14px', lineHeight: 1.7, marginBottom: '24px', flex: 1 }}>{s.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: t.gold, fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>DM for pricing</span>
                  <button
                    onClick={() => { setForm({ ...form, service: s.name }); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }) }}
                    style={{ background: 'transparent', border: `1px solid ${t.gold}`, color: t.gold, padding: '8px 16px', borderRadius: '50px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.5px' }}
                  >
                    Book →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="dance" className="section-pad" style={{ padding: '120px 80px', background: t.surface }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-tag">✦ Wonderland Dance Academy</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 700 }}>
            Find your <em className="gold-text">rhythm</em>
          </h2>
          <p style={{ color: t.muted, marginTop: '14px', fontSize: '16px', maxWidth: '560px', margin: '14px auto 0' }}>
            Weekly dance classes for every level — beginners welcome, energy required.
          </p>
        </div>
        <div className="dance-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1100px', margin: '0 auto', alignItems: 'stretch' }}>
          <div style={{
            background: `linear-gradient(145deg, ${t.deepPurple}, #1a0530)`,
            borderRadius: '24px', padding: '48px', color: '#ffffff',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(229,193,88,0.25), transparent 70%)', borderRadius: '50%' }} />
            <div style={{ fontSize: '50px', marginBottom: '20px', position: 'relative' }}>💃</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '30px', fontWeight: 700, marginBottom: '24px', position: 'relative' }}>Class Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>When</div>
                <div style={{ fontSize: '18px', fontWeight: 600 }}>Every Sunday · 2:00 PM</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Where</div>
                <div style={{ fontSize: '16px', lineHeight: 1.5 }}>TGRP, Borehole Junction,<br/>Aroje, Ogbomosho</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Who</div>
                <div style={{ fontSize: '16px' }}>All ages & levels welcome</div>
              </div>
            </div>
            <a href="https://wa.me/2348103452135?text=Hi%20Dove!%20I%27d%20like%20to%20join%20Wonderland%20Dance%20Academy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button className="book-btn" style={{ marginTop: '32px', position: 'relative' }}>
                Join the next class
              </button>
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { icon: '🌱', title: 'Beginner Class', desc: 'Brand new to dance? Start with fundamentals, rhythm and confidence.' },
              { icon: '🔥', title: 'Intermediate Training', desc: 'Level up your technique with structured choreography and drills.' },
              { icon: '⭐', title: 'Private Session', desc: 'One-on-one coaching shaped fully around your goals and pace.' },
              { icon: '👯', title: 'Group Workshop', desc: 'Bring your crew or event — a high-energy session built for groups.' },
            ].map((f, i) => (
              <div key={i} className="reveal hover-lift" style={{
                background: t.card, border: `1px solid ${t.border}`,
                borderRadius: '16px', padding: '22px 24px',
                display: 'flex', gap: '18px', alignItems: 'flex-start',
                animationDelay: `${i * 90}ms`
              }}>
                <div style={{ fontSize: '28px' }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{f.title}</div>
                  <div style={{ color: t.muted, fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          maxWidth: '1100px', margin: '40px auto 0',
          borderRadius: '24px', overflow: 'hidden', position: 'relative',
          aspectRatio: '16 / 9', border: `1px solid ${t.border}`,
          background: `linear-gradient(145deg, ${t.deepPurple}, #5b2bb5)`
        }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <span style={{ fontSize: '64px' }}>💃</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Dance reel coming soon</span>
          </div>
          <video
            autoPlay loop muted playsInline controls
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.currentTarget as HTMLVideoElement).style.display = 'none' }}
          >
            <source src="/dance-video.mp4" type="video/mp4" />
          </video>
        </div>

        <div style={{ maxWidth: '1100px', margin: '48px auto 0' }}>
          <div style={{
            position: 'relative', borderRadius: '24px', overflow: 'hidden',
            aspectRatio: '16 / 9', border: `1px solid ${t.border}`,
            background: `linear-gradient(145deg, ${t.deepPurple}, #5b2bb5)`
          }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span style={{ fontSize: '56px' }}>📸</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Dance academy photos coming soon</span>
            </div>
            {Array.from({ length: danceCount }, (_, i) => (
              <img
                key={i}
                src={`/wonder${i + 1}.jpg`}
                alt={`Wonderland Dance Academy moment ${i + 1}`}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                  opacity: i === danceSlide ? 1 : 0, transition: 'opacity 0.8s ease'
                }}
              />
            ))}
            <button
              onClick={() => setDanceSlide(p => (p - 1 + danceCount) % danceCount)}
              aria-label="Previous photo"
              style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                width: '44px', height: '44px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: 'rgba(18,5,36,0.6)', color: '#fff', fontSize: '20px', backdropFilter: 'blur(6px)'
              }}
            >‹</button>
            <button
              onClick={() => setDanceSlide(p => (p + 1) % danceCount)}
              aria-label="Next photo"
              style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                width: '44px', height: '44px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: 'rgba(18,5,36,0.6)', color: '#fff', fontSize: '20px', backdropFilter: 'blur(6px)'
              }}
            >›</button>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px' }}>
            {Array.from({ length: danceCount }, (_, i) => (
              <button
                key={i}
                onClick={() => setDanceSlide(i)}
                aria-label={`Go to photo ${i + 1}`}
                style={{
                  width: i === danceSlide ? '28px' : '8px', height: '8px',
                  borderRadius: '4px', border: 'none', cursor: 'pointer',
                  background: i === danceSlide ? t.gold : t.border,
                  transition: 'all 0.4s ease'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="influence" className="section-pad" style={{ padding: '120px 80px', background: `linear-gradient(160deg, ${t.deepPurple}, #14071f)`, color: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(229,193,88,0.2), transparent 70%)', borderRadius: '50%' }} />
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '56px', position: 'relative' }}>
          <div className="section-tag" style={{ color: '#f5d97a' }}>✦ Dove Influence</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 700, color: '#ffffff' }}>
            Collaborate with <em className="gold-text">Dove</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '600px', margin: '14px auto 0', lineHeight: 1.7 }}>
            Beyond the studio, Dove partners with brands as a content creator and influencer — bringing authentic energy and a loyal audience to the products she loves.
          </p>
        </div>
        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
          {[
            { icon: '🤝', title: 'Brand Ambassador', desc: 'Long-term partnerships representing brands that fit her audience.' },
            { icon: '🎬', title: 'Content Creation', desc: 'Scroll-stopping photo and video content built around your product.' },
            { icon: '📣', title: 'PR Campaigns', desc: 'Campaign features that put your brand in front of her followers.' },
            { icon: '🌟', title: 'Event Appearances', desc: 'Presence, energy and reach for your launch or special event.' },
          ].map((c, i) => (
            <div key={i} className="reveal hover-lift" style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(229,193,88,0.25)',
              borderRadius: '20px', padding: '30px 24px', backdropFilter: 'blur(6px)',
              animationDelay: `${i * 90}ms`
            }}>
              <div style={{ fontSize: '38px', marginBottom: '16px' }}>{c.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '19px', fontWeight: 700, marginBottom: '10px', color: '#ffffff' }}>{c.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: 1.7 }}>{c.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '48px', position: 'relative' }}>
          <button className="book-btn" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
            Start a collaboration
          </button>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', marginTop: '18px' }}>
            Or reach out on TikTok <a href="https://tiktok.com/@dove_glitters" target="_blank" rel="noopener noreferrer" style={{ color: '#f5d97a', textDecoration: 'none', fontWeight: 600 }}>@dove_glitters</a>
          </p>
        </div>
      </section>

      <section id="gallery" className="section-pad" style={{ padding: '110px 80px', background: t.bg }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-tag">✦ The Work</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 700 }}>
            From the <em className="gold-text">studio</em>
          </h2>
          <p style={{ color: t.muted, marginTop: '14px', fontSize: '16px' }}>Recent sets, looks and moments — real photos drop in here.</p>
        </div>
        <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '1200px', margin: '0 auto' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
            const tall = n === 2 || n === 4 || n === 8
            return (
              <div key={n} className="gallery-item reveal" style={{ gridRow: tall ? 'span 2' : 'span 1', animationDelay: `${(n - 1) * 70}ms` }}>
                <div style={{
                  height: tall ? '360px' : '170px', width: '100%', position: 'relative',
                  background: 'linear-gradient(145deg,#3D1B6B,#5b2bb5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: tall ? '80px' : '60px'
                }}>
                  <span aria-hidden="true">✦</span>
                  <img
                    src={`/gallery${n}.jpg`}
                    alt={`Dove Glitters studio work ${n}`}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
                <div className="overlay">✦ Dove Glitters</div>
              </div>
            )
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href="https://tiktok.com/@dove_glitters" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button className="ghost-btn">See more on TikTok →</button>
          </a>
        </div>
      </section>

      <section id="reviews" className="section-pad" style={{ padding: '110px 80px', background: t.surface }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-tag">✦ Client Love</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 700 }}>
            What they <em className="gold-text">say</em>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { name: 'Adunni O.', review: "Dove did my acrylics for my birthday and I haven't stopped getting compliments. Best nail tech in Ogbomosho hands down.", stars: 5, service: 'Acrylic Extensions' },
            { name: 'Funke A.', review: "Took her nail training course and learned so much in just a few weeks. She's patient and genuinely cares about her students.", stars: 5, service: 'Nail Training' },
            { name: 'Bisola T.', review: "Wonderland Dance is the highlight of my week. Dove brings so much energy — I leave class smiling every time.", stars: 5, service: 'Dance Academy' },
            { name: 'Iyabo M.', review: "My French tips lasted three full weeks without chipping. Worth every minute of the appointment.", stars: 5, service: 'Gel Manicure' },
          ].map((r, i) => (
            <div key={i} className="review-card reveal" style={{ animationDelay: `${i * 90}ms` }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[1,2,3,4,5].map(j => <span key={j} className="gold-text" style={{ fontSize: '18px' }}>★</span>)}
              </div>
              <p style={{ color: t.muted, fontSize: '14px', lineHeight: 1.8, marginBottom: '20px', fontStyle: 'italic' }}>"{r.review}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.purple}, ${t.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '16px' }}>
                  {r.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{r.name}</div>
                  <div style={{ fontSize: '12px', color: t.muted }}>{r.service}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="booking" className="section-pad" style={{ padding: '110px 80px', background: t.bg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="section-tag">✦ Reserve Your Slot</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '46px', fontWeight: 700 }}>
              Book an <em className="gold-text">appointment</em>
            </h2>
            <p style={{ color: t.muted, marginTop: '14px', fontSize: '15px' }}>
              Fill the form and Dove will confirm via WhatsApp. Prefer to chat first? <a href="https://wa.me/2348103452135" target="_blank" rel="noopener noreferrer" style={{ color: t.gold, fontWeight: 600, textDecoration: 'none' }}>DM her here</a>.
            </p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '80px', marginBottom: '24px' }}>✦</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '32px', marginBottom: '16px' }}>
                Almost <em className="gold-text">there!</em>
              </h3>
              <p style={{ color: t.muted, fontSize: '16px', lineHeight: 1.8, maxWidth: '440px', margin: '0 auto' }}>
                Your details are saved. A WhatsApp message to Dove just opened in a new tab — tap send there and she'll confirm your slot. Didn't open? Use the button below.
              </p>
              <a href={buildWaUrl()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '28px' }}>
                <button className="book-btn" style={{ background: '#25D366', animation: 'none' }}>
                  📲 Send to Dove on WhatsApp
                </button>
              </a>
              <div style={{ marginTop: '20px' }}>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', date: '', time: '', notes: '' }) }}
                  style={{ background: 'none', border: 'none', color: t.muted, cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}>
                  Book another
                </button>
              </div>
            </div>
          ) : (
            <div className="booking-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                { label: 'Full Name', placeholder: 'Your full name', type: 'text', key: 'name' },
                { label: 'Phone Number', placeholder: 'e.g. 0810 345 2135', type: 'tel', key: 'phone' },
                { label: 'Email (optional)', placeholder: 'your@email.com', type: 'email', key: 'email' },
                { label: 'Preferred Date', placeholder: '', type: 'date', key: 'date' },
              ].map(({ label, placeholder, type, key }) => (
                <div key={label}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: t.muted, display: 'block', marginBottom: '8px' }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="input-field"
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: t.muted, display: 'block', marginBottom: '8px' }}>Service</label>
                <select className="input-field" style={{ appearance: 'none' }} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                  <option value="">Select a service</option>
                  <optgroup label="Nails — Dove Glitters">
                    {['Brand Full Nail Set', 'Nail Repair', 'Soft Glam Manicure', 'Nail Art Design'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Dance — Wonderland Academy">
                    {['Beginner Class', 'Intermediate Training', 'Private Session', 'Group Workshop'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Collaborations — Dove Influence">
                    {['Brand Ambassador', 'Content Creation', 'PR Campaign', 'Event Appearance'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: t.muted, display: 'block', marginBottom: '8px' }}>Preferred Time</label>
                <select className="input-field" style={{ appearance: 'none' }} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                  <option value="">Pick a time</option>
                  {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map(slot => (
                    <option key={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: t.muted, display: 'block', marginBottom: '8px' }}>Anything else? (optional)</label>
                <textarea
                  placeholder="Inspo pics, length, colour ideas, dance level..."
                  className="input-field"
                  rows={4}
                  style={{ resize: 'vertical' }}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button
                  className="book-btn"
                  style={{ width: '100%', fontSize: '16px', padding: '18px' }}
                  onClick={handleBooking}
                  disabled={submitting}
                >
                  {submitting ? 'Opening WhatsApp...' : '📲 Book via WhatsApp'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="visit" className="section-pad" style={{ padding: '110px 80px', background: t.surface }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-tag">✦ Find Us</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 700 }}>
            Visit the <em className="gold-text">studio</em>
          </h2>
          <p style={{ color: t.muted, marginTop: '14px', fontSize: '16px', maxWidth: '520px', margin: '14px auto 0', lineHeight: 1.7 }}>
            Come through for your nails, or join a dance class — you'll find Dove Glitters here in Ogbomosho.
          </p>
        </div>
        <div className="reveal" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ borderRadius: '24px', overflow: 'hidden', border: `1px solid ${t.border}`, height: '420px' }}>
            <iframe
              src="https://www.google.com/maps?q=Borehole%20Junction%2C%20Aroje%2C%20Ogbomosho%2C%20Oyo%20State%2C%20Nigeria&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dove Glitters studio location"
            />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px' }}>📍</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Dove Glitters · Wonderland Dance Academy</div>
                <div style={{ color: t.muted, fontSize: '14px', lineHeight: 1.6 }}>TGRP, Borehole Junction, Aroje,<br />Ogbomosho, Oyo State</div>
              </div>
            </div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=Borehole%20Junction%2C%20Aroje%2C%20Ogbomosho%2C%20Oyo%20State%2C%20Nigeria" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button className="book-btn">Get Directions</button>
            </a>
          </div>
        </div>
      </section>

      <footer style={{ background: '#0e041d', color: 'rgba(255,255,255,0.55)', padding: '60px 80px 32px', borderTop: '1px solid rgba(229,193,88,0.15)' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '60px', marginBottom: '48px', maxWidth: '1200px', margin: '0 auto 48px' }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '28px', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>
              Dove <span className="gold-text">Glitters</span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.8, maxWidth: '320px' }}>
              Nail artistry, training, and Wonderland Dance Academy — Dove's full creative world, in one studio.
            </p>
            <div style={{ display: 'flex', gap: '18px', marginTop: '24px', flexWrap: 'wrap' }}>
              <a href="https://tiktok.com/@dove_glitters" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#E5C158'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}>
                TikTok @dove_glitters
              </a>
              <a href="https://instagram.com/dove_glitters" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#E5C158'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}>
                Instagram
              </a>
              <a href="https://wa.me/2348103452135" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#E5C158'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}>
                WhatsApp
              </a>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '20px', fontSize: '15px' }}>Explore</div>
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ display: 'block', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#E5C158'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}>
                {l}
              </a>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '20px', fontSize: '15px' }}>Visit</div>
            <div style={{ fontSize: '14px', lineHeight: 2.2 }}>
              <div>📍 Ogbomosho, OYO State</div>
              <div>📞 08103452135</div>
              <div>💃 TGRP, Borehole Junction, Aroje</div>
              <div>🕑 Dance: Sundays 2PM</div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(229,193,88,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', flexWrap: 'wrap', gap: '12px', maxWidth: '1200px', margin: '0 auto' }}>
          <span>© 2026 Dove Glitters. All rights reserved.</span>
          <span style={{ color: '#E5C158' }}>Designed with love ✦</span>
        </div>
      </footer>
    </main>
  )
}
