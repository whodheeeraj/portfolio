/**
 * Edit your handles and contact details here — every link on the site reads
 * from this file.
 *
 * To drop a social, comment out or delete its entry. To reuse the same handle
 * everywhere (which is the case today), change SOCIAL_HANDLE once and all the
 * URLs below follow.
 */
export const SOCIAL_HANDLE = "whodheeeraj";

export type SocialPlatform =
  | "Instagram"
  | "LinkedIn"
  | "X"
  | "Facebook"
  | "YouTube"
  | "GitHub";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  /** Display form of the handle: "@name", "in/name", "name", … */
  label: string;
  url: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "social-instagram",
    platform: "Instagram",
    label: `@${SOCIAL_HANDLE}`,
    url: `https://www.instagram.com/${SOCIAL_HANDLE}/`,
  },
  {
    id: "social-linkedin",
    platform: "LinkedIn",
    label: `in/${SOCIAL_HANDLE}`,
    url: `https://www.linkedin.com/in/${SOCIAL_HANDLE}/`,
  },
  {
    id: "social-x",
    platform: "X",
    label: `@${SOCIAL_HANDLE}`,
    url: `https://x.com/${SOCIAL_HANDLE}`,
  },
  {
    id: "social-facebook",
    platform: "Facebook",
    label: `@${SOCIAL_HANDLE}`,
    url: `https://www.facebook.com/${SOCIAL_HANDLE}`,
  },
  {
    id: "social-youtube",
    platform: "YouTube",
    label: `@${SOCIAL_HANDLE}`,
    url: `https://www.youtube.com/@${SOCIAL_HANDLE}`,
  },
  {
    id: "social-github",
    platform: "GitHub",
    label: SOCIAL_HANDLE,
    url: `https://github.com/${SOCIAL_HANDLE}`,
  },
];

export const CONTACT = {
  email: "drj8work@gmail.com",
  phone: "+91-7303113611",
  phoneHref: "tel:+917303113611",
  /** Opens in a new tab, so visitors can preview or download the PDF. */
  cvUrl: "https://whodheeeraj.github.io/Dheeraj-Sain-Resume.pdf",
  photoUrl: "https://whodheeeraj.github.io/Dheeraj-Sain.webp",
} as const;

export const MAILTO_URL = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
  "Project enquiry — Dheeraj Sain",
)}`;
