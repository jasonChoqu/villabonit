import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const VideoInHome = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const content = sectionRef.current.querySelector('.gsap-video-content');
    // Initial state: left for content
    gsap.set(content, { opacity: 0, x: -80 });
    let lastScrollY = window.scrollY;
    const showDown = () => {
      gsap.to(content, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
    };
    const showUp = () => {
      gsap.to(content, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
    };
    const hideDown = () => {
      gsap.to(content, { opacity: 0, x: -80, duration: 0.5, ease: 'power3.in' });
    };
    const hideUp = () => {
      gsap.to(content, { opacity: 0, x: 80, duration: 0.5, ease: 'power3.in' });
    };
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
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, { scope: sectionRef });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div ref={sectionRef} className="max-w-6xl mx-auto">
          <div className="gsap-video-content flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <p className="text-lg text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices
                gravida. Risus commodo viverra maceenas accumsan lacus vel facilisis.
              </p>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                <iframe
                  src="https://www.youtube.com/embed/KtSnNuf9zdw?autoplay=0&controls=1&rel=0"
                  title="Video Institucional"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoInHome;