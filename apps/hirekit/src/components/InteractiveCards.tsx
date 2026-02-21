'use client';

import { useState } from 'react';

/* ── Problem Card (tilted, straightens on hover) ── */
export function ProblemCard({
  icon,
  title,
  description,
  iconBg,
  iconColor,
  rotate,
}: {
  icon: string;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  rotate: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 transition-all duration-300 relative"
      style={{
        transform: hovered ? 'translateY(-10px) rotate(0deg)' : rotate,
        zIndex: hovered ? 10 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-16 h-16 rounded-[20px] flex items-center justify-center text-[32px] mb-6"
        style={{ background: iconBg, color: iconColor }}
      >
        <i className={icon} />
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-base mt-3 text-slate-500">{description}</p>
    </div>
  );
}

/* ── Feature Card (lifts on hover) ── */
export function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="p-8 rounded-2xl transition-all duration-300"
      style={{
        background: hovered ? 'white' : '#FAFBFC',
        border: hovered ? '1px solid #E2E8F0' : '1px solid transparent',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 40px -4px rgba(79, 70, 229, 0.12)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <i className={icon} style={{ fontSize: '40px', color }} />
      <h3 className="mt-4 mb-2 font-bold">{title}</h3>
      <p className="text-base text-slate-500">{description}</p>
    </div>
  );
}

/* ── Pricing Card ── */
export function PricingCard({
  title,
  price,
  description,
  features,
  variant = 'default',
  popular = false,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  variant?: 'default' | 'popular' | 'dark';
  popular?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const bgMap = {
    default: 'bg-white border border-slate-200',
    popular: 'bg-green-50 border-2 border-hk-accent',
    dark: 'bg-hk-dark text-white border-none',
  };

  const btnMap = {
    default: 'border border-slate-200 text-hk-dark hover:bg-slate-50',
    popular: 'bg-hk-primary text-white shadow-md hover:shadow-lg',
    dark: 'bg-white text-hk-primary hover:bg-slate-50',
  };

  const btnLabel = {
    default: 'Get Started',
    popular: 'Start Free Trial',
    dark: 'Contact Sales',
  };

  return (
    <div
      className={`rounded-2xl p-10 transition-all duration-300 relative ${bgMap[variant]}`}
      style={{
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: hovered ? '0 20px 40px -4px rgba(79, 70, 229, 0.12)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-hk-accent text-white px-3 py-1 rounded-xl text-xs font-bold">
          MOST POPULAR
        </div>
      )}
      <h3 className="font-bold">{title}</h3>
      <div className="text-5xl font-extrabold my-6">
        {price}
        <span className={`text-lg font-medium ${variant === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          /mo
        </span>
      </div>
      <p className={`text-[15px] ${variant === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
        {description}
      </p>
      <ul className="my-8 space-y-4">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3">
            <i
              className="ph-bold ph-check text-xl"
              style={{ color: variant === 'dark' ? 'white' : '#51CF66' }}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href="https://app.hirekit.io/auth/signup"
        className={`block w-full text-center py-3 px-6 rounded-full font-semibold transition-all duration-300 ${btnMap[variant]}`}
      >
        {btnLabel[variant]}
      </a>
    </div>
  );
}

/* ── Feature Showcase Block (alternating layout for How It Works) ── */
export function FeatureShowcaseBlock({
  icon,
  title,
  description,
  bullets,
  visual,
  reversed = false,
}: {
  icon: string;
  title: string;
  description: string;
  bullets: string[];
  visual: React.ReactNode;
  reversed?: boolean;
}) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reversed ? 'lg:direction-rtl' : ''}`}>
      <div className={reversed ? 'lg:order-2' : 'lg:order-1'}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <i className={`${icon} text-hk-primary text-2xl`} />
          </div>
          <h3 className="text-2xl font-bold text-hk-dark">{title}</h3>
        </div>
        <p className="text-slate-500 text-lg mb-6">{description}</p>
        <ul className="space-y-3">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 items-start">
              <i className="ph-fill ph-check-circle text-hk-accent text-xl mt-0.5 shrink-0" />
              <span className="text-slate-600">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={reversed ? 'lg:order-1' : 'lg:order-2'}>
        {visual}
      </div>
    </div>
  );
}

/* ── Hero Mockup Window (3D perspective) ── */
export function HeroMockup() {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ perspective: '1000px' }} className="relative">
      {/* Floating icons */}
      <div className="absolute -top-5 -left-5 bg-white p-4 rounded-[20px] shadow-sm text-[32px] animate-bounce-slow z-10">
        <i className="ph-duotone ph-file-text text-hk-primary" />
      </div>
      <div className="absolute bottom-10 -right-7 bg-white p-4 rounded-[20px] shadow-sm text-[32px] animate-bounce-slow-delay z-10">
        <i className="ph-duotone ph-check-circle text-hk-accent" />
      </div>

      {/* Mockup window */}
      <div
        className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden w-full h-[450px] relative transition-transform duration-500"
        style={{
          transform: hovered ? 'rotateY(0) rotateX(0)' : 'rotateY(-10deg) rotateX(5deg)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Title bar */}
        <div className="h-10 bg-slate-100 flex items-center px-4 gap-2 border-b border-slate-200">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        {/* Content skeleton */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="w-2/5 h-6 bg-slate-200 rounded" />
            <div className="w-8 h-8 bg-slate-200 rounded-full" />
          </div>
          <div className="w-full h-3 bg-slate-100 rounded" />
          <div className="w-[70%] h-3 bg-slate-100 rounded" />

          <div className="flex gap-4 mt-4">
            <div className="flex-1 h-[120px] bg-hk-light border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400">
              <div className="text-center">
                <i className="ph-bold ph-users text-2xl mb-2 block" />
                <div className="text-xs font-semibold">Candidates</div>
              </div>
            </div>
            <div className="flex-1 h-[120px] bg-hk-light border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400">
              <div className="text-center">
                <i className="ph-bold ph-chart-bar text-2xl mb-2 block" />
                <div className="text-xs font-semibold">Analytics</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 rounded-lg p-3 mt-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full" />
            <div>
              <div className="w-[120px] h-2 bg-slate-300 rounded mb-1" />
              <div className="w-20 h-2 bg-slate-200 rounded" />
            </div>
            <div className="ml-auto w-6 h-6 bg-hk-primary rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
