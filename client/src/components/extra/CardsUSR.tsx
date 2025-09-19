import { motion } from "framer-motion";
import type { IconType } from "react-icons";

interface CardsUSRProps {
  title: string;
  content: React.ReactNode;
  icon: IconType;
  borderColor?: string;
  textColor?: string;
  iconSize?: number;
  titleSize?: string;
  borderSize?: string;
}

const CardsUSR = ({
  title,
  content,
  icon: Icon,
  borderColor = "border-[#223c7a]",
  textColor = "text-[#223c7a]",
  iconSize = 24,
  titleSize = "text-2xl",
  borderSize = "border-2",
}: CardsUSRProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-3xl shadow-xl p-6 md:p-6 md:px-10 px-4 overflow-hidden h-full md:mx-10 mx-2 ${borderSize} ${borderColor}`}
    >
      <div className="flex items-end justify-center md:justify-start">
        <Icon className={`${textColor} mr-3`} size={iconSize} />
        <h2 className={`${titleSize} font-bold md:text-5xl ${textColor}`}>{title}</h2>
      </div>
      <div className="text-gray-700 md:text-2xl leading-6 mt-3 -tracking-tight text-justify">{content}</div>
    </motion.div>
  );
};

export default CardsUSR;
