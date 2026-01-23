import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useInView, useReducedMotion } from 'framer-motion';
import projectData from '../../portfolio.project.json';

// ============================================
// COMBINED PORTFOLIO: Visual Design + Truthful Data
// Uses design from Portfolio.jsx + data from JSON only
// ============================================

const { project } = projectData;

// Animated counter component
const AnimatedCounter = ({ value, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const frameRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = performance.now();
    const numValue = parseFloat(value);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(numValue * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isInView, value]);

  const displayValue = Number.isInteger(parseFloat(value))
    ? Math.floor(count)
    : count.toFixed(1);

  return <span ref={ref}>{prefix}{displayValue}{suffix}</span>;
};

// Floating particle background
const ParticleField = () => {
  const prefersReducedMotion = useReducedMotion();
  const particles = useMemo(() => (
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))
  ), []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'linear-gradient(to right, rgba(52, 211, 153, 0.2), rgba(34, 211, 238, 0.2))',
          }}
          animate={prefersReducedMotion ? undefined : {
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={prefersReducedMotion ? undefined : {
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Glowing orb component
const GlowingOrb = ({ color, size, position, delay = 0 }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
  <motion.div
    style={{
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(80px)',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      width: size,
      height: size,
      ...position,
    }}
    animate={prefersReducedMotion ? undefined : {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
    }}
    transition={prefersReducedMotion ? undefined : {
      duration: 8,
      repeat: Infinity,
      delay,
      ease: 'easeInOut',
    }}
  />
  );
};

// Interactive tech stack pill
const TechPill = ({ name, category, index }) => {
  const colors = {
    frontend: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#34d399' },
    backend: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#60a5fa' },
    database: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)', text: '#a78bfa' },
    infra: { bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.3)', text: '#fb923c' },
    tooling: { bg: 'rgba(156, 163, 175, 0.1)', border: 'rgba(156, 163, 175, 0.3)', text: '#9ca3af' },
  };
  const c = colors[category] || colors.tooling;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      whileHover={{ scale: 1.08, y: -2 }}
      style={{
        display: 'inline-block',
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 500,
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        cursor: 'default',
      }}
    >
      {name}
    </motion.span>
  );
};

// Feature card with hover effects
const FeatureCard = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const gradients = [
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #22d3ee, #0891b2)',
    'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    'linear-gradient(135deg, #f97316, #ea580c)',
    'linear-gradient(135deg, #ec4899, #db2777)',
    'linear-gradient(135deg, #eab308, #ca8a04)',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative' }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '1.5rem',
          background: gradient,
          opacity: isHovered ? 0.15 : 0,
          filter: 'blur(20px)',
          transition: 'opacity 0.4s ease',
        }}
      />
      <div
        style={{
          position: 'relative',
          padding: '1.5rem',
          borderRadius: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          height: '100%',
          transition: 'all 0.3s ease',
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.75rem',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            fontSize: '1.25rem',
          }}
        >
          ✓
        </div>
        <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
          {feature}
        </p>
      </div>
    </motion.div>
  );
};

// Metric card with animation
const MetricCard = ({ metric, index }) => {
  const gradients = [
    'linear-gradient(to right, #34d399, #22c55e)',
    'linear-gradient(to right, #22d3ee, #3b82f6)',
    'linear-gradient(to right, #a78bfa, #8b5cf6)',
    'linear-gradient(to right, #fb923c, #f97316)',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      style={{ position: 'relative' }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '1rem',
          background: gradient,
          opacity: 0.15,
          filter: 'blur(20px)',
        }}
      />
      <div
        style={{
          position: 'relative',
          padding: '1.5rem',
          borderRadius: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
          }}
        >
          <AnimatedCounter value={metric.value} suffix={metric.unit} />
        </div>
        <div style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {metric.label}
        </div>
      </div>
    </motion.div>
  );
};

// Evidence file component
const EvidenceFile = ({ file, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ x: 4 }}
    style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(255, 255, 255, 0.05)',
    }}
  >
    <div style={{ flexShrink: 0, color: '#10b981', fontSize: '1.25rem' }}>📄</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <code style={{ color: '#34d399', fontSize: '0.875rem', wordBreak: 'break-all' }}>
        {file.path}
      </code>
      <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem', margin: 0 }}>
        {file.why}
      </p>
    </div>
  </motion.div>
);

