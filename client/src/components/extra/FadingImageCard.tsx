import type { ReactNode } from "react";

interface FadingFooterCardProps {
  imageUrl: string;
  fadeHeight?: string;
  cardHeight?: string;
  children?: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export default function FadingFooterCard({
  imageUrl,
  fadeHeight = "h-32",
  cardHeight = "h-96",
  children,
  className = "",
  fullWidth = true, // Valor por defecto true
}: FadingFooterCardProps) {
  return (
    <div
      className={`relative overflow-hidden ${cardHeight} ${className} ${
        fullWidth ? "w-screen relative left-1/2 right-1/2 -mx-[50vw]" : ""
      }`}
    >
      <img src={imageUrl} alt="Card background" className="absolute inset-0 w-full h-full object-cover" />

      <div
        className={`
        absolute bottom-0 left-0 right-0 
        ${fadeHeight}
        bg-gradient-to-t from-white/90 via-white/50 to-transparent
      `}
      />

      <div className="relative h-full flex flex-col justify-end p-6 text-white">{children}</div>
    </div>
  );
}
