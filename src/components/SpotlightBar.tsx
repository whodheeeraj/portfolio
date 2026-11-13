"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  Briefcase,
  CornerDownLeft,
  FileDown,
  Layers,
  Mail,
  Phone,
  Search,
} from "lucide-react";
import {
  RESUME_DATA,
  type PersonaId,
  type Project,
} from "@/data/resume";
import { CONTACT, MAILTO_URL, SOCIAL_LINKS } from "@/data/links";
import { usePersona } from "@/components/PersonaSwitcher";
import {
  CATEGORY_ICONS,
  ICON_STROKE,
  PLATFORM_ICONS,
  SOCIAL_ICONS,
} from "@/components/icons";
import { cn } from "@/lib/utils";

type IconComponent = ComponentType<{ className?: string; strokeWidth?: number }>;

interface PaletteItem {
  id: string;
  group: string;
  label: string;
  hint: string;
  icon: IconComponent;
  keywords: string;
  run: () => void;
}

const GROUP_ORDER = [
  "Personas",
  "Quick actions",
  "Projects",
  "Experience",
  "Channels",
  "Socials",
  "Websites",
];

export function SpotlightBar({
  onOpenProject,
  sheetOpen = false,
  showTrigger = true,
}: {
  onOpenProject: (project: Project) => void;
  sheetOpen?: boolean;
  /** The navbar trigger is optional — the shortcut always works. */
  showTrigger?: boolean;
}) {
  const { setPersona } = usePersona();
  const [open, setOpen] = useState(false);
  const [restoreFocus, setRestoreFocus] = useState(true);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const openRef = useRef(false);
  const sheetOpenRef = useRef(sheetOpen);

  const close = useCallback((shouldRestoreFocus = true) => {
    setRestoreFocus(shouldRestoreFocus);
    setOpen(false);
  }, []);

  const show = useCallback(() => {
    // With no visible trigger, Cmd+K can be pressed anywhere. Remember where
    // the user came from so closing returns focus there.
    const active = document.activeElement;
    openerRef.current = active instanceof HTMLElement ? active : null;
    setOpen(true);
  }, []);

  // The shortcut listener subscribes once. Reading liveness from refs keeps
  // its dependency list constant instead of re-binding on every open/close.
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    sheetOpenRef.current = sheetOpen;
  }, [sheetOpen]);

  // Return focus where the palette was opened from after a close, unless a
  // result is taking the user somewhere else (a project brief owns focus then).
  useEffect(() => {
    if (wasOpenRef.current && !open && restoreFocus) {
      const target = triggerRef.current ?? openerRef.current;
      if (target?.isConnected) {
        target.focus({ preventScroll: true });
      }
    }
    wasOpenRef.current = open;
  }, [open, restoreFocus]);

  const items = useMemo<PaletteItem[]>(() => {
    const personas = (Object.values(RESUME_DATA.personas) as {
      id: PersonaId;
      label: string;
      badge: string;
      headline: string;
      subheadline: string;
    }[]).map((persona) => ({
      id: `persona-${persona.id}`,
      group: "Personas",
      label: persona.label,
      hint: persona.badge,
      icon: Layers as IconComponent,
      keywords: `${persona.headline} ${persona.subheadline} switch hat view`,
      run: () => {
        close();
        setPersona(persona.id);
      },
    }));

    const quickActions: PaletteItem[] = [
      {
        id: "action-email",
        group: "Quick actions",
        label: "Email Dheeraj",
        hint: CONTACT.email,
        icon: Mail as IconComponent,
        keywords: "email mail contact hire reach out enquiry",
        run: () => {
          close();
          window.location.href = MAILTO_URL;
        },
      },
      {
        id: "action-call",
        group: "Quick actions",
        label: "Call Dheeraj",
        hint: CONTACT.phone,
        icon: Phone as IconComponent,
        keywords: "phone call contact dial number",
        run: () => {
          close();
          window.location.href = CONTACT.phoneHref;
        },
      },
      {
        id: "action-resume",
        group: "Quick actions",
        label: "Download CV",
        hint: "PDF — opens in a new tab",
        icon: FileDown as IconComponent,
        keywords: "cv resume pdf download print",
        run: () => {
          close();
          window.open(CONTACT.cvUrl, "_blank", "noopener,noreferrer");
        },
      },
    ];

    const projects: PaletteItem[] = RESUME_DATA.projects.map((project) => ({
      id: `project-${project.id}`,
      group: "Projects",
      label: project.title,
      hint: project.tagline,
      icon: CATEGORY_ICONS[project.category] as IconComponent,
      keywords: `${project.category} ${project.summary} ${project.techStack.join(" ")}`,
      run: () => {
        close(false);
        onOpenProject(project);
      },
    }));

    const experience: PaletteItem[] = RESUME_DATA.experience.map((role) => ({
      id: `experience-${role.id}`,
      group: "Experience",
      label: role.role,
      hint: `${role.company} · ${role.period}`,
      icon: Briefcase as IconComponent,
      keywords: `${role.company} ${role.period} ${role.stack.join(" ")} ${role.highlights.join(" ")}`,
      run: () => {
        close();
        requestAnimationFrame(() =>
          document
            .getElementById("experience-heading")
            ?.scrollIntoView({ block: "start" }),
        );
      },
    }));

    const channels: PaletteItem[] = RESUME_DATA.socialPortfolio.map(
      (channel) => ({
        id: `channel-${channel.id}`,
        group: "Channels",
        label: `${channel.platform} ${channel.handle}`,
        hint: channel.role,
        icon: PLATFORM_ICONS[channel.platform] as IconComponent,
        keywords: `${channel.niche} ${channel.metrics} social media`,
        run: () => {
          close();
          window.open(channel.url, "_blank", "noopener,noreferrer");
        },
      }),
    );

    const socials: PaletteItem[] = SOCIAL_LINKS.map((social) => ({
      id: social.id,
      group: "Socials",
      label: social.platform,
      hint: social.label,
      icon: SOCIAL_ICONS[social.platform] as IconComponent,
      keywords: `${social.label} ${social.platform} social profile handle`,
      run: () => {
        close();
        window.open(social.url, "_blank", "noopener,noreferrer");
      },
    }));

    const websites: PaletteItem[] = RESUME_DATA.profile.websites.map(
      (website) => ({
        id: `website-${website.id}`,
        group: "Websites",
        label: website.label,
        hint: new URL(website.url).hostname.replace(/^www\./, ""),
        icon: ArrowUpRight as IconComponent,
        keywords: "website live site work",
        run: () => {
          close();
          window.open(website.url, "_blank", "noopener,noreferrer");
        },
      }),
    );

    return [
      ...personas,
      ...quickActions,
      ...projects,
      ...experience,
      ...channels,
      ...socials,
      ...websites,
    ];
  }, [close, onOpenProject, setPersona]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        return;
      }

      event.preventDefault();
      if (sheetOpenRef.current) return;

      if (openRef.current) {
        close();
      } else {
        show();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, show]);

  return (
    <>
      {showTrigger ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => {
            if (!sheetOpen) show();
          }}
          aria-label="Search portfolio (Command K)"
          aria-haspopup="dialog"
          aria-expanded={open}
          className="btn-secondary h-9 gap-2 px-3 text-[0.74rem]"
        >
          <Search
            aria-hidden="true"
            strokeWidth={ICON_STROKE}
            className="size-3.5"
          />
          <span className="hidden sm:inline">Search</span>
          <span
            aria-hidden="true"
            className="hidden items-center gap-0.5 sm:flex"
          >
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>
      ) : null}

      {open && typeof document !== "undefined"
        ? createPortal(
            <Palette items={items} onClose={close} />,
            document.body,
          )
        : null}
    </>
  );
}

