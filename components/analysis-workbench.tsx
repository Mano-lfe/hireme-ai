"use client";

import { useRef, useState } from "react";
import { AlertCircle, BarChart3, CheckCircle2, Clipboard, FileText, Info, Lightbulb, LoaderCircle, Sparkles, Target, Upload, WandSparkles } from "lucide-react";
import { DEMO_CV, DEMO_OFFER } from "@/lib/demo-analysis";
import type { Analysis } from "@/lib/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const roles = ["Développeur web", "Développeur full-stack", "Développeur front-end", "Développeur back-end", "Data / IA", "UX / UI designer", "Autre poste numérique"];

function saveAnalysis(analysis: Analysis) {
  const key = "hireme-analyses";
  const current = JSON.parse(window.localStorage.getItem(key) || "[]") as Analysis[];
  window.localStorage.setItem(key, JSON.stringify([analysis, ...current.filter((item) => item.id !== analysis.id)].slice(0, 20)));
}

async function saveCloudAnalysis(analysis: Analysis) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return;
  await supabase.from("analyses").upsert({
    id: analysis.id,
    user_id: auth.user.id,
    target_role: analysis.targetRole,
    compatibility_score: analysis.compatibilityScore,
    result: analysis,
    source_file_name: analysis.sourceFileName ?? null
  });
}

