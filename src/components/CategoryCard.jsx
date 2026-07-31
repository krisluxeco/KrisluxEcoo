import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CategoryCard({ cat, index, featured = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Link href={`/products?category=${cat.slug}`} className="block h-full">
        <div className="group relative h-full rounded-[28px] overflow-hidden bg-[#1C1C1A] shadow-[0_8px_30px_rgba(28,28,26,0.12)] hover:shadow-[0_20px_50px_rgba(28,28,26,0.22)] transition-shadow duration-500">

          {/* Image */}
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            sizes={featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.045]"
          />

          {/* Warm gradient, tuned softer than pure black */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A]/85 via-[#1C1C1A]/15 to-transparent" />

          {/* Craft tag — signature element */}
          <div
            className="
              absolute top-5 left-5
              flex items-center gap-2
              rounded-[6px] px-3 py-1.5
              bg-[#F1E9D8]/95
              border border-dashed border-[#C8A97A]/70
              rotate-[-2deg]
              transition-transform duration-500
              group-hover:rotate-0
              shadow-sm
            "
          >
            {/* eyelet */}
            <span className="w-[5px] h-[5px] rounded-full bg-[#1C1C1A]/30 shrink-0" />
            {cat.icon && <span className="text-xs leading-none">{cat.icon}</span>}
            <span className="text-[10px] uppercase tracking-[0.14em] text-[#1C1C1A]/80 font-medium leading-none">
              {cat.tag || cat.name}
            </span>
          </div>

          {/* Arrow chip */}
          <div className="absolute top-5 right-5 flex items-center gap-2">
            <span
              className="
                max-w-0 overflow-hidden whitespace-nowrap
                text-[11px] uppercase tracking-[0.12em] text-white/0
                group-hover:max-w-[80px] group-hover:text-white/85
                transition-all duration-500
              "
            >
              Shop now
            </span>
            <div
              className="
                w-9 h-9 rounded-full
                bg-white/15 backdrop-blur-md
                flex items-center justify-center
                text-white text-sm
                group-hover:bg-[#1C1C1A] group-hover:rotate-45
                transition-all duration-400
              "
            >
              →
            </div>
          </div>

          {/* Content */}
          <div className={`absolute bottom-0 left-0 right-0 p-6 ${featured ? "md:p-8" : ""}`}>
            <h3
              className={`text-white font-medium leading-[1.05] ${featured ? "text-[2.4rem] md:text-[3rem]" : "text-2xl md:text-[1.9rem]"
                }`}
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {cat.name}
            </h3>

            <p className={`text-white/70 text-xs mt-2 max-w-[90%] ${featured ? "md:text-sm md:max-w-[70%]" : ""}`}>
              {cat.description}
            </p>

            <div className="h-px w-8 bg-[#C8A97A] mt-4 transition-all duration-500 group-hover:w-16" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}