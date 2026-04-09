import HOLIDAYS_JSON from "./indianHolidays.json";

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const MONTH_HERO_IMAGES = {
  0: {
    url: "/tuf_hero_images/00_january_cold_start.jpg",
    gradient: "from-slate-900 via-blue-900 to-blue-700",
    label: "January — Cold Start",
    alt: "Cozy morning coffee and laptop by a snowy window",
    theme: "New Year, cold outside, warm desk, fresh DSA grind begins",
  },
  1: {
    url: "/tuf_hero_images/01_february_love_grind.png",
    gradient: "from-rose-900 via-pink-800 to-purple-700",
    label: "February — Love the Grind",
    alt: "Warm lamp light on cozy home desk with notebook",
    theme: "Valentine's — fall in love with the process, daily streaks",
  },
  2: {
    url: "/tuf_hero_images/02_march_easter_bloom.png",
    gradient: "from-emerald-800 via-teal-600 to-lime-400",
    label: "March — Easter & Bloom",
    alt: "Cherry blossoms in morning spring light wide landscape",
    theme: "Easter, spring renewal, fresh energy, new contests",
  },
  3: {
    url: "/tuf_hero_images/03_april_internship_push.jpg",
    gradient: "from-sky-900 via-blue-700 to-cyan-500",
    label: "April — Internship Push",
    alt: "Bright sunlit home office with laptop and coffee",
    theme: "Application season, resume polish, OA grind begins",
  },
  4: {
    url: "/tuf_hero_images/04_may_peak_pressure.png",
    gradient: "from-orange-900 via-amber-700 to-yellow-500",
    label: "May — Peak Pressure",
    alt: "Golden hour light through window on focused work desk",
    theme: "Interview season peak, LC hard, mock rounds, high pressure",
  },
  5: {
    url: "/tuf_hero_images/05_june_first_internship.jpg",
    gradient: "from-violet-900 via-purple-700 to-fuchsia-500",
    label: "June — First Internship",
    alt: "Open bright modern office with people and laptops",
    theme: "Internship Day 1, standups, first PR, real codebase",
  },
  6: {
    url: "/tuf_hero_images/06_july_in_trenches.jpg",
    gradient: "from-blue-900 via-indigo-700 to-slate-600",
    label: "July — In the Trenches",
    alt: "Developer working alone by a sunlit window in summer",
    theme: "Mid-internship grind, system design, code reviews",
  },
  7: {
    url: "/tuf_hero_images/07_august_deep_work.png",
    gradient: "from-indigo-900 via-violet-800 to-purple-600",
    label: "August — Deep Work",
    alt: "Cozy evening study desk with warm lamp light",
    theme: "Back to campus, advanced DSA, DP + Graphs deep dive",
  },
  8: {
    url: "/tuf_hero_images/08_september_placement.png",
    gradient: "from-teal-900 via-emerald-700 to-green-500",
    label: "September — Placement Mode",
    alt: "Morning study desk with open notebook and coffee",
    theme: "OS, DBMS, CN revision, mock GDs, campus drive prep",
  },
  9: {
    url: "/tuf_hero_images/09_october_hacktober.jpg",
    gradient: "from-red-900 via-orange-800 to-amber-600",
    label: "October — Hacktober Grind",
    alt: "Glowing carved jack-o-lantern pumpkins in autumn night",
    theme: "Hacktoberfest, open source PRs, Halloween, peak interviews",
  },
  10: {
    url: "/tuf_hero_images/10_november_offer_letters.jpg",
    gradient: "from-amber-900 via-orange-700 to-yellow-500",
    label: "November — Offer Letters",
    alt: "Warm cozy autumn home with golden light and falling leaves",
    theme: "PPO decisions, offer letters, campus results, winding down",
  },
  11: {
    url: "/tuf_hero_images/11_december_christmas.png",
    gradient: "from-slate-900 via-blue-900 to-indigo-800",
    label: "December — Christmas Reset",
    alt: "Cozy living room with Christmas tree lights and fireplace",
    theme: "Holidays, year wrap, Christmas vibes, planning next year",
  },
};

export const MONTH_TAGS = {
  0:  ["New Year Goals", "DSA Kickoff"],
  1:  ["Consistency Building", "Mock Interviews"],
  2:  ["Spring Prep", "Contest Season"],
  3:  ["Internship Hunt", "Resume Building"],
  4:  ["System Design Basics"],
  5:  ["Mid-Year Check", "Project Building"],
  6:  ["Internship Season", "Real-World Coding"],
  7:  ["Upskilling", "Advanced DSA"],
  8:  ["Placement Prep", "Core Subjects"],
  9:  ["Interview Season", "Hacktober"],
  10: ["Offer Season", "Negotiation Prep"],
  11: ["Year Review", "Goal Reset"],
};

export const BADGES = [
  { id: "deadline",  label: "Deadline",        color: "bg-red-500 hover:bg-red-600 text-white",      dot: "bg-red-500"    },
  { id: "study",     label: "Study / DSA",     color: "bg-blue-500 hover:bg-blue-600 text-white",     dot: "bg-blue-500"   },
  { id: "interview", label: "Interview",       color: "bg-green-500 hover:bg-green-600 text-white",   dot: "bg-green-500"  },
  { id: "contest",   label: "Contest",         color: "bg-yellow-500 hover:bg-yellow-600 text-white", dot: "bg-yellow-500" },
  { id: "project",   label: "Project / Build", color: "bg-purple-500 hover:bg-purple-600 text-white", dot: "bg-purple-500" },
  { id: "holiday",   label: "Holiday",         color: "bg-rose-500 hover:bg-rose-600 text-white",     dot: "bg-rose-400"   },
];

export const PUBLIC_HOLIDAYS = HOLIDAYS_JSON;
