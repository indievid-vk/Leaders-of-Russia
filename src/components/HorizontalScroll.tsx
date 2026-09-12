import React, { useRef, useState, useEffect, useCallback } from 'react';

interface HorizontalScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  indicatorClassName?: string;
  showIndicator?: boolean;
}

export default function HorizontalScroll({
  children,
  className = '',
  contentClassName = '',
  indicatorClassName = '',
  showIndicator = true,
  ...props
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [thumbStyle, setThumbStyle] = useState({ width: 0, left: 0 });
  const [canScroll, setCanScroll] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateThumb = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    
    // Check if content actually overflows
    if (scrollWidth <= clientWidth + 4) {
      setCanScroll(false);
      return;
    }
    setCanScroll(true);

    // Dynamic thumb width and position
    const visibleRatio = clientWidth / scrollWidth;
    const trackWidth = clientWidth;
    const thumbWidth = Math.max(28, Math.min(trackWidth * 0.4, trackWidth * visibleRatio));
    const maxScroll = scrollWidth - clientWidth;
    const maxThumbLeft = trackWidth - thumbWidth;
    const thumbLeft = maxScroll > 0 ? (scrollLeft / maxScroll) * maxThumbLeft : 0;

    setThumbStyle({ width: thumbWidth, left: thumbLeft });
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    updateThumb();
    // Make indicator visible only AFTER user starts scrolling
    setIsScrolling(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Smoothly fade away 800ms after scrolling stops
    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);

    props.onScroll?.(e);
  };

  useEffect(() => {
    updateThumb();
    const handleResize = () => updateThumb();
    window.addEventListener('resize', handleResize);
    
    // Check again after fonts/content load
    const timer = setTimeout(updateThumb, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [updateThumb, children]);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Scrollable Container with native scrollbars strictly hidden on all browsers */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`overflow-x-auto no-scrollbar select-none sm:select-auto ${contentClassName}`}
        {...props}
      >
        {children}
      </div>

      {/* Dynamic Scroll Indicator: INVISIBLE ON OPEN, APPEARS ONLY WHILE SCROLLING */}
      {showIndicator && canScroll && (
        <div 
          className={`absolute -bottom-0.5 left-0 right-0 h-1 px-1 pointer-events-none transition-opacity duration-300 ${
            isScrolling ? 'opacity-100' : 'opacity-0'
          } ${indicatorClassName}`}
          aria-hidden="true"
        >
          <div className="relative w-full h-1 bg-slate-200/50 rounded-full overflow-hidden">
            <div
              className="absolute top-0 h-full bg-slate-400/90 rounded-full transition-transform duration-75 ease-out"
              style={{
                width: `${thumbStyle.width}px`,
                transform: `translateX(${thumbStyle.left}px)`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
