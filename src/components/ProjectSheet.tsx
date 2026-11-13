"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import { RESUME_DATA, type Project } from "@/data/resume";
import {
  CATEGORY_ICONS,
  GithubIcon,
  ICON_STROKE,
} from "@/components/icons";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

const ENTER_SPRING = {
  type: "spring",
  bounce: 0.16,
  duration: 0.46,
} as const;

const SETTLE_SPRING = {
  type: "spring",
  bounce: 0.18,
  duration: 0.42,
} as const;

// Apple's exponential-decay projection. At 0.998 a 1,000px/s flick throws the
// sheet roughly 500px, so a short gesture can still dismiss it.
const DECELERATION_RATE = 0.998;

const VELOCITY_WINDOW_MS = 110;
const DISMISS_FRACTION = 0.45;

function projectMomentum(velocity: number) {
  return (
    (velocity / 1000) * (DECELERATION_RATE / (1 - DECELERATION_RATE))
  );
}

function rubberband(overshoot: number, dimension: number) {
  const constant = 0.55;
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  );
}

interface ProjectSheetProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectSheet({ project, onClose }: ProjectSheetProps) {
  // The sheet mounts only after a card is chosen, so the portal target is
  // already available. The static render has no project and stays null.
  if (!project || typeof document === "undefined") return null;

  return createPortal(
    <Sheet key={project.id} project={project} onClosed={onClose} />,
    document.body,
  );
}

