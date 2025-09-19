import React, { useMemo } from "react";
import { motion } from "framer-motion";

/* -------------------- Types -------------------- */
export type TimelineItem = {
  year: string;
  title: string;
  description: string;
  image: string;
};

interface TimelineVillaBonitaProps {
  items: TimelineItem[];
  height?: number;
  minWidth?: number;
  minGap?: number;
}

/* -------------------- Demo data -------------------- */
export const timelineItemsFromImage: TimelineItem[] = [
  {
    year: "1999",
    title: "Construcción de primeras viviendas",
    description: "Se edifican las primeras viviendas, dando lugar a los primeros asentamientos familiares en la zona.",
    image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    year: "2003",
    title: "Inicio de urbanización",
    description:
      "El 18 de agosto comienzan las obras de urbanización de Villa Bonita, marcando el hito formal del proyecto.",
    image: "https://images.pexels.com/photos/8354523/pexels-photo-8354523.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    year: "2004",
    title: "Pavimentación de Vías Internas",
    description:
      "Se pavimentan las vías estructurales internas, mejorando la accesibilidad y conectividad del proyecto.",
    image: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    year: "2007",
    title: "Servicios Básicos y Constitución de la Cooperativa AGUAYSES",
    description:
      "Se instalan redes de energía eléctrica, alumbrado público y sistema de agua potable. Ese mismo año se constituye la Cooperativa AGUAYSES, que integra a los laborers con el alcantarillado, suministro y mantenimiento del agua.",
    image: "https://images.pexels.com/photos/382177/pexels-photo-382177.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

/* -------------------- Component -------------------- */
export default function TimelineVillaBonita({
  items,
  height = 460,
  minWidth = 1600,
  minGap = 280,
}: TimelineVillaBonitaProps) {
  // Move hooks before any early return
  const contentWidth = useMemo(() => {
    if (!items || items.length <= 1) return minWidth;
    const segments = items.length - 1;
    return Math.max(minWidth, segments * minGap + 400);
  }, [items, minWidth, minGap]);

  const positions = useMemo(
    () =>
      !items || items.length === 0
        ? []
        : items.map((_, idx) => (items.length <= 1 ? 50 : (idx / (items.length - 1)) * 97)),
    [items]
  );

  if (!items || items.length === 0) {
    return <div className="w-full text-center py-10 text-gray-500">No hay datos para mostrar la línea de tiempo.</div>;
  }

  return (
    <div
      className="relative mx-auto select-none bg-white px-8 my-12 "
      style={{ height, width: contentWidth, maxWidth: "100%" }}
    >
      {/* Single timeline with alternating colors */}
      <div className="absolute left-8 right-8 top-1/2 transform -translate-y-1/2">
        {items.map((_, idx) => {
          const segmentWidth = 100 / (items.length - 1);
          const isYellow = idx % 2 === 0;

          if (idx === items.length - 1) return null; // Don't render last segment

          return (
            <div
              key={idx}
              className={`absolute h-[14px] -top-[6px] ${isYellow ? "bg-[#FBD323]" : "bg-[#1d5e3c]"}`}
              style={{
                left: `${idx * segmentWidth}%`,
                width: `${segmentWidth}%`,
              }}
            />
          );
        })}
      </div>

      {/* Timeline items */}
      {items.map((item, idx) => (
        <TimelineItem
          key={`${item.year}-${idx}`}
          item={item}
          position={positions[idx]}
          isTop={idx % 2 === 0}
          index={idx}
        />
      ))}
    </div>
  );
}

/* -------------------- Timeline Item Component -------------------- */
interface TimelineItemProps {
  item: TimelineItem;
  position: number;
  isTop: boolean;
  index: number;
}

const TimelineItem = ({ item, position, isTop, index }: TimelineItemProps) => {
  const { year, title, description, image } = item;

  return (
    <div
      className="absolute top-0 bottom-0"
      style={{
        left: `${position}%`,
        transform: "translateX(-50%)",
        width: "280px",
        marginLeft: "32px", // Account for the padding
      }}
    >
      {/* Short vertical line with dot */}
      {index % 2 === 0 ? (
        <div className="absolute bg-gray-700 left-[50%] top-[73%] w-[2px] h-[350px] z-1 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <div className="absolute bg-gray-700 left-[50%] top-[29%] w-[2px] h-[350px] z-1 -translate-x-1/2 -translate-y-1/2" />
      )}

      {/* Dot on timeline */}
      {index % 2 === 0 ? (
        <div className="absolute bg-gray-700 rounded-full top-[39%] left-[50%] -translate-x-1/2 -translate-y-4 w-2 h-2 z-10" />
      ) : (
        <div className="absolute bg-gray-700 rounded-full top-[67%] left-[50%] -translate-x-1/2 -translate-y-4 w-2 h-2 z-10" />
      )}

      {/* Year text - alternating above and below */}
      <div
        className={` text-[#3f434f] absolute left-1/2 translate-x-5 text-5xl font-extrabold z-[15] ${
          index % 2 === 0 ? "bottom-[55%]" : "top-[55%]"
        }`}
      >
        {year}
      </div>

      {/* Photo - alternating above and below (opposite pattern from original) */}
      <motion.div
        initial={{ opacity: 0, y: isTop ? 20 : -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.45, delay: 0.1 * index }}
        className={`absolute flex justify-center left-64 translate-x-[-50%] w-[120px] z-5 ${
          index % 2 === 0 ? "bottom-[100%]" : "top-[70%]"
        } `}
      >
        <div className="rounded-full overflow-hidden absolute size-36 ">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      </motion.div>

      {/* Text content - same side as year */}
      <motion.div
        initial={{ opacity: 0, y: isTop ? 20 : -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.45, delay: 0.1 * index }}
        className="absolute"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: "240px",
          [index % 2 === 0 ? "bottom" : "top"]: "15%", // Text same side as year
          zIndex: 5,
        }}
      >
        {/* Title */}
        <h3 className="font-extrabold text-[#1d1f4c] mb-2 text-xl leading-5 text-left ml-3">{title}</h3>

        {/* Description */}
        {description && <p className="text-gray-900 text-xs leading-3.5 text-justify ml-3">{description}</p>}
      </motion.div>
    </div>
  );
};
