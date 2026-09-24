import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <div className="footer-brand"><Sparkles size={16} /> HireMe AI</div>
          <p>Préparer sa candidature avec clarté, sans automatiser la décision humaine.</p>
        </div>
        <div className="footer-links">
          <Link href="/privacy">Confidentialité</Link>
          <Link href="/analyze">Lancer une analyse</Link>
        </div>
      </div>
      <div className="shell footer-bottom">Conçu avec <Heart size={13} fill="currentColor" /> pour les étudiants en alternance · {new Date().getFullYear()}</div>
    </footer>
  );
}
