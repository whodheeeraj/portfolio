"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  RESUME_DATA,
  type PersonaId,
  type Project,
} from "@/data/resume";
import { usePersona } from "@/components/PersonaSwitcher";
import { CATEGORY_ICONS, ICON_STROKE } from "@/components/icons";
import { cn } from "@/lib/utils";

const LAYOUT_SPRING = {
  type: "spring",
  bounce: 0,
  duration: 0.45,
} as const;

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

type SkillKey = keyof typeof RESUME_DATA.skills;

const SKILL_GROUPS: { key: SkillKey; title: string }[] = [
  { key: "growthAndSocial", title: "Growth & social" },
  { key: "projectAndNoCode", title: "Delivery & automation" },
  { key: "aiAndEngineering", title: "AI & engineering" },
  { key: "cloudAndDevops", title: "Cloud & DevOps" },
];

const PERSONA_SKILLS: Record<PersonaId, SkillKey[]> = {
  all: [
    "growthAndSocial",
    "projectAndNoCode",
    "aiAndEngineering",
    "cloudAndDevops",
  ],
  engineering: ["aiAndEngineering", "cloudAndDevops"],
  growth: ["growthAndSocial", "projectAndNoCode"],
  "cloud-pm": ["projectAndNoCode", "cloudAndDevops"],
};

const WORK_COPY: Record<PersonaId, { title: string; note: string }> = {
  all: {
    title: "One operator, the whole stack.",
    note: "Product, AI, growth, and delivery in the same body of work. Switch the lens to narrow the cut.",
  },
  engineering: {
    title: "Systems built to ship.",
    note: "Production AI agents, full-stack products, and the cloud plumbing underneath them.",
  },
  growth: {
    title: "Growth systems with a feedback loop.",
    note: "Channels, search, and AI-assisted content pipelines designed to compound instead of spike.",
  },
  "cloud-pm": {
    title: "Delivered end to end.",
    note: "Architecture, cloud deployment, and stakeholder delivery from zero to production.",
  },
};

function belongsToPersona(personas: PersonaId[], active: PersonaId) {
  return active === "all" || personas.includes(active);
}

