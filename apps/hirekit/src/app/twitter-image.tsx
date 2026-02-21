import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'HireKit — The Hiring Platform That Replaces 5 Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 60%, #3730A3 100%)',
          padding: '60px 80px',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'rgba(81,207,102,0.1)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              color: 'white',
              fontWeight: 800,
            }}
          >
            H
          </div>
          <span style={{ fontSize: 32, fontWeight: 800, color: 'white', letterSpacing: -0.5 }}>
            HireKit
          </span>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: -2,
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          The Hiring Platform That Replaces 5 Tools
        </div>
        <div
          style={{
            fontSize: 24,
            color: 'rgba(199,210,254,0.9)',
            lineHeight: 1.4,
            maxWidth: 700,
            marginBottom: 40,
          }}
        >
          ATS, AI scoring, career pages, scheduling, email — one platform, zero complexity.
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['ATS Pipeline', 'AI Scoring', 'Career Pages', 'Widgets', 'Scheduling', 'Webhooks'].map(
            (label) => (
              <div
                key={label}
                style={{
                  padding: '10px 20px',
                  borderRadius: 100,
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            right: 80,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(199,210,254,0.7)',
            fontSize: 16,
          }}
        >
          Free during early access
        </div>
      </div>
    ),
    { ...size }
  );
}
