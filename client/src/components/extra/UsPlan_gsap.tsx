'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import UsPlanCard from './UsPlanCard';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function UsPlan() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current!;
      // Estado inicial
      gsap.set(el, { autoAlpha: 0, y: 60 });

      // Handlers reutilizables (con overwrite para evitar choques)
      const show = () =>
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: 'auto',
        });

      const hideDown = () =>
        gsap.to(el, {
          autoAlpha: 0,
          y: 60,
          duration: 0.6,
          ease: 'power3.in',
          overwrite: 'auto',
        });

      const hideUp = () =>
        gsap.to(el, {
          autoAlpha: 0,
          y: -60,
          duration: 0.6,
          ease: 'power3.in',
          overwrite: 'auto',
        });

      // ScrollTrigger maneja entrada/salida y entrada de vuelta
      ScrollTrigger.create({
        trigger: el,
        start: 'top 78%',     // empieza a animar cuando el top del bloque entra al 78% de la ventana
        end: 'bottom 22%',    // termina cuando el bottom llega al 22%
        onEnter: show,        // scrolling hacia abajo, entra
        onEnterBack: show,    // scrolling hacia arriba, reentra
        onLeave: hideUp,      // se fue por arriba
        onLeaveBack: hideDown,// se fue por abajo
        // markers: true,      // descomenta para debug
      });

      // Si hay imágenes/fuentes que cambian el layout, refresca el cálculo
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: sectionRef }
  );

  return (
    <div
      ref={sectionRef}
      className="flex flex-col transform-gpu will-change-[opacity,transform]"
      // Opcionalmente mejora el repintado:
      style={{ contain: 'layout paint' }}
    >
      <UsPlanCard
        logo="logo"
        title="Planeamos con propósito, construimos con pasión"
        content={`Constructora Villa Bonita es una empresa que se dedica al diseño, construcción y comercialización de proyectos inmobiliarios y obras civiles en general, tanto propios como de terceros.

Nuestro trabajo se caracteriza por la calidad y la eficiencia en tiempos y costos en cada uno de sus trabajos.

Fundada en el año 2011, nació como un sueño de su Gerente General, el Ing. Willmar Guzmán, para afrontar la creciente demanda de proyectos inmobiliarios en la zona del Urubó y también para terminar de consolidar la Urbanización Villa Bonita.

A partir del 2016 toma un giro para no sólo dedicarse al ámbito inmobiliario, sino también a la participación de proyectos civiles en otros sectores como clientes particulares y licitaciones públicas.

Actualmente, contamos con varios proyectos terminados y entregados a clientes satisfechos, tanto privados como del ámbito público. Esto es gracias al gran equipo que conforma la Constructora, que no sólo son excelentes profesionales, sino que también son excelentes personas, compañeros y amigos.`}
        highlights={[
          { label: 'CEO:', value: 'Willmar Guzmán Justiniano' },
          { label: 'CFO:', value: 'Carlos Guzmán Justiniano' },
        ]}
      />
    </div>
  );
}