export function BentoPortfolio({
  onOpenProject,
}: {
  onOpenProject: (project: Project) => void;
}) {
  const { activePersona } = usePersona();
  const reduceMotion = useReducedMotion();

  const projects = RESUME_DATA.projects.filter((project) =>
    belongsToPersona(project.personas, activePersona),
  );
  const experience = RESUME_DATA.experience.filter((role) =>
    belongsToPersona(role.personas, activePersona),
  );
  const skillKeys = PERSONA_SKILLS[activePersona];
  const skillGroups = SKILL_GROUPS.filter((group) =>
    skillKeys.includes(group.key),
  );
  const copy = WORK_COPY[activePersona];

  const enter = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 14, scale: 0.985 };
  const settled = { opacity: 1, y: 0, scale: 1 };
  const leave = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: -8, scale: 0.985 };
  const cardTransition = reduceMotion
    ? { duration: 0.18, ease: EASE_OUT }
    : LAYOUT_SPRING;
  const layoutTransition = reduceMotion ? { duration: 0 } : LAYOUT_SPRING;

  return (
    <motion.div
      layout
      className="mt-12 space-y-4"
      transition={layoutTransition}
    >
      <section id="work" aria-labelledby="work-heading" className="scroll-mt-28">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-accent">Selected work</p>
            <h2 id="work-heading" className="section-title mt-3">
              {copy.title}
            </h2>
          </div>
          <p className="max-w-sm text-[0.82rem] leading-relaxed text-muted">
            {copy.note}
          </p>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12"
          transition={layoutTransition}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {projects.map((project, index) => {
              const isWide = index >= 5;
              const CategoryIcon = CATEGORY_ICONS[project.category];

              return (
                <motion.article
                  layout
                  key={project.id}
                  initial={enter}
                  animate={settled}
                  exit={leave}
                  transition={cardTransition}
                  className={cn(
                    "glass-panel card-hover group relative flex h-full cursor-pointer flex-col p-5 sm:p-6",
                    // Bento rhythm: two wide cards, three compact cards, one
                    // full-width anchor. Fills cleanly for 2, 5, or 6 projects.
                    index < 2 && "lg:col-span-6",
                    index >= 2 && index < 5 && "lg:col-span-4",
                    isWide &&
                      "lg:col-span-12 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-x-10",
                    index === 0 && "glass-panel--featured",
                  )}
                >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-1">
                    <CategoryIcon
                      aria-hidden="true"
                      strokeWidth={ICON_STROKE}
                      className="size-3 text-accent"
                    />
                    <span className="font-mono text-[0.58rem] font-medium uppercase tracking-[0.12em] text-accent">
                      {project.category}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[0.62rem] tabular-nums text-muted">
                    {String(index + 1).padStart(2, "0")}
                    <ArrowUpRight
                      aria-hidden="true"
                      strokeWidth={ICON_STROKE}
                      className="size-3 opacity-0 transition-opacity duration-200 group-hover:opacity-60"
                    />
                  </span>
                </div>

                <h3
                  className={cn(
                    "card-title mt-5 font-semibold text-ink",
                    index === 0
                      ? "text-[1.65rem] sm:text-[2.1rem]"
                      : isWide
                        ? "text-2xl"
                        : "text-xl",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onOpenProject(project)}
                    aria-label={`Open ${project.title} project brief`}
                    data-project-trigger={project.id}
                    className="text-left outline-none after:absolute after:inset-0 after:rounded-[1.75rem] after:content-[''] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent"
                  >
                    {project.title}
                  </button>
                </h3>
                <p className="mt-2 text-[0.82rem] leading-snug text-muted">
                  {project.tagline}
                </p>
                <p className="mt-4 max-w-[52ch] text-[0.82rem] leading-relaxed text-ink/75">
                  {project.summary}
                </p>

                <div
                  className={cn(
                    "mt-auto pt-5",
                    isWide &&
                      "lg:col-start-2 lg:row-span-5 lg:row-start-1 lg:mt-0 lg:self-center lg:pt-0",
                  )}
                >
                  <div className="rounded-xl border border-line bg-ink/[0.025] p-3">
                    <p className="eyebrow text-[0.52rem] text-muted">Outcome</p>
                    <p className="mt-1 text-[0.76rem] leading-relaxed text-ink/80">
                      {project.metrics}
                    </p>
                  </div>

                  <ul
                    aria-label={`${project.title} technologies`}
                    className="mt-3 flex flex-wrap gap-1.5"
                  >
                    {project.techStack
                      .slice(0, index === 0 ? 6 : 4)
                      .map((tech) => (
                        <li key={tech}>
                          <span className="chip">{tech}</span>
                        </li>
                      ))}
                  </ul>

                  <ProjectLinks project={project} />
                </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <motion.section
          layout
          aria-labelledby="experience-heading"
          transition={layoutTransition}
          className="glass-panel p-5 sm:p-7 lg:col-span-7"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-accent">Track record</p>
              <h2
                id="experience-heading"
                className="mt-3 text-[1.75rem] font-semibold leading-[1.06] tracking-[-0.032em] text-ink sm:text-[2rem]"
              >
                Where I&apos;ve shipped.
              </h2>
            </div>
            <span className="font-mono text-[0.62rem] tabular-nums text-muted">
              {String(experience.length).padStart(2, "0")}
            </span>
          </div>

          <motion.ol
            layout
            transition={layoutTransition}
            className="mt-7 space-y-6"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {experience.map((role) => (
                <motion.li
                  layout
                  key={role.id}
                  initial={enter}
                  animate={settled}
                  exit={leave}
                  transition={cardTransition}
                  className="relative border-l border-line pl-5"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-[3.5px] top-1.5 size-[7px] rounded-full bg-accent ring-[3px] ring-paper"
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="text-[0.95rem] font-semibold leading-snug tracking-[-0.015em] text-ink">
                      {role.role}
                    </h3>
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted">
                      {role.period}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[0.8rem] text-muted">
                    {role.company}
                  </p>

                  <ul className="mt-3 space-y-2">
                    {role.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex gap-2 text-[0.79rem] leading-relaxed text-ink/75"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-ink/30"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <ul
                    aria-label={`${role.company} stack`}
                    className="mt-3 flex flex-wrap gap-1.5"
                  >
                    {role.stack.map((item) => (
                      <li key={item}>
                        <span className="chip">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ol>
        </motion.section>

        <motion.section
          layout
          aria-labelledby="skills-heading"
          transition={layoutTransition}
          className="glass-panel flex flex-col p-5 sm:p-7 lg:col-span-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-accent">Toolkit</p>
              <h2
                id="skills-heading"
                className="mt-3 text-[1.75rem] font-semibold leading-[1.06] tracking-[-0.032em] text-ink sm:text-[2rem]"
              >
                What I bring.
              </h2>
            </div>
            <span className="font-mono text-[0.62rem] tabular-nums text-muted">
              {String(
                skillGroups.reduce(
                  (total, group) =>
                    total + RESUME_DATA.skills[group.key].length,
                  0,
                ),
              ).padStart(2, "0")}
            </span>
          </div>

          <motion.div
            layout
            transition={layoutTransition}
            className="mt-7 space-y-5"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {skillGroups.map((group) => {
                const items = RESUME_DATA.skills[group.key];

                return (
                  <motion.div
                    layout
                    key={group.key}
                    initial={enter}
                    animate={settled}
                    exit={leave}
                    transition={cardTransition}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[0.66rem] font-medium uppercase tracking-[0.14em] text-muted">
                        {group.title}
                      </h3>
                      <span className="font-mono text-[0.58rem] tabular-nums text-muted">
                        {String(items.length).padStart(2, "0")}
                      </span>
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {items.map((skill) => (
                        <li key={skill}>
                          <span className="chip">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          <div className="mt-auto border-t border-line pt-5 lg:pt-6">
            <p className="eyebrow text-[0.52rem] text-muted">Availability</p>
            <p className="mt-1.5 text-[0.78rem] leading-relaxed text-ink/75">
              {RESUME_DATA.profile.availability}
            </p>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  const links = [
    project.links.live ? { label: "Live", href: project.links.live } : null,
    project.links.github
      ? { label: "GitHub", href: project.links.github }
      : null,
    project.links.caseStudy
      ? { label: "Case study", href: project.links.caseStudy }
      : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  if (links.length === 0) {
    return (
      <p className="mt-4 text-[0.66rem] tracking-[0.01em] text-muted">
        Architecture walkthrough available on request.
      </p>
    );
  }

  return (
    <div className="relative z-10 mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} — ${link.label} (opens in a new tab)`}
          className="link-quiet"
        >
          {link.label}
          <ArrowUpRight aria-hidden="true" className="size-3" />
        </a>
      ))}
    </div>
  );
}
