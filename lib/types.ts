export type Analysis = {
  id: string;
  createdAt: string;
  targetRole: string;
  compatibilityScore: number;
  compatibilityLabel: string;
  profileSummary: string;
  cvSkills: string[];
  offerSkills: string[];
  matchingSkills: string[];
  skillsToImprove: string[];
  actionPlan: { title: string; detail: string; timeframe: string }[];
  projectIdeas: { title: string; description: string; skills: string[] }[];
  outreachMessage: string;
  mode: "demo" | "ai";
  sourceFileName?: string;
};

export type AnalysisInput = {
  cvText: string;
  offerText: string;
  targetRole: string;
};