function Sheet({
  project,
  onClosed,
}: {
  project: Project;
  onClosed: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const y = useMotionValue(0);
  const scrimOpacity = useMotionValue(0);
  const closingRef = useRef(false);
  const onClosedRef = useRef(onClosed);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startY: number;
    history: { y: number; t: number }[];
  } | null>(null);

  const CategoryIcon = CATEGORY_ICONS[project.category];
  const personaLabels = project.personas
    .filter((persona) => persona !== "all")
    .map((persona) => RESUME_DATA.personas[persona].label);
  const links = [
    project.links.live
      ? { label: "Live", href: project.links.live, primary: true, repo: false }
      : null,
    project.links.github
      ? {
          label: "GitHub",
          href: project.links.github,
          primary: false,
          repo: true,
        }
      : null,
    project.links.caseStudy
      ? {
          label: "Case study",
          href: project.links.caseStudy,
          primary: false,
          repo: false,
        }
      : null,
  ].filter(
    (
      link,
    ): link is {
      label: string;
      href: string;
      primary: boolean;
      repo: boolean;
    } => link !== null,
  );

  useEffect(() => {
    onClosedRef.current = onClosed;
  }, [onClosed]);

  const close = useCallback(
    (velocity = 0) => {
      if (closingRef.current) return;
      closingRef.current = true;

      const height = panelRef.current?.offsetHeight ?? 560;

      const fade = animate(scrimOpacity, 0, {
        duration: reduceMotion ? 0.12 : 0.18,
        ease: EASE_OUT,
      });

      if (reduceMotion) {
        y.set(height + 80);
        fade.finished.then(() => onClosedRef.current());
        return;
      }

      // Reuse the release velocity so a flick leaves with the hand, while a
      // slow drag still exits promptly instead of drifting.
      animate(y, height + 80, {
        type: "spring",
        bounce: 0,
        duration: 0.26,
        velocity: Math.max(velocity, 0),
      })
        .finished.then(() => onClosedRef.current());
    },
    [reduceMotion, scrimOpacity, y],
  );

  // Entrance runs before paint so there is no flash at y: 0.
  useLayoutEffect(() => {
    const height = panelRef.current?.offsetHeight ?? 560;

    if (reduceMotion) {
      y.set(0);
      animate(scrimOpacity, 1, { duration: 0.14, ease: EASE_OUT });
      return;
    }

    y.set(height + 32);
    const entrance = animate(y, 0, ENTER_SPRING);
    const fade = animate(scrimOpacity, 1, { duration: 0.22, ease: EASE_OUT });

    return () => {
      entrance.stop();
      fade.stop();
    };
  }, [reduceMotion, scrimOpacity, y]);

  // Lock the page without letting the scrollbar disappearance shift layout.
  useEffect(() => {
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarGap > 0) body.style.paddingRight = `${scrollbarGap}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  // Focus moves into the sheet, stays there, and returns to the card on close.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(0);
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => node.offsetParent !== null);

      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first || document.activeElement === panel) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);

      // The originating card is the natural return point. If the brief was
      // opened from the palette, that input is already gone, so fall back to
      // the project's card (or the first card when the current lens hides it).
      const returnTarget =
        previousFocus && previousFocus.isConnected
          ? previousFocus
          : (document.querySelector<HTMLElement>(
              `[data-project-trigger="${project.id}"]`,
            ) ?? document.querySelector<HTMLElement>("[data-project-trigger]"));

      returnTarget?.focus({ preventScroll: true });
    };
  }, [close, project.id]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (closingRef.current) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, [data-no-drag]")) return;

    // Grabbing mid-animation takes over from the live value, not the target.
    y.stop();

    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      history: [{ y: event.clientY, t: performance.now() }],
    };

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Capture can fail for synthetic pointers; tracking still works while
      // the pointer stays over the header.
    }
    setDragging(true);
    event.preventDefault();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const height = panelRef.current?.offsetHeight ?? 560;
    const rawOffset = event.clientY - drag.startY;
    const offset =
      rawOffset < 0
        ? -rubberband(-rawOffset, height)
        : rawOffset;

    y.set(offset);

    const now = performance.now();
    drag.history.push({ y: event.clientY, t: now });
    drag.history = drag.history.filter(
      (sample) => now - sample.t <= VELOCITY_WINDOW_MS,
    );
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>, cancelled = false) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const height = panelRef.current?.offsetHeight ?? 560;
    const current = y.get();

    if (cancelled) {
      animate(y, 0, SETTLE_SPRING);
      return;
    }

    const now = performance.now();
    drag.history.push({ y: event.clientY, t: now });
    const recent = drag.history.filter(
      (sample) => now - sample.t <= VELOCITY_WINDOW_MS,
    );
    const first = recent[0] ?? drag.history[0];
    const last = recent[recent.length - 1] ?? drag.history[drag.history.length - 1];
    const elapsed = last.t - first.t;
    // A sub-frame gap can turn a tiny movement into a huge velocity spike.
    const rawVelocity =
      elapsed >= 16 ? ((last.y - first.y) / elapsed) * 1000 : 0;
    const velocity = Math.max(-6000, Math.min(6000, rawVelocity));

    const projected = current + projectMomentum(velocity);

    if (projected > height * DISMISS_FRACTION) {
      close(velocity);
      return;
    }

    animate(y, 0, { ...SETTLE_SPRING, velocity });
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <motion.div
        aria-hidden="true"
        style={{ opacity: scrimOpacity }}
        className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) close(0);
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center sm:p-5">
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-sheet-title"
          tabIndex={-1}
          style={{ y }}
          className="glass-panel glass-sheet pointer-events-auto flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.9rem] pb-[env(safe-area-inset-bottom)] outline-none will-change-transform sm:max-h-[86dvh] sm:rounded-[1.9rem]"
        >
          <div
            data-drag-handle
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(event) => endDrag(event)}
            onPointerCancel={(event) => endDrag(event, true)}
            className={`shrink-0 touch-none select-none px-5 pt-3 sm:px-8 ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-ink/20" />

            <div className="mt-4 flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-1">
                <CategoryIcon
                  aria-hidden="true"
                  strokeWidth={ICON_STROKE}
                  className="size-3 text-accent"
                />
                <span className="eyebrow text-[0.55rem] text-accent">
                  {project.category}
                </span>
              </span>

              <button
                type="button"
                onClick={() => close(0)}
                aria-label="Close project brief"
                className="flex items-center gap-1.5 rounded-full border border-line bg-ink/[0.03] px-3 py-1.5 text-[0.68rem] font-medium text-muted transition-colors duration-150 hover:border-line-strong hover:text-ink"
              >
                <X aria-hidden="true" strokeWidth={ICON_STROKE} className="size-3.5" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>

            <h2
              id="project-sheet-title"
              className="mt-4 text-[1.75rem] font-semibold leading-[1.04] tracking-[-0.038em] text-ink sm:text-[2.15rem]"
            >
              {project.title}
            </h2>
            <p className="mt-2 text-[0.84rem] leading-snug text-muted">
              {project.tagline}
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-5 sm:px-8">
            <p className="max-w-[62ch] text-[0.9rem] leading-relaxed text-ink/80">
              {project.summary}
            </p>

            <div className="mt-6 rounded-2xl border border-line bg-ink/[0.03] p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  aria-hidden="true"
                  strokeWidth={ICON_STROKE}
                  className="size-4 text-accent"
                />
                <span className="eyebrow text-[0.55rem] text-muted">Outcome</span>
              </div>
              <p className="mt-2 text-[0.84rem] leading-relaxed text-ink/80">
                {project.metrics}
              </p>
            </div>

            <div className="mt-6">
              <p className="eyebrow text-[0.55rem] text-muted">Stack</p>
              <ul
                aria-label={`${project.title} technologies`}
                className="mt-2.5 flex flex-wrap gap-1.5"
              >
                {project.techStack.map((tech) => (
                  <li key={tech}>
                    <span className="chip">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            {links.length > 0 ? (
              <div className="mt-7 flex flex-wrap items-center gap-2.5">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} — ${link.label} (opens in a new tab)`}
                    className={`${
                      link.primary ? "btn-primary" : "btn-secondary"
                    } px-4 py-2 text-[0.76rem]`}
                  >
                    {link.repo ? (
                      <GithubIcon
                        strokeWidth={ICON_STROKE}
                        className="size-3.5"
                      />
                    ) : (
                      <ArrowUpRight
                        aria-hidden="true"
                        strokeWidth={ICON_STROKE}
                        className="size-3.5"
                      />
                    )}
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-7 text-[0.7rem] text-muted">
                Architecture walkthrough available on request.
              </p>
            )}

            {personaLabels.length > 0 ? (
              <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <span className="eyebrow text-[0.52rem] text-muted">
                  Fits the lens
                </span>
                {personaLabels.map((label) => (
                  <span key={label} className="chip">
                    {label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
