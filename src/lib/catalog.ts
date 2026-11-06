import type { ActivityKind } from "./types";

/**
 * Structure of each activity page — which sections it will carry. Content for
 * each section comes from the database (Phase 5); until then the section
 * shows an honest "not yet posted" state.
 */
export interface ActivityBlueprint {
  slug: string;
  title: string;
  kind: ActivityKind;
  tagline: string;
  sections: string[];
}

export const ACTIVITY_CATALOG: ActivityBlueprint[] = [
  { slug: "basketball", title: "Basketball", kind: "sport", tagline: "Interbatch basketball tournament",
    sections: ["Tournament announcements", "Registration details", "Team listings", "Game schedule", "Match results", "Standings", "Championship updates", "Awarding"] },
  { slug: "volleyball", title: "Volleyball", kind: "sport", tagline: "Interbatch volleyball tournament",
    sections: ["Tournament announcements", "Team registration", "Game schedule", "Results", "Standings", "Championship announcements"] },
  { slug: "pickleball", title: "Pickleball", kind: "sport", tagline: "Pickleball tournament",
    sections: ["Tournament announcements", "Registration", "Player listings", "Match schedules", "Results", "Winners"] },
  { slug: "mobile-legends", title: "Mobile Legends", kind: "esport", tagline: "Mobile Legends: Bang Bang tournament",
    sections: ["Tournament announcements", "Team registration", "Tournament mechanics", "Match brackets", "Game schedules", "Match results", "Championship announcements"] },
  { slug: "parade-opening", title: "Parade & Formal Opening", kind: "program", tagline: "Parade, formal opening program, games and Laro ng Lahi",
    sections: ["Assembly time", "Parade route", "Venue", "Participating batches", "Program sequence", "Announcements", "Photos"] },
  { slug: "bingo-socials", title: "Bingo Socials", kind: "social", tagline: "Community bingo socials",
    sections: ["Schedule", "Venue", "Mechanics", "Announcements"] },
  { slug: "raffle-bonanza", title: "Raffle Bonanza", kind: "social", tagline: "The Paskorisyuhan Raffle Bonanza",
    sections: ["Event date", "Venue", "Time", "Ticket details", "Mechanics", "Prize announcements", "Winners", "Official posters"] },
];

export const KIND_LABEL: Record<ActivityKind, string> = {
  sport: "Sports", esport: "E-Sports", program: "Program", social: "Socials",
};

export const ANNOUNCEMENT_CATEGORY_LABEL = {
  general: "General", fun_run: "Fun Run", registration: "Registration", sports: "Sports & Games",
  parade_opening: "Parade & Opening", bingo: "Bingo Socials", raffle: "Raffle Bonanza",
  results: "Results & Awarding", reminder: "Important Reminder",
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/fun-run", label: "Fun Run" },
  { href: "/activities", label: "Activities" },
  { href: "/schedule", label: "Event Schedule" },
  { href: "/announcements", label: "Announcements" },
  { href: "/results", label: "Results & Winners" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
] as const;
