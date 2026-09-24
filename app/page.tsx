import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, FileText, LockKeyhole, MessageSquareText, ShieldCheck, Sparkles, Target } from "lucide-react";

const features = [
  { icon: FileText, title: "Lis ton CV autrement", text: "Repère les compétences déjà valorisables et celles à rendre plus visibles." },
  { icon: Target, title: "Cible chaque offre", text: "Compare ton profil à une alternance précise, sans score de recrutement automatisé." },
  { icon: MessageSquareText, title: "Prépare ta candidature", text: "Repars avec un plan d'action, des projets et un message personnalisé." }
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={15} /> Ton copilote pour l&apos;alternance</p>
            <h1>Prépare une candidature qui <span>te ressemble.</span></h1>
            <p className="hero-description">HireMe AI t&apos;aide à relier ton CV aux attentes d&apos;une offre, à identifier tes leviers de progression et à passer à l&apos;action.</p>
            <div className="hero-actions">
              <Link href="/analyze" className="button button-large">Analyser mon profil <ArrowRight size={18} /></Link>
              <Link href="#comment-ca-marche" className="text-link">Découvrir comment ça marche</Link>
            </div>
            <div className="trust-row"><ShieldCheck size={18} /> Tes données restent sous ton contrôle. Mode démo disponible sans compte.</div>
          </div>
          <div className="hero-visual" aria-label="Aperçu d'une analyse de candidature">
            <div className="visual-top"><span className="status-dot" /> Analyse pédagogique <span>À l&apos;instant</span></div>
            <div className="score-panel">
              <div className="score-ring"><strong>76</strong><small>/ 100</small></div>
              <div><p className="score-title">Base solide à valoriser</p><p>Une compatibilité indicative, pas une décision de recrutement.</p></div>
            </div>
            <div className="visual-skills">
              <span>React <CheckCircle2 size={13} /></span><span>TypeScript <CheckCircle2 size={13} /></span><span>API REST <CheckCircle2 size={13} /></span>
            </div>
            <div className="next-step"><div><Sparkles size={17} /><span><b>Prochaine étape</b><br />Créer un projet avec Supabase</span></div><ArrowRight size={17} /></div>
          </div>
        </div>
      </section>

      <section className="shell proof-strip" aria-label="Promesses de l'outil">
        <div><strong>01</strong><span>Analyse structurée</span></div>
        <div><strong>02</strong><span>Actions concrètes</span></div>
        <div><strong>03</strong><span>Approche pédagogique</span></div>
      </section>

      <section className="section shell" id="comment-ca-marche">
        <div className="section-heading"><p className="eyebrow">Simple et utile</p><h2>Trois étapes pour avancer avec confiance.</h2></div>
        <div className="steps-grid">
          <article className="step-card"><span>01</span><FileText size={25} /><h3>Ajoute ton contexte</h3><p>Importe ton CV, colle l&apos;offre et choisis le poste que tu vises.</p></article>
          <article className="step-card"><span>02</span><BarChart3 size={25} /><h3>Lis les correspondances</h3><p>Visualise les compétences qui se répondent et les priorités à travailler.</p></article>
          <article className="step-card"><span>03</span><MessageSquareText size={25} /><h3>Transforme l&apos;analyse en action</h3><p>Utilise ton plan, tes idées de projets et ton message de candidature.</p></article>
        </div>
      </section>

      <section className="section soft-section">
        <div className="shell split-section">
          <div><p className="eyebrow">Pensé avec soin</p><h2>Un avis pour t&apos;aider, jamais un verdict sur ton avenir.</h2></div>
          <div className="commitments">
            <p><LockKeyhole size={20} /><span><b>Consentement explicite</b><br />Aucune analyse personnelle n&apos;est enregistrée sans ton accord.</span></p>
            <p><ShieldCheck size={20} /><span><b>Score pédagogique</b><br />L&apos;indicateur est une aide à la préparation, pas un outil de sélection.</span></p>
          </div>
        </div>
      </section>

      <section className="shell cta-section">
        <div><p className="eyebrow">Prêt à commencer ?</p><h2>Fais de ta prochaine candidature un projet clair.</h2></div>
        <Link href="/analyze" className="button button-light">Lancer l&apos;analyse <ArrowRight size={18} /></Link>
      </section>
    </>
  );
}
