import { calculateCompatibility, detectSkills, SKILL_CATALOG } from "./scoring";
import type { Analysis, AnalysisInput } from "./types";

const demoCv = `Étudiant en informatique, je développe des applications web avec HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, PHP et MySQL. J'utilise Git, GitHub, Figma, Python, OpenAI et des API REST. J'aime transformer un besoin concret en expérience claire, accessible et responsive.`;

const demoOffer = `Alternance développeur web full-stack. Nous recherchons une personne curieuse qui maîtrise JavaScript, TypeScript, React, Node.js, SQL, Git et les API REST. Une première expérience avec Next.js, Tailwind CSS, Docker et l'intelligence artificielle est appréciée. Vous participerez à la création de produits web modernes au sein d'une équipe Agile.`;

export const DEMO_CV = demoCv;
export const DEMO_OFFER = demoOffer;

function labelFor(score: number) {
  if (score >= 75) return "Très bonne adéquation pédagogique";
  if (score >= 55) return "Base solide à valoriser";
  return "Potentiel de progression identifié";
}

export function buildDemoAnalysis(input: AnalysisInput): Analysis {
  const cvText = input.cvText.trim() || demoCv;
  const offerText = input.offerText.trim() || demoOffer;
  const cvSkills = detectSkills(cvText);
  const offerSkills = detectSkills(offerText);
  const detectedOfferSkills = offerSkills.length ? offerSkills : ["JavaScript", "React", "Git", "API REST"];
  const detectedCvSkills = cvSkills.length ? cvSkills : ["JavaScript", "HTML", "CSS", "Git"];
  const { score, matching, missing } = calculateCompatibility(detectedCvSkills, detectedOfferSkills);
  const role = input.targetRole || "Développeur web";
  const reinforce = missing.slice(0, 4);
  const coreSkill = reinforce[0] || "React";
  const secondSkill = reinforce[1] || "API REST";

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    targetRole: role,
    compatibilityScore: score,
    compatibilityLabel: labelFor(score),
    profileSummary: `Profil orienté ${role.toLowerCase()}, avec une base concrète en ${detectedCvSkills.slice(0, 4).join(", ")}. La candidature gagnera en impact en reliant chaque compétence à une réalisation mesurable et en renforçant les thèmes les plus présents dans l'offre.`,
    cvSkills: detectedCvSkills,
    offerSkills: detectedOfferSkills,
    matchingSkills: matching,
    skillsToImprove: reinforce,
    actionPlan: [
      { title: "Rendre le CV plus ciblé", detail: `Ajoute un encart “compétences clés” et place ${matching.slice(0, 3).join(", ") || "tes compétences les plus fortes"} en haut du CV.`, timeframe: "Aujourd'hui" },
      { title: `Renforcer ${coreSkill}`, detail: `Consacre une session courte à un mini-projet démontrable en ${coreSkill}, puis ajoute le lien GitHub au CV.`, timeframe: "Cette semaine" },
      { title: "Préparer l'entretien", detail: `Prépare deux exemples STAR : une difficulté résolue et une fonctionnalité livrée avec ${secondSkill}.`, timeframe: "Avant l'entretien" }
    ],
    projectIdeas: [
      { title: "Tableau de bord de candidature", description: `Un tracker d'alternances avec recherche, statuts, rappels et statistiques simples.`, skills: ["React", "TypeScript", "SQL"] },
      { title: `Mini-projet ${coreSkill}`, description: `Une application courte et documentée qui met ${coreSkill} au centre, avec une démo en ligne et un README clair.`, skills: [coreSkill, "Git", "API REST"] }
    ],
    outreachMessage: `Bonjour,\n\nJe me permets de vous contacter au sujet de l'alternance ${role}. Mon parcours m'a permis de développer des projets concrets en ${matching.slice(0, 3).join(", ") || "développement web"}. L'opportunité de contribuer à vos produits, tout en approfondissant ${reinforce.slice(0, 2).join(" et ") || "mes compétences full-stack"}, m'intéresse particulièrement.\n\nJe serais ravi d'échanger avec vous sur ma motivation et mes réalisations.\n\nBien cordialement,`,
    mode: "demo"
  };
}

export function isPlausibleAnalysis(value: unknown): value is Omit<Analysis, "id" | "createdAt" | "mode"> {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.compatibilityScore === "number" && Array.isArray(record.cvSkills) && Array.isArray(record.offerSkills);
}

export { SKILL_CATALOG };
