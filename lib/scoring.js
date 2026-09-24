export const SKILL_CATALOG = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "PHP",
  "HTML", "CSS", "Tailwind CSS", "SQL", "MySQL", "PostgreSQL", "MongoDB",
  "Git", "GitHub", "Docker", "Figma", "Supabase", "Vercel", "AWS", "Azure",
  "OpenAI", "LLM", "RAG", "Machine Learning", "TensorFlow", "Pandas",
  "REST API", "GraphQL", "Agile", "Scrum", "CI/CD", "Linux", "UX/UI"
];

const ALIASES = {
  "next.js": ["next", "nextjs"],
  "node.js": ["node", "nodejs"],
  "tailwind css": ["tailwind"],
  "rest api": ["api rest", "restful", "api"],
  "machine learning": ["ml", "apprentissage automatique"],
  "ux/ui": ["ux", "ui", "interface utilisateur"],
  "ci/cd": ["cicd", "continuous integration"],
  "llm": ["large language model", "modèle de langage"]
};

export function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function detectSkills(text, catalog = SKILL_CATALOG) {
  const normalized = normalizeText(text);
  return catalog.filter((skill) => {
    const key = normalizeText(skill);
    const terms = [key, ...(ALIASES[key] || [])];
    return terms.some((term) => normalized.includes(normalizeText(term)));
  });
}

export function calculateCompatibility(cvSkills = [], offerSkills = []) {
  const cv = new Set(cvSkills.map(normalizeText));
  const requested = [...new Set(offerSkills.map((skill) => String(skill)))];
  const matching = requested.filter((skill) => cv.has(normalizeText(skill)));
  const missing = requested.filter((skill) => !cv.has(normalizeText(skill)));
  const raw = requested.length ? Math.round((matching.length / requested.length) * 100) : 0;
  const score = Math.max(18, Math.min(92, raw || (cvSkills.length ? 35 : 18)));
  return { score, matching, missing };
}
