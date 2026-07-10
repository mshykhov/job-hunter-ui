import type { JobSourceOption } from "@/features/jobs/hooks/useJobSources";
import type { JobGroup, JobGroupDetail, PublicJob, UserJobStatus } from "@/features/jobs/types";

const HOUR = 3_600_000;
const NOW = Date.now();

export const SOURCES: JobSourceOption[] = [
  { id: "djinni", displayName: "Djinni" },
  { id: "dou", displayName: "DOU" },
  { id: "linkedin", displayName: "LinkedIn" },
  { id: "euremotejobs", displayName: "EuRemoteJobs" },
  { id: "adzuna", displayName: "Adzuna" },
];

const TITLES = [
  "Java Full Stack Developer",
  "Senior Java IVR Application Developer",
  "Software Engineer (Java)",
  "Kotlin Backend Engineer",
  "Senior Backend Developer (Spring Boot)",
  "Lead Java Engineer",
  "Full Stack Engineer (React + Java)",
  "Platform Engineer",
  "Backend Developer (Microservices)",
  "Staff Software Engineer",
  "Java Team Lead",
  "Cloud Backend Engineer (AWS)",
  "Senior Software Engineer, Payments",
  "Distributed Systems Engineer",
  "Java Developer (Fintech)",
  "Principal Engineer",
  "Middle Java Developer",
  "Backend Engineer (Kafka, Spring)",
  "Senior Kotlin Developer",
  "API Platform Engineer",
];
const COMPANIES = [
  "Miratech",
  "Kozak Agency",
  "EPAM",
  "SoftServe",
  "Revolut",
  "Wise",
  "Monobank",
  "GlobalLogic",
  "Grammarly",
  "Bolt",
  "Playtika",
  "Ajax Systems",
  null,
  "N-iX",
  "Luxoft",
];
const SALARIES = [null, "$4000-6000", "€60k-80k", "$5500", "€70k-95k", null, "$3000-4500", null];
const LOCATIONS = [
  ["Kyiv"],
  ["Remote"],
  ["Warsaw", "Remote"],
  ["Lviv"],
  ["Berlin", "Remote"],
  ["Kyiv", "Remote"],
  ["London"],
  ["Amsterdam", "Remote"],
  ["Wroclaw"],
  ["Remote", "EU"],
];
const STATUSES: UserJobStatus[] = ["new", "new", "new", "new", "applied", "irrelevant", "new"];
const REASONS = [
  "Strong match on core Java/Spring stack and remote setup. Salary band aligns with your target. Company size and domain fit your stated preferences.",
  "Partial match: backend focus is right but the role leans toward on-site work. AI experience is a plus you list, but seniority may be below your target.",
  "Low relevance: primarily a frontend role with light backend work. Location and comp are unclear from the posting.",
];

let seed = 42;
const rnd = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};
const pick = <T>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];

const buildGroups = (): JobGroup[] => {
  const groups: JobGroup[] = [];
  for (let i = 0; i < 96; i++) {
    const sources: string[] = [];
    const count = rnd() < 0.35 ? 2 : 1;
    while (sources.length < count) {
      const s = pick(SOURCES).id;
      if (!sources.includes(s)) sources.push(s);
    }
    const score = rnd() < 0.12 ? null : Math.floor(20 + rnd() * 78);
    const matchedAgo = i < 80 ? rnd() * 23 * HOUR : (24 + rnd() * 120) * HOUR;
    const matchedAt = new Date(NOW - matchedAgo).toISOString();
    const publishedAt = new Date(NOW - matchedAgo - rnd() * 48 * HOUR).toISOString();
    groups.push({
      id: `g${i}`,
      groupId: `g${i}`,
      title: pick(TITLES),
      company: pick(COMPANIES),
      sources,
      locations: pick(LOCATIONS),
      salary: pick(SALARIES),
      remote: rnd() < 0.72,
      status: pick(STATUSES),
      aiRelevanceScore: score,
      jobCount: rnd() < 0.3 ? 1 + Math.floor(rnd() * 3) : 1,
      primaryUrl: "https://example.com/job",
      publishedAt,
      matchedAt,
      createdAt: matchedAt,
      updatedAt: matchedAt,
    });
  }
  return groups;
};

export const GROUPS = buildGroups();

const DESCRIPTION =
  "<h3>About the role</h3><p>We are looking for a strong engineer to join our backend team working on high-throughput services.</p><ul><li>Design and build REST APIs with Spring Boot</li><li>Work with Kafka, PostgreSQL, AWS</li><li>Collaborate with product and frontend teams</li></ul><p>Remote-friendly, flexible hours.</p>";

export const buildDetail = (g: JobGroup): JobGroupDetail => ({
  groupId: g.groupId,
  title: g.title,
  company: g.company,
  remote: g.remote,
  status: g.status,
  aiRelevanceScore: g.aiRelevanceScore,
  aiReasoning: g.aiRelevanceScore == null ? null : REASONS[g.aiRelevanceScore % REASONS.length],
  jobs: Array.from({ length: g.jobCount }, (_, j) => ({
    jobId: `${g.groupId}-j${j}`,
    url: "https://example.com/job",
    source: g.sources[j % g.sources.length],
    description: DESCRIPTION,
    salary: g.salary,
    location: g.locations[0] ?? null,
    remote: g.remote,
    coverLetter: null,
    recruiterMessage: null,
    publishedAt: g.publishedAt,
    scrapedAt: g.matchedAt,
  })),
});

export const PUBLIC_JOBS: PublicJob[] = GROUPS.map((g) => ({
  id: g.id,
  title: g.title,
  company: g.company,
  url: "https://example.com/job",
  description: DESCRIPTION,
  source: g.sources[0],
  salary: g.salary,
  location: g.locations[0] ?? null,
  remote: g.remote,
  publishedAt: g.publishedAt,
  scrapedAt: g.matchedAt,
}));
