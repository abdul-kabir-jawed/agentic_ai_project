import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import AnimatedSection from '@site/src/components/AnimatedSection';
import { Brain, Cpu, Zap, ArrowRight } from 'lucide-react';

// Sub-component for Features
function FeatureCard({ icon, title, desc, color, bg, border }) {
  return (
    <div className={`group relative p-8 rounded-2xl bg-slate-800/40 border border-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 card-glow ${border}`}>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${bg} ${color}`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed">
        {desc}
      </p>

      {/* Decorative Orb */}
      <div className="absolute -top-12 -right-12 w-24 h-24 orb rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}

const CurriculumHighlights = [
  {
    title: 'Chapter 1 · Physical AI Fundamentals',
    summary:
      'Define Physical AI, trace its history from cybernetics to modern humanoids, and unpack embodied intelligence plus sensorimotor learning loops.',
    doc: '/docs/chapter-1-introduction-to-physical-ai',
    topics: 'Embodiment • Morphological computation • Sensorimotor loops',
  },
  {
    title: 'Chapter 4 · Navigation & Path Planning',
    summary:
      'Dive into localization, mapping, and planners—EKF vs. particle filters, occupancy grids, and algorithms such as A*, RRT, and PRM for real robots.',
    doc: '/docs/chapter-4-navigation-and-path-planning',
    topics: 'Localization • SLAM • Motion control',
  },
  {
    title: 'Chapter 6 · Machine Learning for Robotics',
    summary:
      'Build reinforcement learning and imitation pipelines, explore sim-to-real transfer, and study how foundation models are entering robotics stacks.',
    doc: '/docs/chapter-6-machine-learning-for-robotics',
    topics: 'PPO • Imitation learning • Sim-to-real',
  },
];

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl;
  
  return (
    <Layout
      title={`Home | ${siteConfig.title}`}
      description="The definitive open-source guide to embodied intelligence."
      wrapperClassName="homepage-wrapper"
      noFooter>
      
      <div className="min-h-screen bg-[#0f172a] text-slate-50 font-sans selection:bg-blue-500/30 overflow-x-hidden">
        
        {/* --- Hero Section --- */}
        <header className="hero-bg relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 overflow-hidden">
          
          {/* Animated Background Elements */}
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Badge */}
          <div className="mb-8 animate-fade-in-up" style={{animationDuration: '0.6s'}}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              INTERACTIVE TEXTBOOK V2.0
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] max-w-4xl mx-auto animate-fade-in-up" style={{animationDuration: '0.8s'}}>
            <span className="text-gradient">Physical AI & </span>
            <br className="hidden md:block" />
            <span className="text-gradient-blue">Humanoid Robotics</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{animationDuration: '1s'}}>
            The definitive open-source guide to embodied intelligence. 
            Master the fusion of <span className="text-slate-200 font-semibold">deep reinforcement learning</span> and <span className="text-slate-200 font-semibold">mechanical design</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDuration: '1.2s'}}>
            <Link to="/docs/chapter-1-introduction-to-physical-ai" className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1 transition-all duration-300 overflow-hidden no-underline hover:text-white">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-2">
                Start Learning <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </header>

        {/* --- Features Grid --- */}
        <section className="py-24 bg-[#0b1120] relative">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Learning Modules</h2>
              <p className="text-slate-400 max-w-xl mx-auto">Master the complete robotics stack: from sensor fusion and actuator control to neural policy training and sim-to-real deployment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <FeatureCard 
                icon={<Brain size={32} />}
                title="Reinforcement Learning"
                desc="Learn Proximal Policy Optimization (PPO), actor-critic methods, and how to train neural policies for robotic control tasks covered in Chapter 6."
                color="text-pink-400"
                bg="bg-pink-500/10"
                border="group-hover:border-pink-500/30"
              />

              {/* Card 2 */}
              <FeatureCard 
                icon={<Cpu size={32} />}
                title="Sim-to-Real Transfer"
                desc="Understand domain randomization, policy distillation, and techniques for deploying simulation-trained policies on physical robots as detailed in our ML chapters."
                color="text-blue-400"
                bg="bg-blue-500/10"
                border="group-hover:border-blue-500/30"
              />

              {/* Card 3 */}
              <FeatureCard 
                icon={<Zap size={32} />}
                title="Actuator Control"
                desc="Explore Field Oriented Control (FOC), torque control, and impedance control laws essential for humanoid robotics covered in Chapter 3."
                color="text-amber-400"
                bg="bg-amber-500/10"
                border="group-hover:border-amber-500/30"
              />
            </div>
          </div>
        </section>

        {/* --- Terminal/Code Section --- */}
        <section className="py-20 bg-[#0f172a] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-mono">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Interactive Learning
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Hands-On <span className="text-blue-400">Robotics</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Each chapter includes practical Python examples and code snippets. Learn by implementing sensorimotor loops, training PPO policies, and building navigation stacks with real-world applications.
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <div className="p-1 rounded bg-blue-500/20 text-blue-400"><ArrowRight size={14} /></div>
                  <span>Python implementations for all algorithms</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 rounded bg-blue-500/20 text-blue-400"><ArrowRight size={14} /></div>
                  <span>Code examples from sensor fusion to policy training</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 rounded bg-blue-500/20 text-blue-400"><ArrowRight size={14} /></div>
                  <span>Ready-to-run notebooks for each chapter</span>
                </li>
              </ul>
            </div>

            <div className="flex-1 w-full max-w-xl">
              <div className="rounded-xl overflow-hidden bg-[#1e293b] border border-white/10 shadow-2xl font-mono text-sm relative group">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="text-xs text-slate-500">localization.py</div>
                </div>
                
                {/* Terminal Body */}
                <div className="p-6 text-slate-300 space-y-2">
                  <div className="flex">
                    <span className="text-blue-400 mr-2">def</span>
                    <span className="text-yellow-200">localize_robot</span>(sensor_data):
                  </div>
                  <div className="pl-4 text-slate-400"># EKF localization from Chapter 4</div>
                  <div className="pl-4">
                    state = <span className="text-purple-400">EKF</span>(motion_model, sensor_model)
                  </div>
                  <div className="pl-4 text-slate-400"># Predict and update cycle</div>
                  <div className="pl-4">
                    state.<span className="text-yellow-200">predict</span>(odometry)
                  </div>
                  <div className="pl-4">
                    state.<span className="text-yellow-200">update</span>(lidar_scan, map)
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">return</span> state.<span className="text-yellow-200">pose</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                     <span className="text-green-400">➜</span>
                     <span className="animate-pulse bg-slate-500 h-4 w-2 block"></span>
                  </div>
                </div>
                
                {/* Glowing overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none"></div>
              </div>
            </div>

          </div>
        </section>

        {/* --- Curriculum Overview --- */}
        <AnimatedSection
          as="section"
          variant="plain"
          className="py-24 bg-[#0f172a] border-y border-white/5"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.4em] text-blue-300/70">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                FROM THEORY TO DEPLOYMENT
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
                A textbook that ships working systems
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto mt-3">
                Every chapter references hardware-ready labs. Preview three flagship modules and jump straight into the docs when you
                want deeper coverage.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {CurriculumHighlights.map(({title, summary, doc, topics}) => (
                <article key={title} className="theme-panel relative p-6 flex flex-col gap-5">
                  <div className="space-y-2">
                    <p className="text-xs font-mono tracking-[0.35em] text-blue-300/80 uppercase">
                      DOC EXCERPT
                    </p>
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <p className="text-slate-400 leading-relaxed">
                      {summary}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-col gap-3">
                    <p className="text-sm text-blue-200/80 font-semibold">{topics}</p>
                    <Link
                      to={doc}
                      className="group inline-flex items-center gap-2 text-blue-300 font-semibold hover:text-blue-200 transition-colors"
                    >
                      Dive into the chapter
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* --- Footer CTA --- */}
        <section className="py-24 bg-gradient-to-b from-[#0b1120] to-[#1e293b] border-t border-white/5 relative overflow-hidden">
          {/* Decorative Grid on bottom */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          
          <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center">
            <div className="p-10 md:p-16 rounded-3xl bg-[#0f172a] border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              
              {/* Hover Glow Effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Build the Future?</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                Follow the same progression we outline in the docs: start with Physical AI fundamentals, graduate to navigation stacks,
                and deploy ML-driven control. Each module links to runnable Colab notebooks and printable lab sheets.
              </p>
              
              <Link to="/docs/chapter-1-introduction-to-physical-ai" className="inline-block px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-1 no-underline hover:text-white">
                Get Started Now
              </Link>
            </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="footer">
          <div className="footer__container">
            <div className="footer__grid">
              {/* Brand Section */}
              <div className="footer__brand-section">
                <div className="footer__brand">
                  <img 
                    src={`${baseUrl}img/physical-ai-favicon.svg`}
                    alt="Physical AI Logo" 
                    className="footer__brand-logo"
                  />
                  <span>PhysicalAI.io</span>
                </div>
                <p className="footer__description">
                  An open-source initiative documenting embodied intelligence—from force-control firmware to policy distillation. Built by robotics enthusiasts for the global community.
                </p>
              </div>
              
              {/* Chapters Section */}
              <div className="footer__section">
                <h3 className="footer__title">Chapters</h3>
                <div className="footer__chapters-grid">
                  <Link className="footer__link-item" to="/docs/chapter-1-introduction-to-physical-ai">Chapter 1: Physical AI</Link>
                  <Link className="footer__link-item" to="/docs/chapter-2-humanoid-robotics-overview">Chapter 2: Overview</Link>
                  <Link className="footer__link-item" to="/docs/chapter-3-humanoid-robotics-sensors-and-actuators">Chapter 3: Sensors & Actuators</Link>
                  <Link className="footer__link-item" to="/docs/chapter-4-navigation-and-path-planning">Chapter 4: Navigation</Link>
                  <Link className="footer__link-item" to="/docs/chapter-5-motion-planning-and-control">Chapter 5: Motion Control</Link>
                  <Link className="footer__link-item" to="/docs/chapter-6-machine-learning-for-robotics">Chapter 6: Machine Learning</Link>
                  <Link className="footer__link-item" to="/docs/chapter-7-human-robot-interaction">Chapter 7: HRI</Link>
                  <Link className="footer__link-item" to="/docs/chapter-8-advanced-topics-future-directions">Chapter 8: Advanced Topics</Link>
                </div>
              </div>
              
              {/* Community Section */}
              <div className="footer__section">
                <h3 className="footer__title">Community</h3>
                <ul className="footer__links-list">
                  <li>
                    <Link className="footer__link-item" to="/docs/chapter-1-introduction-to-physical-ai">
                      Start Reading
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Footer Bottom */}
            <div className="footer__bottom">
              <p className="footer__copyright">
                © 2025 Physical AI Initiative. All rights reserved.
              </p>
              <p className="footer__credit">
                Powered by contributors across Physical AI & Humanoid Robotics
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}