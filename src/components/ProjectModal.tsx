import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowUpRight } from "lucide-react";

export type Project = {
  title: string;
  tag: string;
  year: string;
  role: string;
  goal?: string;
  description: string;
  highlights: string[];
  tech: string[];
  liveUrl?: string;
};

interface ProjectModalProps {
  project: Project;
  index: number;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  index,
  onClose,
}: ProjectModalProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Panel */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto
            bg-[#0f0f0f] border border-white/[0.08] rounded-2xl pointer-events-auto"
          initial={{ scale: 0.96, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 16 }}
          transition={{
            type: "spring",
            stiffness: 520,
            damping: 36,
            mass: 0.8,
          }}
        >
          {/* Hero zone */}
          <div
            className="relative w-full bg-white/[0.03] border-b border-white/[0.06] rounded-t-2xl"
            style={{ aspectRatio: "16/9" }}
          >
            <span className="absolute top-4 left-4 text-[10px] tracking-[0.3em] uppercase text-white/20">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <h2 className="text-[1.75rem] md:text-[2.25rem] font-[500] text-white tracking-[-0.03em] leading-[0.95] mb-1">
              {project.title}
            </h2>

            <div className="flex items-center gap-4 mb-6 mt-2">
              <span className="text-[11px] tracking-[0.3em] uppercase text-white/30">
                {project.year}
              </span>
              <span className="w-px h-3 bg-white/15" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-white/30">
                {project.role}
              </span>
            </div>

            <p className="text-[14px] md:text-[15px] font-[300] text-white/55 leading-relaxed mb-7">
              {project.description}
            </p>

            {project.goal && (
              <div className="mb-7">
                <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-3">
                  Goal
                </p>
                <p className="text-[13px] font-[300] text-white/50 leading-relaxed">
                  {project.goal}
                </p>
              </div>
            )}

            {project.highlights.length > 0 && (
              <div className="mb-7">
                <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-3">
                  Highlights
                </p>
                <ul className="space-y-2">
                  {project.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2.5 text-[13px] font-[300] text-white/50 leading-snug"
                    >
                      <span className="mt-[5px] shrink-0 w-1 h-1 rounded-full bg-white/25" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.tech.length > 0 && (
              <div className="mb-7">
                <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-3">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] tracking-[0.2em] uppercase px-2.5 py-1
                        rounded-full bg-white/[0.05] border border-white/[0.08] text-white/40"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-5 border-t border-white/[0.06]">
              <span className="text-[10px] tracking-[0.35em] uppercase text-white/25">
                Live Project
              </span>
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.15em]
                    uppercase text-white/50 hover:text-white transition-colors duration-200"
                >
                  View
                  <ArrowUpRight className="size-3.5" />
                </a>
              ) : (
                <span className="text-[12px] tracking-[0.15em] uppercase text-white/20">
                  —
                </span>
              )}
            </div>
          </div>

          {/* Close button */}
          <button
            className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full
              bg-white/[0.06] border border-white/[0.1] text-white/50
              hover:bg-white/[0.12] hover:text-white transition-colors duration-200"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </motion.div>
      </motion.div>
    </>
  );
}

export { AnimatePresence };
