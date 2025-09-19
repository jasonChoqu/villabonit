import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { FaHome, FaCalendarAlt, FaSmile } from 'react-icons/fa';

export default function Achievements() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const metrosRef = useRef<HTMLSpanElement>(null);
  const anosRef = useRef<HTMLSpanElement>(null);
  const familiasRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (inView && metrosRef.current && anosRef.current && familiasRef.current) {
      animateValue(metrosRef.current, 0, 97500, 2000);
      animateValue(anosRef.current, 0, 14, 1500);
      animateValue(familiasRef.current, 0, 650, 1800);
    }
  }, [inView]);

  const animateValue = (element: HTMLSpanElement, start: number, end: number, duration: number) => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      
      element.textContent = value.toLocaleString();
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  return (
    <div ref={ref} className="w-screen relative left-1/2 right-1/2 -mx-[50vw] py-12 md:py-16 lg:py-4 bg-yellow-500">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center md:flex-row justify-center gap-8 md:gap-12 lg:gap-16">
          
          <div className="text-center flex flex-col items-center">
            <FaHome className="text-3xl md:text-4xl mb-2 text-black" />
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-1">
              +<span ref={metrosRef}>0</span>
            </div>
            <p className="text-lg md:text-xl text-black">
              metros cuadrados construidos
            </p>
          </div>
          
          <div className="text-center flex flex-col items-center">
            <FaCalendarAlt className="text-3xl md:text-4xl mb-2 text-black" />
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-1">
              +<span ref={anosRef}>0</span>
            </div>
            <p className="text-lg md:text-xl text-black">
              años
            </p>
          </div>
          
          <div className="text-center flex flex-col items-center">
            <FaSmile className="text-3xl md:text-4xl mb-2 text-black" />
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-1">
              +<span ref={familiasRef}>0</span>
            </div>
            <p className="text-lg md:text-xl text-black">
              familias felices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}