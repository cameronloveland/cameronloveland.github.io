import React from 'react';

export default function NebulaLayer() {
  const nebulae = [
    {
      top: '-10%',
      left: '-20%',
      width: '80vw',
      height: '80vw',
      background:
        'radial-gradient(circle at 30% 30%, rgba(102,0,153,0.45), rgba(0,0,0,0))',
      animationDelay: '0s',
    },
    {
      top: '40%',
      left: '60%',
      width: '70vw',
      height: '70vw',
      background:
        'radial-gradient(circle at 70% 40%, rgba(0,128,255,0.4), rgba(0,0,0,0))',
      animationDelay: '5s',
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-[-3]">
      {nebulae.map((n, i) => (
        <div
          key={i}
          className="absolute blur-3xl opacity-60 animate-nebulaFloat"
          style={{
            top: n.top,
            left: n.left,
            width: n.width,
            height: n.height,
            background: n.background,
            animationDelay: n.animationDelay,
          }}
        />
      ))}
    </div>
  );
}