export function AnalysisWorkbench() {
  const resultRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState("Développeur web");
  const [offer, setOffer] = useState("");
  const [cvText, setCvText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [copied, setCopied] = useState(false);

  const fillDemo = () => {
    setCvText(DEMO_CV); setOffer(DEMO_OFFER); setRole("Développeur full-stack"); setConsent(true); setError("");
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setNotice("");
    if (!consent) { setError("Confirme ton accord pour traiter les informations de cette analyse. Rien n'est enregistré sans ton accord."); return; }
    if (!offer.trim()) { setError("Colle l'offre d'alternance pour continuer."); return; }
    setLoading(true);
    try {
      const data = new FormData(); data.append("targetRole", role); data.append("offerText", offer); data.append("cvText", cvText); if (file) data.append("cvFile", file);
      const response = await fetch("/api/analyze", { method: "POST", body: data });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Impossible de lancer l'analyse.");
      const next = payload.analysis as Analysis;
      saveAnalysis(next);
      try { await saveCloudAnalysis(next); } catch { /* The local history remains available if the optional cloud save fails. */ }
      setAnalysis(next); setNotice(payload.notice || "Analyse enregistrée dans cet appareil. Tu peux la retrouver dans Mes analyses.");
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Une erreur est survenue. Réessaie."); }
    finally { setLoading(false); }
  }

  async function copyMessage() {
    if (!analysis) return;
    await navigator.clipboard.writeText(analysis.outreachMessage); setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="app-section shell">
      <div className="notice"><Info size={18} /><span><strong>Indicateur pédagogique uniquement.</strong> HireMe AI t&apos;aide à préparer ta candidature ; il ne prédit pas une décision de recrutement.</span></div>
      <div className="analyze-layout" style={{ marginTop: 24 }}>
        <form className="form-card" onSubmit={submit} noValidate>
          <h2>Ton contexte de candidature</h2>
          <p>Choisis un poste, ajoute l&apos;offre et ton CV. Les informations restent dans ton navigateur, sauf si tu choisis plus tard de connecter ton espace Supabase.</p>
          <div className="field"><label htmlFor="role">Poste recherché</label><select id="role" value={role} onChange={(event) => setRole(event.target.value)}>{roles.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="field"><label htmlFor="cv-file">CV au format PDF <small>facultatif si tu colles le texte</small></label><div className="file-picker"><Upload size={19} /><span>Choisir un PDF · 5 Mo maximum</span><input id="cv-file" type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} /></div>{file && <p className="file-name"><CheckCircle2 size={14} /> {file.name}</p>}</div>
          <div className="field"><label htmlFor="cv-text">Texte du CV <small>recommandé pour une analyse précise</small></label><textarea id="cv-text" value={cvText} onChange={(event) => setCvText(event.target.value)} placeholder="Colle ici le texte de ton CV ou utilise le bouton de démonstration." /></div>
          <div className="field"><label htmlFor="offer">Offre d&apos;alternance</label><textarea required id="offer" value={offer} onChange={(event) => setOffer(event.target.value)} placeholder="Colle l'offre : missions, compétences demandées, contexte de l'entreprise…" /></div>
          <label className="consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>J&apos;accepte que ces informations soient traitées pour produire cette analyse. Je comprends que l&apos;analyse est enregistrée uniquement sur cet appareil, et que je peux la supprimer.</span></label>
          {error && <p className="form-error" role="alert"><AlertCircle size={16} /> {error}</p>}
          <div className="form-buttons"><button className={`button ${loading ? "loading-button" : ""}`} disabled={loading} type="submit">{loading ? <><span className="spinner" /> Analyse en cours…</> : <><WandSparkles size={18} /> Lancer l&apos;analyse</>}</button><button type="button" className="button button-secondary" onClick={fillDemo}>Essayer la démo</button></div>
        </form>
        <aside>
          <div className="side-card"><h3>Ce que tu obtiens</h3><ul><li>Les compétences visibles et attendues</li><li>Un plan d&apos;action priorisé</li><li>Deux idées de projets pertinentes</li><li>Un brouillon de message personnalisé</li></ul></div>
          <div className="side-card"><h3>Pour un meilleur résultat</h3><p>Retire les coordonnées personnelles inutiles avant de coller un CV. Présente tes réalisations avec des actions et des résultats précis.</p></div>
        </aside>
      </div>
      {analysis && <div className="results-wrap" ref={resultRef} tabIndex={-1}>
        <div className="results-heading"><div><h2>Ton analyse est prête</h2><p>{notice}</p></div><span className="mode-badge"><Sparkles size={13} /> {analysis.mode === "ai" ? "Analyse IA" : "Mode démo"}</span></div>
        <div className="results-top"><article className="results-card score-card"><div className="large-score-ring"><strong>{analysis.compatibilityScore}</strong><span>compatibilité</span></div><h3>{analysis.compatibilityLabel}</h3><p>Une lecture indicative pour guider tes prochaines actions.</p></article><article className="results-card summary-card"><h3>Résumé du profil</h3><p>{analysis.profileSummary}</p><div className="result-chip-row">{analysis.cvSkills.map((skill) => <span className="skill-chip" key={skill}><CheckCircle2 size={12} /> {skill}</span>)}</div></article></div>
        <div className="results-grid">
          <article className="results-card"><h2><Target size={19} /> Correspondances et priorités</h2><div className="skills-split"><div><p>Compétences en commun</p><div className="result-chip-row">{analysis.matchingSkills.length ? analysis.matchingSkills.map((skill) => <span className="skill-chip good" key={skill}>{skill}</span>) : <span className="field-help">Aucune correspondance explicite détectée : valorise tes compétences transférables.</span>}</div></div><div><p>À renforcer</p><div className="result-chip-row">{analysis.skillsToImprove.length ? analysis.skillsToImprove.map((skill) => <span className="skill-chip warn" key={skill}>{skill}</span>) : <span className="field-help">Continue de documenter tes réalisations.</span>}</div></div></div></article>
          <article className="results-card"><h2><BarChart3 size={19} /> Plan d&apos;action</h2><div className="action-list">{analysis.actionPlan.map((step, index) => <div className="action-item" key={step.title}><span className="action-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.detail}</p><small>{step.timeframe}</small></div></div>)}</div></article>
          <article className="results-card"><h2><Lightbulb size={19} /> Projets à mettre en avant</h2>{analysis.projectIdeas.map((project) => <div className="project-idea" key={project.title}><h3>{project.title}</h3><p>{project.description}</p><div className="result-chip-row">{project.skills.map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}</div></div>)}</article>
          <article className="results-card"><h2><FileText size={19} /> Compétences attendues dans l&apos;offre</h2><div className="result-chip-row">{analysis.offerSkills.map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}</div><p className="field-help" style={{ marginTop: 18 }}>Conseil : adapte le titre de ton CV et la phrase d&apos;accroche à ces compétences lorsqu&apos;elles correspondent réellement à ton expérience.</p></article>
          <article className="results-card message-card"><h2><Clipboard size={19} /> Message de candidature proposé</h2><p className="message-box">{analysis.outreachMessage}</p><div className="message-actions">{copied && <span className="copy-feedback">Copié !</span>}<button type="button" className="button button-secondary button-small" onClick={copyMessage}><Clipboard size={14} /> Copier le message</button></div></article>
        </div>
      </div>}
    </div>
  );
}
