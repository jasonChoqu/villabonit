import { useMemo } from "react";
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
        : items.map((_, idx) => (items.length <= 1 ? 50 : (idx / (items.length - 1)) * 100)),
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
      {/* Colored track centered horizontally, constrained to left/right 8 */}
      <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[14px]">
        {items.map((_, idx) => {
          const segmentWidth = 100 / (items.length - 1);
          const isYellow = idx % 2 === 0;
          if (idx === items.length - 1) return null;
          return (
            <div
              key={idx}
              className={`absolute h-full ${isYellow ? "bg-[#FBD323]" : "bg-[#1d5e3c]"}`}
              style={{ left: `${idx * segmentWidth}%`, width: `${segmentWidth}%` }}
            />
          );
        })}
      </div>

      {/* Items container spans full height, but shares left/right 8 with the track */}
      <div className="absolute inset-y-0 left-8 right-8">
        <div className="relative w-full h-full">
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
      </div>
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
        // No extra margin needed; we are inside the track (left/right 8 applied to parent)
      }}
    >
      {/* Short vertical line with dot */}
      {index % 2 !== 0 ? (
        // Even index: line goes upward from center
        <div className="absolute bg-gray-700 left-[50%] bottom-[50%] w-[2px] h-[350px] z-1 -translate-x-1/2 translate-y-[5rem]" />
      ) : (
        // Odd index: line goes downward from center
        <div className="absolute bg-gray-700 left-[50%] top-[50%] w-[2px] h-[350px] z-1 -translate-x-1/2 -translate-y-[5rem]" />
      )}
      {index % 2 !== 0 ? (
        // Even index: line goes upward from center
        <div className="absolute bg-gray-700 rounded-full top-[50%] left-[50%] -translate-x-1/2  w-2 h-2 z-10 translate-y-[5rem]" />
      ) : (
        // Odd index: line goes downward from center
        <div className="absolute bg-gray-700 rounded-full top-[50%] left-[50%] -translate-x-1/2  w-2 h-2 z-10 -translate-y-[5rem]" />
      )}

      {/* Dot on timeline */}

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
