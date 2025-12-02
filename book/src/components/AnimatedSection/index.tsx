import React, { useEffect, useRef, useState, ElementType } from 'react';
import clsx from 'clsx';

type SectionTag = ElementType;

type AnimatedSectionVariant = 'default' | 'glow' | 'plain';

interface AnimatedSectionProps {
  as?: SectionTag;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: AnimatedSectionVariant;
}

const variantClasses: Record<AnimatedSectionVariant, string> = {
  default: 'theme-panel',
  glow: 'theme-panel theme-panel--glow',
  plain: '',
};

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  as: Component = 'section',
  children,
  className,
  delay = 0,
  variant = 'default',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px',
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, []);

  return (
    <Component
      ref={(node) => {
        sectionRef.current = node as HTMLElement | null;
      }}
      data-visible={isVisible}
      className={clsx(
        'animate-on-scroll',
        variantClasses[variant],
        isVisible && 'visible',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
};

export default AnimatedSection;