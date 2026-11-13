"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { RESUME_DATA } from "@/data/resume";
import { ICON_STROKE, PLATFORM_ICONS } from "@/components/icons";

const SHIFT_SPRING = {
  type: "spring",
  bounce: 0,
  duration: 0.45,
} as const;

const TAP_SPRING = {
  type: "spring",
  bounce: 0,
  duration: 0.25,
} as const;

export function SocialProofDock() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      layout
      aria-labelledby="social-proof-heading"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              y: -8,
              transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
            }
      }
      transition={reduceMotion ? { duration: 0.15 } : SHIFT_SPRING}
      className="mt-12"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-accent">Social proof</p>
          <h2
            id="social-proof-heading"
            className="mt-3 text-[1.7rem] font-semibold leading-[1.06] tracking-[-0.032em] text-ink sm:text-[2.1rem]"
          >
            Channels I run, not just list.
          </h2>
        </div>
        <p className="max-w-sm text-[0.82rem] leading-relaxed text-muted">
          End-to-end ownership: content systems, search visibility, community,
          and the reporting loop that keeps them compounding.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {RESUME_DATA.socialPortfolio.map((channel) => {
          const PlatformIcon = PLATFORM_ICONS[channel.platform];

          return (
            <motion.a
              key={channel.id}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${channel.platform} — ${channel.handle} (opens in a new tab)`}
              whileTap={{ scale: 0.97 }}
              transition={TAP_SPRING}
              className="glass-panel card-hover group flex h-full flex-col gap-4 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl border border-line bg-ink/[0.04] text-ink">
                  <PlatformIcon
                    strokeWidth={ICON_STROKE}
                    className="size-[1.05rem]"
                  />
                </span>
                <span className="flex items-center gap-1.5 pt-1">
                  <span className="eyebrow text-[0.55rem] text-muted">
                    Managed
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    strokeWidth={ICON_STROKE}
                    className="size-3.5 text-muted transition-colors duration-200 group-hover:text-accent"
                  />
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold tracking-[-0.012em] text-ink">
                  {channel.platform}
                </p>
                <p className="mt-0.5 font-mono text-[0.68rem] tracking-[0.01em] text-muted">
                  {channel.handle}
                </p>
              </div>

              <div>
                <p className="text-[0.78rem] leading-relaxed text-ink/75">
                  {channel.metrics}
                </p>
                <p className="mt-2 text-[0.68rem] leading-snug text-muted">
                  {channel.niche}
                </p>
              </div>

              <p className="mt-auto border-t border-line pt-3 text-[0.7rem] leading-snug text-muted">
                {channel.role}
              </p>
            </motion.a>
          );
        })}
      </div>
    </motion.section>
  );
}
