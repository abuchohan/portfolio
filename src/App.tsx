import "./App.css";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Silk from "./components/Silk";
import ProjectModal, { type Project } from "./components/ProjectModal";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const projectsContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const projectItem = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const projects: Project[] = [
  {
    title: "Norma AI",
    tag: "Full Stack",
    year: "2024",
    role: "Full Stack Developer",
    goal: "To reduce the friction between capturing ideas and acting on them — by turning raw voice notes into structured, actionable tasks automatically using AI.",
    description:
      "A full-stack app that turns voice recordings into organized tasks. Record a note, and an AI pipeline transcribes it with Whisper, analyzes it with GPT, and breaks it down into tasks and subtasks — all stored and ready to act on.",
    highlights: [
      "Async AI pipeline: S3 upload → Whisper transcription → GPT task extraction",
      "Real-time status tracking from Pending through Processing to Done",
      "Session-based auth with httpOnly cookies and 3-day session persistence",
      "Monorepo architecture with Turborepo across React client and Express server",
    ],
    tech: [
      "React 19",
      "TypeScript",
      "Express 5",
      "PostgreSQL",
      "Prisma",
      "OpenAI Whisper",
      "GPT",
      "AWS S3",
      "Redux Toolkit",
      "Tailwind CSS 4",
    ],
    liveUrl: "https://norma.abuchohan.co.uk",
    imageUrl: "/norma.png",
  },
  {
    title: "Spring Board",
    tag: "Full Stack",
    year: "2025",
    role: "Full Stack Developer",
    goal: "To eliminate the repetitive setup work that slows down every new project — by providing a production-ready monorepo foundation with auth, routing, and database wiring already in place.",
    description:
      "A full-stack monorepo starter template for rapid project bootstrapping. Ships with session-based authentication, password reset via email, a protected dashboard, and a React frontend — so you skip the scaffolding and go straight to building.",
    highlights: [
      "Turborepo monorepo with shared TypeScript config across React client and Express server",
      "Session-based auth with login, registration, logout, and 15-minute password-reset tokens via email",
      "Protected dashboard and profile pages with Redux auth state and route guards",
      "Prisma + PostgreSQL with User, Session, and PasswordReset models",
    ],
    tech: [
      "React 19",
      "TypeScript",
      "Express 5",
      "PostgreSQL",
      "Prisma",
      "Turborepo",
      "pnpm Workspaces",
      "Redux Toolkit",
      "Tailwind CSS 4",
      "React Router 7",
      "Zod",
    ],
    liveUrl: "https://github.com/abuchohan/spring-board",
    imageUrl: "/springboard.png",
  },
  {
    title: "URL Shortener",
    tag: "Full Stack",
    year: "2024",
    role: "Full Stack Developer",
    goal: "To build a clean, fast URL shortening service with a focus on simplicity — minimal UI, instant redirects, and persistent link history.",
    description:
      "A full-stack URL shortening app. Paste a long URL, get a short code back, and track all your created links in a table. Built with Next.js 15 on the client and an Express API backed by PostgreSQL.",
    highlights: [
      "Short code generation with uniqueness enforced at the database level",
      "Server actions for form submission with optimistic UI updates",
      "REST API with Express handling redirect resolution and link creation",
      "PostgreSQL via Prisma storing original URLs, short codes, and creation timestamps",
    ],
    tech: [
      "Next.js 15",
      "TypeScript",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Tailwind CSS",
    ],
    liveUrl: undefined,
    imageUrl: "/url-shortner.png",
  },
  {
    title: "Arc UI",
    tag: "Design System",
    year: "2025",
    role: "Senior Software Engineer",
    goal: "To establish a single source of truth for BT Enterprise's design language — enabling product teams across BT, BT Business, and EE to build consistently branded, accessible web interfaces without reinventing components from scratch.",
    description:
      "The UI system powering BT Enterprise digital products. Arc is a collection of React components and design tokens that give teams a shared foundation for building high-quality web interfaces at scale across BT's product portfolio.",
    highlights: [
      "Multi-theme architecture supporting BT, BT Business, and EE brands from a single component library",
      "Design tokens published in CSS, JavaScript, JSON, and SCSS formats for maximum flexibility",
      "React component library published as versioned npm packages under @arc-ui",
      "Storybook-driven development with a dedicated community Storybook for extended contributions",
      "V12 migration with comprehensive breaking-change documentation and migration guides",
    ],
    tech: [
      "React",
      "TypeScript",
      "Design Tokens",
      "Storybook",
      "npm",
      "CSS Custom Properties",
      "SCSS",
      "Docusaurus",
    ],
    liveUrl: "https://ui.digital-ent-int.bt.com/latest/docs/intro",
    imageUrl: "/arc.png",
  },
];

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }, 500);
  };
  return (
    <motion.div
      variants={projectItem}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="group block cursor-pointer"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail */}
      <div
        className="relative w-full overflow-hidden rounded-sm mb-3 border border-white/[0.08]
        transition-colors duration-500 group-hover:border-white/[0.18]"
        style={{ aspectRatio: "16/9" }}
      >
        {/* Placeholder — always visible, fades out on hover when video exists */}
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out
            ${project.videoUrl ? "group-hover:opacity-0 group-hover:delay-500" : ""}`}
          />
        ) : (
          <div
            className={`absolute inset-0 bg-white/[0.03] transition-opacity duration-500 ease-out
            ${project.videoUrl ? "group-hover:opacity-0 group-hover:delay-500" : ""}`}
          />
        )}

        {/* Video — hidden until hover */}
        {project.videoUrl && (
          <video
            ref={videoRef}
            src={project.videoUrl}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover
            opacity-0 transition-opacity duration-500 ease-out
            group-hover:opacity-100 group-hover:delay-500 "
          />
        )}

        {/* Overlay scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Corner index */}
        <span
          className="absolute top-4 left-4 text-[10px] tracking-[0.3em] uppercase text-white/20
          transition-opacity duration-300 group-hover:text-white/50 z-10"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Hover arrow */}
        <div
          className="absolute bottom-4 right-4 opacity-0 translate-y-1
          group-hover:opacity-100 group-hover:translate-y-0
          transition-all duration-300 ease-out z-10"
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full
            bg-white/10 border border-white/20 backdrop-blur-sm"
          >
            <ArrowUpRight className="size-3.5 text-white" />
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="flex items-center justify-between px-0.5">
        <h3
          className="text-[15px] font-[400] text-white/80 tracking-[-0.01em]
          transition-colors duration-300 group-hover:text-white"
        >
          {project.title}
        </h3>
        <ArrowUpRight
          className="size-3.5 text-white/20 -translate-x-1 opacity-0
          group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-300 ease-out"
        />
      </div>
    </motion.div>
  );
}

function App() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFooterRevealed = useInView(sentinelRef, {
    once: true,
    margin: "0px",
  });

  return (
    <>
      {/* ── Footer (fixed, sits behind page content) ── */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-0 bg-[#f0ede8] px-10 md:px-16 lg:px-20 pt-14 pb-10"
        style={{ height: "22rem" }}
      >
        <div className="max-w-[1440px] mx-auto w-full h-full flex flex-col justify-between">
          <motion.div
            className="flex flex-col gap-4"
            variants={container}
            initial="hidden"
            animate={isFooterRevealed ? "show" : "hidden"}
          >
            <motion.h2
              variants={item}
              className="text-[clamp(2.5rem,6vw,5rem)] font-[500] text-[#1a1a1a] tracking-[-0.03em] leading-[0.92]"
            >
              Ready to work?
            </motion.h2>
            <motion.a
              variants={item}
              href="mailto:abuchohan@hotmail.co.uk"
              className="group inline-flex items-center gap-2 text-[clamp(1.5rem,3vw,2.5rem)] font-[500] tracking-[-0.02em] text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors duration-300 leading-none"
            >
              abuchohan@hotmail.co.uk
              <ArrowUpRight className="size-6 md:size-8 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.a>
          </motion.div>
          <motion.div
            className="flex items-end justify-between"
            variants={item}
            initial="hidden"
            animate={isFooterRevealed ? "show" : "hidden"}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#1a1a1a]/35">
              Abu Chohan
            </p>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#1a1a1a]/35">
              © {new Date().getFullYear()}
            </p>
          </motion.div>
        </div>
      </footer>

      {/* ── Page content (scrolls over footer) ── */}
      <div className="relative z-10 dark bg-[#080808]">
        {/* ── Hero ── */}
        <section className="relative w-full h-screen bg-[#080808] overflow-hidden">
          <div className="absolute inset-0">
            <Silk
              speed={4.7}
              scale={1.4}
              color="#002ee6"
              noiseIntensity={1.9}
              rotation={2}
            />
          </div>

          {/* Scrim fade to projects section */}
          <div
            className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-20"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, #080808 100%)",
            }}
          />

          <motion.div
            className="relative z-30 flex flex-col justify-end h-full px-10 md:px-16 lg:px-20 pb-12 md:pb-16"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="mb-6">
              <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.35em] uppercase text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
                Available for work
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-[clamp(5rem,12vw,13rem)] font-[500] text-white tracking-[-0.03em] leading-[0.92] select-none"
            >
              Abu
            </motion.h1>
            <motion.h1
              variants={item}
              className="text-[clamp(5rem,12vw,13rem)] font-[500] text-white tracking-[-0.03em] leading-[0.92] select-none mb-6"
            >
              Chohan
            </motion.h1>

            <motion.p
              variants={item}
              className="text-[13px] font-[250] tracking-[0.3em] uppercase text-white/45 mb-3"
            >
              Full Stack Developer
            </motion.p>

            <motion.p
              variants={item}
              className="text-[15px] md:text-[17px] font-[250] text-white/60 max-w-sm leading-relaxed mb-8"
            >
              There's no better time than now to be a full stack developer.
            </motion.p>

            <motion.div variants={item} className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white backdrop-blur-sm rounded-full"
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View Work
              </Button>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-full gap-1.5"
                onClick={() =>
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  })
                }
              >
                Contact
                <ArrowRight className="size-3.5" />
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Projects ── */}
        <section
          id="projects"
          className="bg-[#080808] px-10 md:px-16 lg:px-20 pt-24 pb-32"
        >
          <div className="max-w-[1440px] mx-auto w-full">
            {/* Section header */}
            <motion.div
              className="flex items-end justify-between mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div>
                <p className="text-[11px] tracking-[0.35em] uppercase text-white/30 mb-3">
                  Selected Work
                </p>
                <h2 className="text-[2.5rem] md:text-[3.5rem] font-[500] text-white tracking-[-0.03em] leading-[0.92]">
                  Projects
                </h2>
              </div>
              <p className="text-[12px] tracking-[0.25em] uppercase text-white/25 hidden md:block">
                {projects.length} works
              </p>
            </motion.div>

            {/* Cards grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
              variants={projectsContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
            >
              {projects.map((project, i) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={i}
                  onClick={() => setSelectedProject(i)}
                />
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      {/* Transparent spacer — creates scroll depth to reveal the fixed footer.
          The footer (z-0) shows through this because it has no background. */}
      <div ref={sentinelRef} className="h-[22rem]" />

      {/* Project modal */}
      <AnimatePresence>
        {selectedProject !== null && (
          <ProjectModal
            key={selectedProject}
            project={projects[selectedProject]}
            index={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
