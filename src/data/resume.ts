export type PersonaId = "all" | "engineering" | "growth" | "cloud-pm";

export interface PersonaConfig {
  id: PersonaId;
  label: string;
  badge: string;
  headline: string;
  subheadline: string;
  ctaText: string;
}

export interface SocialChannel {
  id: string;
  platform: "Instagram" | "YouTube" | "LinkedIn";
  handle: string;
  url: string;
  role: string;
  niche: string;
  metrics: string;
  highlights: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  personas: PersonaId[];
  category: "AI & Agents" | "Full-Stack" | "Social & Growth" | "Cloud & PM";
  metrics: string;
  techStack: string[];
  summary: string;
  links: { github?: string; live?: string; caseStudy?: string };
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  personas: PersonaId[];
  highlights: string[];
  stack: string[];
}

export const RESUME_DATA = {
  profile: {
    name: "Dheeraj Sain",
    location: "Delhi NCR, India",
    availability: "Open for Full-Time Roles & Global Freelance Contracts",
    defaultRole: "Multi-Disciplinary Technologist — AI, Full-Stack, Digital Growth & PM",
  },

  // 1. Dynamic Persona Modes (Powers the Apple Segmented Control & ?persona= URL param)
  personas: {
    all: {
      id: "all",
      label: "All Hats",
      badge: "Full-Spectrum Builder & Marketer",
      headline: "Bridging Production Code, AI Automation & Digital Growth.",
      subheadline:
        "3+ years engineering full-stack systems and AI agents, combined with high-conversion SEO, social media management, and technical project delivery.",
      ctaText: "Book a Discovery Call",
    },
    growth: {
      id: "growth",
      label: "Social, SEO & Digital Marketing",
      badge: "AI-Powered Growth & Social Media Manager",
      headline: "Scaling Brands with Data-Driven Content, SEO & AI Workflows.",
      subheadline:
        "I manage end-to-end social channels (Instagram, YouTube, LinkedIn), build automated content pipelines with n8n & GenAI, and execute technical SEO that drives organic reach.",
      ctaText: "Audit My Brand / Hire Me",
    },
    engineering: {
      id: "engineering",
      label: "Full-Stack & GenAI",
      badge: "Full-Stack & AI Engineer",
      headline: "Architecting Autonomous AI Agents & Low-Latency Web Apps.",
      subheadline:
        "Specializing in Python (FastAPI, Django), React/Next.js, production RAG pipelines, and multi-agent systems using LangGraph and CrewAI.",
      ctaText: "View Architecture & GitHub",
    },
    "cloud-pm": {
      id: "cloud-pm",
      label: "Cloud, DevOps & PM",
      badge: "Technical Project Manager & Cloud Architect",
      headline: "Taking Products from Zero to Production on Time.",
      subheadline:
        "Experienced in end-to-end sprint planning, stakeholder communication, AWS/GCP infrastructure, Docker microservices, and enterprise workflow digitization.",
      ctaText: "Discuss Your Project",
    },
  } as Record<PersonaId, PersonaConfig>,

  // 2. Managed Social Media Channels & Brand Proof (Replace URLs/handles with your live links)
  socialPortfolio: [
    {
      id: "social-ig-1",
      platform: "Instagram",
      handle: "@your_managed_handle", // Replace with actual Instagram handle
      url: "https://instagram.com/your_managed_handle",
      role: "Social Media Manager & Content Strategist",
      niche: "Sports Community & Aesthetics / Tech Brand",
      metrics: "High-retention Reels, Visual Grid Curation & Community Growth",
      highlights: [
        "Directed graphic art direction, aesthetic poster series, and short-form Reel hooks.",
        "Managed content calendars, hashtag/keyword SEO, and community engagement workflows.",
      ],
    },
    {
      id: "social-yt-1",
      platform: "YouTube",
      handle: "@your_youtube_channel", // Replace with actual YouTube handle
      url: "https://youtube.com/@your_youtube_channel",
      role: "Channel Manager & Video SEO Strategist",
      niche: "Tech, AI & Creator Content",
      metrics: "Optimized CTR Thumbnails, Retention Scripting & YouTube Shorts",
      highlights: [
        "Executed keyword research, metadata optimization, and high-CTR packaging for long-form and Shorts.",
        "Automated video repurposing and captioning workflows using GenAI and n8n.",
      ],
    },
    {
      id: "social-li-1",
      platform: "LinkedIn",
      handle: "in/dheerajsain", // Replace with your LinkedIn or client pages
      url: "https://linkedin.com/in/dheerajsain",
      role: "B2B Thought Leadership & Personal Branding",
      niche: "SaaS, AI Engineering & B2B Growth",
      metrics: "Inbound Lead Generation & Executive Ghostwriting",
      highlights: [
        "Crafted technical storytelling and B2B authority posts driving inbound freelance and recruitment leads.",
        "Built direct founder-outreach campaigns (including product pitches like FotAI).",
      ],
    },
  ] as SocialChannel[],

  // 3. Cross-Functional Projects (Tagged by Persona so the Bento Grid filters smoothly)
  projects: [
    {
      id: "sports-community-platform",
      title: "Sports Community & Session Booking Platform",
      tagline: "Full-Stack Product + Local Community Growth Engine",
      personas: ["all", "growth", "engineering", "cloud-pm"],
      category: "Social & Growth",
      metrics: "End-to-end session bookings, revenue-sharing & grassroots social funnel",
      techStack: ["Next.js", "FastAPI", "Instagram Growth", "Community Management", "SEO"],
      summary:
        "Built both the booking/revenue-share platform for football and basketball sessions and the grassroots social media engine driving local player acquisition.",
      links: { live: "https://your-link.com" },
    },
    {
      id: "ai-content-seo-engine",
      title: "Autonomous AI Content & SEO Automation Pipeline",
      tagline: "Multi-Agent Marketing Workflows with n8n & LLMs",
      personas: ["all", "growth", "engineering"],
      category: "Social & Growth",
      metrics: "Automated keyword research, social repurposing & omni-channel scheduling",
      techStack: ["n8n", "LangGraph", "CrewAI", "Technical SEO", "Google AI Studio"],
      summary:
        "Engineered automated marketing agents that scrape trending niche topics, generate SEO-optimized copy, and schedule multi-platform social assets.",
      links: {},
    },
    {
      id: "kubebuddy",
      title: "KubeBuddy",
      tagline: "AI-Powered Kubernetes Diagnostic Dashboard",
      personas: ["all", "engineering", "cloud-pm"],
      category: "AI & Agents",
      metrics: "Translates natural language into live cluster diagnostics",
      techStack: ["Django", "Kubernetes API", "LLMs", "Python", "Docker"],
      summary:
        "Architected an AI observability tool that translates natural-language queries into live K8s diagnostic commands.",
      links: { github: "https://github.com/yourusername/kubebuddy" },
    },
    {
      id: "musashi-dispatch",
      title: "Enterprise Dispatch & GRN Digitization System",
      tagline: "Technical PM & Full-Stack PoC for Musashi Auto Parts India",
      personas: ["all", "engineering", "cloud-pm"],
      category: "Cloud & PM",
      metrics: "Digitized vehicle gate verification, GRN & transporter billing",
      techStack: ["FastAPI", "React", "PostgreSQL", "Stakeholder Management", "System Design"],
      summary:
        "Led requirements gathering, architecture design, and full-stack delivery to digitize multi-step supply chain and billing workflows.",
      links: {},
    },
    {
      id: "bookleaf-portal",
      title: "BookLeaf Publishing Full-Stack Portal",
      tagline: "Production Web Portal & Cloud Deployment on AWS",
      personas: ["all", "engineering", "cloud-pm"],
      category: "Full-Stack",
      metrics: "End-to-end portal architecture, documentation & AWS hosting",
      techStack: ["FastAPI", "React", "AWS EC2", "Docker", "Technical Documentation"],
      summary:
        "Designed, documented, and deployed a responsive publishing portal hosted on AWS with clean REST API architecture.",
      links: {},
    },
    {
      id: "hero-mft-automation",
      title: "Secure AWS MFT Server & Vendor Automation",
      tagline: "Managed File Transfer & Automated Batch Pipelines for Hero Cycles",
      personas: ["all", "engineering", "cloud-pm"],
      category: "Cloud & PM",
      metrics: "Automated daily vendor archive extraction with Bearer Token auth",
      techStack: ["FastAPI", "AWS EC2", "Python", "Linux CLI", "Security"],
      summary:
        "Built a high-throughput Managed File Transfer server on AWS EC2 and automated vendor file workflows.",
      links: {},
    },
  ] as Project[],

  // 4. Work Experience (Tagged so bullet points adapt to the selected hat)
  experience: [
    {
      id: "exp-aguna",
      role: "Full-Stack Developer & AI Workflow Specialist",
      company: "Aguna Solutions",
      period: "Present",
      personas: ["all", "engineering", "growth", "cloud-pm"],
      highlights: [
        "Engineered autonomous multi-agent workflows (LangGraph, CrewAI) and visual automation pipelines (n8n, Bubble.io) for business process and marketing automation.",
        "Architected low-latency web applications (React, Next.js, FastAPI) optimized for Core Web Vitals, technical SEO, and high conversion.",
        "Collaborated directly with stakeholders on product roadmaps, technical interviews, and end-to-end delivery.",
      ],
      stack: ["Next.js", "FastAPI", "LangGraph", "n8n", "Technical SEO", "AWS"],
    },
    {
      id: "exp-nao",
      role: "Software Developer",
      company: "Nao Medical",
      period: "Previous",
      personas: ["all", "engineering", "cloud-pm"],
      highlights: [
        "Developed scalable full-stack web modules and high-availability REST APIs using Django, React, and PostgreSQL.",
        "Coordinated cross-functional feature releases and cloud deployments on AWS.",
      ],
      stack: ["Django", "React", "PostgreSQL", "AWS EC2", "REST APIs"],
    },
    {
      id: "exp-thinknyx",
      role: "Technical Project Engineer",
      company: "Thinknyx Technologies LLP",
      period: "Previous (2 yrs 9 mos tenure)",
      personas: ["all", "cloud-pm", "engineering", "growth"],
      highlights: [
        "Managed technical project lifecycles, client communications, and milestone delivery across cloud and software initiatives.",
        "Conducted technical workshops, created technical content/documentation, and executed container deployments with Docker & Kubernetes.",
      ],
      stack: ["Project Management", "Client Delivery", "Docker", "Kubernetes", "Python", "AWS"],
    },
  ] as Experience[],

  // 5. Categorized Skill Matrix
  skills: {
    growthAndSocial: [
      "Social Media Management (IG, YT, LinkedIn)",
      "Technical & On-Page SEO",
      "Content Strategy & Reel Hooks",
      "YouTube Packaging & Analytics",
      "AI Marketing Automation (n8n)",
      "Brand Graphic Curation",
      "Copywriting & Ghostwriting",
    ],
    projectAndNoCode: [
      "Agile / Scrum Project Management",
      "Stakeholder & Client Communication",
      "Product Roadmapping",
      "n8n Workflow Automation",
      "Bubble.io",
      "Technical Hiring & Mentoring",
    ],
    aiAndEngineering: [
      "LangGraph & CrewAI",
      "RAG Pipelines (FAISS, Pinecone)",
      "Python (FastAPI, Django, Flask)",
      "React & Next.js (App Router)",
      "Node.js & TypeScript",
      "PostgreSQL & MongoDB",
    ],
    cloudAndDevops: [
      "AWS (EC2, SageMaker)",
      "Google Cloud Platform (GCP)",
      "Docker & Kubernetes",
      "CI/CD Pipelines",
      "Linux Terminal & Bash",
    ],
  },
};