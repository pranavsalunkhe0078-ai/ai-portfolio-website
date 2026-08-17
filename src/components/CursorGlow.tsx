import { useEffect, useState, RefObject } from 'react';

interface CursorGlowProps {
  containerRef?: RefObject<HTMLElement | null>;
}

export default function CursorGlow({ containerRef }: CursorGlowProps) {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          setOpacity(1);
          return;
        } else {
          setOpacity(0);
          return;
        }
      }
      setPosition({ x: e.clientX, y: e.clientY });
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-700 ease-out z-10"
      style={{ opacity }}
    >
      <div
        className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] transition-transform duration-100 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          background:
            'radial-gradient(circle, rgba(229, 9, 20, 0.18) 0%, rgba(220, 38, 38, 0.08) 45%, rgba(0, 0, 0, 0) 70%)',
        }}
      />
    </div>
  );
}
