'use client'

export function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '4px 0',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="MRL Travel"
        width={36}
        height={36}
        style={{ objectFit: 'contain', flexShrink: 0 }}
      />
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.04em',
        }}
      >
        MRL Travel
      </span>
    </div>
  )
}