// Format date range
const formatDateRange = (start, end) => {
  if (!start) return 'Dates not provided';
  const formatDate = (d) => {
    const [year, month] = d.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };
  return `${formatDate(start)} – ${end ? formatDate(end) : 'Present'}`;
};

// Main Portfolio Component
export default function Portfolio() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const mouseFrameRef = useRef(null);

  useEffect(() => {
    const previousHtmlScrollBehavior = document.documentElement.style.scrollBehavior;
    const previousBodyScrollBehavior = document.body.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    return () => {
      document.documentElement.style.scrollBehavior = previousHtmlScrollBehavior;
      document.body.style.scrollBehavior = previousBodyScrollBehavior;
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMouseMove = (e) => {
      if (mouseFrameRef.current) return;
      const { clientX, clientY } = e;
      mouseFrameRef.current = requestAnimationFrame(() => {
        setMousePosition({
          x: (clientX / window.innerWidth - 0.5) * 20,
          y: (clientY / window.innerHeight - 0.5) * 20,
        });
        mouseFrameRef.current = null;
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseFrameRef.current) {
        cancelAnimationFrame(mouseFrameRef.current);
        mouseFrameRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  // Extract data from JSON - TRUTH ONLY
  const metrics = project.impact?.metrics?.slice(0, 4) || [];
  const features = project.features?.slice(0, 9) || [];
  const keyFiles = project.evidence?.key_files?.slice(0, 8) || [];
  const techStack = project.tech_stack || {};
  const architecture = project.architecture || {};

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: '#0a0a0f',
        color: '#ffffff',
        minHeight: '100vh',
        overflowX: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Progress bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(to right, #10b981, #22d3ee, #8b5cf6)',
          transformOrigin: 'left',
          scaleX: smoothProgress,
          zIndex: 50
        }}
      />

      {/* ========================================
          HERO SECTION
          ======================================== */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Animated background */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <GlowingOrb color="rgba(16, 185, 129, 0.4)" size="600px" position={{ top: '-20%', left: '-10%' }} delay={0} />
          <GlowingOrb color="rgba(6, 182, 212, 0.3)" size="500px" position={{ bottom: '-10%', right: '-5%' }} delay={2} />
          <GlowingOrb color="rgba(139, 92, 246, 0.25)" size="400px" position={{ top: '50%', left: '60%' }} delay={4} />
          <ParticleField />
        </div>

        {/* Grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.875rem', color: '#34d399', fontWeight: 500 }}>{project.status}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0.25rem' }}>•</span>
              <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{project.category}</span>
            </motion.div>

            {/* Title with parallax */}
            <motion.h1
              style={{
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                fontWeight: 900,
                marginBottom: '1rem',
                lineHeight: 1.1,
                transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
              }}
            >
              <span style={{ display: 'block', color: '#ffffff' }}>{project.title.split(' ').slice(0, 3).join(' ')}</span>
              <span
                style={{
                  display: 'block',
                  background: 'linear-gradient(to right, #34d399, #22d3ee, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {project.title.split(' ').slice(3).join(' ')}
              </span>
            </motion.h1>

            {/* Role & Date */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginBottom: '1.5rem', color: '#9ca3af' }}
            >
              <span>{project.role}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
              <span>{formatDateRange(project.dates?.start, project.dates?.end)}</span>
            </motion.div>

            {/* One-liner */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ fontSize: '1.25rem', color: '#d1d5db', maxWidth: '700px', margin: '0 auto 2rem', lineHeight: 1.6 }}
            >
              {project.one_liner}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}
            >
              <motion.a
                href="#work"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(to right, #10b981, #22d3ee)',
                  color: '#ffffff',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
                }}
                className="portfolio-link"
              >
                View What I Built
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
                className="portfolio-link"
              >
                Get In Touch
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)' }}
          >
            <motion.div
              animate={prefersReducedMotion ? undefined : { y: [0, 10, 0] }}
              transition={prefersReducedMotion ? undefined : { duration: 2, repeat: Infinity }}
              style={{ width: '24px', height: '40px', borderRadius: '9999px', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '8px' }}
            >
              <motion.div
                animate={prefersReducedMotion ? undefined : { opacity: [1, 0, 1], y: [0, 8, 0] }}
                transition={prefersReducedMotion ? undefined : { duration: 2, repeat: Infinity }}
                style={{ width: '4px', height: '8px', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '9999px' }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          IMPACT METRICS
          ======================================== */}
      <section id="work" style={{ position: 'relative', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Measurable Impact
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, marginTop: '0.5rem', color: '#ffffff' }}>
              Real Results, Real Numbers
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(metrics.length, 2)}, 1fr)`, gap: '1.5rem' }}>
            {metrics.map((metric, i) => (
              <MetricCard key={i} metric={metric} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          WHAT I BUILT (Features)
          ======================================== */}
      <section style={{ position: 'relative', padding: '4rem 1.5rem', overflow: 'hidden' }}>
        <GlowingOrb color="rgba(139, 92, 246, 0.2)" size="400px" position={{ top: '0', right: '-10%' }} delay={0} />

        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <span style={{ color: '#22d3ee', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Features
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, marginTop: '0.5rem', color: '#ffffff' }}>
              What I Built
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          ARCHITECTURE
          ======================================== */}
      <section style={{ position: 'relative', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <span style={{ color: '#a78bfa', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Architecture
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, marginTop: '0.5rem', color: '#ffffff' }}>
              How It Works
            </h2>
          </motion.div>

          {/* Architecture Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              padding: '2rem',
              borderRadius: '1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '2rem',
            }}
          >
            <p style={{ color: '#d1d5db', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
              {architecture.overview}
            </p>
          </motion.div>

          {/* Architecture Components - Visual boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {(architecture.components || []).slice(0, 5).map((comp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                style={{
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  backgroundColor: 'rgba(139, 92, 246, 0.05)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                }}
              >
                <span style={{ color: '#a78bfa', fontSize: '1.25rem', marginRight: '0.5rem' }}>→</span>
                <span style={{ color: '#d1d5db', fontSize: '0.9rem' }}>{comp}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          TECH STACK
          ======================================== */}
      <section style={{ position: 'relative', padding: '4rem 1.5rem', overflow: 'hidden' }}>
        <GlowingOrb color="rgba(16, 185, 129, 0.2)" size="400px" position={{ bottom: '-10%', left: '-10%' }} delay={2} />

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Technology
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, marginTop: '0.5rem', color: '#ffffff' }}>
              Tech Stack
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {Object.entries(techStack).map(([category, techs], catIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
                style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}
              >
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  minWidth: '90px',
                }}>
                  {category}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {techs.map((tech, i) => (
                    <TechPill key={tech} name={tech} category={category} index={i} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          EVIDENCE (Key Files)
          ======================================== */}
      <section style={{ position: 'relative', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <span style={{ color: '#fbbf24', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Evidence
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginTop: '0.5rem', color: '#ffffff' }}>
              Key Implementation Files
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {keyFiles.map((file, i) => (
              <EvidenceFile key={i} file={file} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          CONTACT
          ======================================== */}
      <section id="contact" style={{ position: 'relative', padding: '6rem 1.5rem' }}>
        <GlowingOrb color="rgba(16, 185, 129, 0.3)" size="500px" position={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} delay={0} />

        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
              <span style={{ color: '#ffffff' }}>Let's Build </span>
              <span style={{
                background: 'linear-gradient(to right, #34d399, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Together</span>
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              I'm looking for opportunities to ship meaningful products and make real impact.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              <motion.a
                href="mailto:contact@example.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(to right, #10b981, #22d3ee)',
                  color: '#ffffff',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
                className="portfolio-link"
              >
                ✉️ Get In Touch
              </motion.a>
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
                className="portfolio-link"
              >
                💻 GitHub
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
                className="portfolio-link"
              >
                🔗 LinkedIn
              </motion.a>
            </div>

            {/* Status cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[
                { label: 'Location', value: 'Saskatchewan, Canada' },
                { label: 'Status', value: 'Open to Work' },
                { label: 'Focus', value: 'Full-Stack Development' },
              ].map((info, i) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{info.label}</div>
                  <div style={{ color: '#d1d5db', fontWeight: 500, fontSize: '0.9rem' }}>{info.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.85rem'
      }}>
        <p style={{ margin: 0 }}>
          Built with React, Framer Motion, and real project data.
        </p>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          Data source: <code style={{ color: '#10b981' }}>portfolio.project.json</code>
        </p>
      </footer>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .portfolio-link:focus-visible {
          outline: 2px solid #22d3ee;
          outline-offset: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
