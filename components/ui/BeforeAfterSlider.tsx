"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Sebelum",
  afterLabel = "Sesudah",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-peek animation on mount
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsAnimating(true);
      setSliderPosition(45);
    }, 1000);
    
    const timer2 = setTimeout(() => {
      setSliderPosition(55);
    }, 1600);

    const timer3 = setTimeout(() => {
      setSliderPosition(50);
    }, 2200);

    const timer4 = setTimeout(() => {
      setIsAnimating(false);
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-line select-none cursor-ew-resize bg-gray-100"
      ref={containerRef}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* Aspect Ratio Wrapper to match image 3360x1916 */}
      <div className="relative w-full pb-[57.02%]">
        
        {/* BEFORE IMAGE (Bottom layer) */}
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src={beforeImage} 
            alt={beforeLabel} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
            unoptimized={beforeImage.includes('placehold.co')}
          />
          {beforeLabel && (
            <div className="absolute left-4 top-4 rounded-full bg-ink/80 backdrop-blur-sm px-3 py-1 font-secondary text-xs font-semibold text-white z-10">
              {beforeLabel}
            </div>
          )}
        </div>

        {/* AFTER IMAGE (Top layer, clipped to show on the right) */}
        <div 
          className={`absolute inset-0 w-full h-full ${isAnimating ? "transition-all duration-500 ease-in-out" : ""}`}
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          <Image 
            src={afterImage} 
            alt={afterLabel} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 3360px"
            priority
          />
          {afterLabel && (
            <div className="absolute right-4 top-4 rounded-full bg-cobalt/90 backdrop-blur-sm px-3 py-1 font-secondary text-xs font-semibold text-white z-10">
              {afterLabel}
            </div>
          )}
        </div>

        {/* SLIDER HANDLE */}
        <div 
          className={`absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${isAnimating ? "transition-all duration-500 ease-in-out" : ""}`}
          style={{ left: `calc(${sliderPosition}% - 1px)` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:scale-110">
            <MoveHorizontal size={20} />
          </div>
        </div>

      </div>
    </div>
  );
}
