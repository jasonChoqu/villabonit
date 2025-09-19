import { useEffect, useRef } from "react";
import gsap from "gsap";
import CardStart from "./cardStart";

export default function Specializations() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Initial state
    gsap.set(el, { opacity: 0, y: -50 });

    let lastScrollY = window.scrollY;

    // Show: fade in and move down to position
    const showDown = () => {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    };
    // Show: fade in and move up to position
    const showUp = () => {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", rotate: 0 });
    };
    // Hide: fade out and move up
    const hideUp = () => {
      gsap.to(el, { opacity: 0, y: -50, duration: 0.6, ease: "power3.in" });
    };
    // Hide: fade out and move down
    const hideDown = () => {
      gsap.to(el, { opacity: 0, y: 50, duration: 0.6, ease: "power3.in" });
    };

    // Intersection Observer for scroll in/out
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY;
        lastScrollY = currentScrollY;
        if (entry.isIntersecting) {
          if (scrollingDown) {
            showDown();
          } else {
            showUp();
          }
        } else {
          if (scrollingDown) {
            hideDown();
          } else {
            hideUp();
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-screen relative left-1/2 right-1/2 -mx-[50vw] z-10 bg-white bg-opacity-90 py-8 md:py-12 md:px-4"
    >
      <div className="container mx-auto sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10 md:mb-12" style={{ color: "#006C2E" }}>
          Áreas de especialización
        </h2>
        <div className="mb-16 md:mb-2">
          <CardStart />
        </div>
      </div>
    </section>
  );
}
