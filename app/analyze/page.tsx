import { AnalysisWorkbench } from "@/components/analysis-workbench";
import { Sparkles } from "lucide-react";

export default function AnalyzePage() {
  return <><section className="page-hero"><div className="shell"><p className="eyebrow"><Sparkles size={15} /> Analyse de candidature</p><h1>Transforme une offre en plan d&apos;action.</h1><p>Compare tes compétences à l&apos;alternance que tu vises. L&apos;analyse reste pédagogique : elle t&apos;aide à te préparer, elle ne remplace jamais l&apos;échange avec un recruteur.</p></div></section><AnalysisWorkbench /></>;
}
