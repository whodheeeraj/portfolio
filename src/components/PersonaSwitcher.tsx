"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { RESUME_DATA, type PersonaId } from "@/data/resume";
import { cn } from "@/lib/utils";

const PERSONA_ORDER: PersonaId[] = [
  "all",
  "engineering",
  "growth",
  "cloud-pm",
];

const SHORT_LABEL: Record<PersonaId, string> = {
  all: "Overview",
  engineering: "Engineering",
  growth: "Growth",
  "cloud-pm": "Cloud & PM",
};

const PILL_SPRING = {
  type: "spring",
  bounce: 0,
  duration: 0.4,
} as const;

interface PersonaContextValue {
  activePersona: PersonaId;
  setPersona: (persona: PersonaId) => void;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

function isPersonaId(value: string | null): value is PersonaId {
  return value !== null && PERSONA_ORDER.includes(value as PersonaId);
}

function getPersonaFromParam(value: string | null): PersonaId {
  return isPersonaId(value) ? value : "all";
}

const noop = () => {};

export function usePersona() {
  const context = useContext(PersonaContext);

  if (!context) {
    throw new Error("usePersona must be used inside <PersonaProvider>.");
  }

  return context;
}

/**
 * The URL-backed persona store is wrapped in Suspense because it reads
 * useSearchParams. The fallback still renders the full page with the default
 * persona, so the static shell is never blank.
 */
export function PersonaProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <PersonaContext.Provider
          value={{ activePersona: "all", setPersona: noop }}
        >
          {children}
        </PersonaContext.Provider>
      }
    >
      <PersonaFromUrl>{children}</PersonaFromUrl>
    </Suspense>
  );
}

function PersonaFromUrl({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const urlPersona = getPersonaFromParam(searchParams.get("persona"));
  // Read once for the initial view; the switcher owns the live value afterwards
  // so a URL write never forces a second render.
  const [activePersona, setActivePersona] = useState<PersonaId>(urlPersona);

  const setPersona = useCallback((persona: PersonaId) => {
    setActivePersona(persona);

    const url = new URL(window.location.href);
    if (persona === "all") {
      url.searchParams.delete("persona");
    } else {
      url.searchParams.set("persona", persona);
    }

    // Native History API is integrated with the App Router, so
    // useSearchParams updates without a server round trip.
    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, []);

  const value = useMemo(
    () => ({ activePersona, setPersona }),
    [activePersona, setPersona],
  );

  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
}

export function PersonaSwitcher({ className }: { className?: string }) {
  const { activePersona, setPersona } = usePersona();
  const reduceMotion = useReducedMotion();
  const groupRef = useRef<HTMLDivElement | null>(null);
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);

  // On narrow screens the control scrolls horizontally; keep the active
  // segment centered when the page loads from a shared ?persona= link.
  useEffect(() => {
    const group = groupRef.current;
    const button = activeButtonRef.current;

    if (!group || !button) return;

    const groupRect = group.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    group.scrollLeft +=
      buttonRect.left -
      groupRect.left -
      (group.clientWidth - button.clientWidth) / 2;
  }, [activePersona]);

  return (
    <div
      className={cn(
        "flex w-full max-w-[calc(100vw-2rem)] flex-col items-center sm:w-auto",
        className,
      )}
    >
      <div className="glass-pill flex max-w-full items-center gap-0.5 rounded-full p-1">
        <div
          ref={groupRef}
          role="group"
          aria-label="Choose a persona lens"
          className="no-scrollbar flex min-w-0 items-center gap-0.5 overflow-x-auto"
        >
          {PERSONA_ORDER.map((persona) => {
            const active = persona === activePersona;
            const config = RESUME_DATA.personas[persona];

            return (
              <button
                key={persona}
                ref={active ? activeButtonRef : undefined}
                type="button"
                onClick={() => setPersona(persona)}
                aria-pressed={active}
                title={config.label}
                className={cn(
                  "relative isolate shrink-0 rounded-full px-3.5 py-2 text-[0.8rem] font-medium tracking-[-0.005em] transition-colors duration-200 sm:px-4",
                  active ? "text-paper" : "text-muted hover:text-ink",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="active-pill"
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-full bg-ink"
                    transition={reduceMotion ? { duration: 0 } : PILL_SPRING}
                  />
                ) : null}
                <span className="relative z-10">{SHORT_LABEL[persona]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
