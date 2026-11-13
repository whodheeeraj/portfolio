"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight, FileDown, Mail, Phone } from "lucide-react";
import {
  PersonaProvider,
  PersonaSwitcher,
  usePersona,
} from "@/components/PersonaSwitcher";
import { SocialProofDock } from "@/components/SocialProofDock";
import { BentoPortfolio } from "@/components/BentoPortfolio";
import { ProjectSheet } from "@/components/ProjectSheet";
import { SpotlightBar } from "@/components/SpotlightBar";
import { ICON_STROKE, SOCIAL_ICONS } from "@/components/icons";
import { RESUME_DATA, type Project } from "@/data/resume";
import { CONTACT, MAILTO_URL, SOCIAL_LINKS } from "@/data/links";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

const LAYOUT_SPRING = {
  type: "spring",
  bounce: 0,
  duration: 0.45,
} as const;

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div aria-hidden="true" className="page-aura" />
      <PersonaProvider>
        <PortfolioPage />
      </PersonaProvider>
    </>
  );
}

function PortfolioPage() {
  const { activePersona } = usePersona();
  const reduceMotion = useReducedMotion();
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const openProject = useCallback((project: Project) => {
    setActiveProject(project);
  }, []);

  const closeProject = useCallback(() => {
    setActiveProject(null);
  }, []);
  const persona = RESUME_DATA.personas[activePersona];
  const showSocialProof =
    activePersona === "all" || activePersona === "growth";
  const linkedinUrl =
    SOCIAL_LINKS.find((social) => social.platform === "LinkedIn")?.url ??
    MAILTO_URL;

  const heroEnter = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 10, filter: "blur(3px)" };
  const heroSettled = { opacity: 1, y: 0, filter: "blur(0px)" };
  const heroExit = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: -6, filter: "blur(3px)" };
  const layoutTransition = reduceMotion ? { duration: 0 } : LAYOUT_SPRING;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8 sm:py-6">
        <a
          href="#main"
          aria-label={`${RESUME_DATA.profile.name} — back to top`}
          className="group flex items-center gap-3"
        >
          <Image
            src={CONTACT.photoUrl}
            alt=""
            width={80}
            height={80}
            priority
            className="size-10 shrink-0 rounded-full bg-ink object-cover ring-1 ring-line"
          />
          <span className="flex flex-col">
            <span className="text-[0.84rem] font-semibold tracking-[-0.015em] text-ink">
              {RESUME_DATA.profile.name}
            </span>
            <span className="mt-0.5 font-mono text-[0.55rem] uppercase tracking-[0.15em] text-muted">
              {RESUME_DATA.profile.location}
            </span>
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[0.68rem] text-muted md:flex">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full rounded-full bg-emerald-500/40" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            Open to full-time & freelance
          </span>

          <SpotlightBar
            onOpenProject={openProject}
            sheetOpen={activeProject !== null}
            showTrigger={false}
          />

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-4 py-2 text-[0.74rem]"
          >
            Connect
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </header>

      <div className="flex justify-center px-4">
        <PersonaSwitcher />
      </div>

      <main
        id="main"
        className="mx-auto w-full max-w-6xl flex-1 px-5 pb-10 pt-10 sm:px-8 sm:pt-14"
      >
        <section aria-label="Introduction" className="max-w-4xl">
          <motion.div layout className="grid" transition={layoutTransition}>
            <AnimatePresence initial={false}>
              <motion.div
                key={activePersona}
                initial={heroEnter}
                animate={heroSettled}
                exit={heroExit}
                transition={{
                  duration: reduceMotion ? 0.14 : 0.28,
                  ease: EASE_OUT,
                }}
                className="col-start-1 row-start-1"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="eyebrow text-accent">{persona.badge}</span>
                  <span
                    aria-hidden="true"
                    className="h-px w-8 bg-line-strong"
                  />
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted">
                    {persona.label}
                  </span>
                </div>

                <h1 className="display-title mt-5 text-ink">
                  {persona.headline}
                </h1>

                <p className="lede mt-6 max-w-2xl text-[1.02rem] text-muted sm:text-[1.1rem]">
                  {persona.subheadline}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-2.5">
                  <a href={MAILTO_URL} className="btn-primary">
                    {persona.ctaText}
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  </a>
                  <a href="#work" className="btn-secondary">
                    See the work
                    <ArrowDown aria-hidden="true" className="size-3.5" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </section>

        <motion.dl
          layout
          transition={layoutTransition}
          className="mt-12 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-4"
        >
          <Stat value="3+" label="Years building" />
          <Stat
            value={String(RESUME_DATA.projects.length).padStart(2, "0")}
            label="Production builds"
          />
          <Stat
            value={String(RESUME_DATA.socialPortfolio.length).padStart(2, "0")}
            label="Channels managed"
          />
          <Stat value="Delhi NCR" label="Based in" />
        </motion.dl>

        <AnimatePresence initial={false} mode="popLayout">
          {showSocialProof ? <SocialProofDock key="social-proof" /> : null}
        </AnimatePresence>

        <BentoPortfolio onOpenProject={openProject} />

        <footer
          id="contact"
          className="glass-panel mt-12 p-5 sm:p-8"
          aria-labelledby="contact-heading"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow text-accent">Next step</p>
              <h2 id="contact-heading" className="section-title mt-3">
                Ship the product. Grow the audience.
              </h2>
              <p className="mt-4 max-w-md text-[0.84rem] leading-relaxed text-muted">
                {RESUME_DATA.profile.availability}. Based in{" "}
                {RESUME_DATA.profile.location}, working with teams worldwide.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5">
                <a href={MAILTO_URL} className="link-quiet">
                  <Mail
                    aria-hidden="true"
                    strokeWidth={ICON_STROKE}
                    className="size-3.5"
                  />
                  {CONTACT.email}
                </a>
                <a href={CONTACT.phoneHref} className="link-quiet">
                  <Phone
                    aria-hidden="true"
                    strokeWidth={ICON_STROKE}
                    className="size-3.5"
                  />
                  {CONTACT.phone}
                </a>
                <a
                  href={CONTACT.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-quiet"
                >
                  <FileDown
                    aria-hidden="true"
                    strokeWidth={ICON_STROKE}
                    className="size-3.5"
                  />
                  Résumé
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a href={MAILTO_URL} className="btn-primary">
                {persona.ctaText}
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
              <a href="#main" className="btn-secondary">
                Back to top
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-5">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform];

              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.platform}
                  aria-label={`${social.platform} — ${social.label} (opens in a new tab)`}
                  className="link-quiet"
                >
                  <Icon
                    strokeWidth={ICON_STROKE}
                    className="size-3.5 text-muted"
                  />
                  <span className="font-mono text-[0.68rem] tracking-[0.01em]">
                    {social.label}
                  </span>
                </a>
              );
            })}
            <span className="ml-auto font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted">
              © {RESUME_DATA.profile.name}
            </span>
          </div>
        </footer>
      </main>

      <ProjectSheet project={activeProject} onClose={closeProject} />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col-reverse gap-1">
      <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">
        {label}
      </dt>
      <dd className="font-mono text-[1.4rem] font-medium tabular-nums tracking-[-0.04em] text-ink">
        {value}
      </dd>
    </div>
  );
}