function Palette({
  items,
  onClose,
}: {
  items: PaletteItem[];
  onClose: (restoreFocus?: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return items;

    return items.filter((item) => {
      const haystack =
        `${item.label} ${item.hint} ${item.group} ${item.keywords}`.toLowerCase();
      return tokens.every((token) => haystack.includes(token));
    });
  }, [items, query]);

  const ordered = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group),
      ),
    [filtered],
  );

  const activeIndex =
    ordered.length === 0 ? -1 : Math.min(active, ordered.length - 1);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarGap =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarGap > 0) body.style.paddingRight = `${scrollbarGap}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  useEffect(() => {
    if (activeIndex < 0) return;
    const row = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    row?.scrollIntoView({ block: "nearest", behavior: "auto" });
  }, [activeIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const move = (delta: number) => {
    if (ordered.length === 0) return;
    setActive((current) => {
      const next = Math.min(
        Math.max(current + delta, 0),
        ordered.length - 1,
      );
      return next;
    });
  };

  const runItem = (item: PaletteItem | undefined) => {
    if (!item) return;
    item.run();
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      runItem(ordered[activeIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "Tab") {
      event.preventDefault();
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-3 pt-[10vh] sm:px-4 sm:pt-[12vh]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]"
        onPointerDown={() => onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search portfolio"
        className="glass-panel glass-sheet relative w-full max-w-xl overflow-hidden"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
          <Search
            aria-hidden="true"
            strokeWidth={ICON_STROKE}
            className="size-4 shrink-0 text-muted"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls="spotlight-listbox"
            aria-activedescendant={
              activeIndex >= 0
                ? `spotlight-option-${ordered[activeIndex].id}`
                : undefined
            }
            aria-autocomplete="list"
            aria-label="Search projects, personas, experience, and channels"
            placeholder="Search projects, personas, channels…"
            autoComplete="off"
            spellCheck={false}
            className="spotlight-input min-w-0 flex-1 bg-transparent text-base font-medium tracking-[-0.01em] text-ink outline-none placeholder:text-muted/70 sm:text-[0.95rem]"
          />
          <button
            type="button"
            onClick={() => onClose()}
            aria-label="Close search"
            className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted transition-colors duration-150 hover:border-line-strong hover:text-ink"
          >
            Esc
          </button>
        </div>

        <div
          ref={listRef}
          id="spotlight-listbox"
          role="listbox"
          aria-label="Search results"
          className="max-h-[min(54vh,26rem)] overflow-y-auto overscroll-contain py-2"
        >
          {ordered.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-[0.88rem] font-medium text-ink">
                Nothing matches “{query.trim()}”
              </p>
              <p className="mt-1 text-[0.74rem] text-muted">
                Try a project, a technology, or a persona.
              </p>
            </div>
          ) : (
            ordered.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeIndex;
              const startsGroup =
                index === 0 || ordered[index - 1].group !== item.group;

              return (
                <div key={item.id}>
                  {startsGroup ? (
                    <div className="px-4 pb-1 pt-2.5 first:pt-0">
                      <span className="eyebrow text-[0.52rem] text-muted">
                        {item.group}
                      </span>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    role="option"
                    id={`spotlight-option-${item.id}`}
                    data-index={index}
                    aria-selected={isActive}
                    tabIndex={-1}
                    onMouseDown={(event) => event.preventDefault()}
                    onPointerMove={() => setActive(index)}
                    onClick={() => runItem(item)}
                    className={cn(
                      "group mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-none",
                      isActive
                        ? "bg-ink text-paper"
                        : "text-ink hover:bg-ink/[0.04]",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-lg border",
                        isActive
                          ? "border-paper/20 bg-paper/10 text-paper"
                          : "border-line bg-ink/[0.03] text-muted",
                      )}
                    >
                      <Icon
                        strokeWidth={ICON_STROKE}
                        className="size-3.5"
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.85rem] font-medium tracking-[-0.012em]">
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block truncate text-[0.7rem]",
                          isActive ? "text-paper/65" : "text-muted",
                        )}
                      >
                        {item.hint}
                      </span>
                    </span>

                    {isActive ? (
                      <CornerDownLeft
                        aria-hidden="true"
                        strokeWidth={ICON_STROKE}
                        className="size-3.5 shrink-0 text-paper/70"
                      />
                    ) : (
                      <ArrowUpRight
                        aria-hidden="true"
                        strokeWidth={ICON_STROKE}
                        className="size-3.5 shrink-0 text-muted opacity-0 transition-none group-hover:opacity-60"
                      />
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5">
          <div className="flex items-center gap-3 text-[0.62rem] text-muted">
            <span className="flex items-center gap-1">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span className="ml-0.5">navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <Kbd>↵</Kbd>
              <span className="ml-0.5">open</span>
            </span>
          </div>
          <span className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-muted">
            {ordered.length} {ordered.length === 1 ? "result" : "results"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-5 items-center justify-center rounded border border-line bg-ink/[0.04] px-1 py-0.5 font-mono text-[0.58rem] leading-none text-muted">
      {children}
    </kbd>
  );
}
