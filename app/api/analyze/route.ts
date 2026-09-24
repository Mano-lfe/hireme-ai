import OpenAI from "openai";
import { buildDemoAnalysis, isPlausibleAnalysis } from "@/lib/demo-analysis";
import type { Analysis, AnalysisInput } from "@/lib/types";

export const runtime = "nodejs";

const MAX_TEXT_LENGTH = 18000;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function cleanText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().slice(0, MAX_TEXT_LENGTH) : "";
}

function extractBasicPdfText(bytes: ArrayBuffer) {
  // Fallback deliberately limited: it recovers uncompressed text only. The UI always lets users paste text for accuracy.
  const raw = Buffer.from(bytes).toString("latin1");
  const chunks = [...raw.matchAll(/\(([^()]{2,220})\)/g)].map((match) => match[1].replace(/\\[nrt]/g, " ").replace(/\\\(/g, "(").replace(/\\\)/g, ")"));
  return chunks.join(" ").replace(/\s+/g, " ").trim().slice(0, MAX_TEXT_LENGTH);
}

function extractJson(value: string) {
  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? value;
  const start = fenced.indexOf("{");
  const end = fenced.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try { return JSON.parse(fenced.slice(start, end + 1)); } catch { return null; }
}

function asStringArray(value: unknown, fallback: string[]) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").slice(0, 12) : fallback;
}

function asActionPlan(value: unknown, fallback: Analysis["actionPlan"]) {
  if (!Array.isArray(value)) return fallback;
  const steps = value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object").slice(0, 4).map((item, index) => ({
    title: typeof item.title === "string" ? item.title : `Étape ${index + 1}`,
    detail: typeof item.detail === "string" ? item.detail : "À préciser.",
    timeframe: typeof item.timeframe === "string" ? item.timeframe : "À planifier"
  }));
  return steps.length ? steps : fallback;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const targetRole = cleanText(form.get("targetRole"));
    const offerText = cleanText(form.get("offerText"));
    let cvText = cleanText(form.get("cvText"));
    const file = form.get("cvFile");
    let sourceFileName: string | undefined;

    if (file instanceof File) {
      if (file.type !== "application/pdf") return Response.json({ error: "Le CV doit être envoyé au format PDF." }, { status: 400 });
      if (file.size > MAX_FILE_SIZE) return Response.json({ error: "Le PDF est trop volumineux. La limite est de 5 Mo." }, { status: 400 });
      sourceFileName = file.name;
      if (!cvText) cvText = extractBasicPdfText(await file.arrayBuffer());
    }

    if (!offerText || !targetRole) {
      return Response.json({ error: "Ajoute l'offre d'alternance et le poste recherché pour lancer l'analyse." }, { status: 400 });
    }

    const input: AnalysisInput = { cvText, offerText, targetRole };
    const fallback = buildDemoAnalysis(input);
    fallback.sourceFileName = sourceFileName;

    if (!process.env.OPENAI_API_KEY) return Response.json({ analysis: fallback, notice: "Mode démo : analyse réalisée à partir de règles pédagogiques et de données fictives si le CV n'est pas lisible." });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      store: false,
      input: `Tu es HireMe AI, un assistant pédagogique français pour préparer une alternance. Analyse le CV et l'offre uniquement pour aider l'étudiant à préparer sa candidature. Ne fais jamais de prédiction de recrutement, ne déduis ni âge, ni origine, ni état de santé, ni autre donnée sensible. Le score est un indicateur pédagogique et doit être présenté comme tel. Retourne UNIQUEMENT un JSON valide avec les clés : compatibilityScore (nombre entier 0-100), compatibilityLabel, profileSummary, cvSkills (tableau), offerSkills (tableau), matchingSkills (tableau), skillsToImprove (tableau), actionPlan (tableau de {title,detail,timeframe}), projectIdeas (tableau de {title,description,skills}), outreachMessage. Réponds en français, de manière concrète, positive et concise.\n\nPOSTE VISÉ : ${targetRole}\n\nCV : ${cvText || "Le texte du CV n'a pas pu être lu. Utilise les données de démonstration avec prudence."}\n\nOFFRE : ${offerText}`
    });
    const aiValue = extractJson(completion.output_text);
    if (!isPlausibleAnalysis(aiValue)) return Response.json({ analysis: fallback, notice: "L'analyse IA n'a pas pu être formatée. Le mode démo a pris le relais." });

    const analysis: Analysis = {
      ...fallback,
      compatibilityScore: Math.max(0, Math.min(100, Math.round(aiValue.compatibilityScore))),
      compatibilityLabel: typeof aiValue.compatibilityLabel === "string" ? aiValue.compatibilityLabel : fallback.compatibilityLabel,
      profileSummary: typeof aiValue.profileSummary === "string" ? aiValue.profileSummary : fallback.profileSummary,
      cvSkills: asStringArray(aiValue.cvSkills, fallback.cvSkills),
      offerSkills: asStringArray(aiValue.offerSkills, fallback.offerSkills),
      matchingSkills: asStringArray(aiValue.matchingSkills, fallback.matchingSkills),
      skillsToImprove: asStringArray(aiValue.skillsToImprove, fallback.skillsToImprove),
      actionPlan: asActionPlan(aiValue.actionPlan, fallback.actionPlan),
      projectIdeas: Array.isArray(aiValue.projectIdeas) ? aiValue.projectIdeas.filter((item): item is Analysis["projectIdeas"][number] => Boolean(item) && typeof item === "object" && typeof (item as { title?: unknown }).title === "string").slice(0, 3) : fallback.projectIdeas,
      outreachMessage: typeof aiValue.outreachMessage === "string" ? aiValue.outreachMessage : fallback.outreachMessage,
      mode: "ai"
    };
    return Response.json({ analysis });
  } catch (error) {
    console.error("analysis route error", error);
    return Response.json({ error: "Une erreur est survenue pendant l'analyse. Réessaie dans quelques instants." }, { status: 500 });
  }
}
