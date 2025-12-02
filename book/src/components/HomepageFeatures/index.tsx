import React, { type ReactNode } from 'react';
import { Brain, Rocket, BookOpen } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';

type FeatureItem = {
  title: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  description: ReactNode;
  color: string;
  bg: string;
  accent: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Neural Intelligence',
    Icon: Brain,
    description: (
      <>
        Learn cutting-edge reinforcement learning techniques and neural network architectures 
        designed specifically for robotics and embodied AI systems.
      </>
    ),
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    accent: 'from-pink-500/10 via-transparent to-transparent',
  },
  {
    title: 'Practical Implementation',
    Icon: Rocket,
    description: (
      <>
        Move beyond theory with hands-on projects, real-world case studies, and 
        deployable code that bridges the gap between simulation and reality.
      </>
    ),
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    accent: 'from-blue-500/10 via-transparent to-transparent',
  },
  {
    title: 'Open Source Knowledge',
    Icon: BookOpen,
    description: (
      <>
        Access a comprehensive, community-driven curriculum that evolves with the field. 
        Contribute, learn, and grow with the robotics community.
      </>
    ),
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    accent: 'from-amber-500/10 via-transparent to-transparent',
  },
];

function Feature({
  title,
  Icon,
  description,
  color,
  bg,
  accent,
  index,
}: FeatureItem & { index: number }) {
  return (
    <AnimatedSection
      as="article"
      variant="glow"
      delay={index * 120}
      className="feature-panel group relative overflow-hidden p-8 backdrop-blur-lg"
    >
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 bg-gradient-to-br ${accent}`}></div>
      </div>

      <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${bg}`}>
        <Icon size={32} className={color} />
      </div>
      
      <h3 className="relative text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
        {title}
      </h3>
      <p className="relative text-slate-400 leading-relaxed">
        {description}
      </p>

      <div className="relative mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
        Hyper-real Labs
      </div>
    </AnimatedSection>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <AnimatedSection
      as="section"
      variant="plain"
      className="py-24 bg-[#0b1120] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_50%)] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <p className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-blue-300/70">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            CORE MODULES
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Why Choose PhysicalAI?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A cinematic learning experience that blends neural policy design, electro-mechanical intuition, and zero-to-one experimentation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FeatureList.map((props, idx) => (
            <Feature key={props.title} index={idx} {...props} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
