"use client";

import Link from "next/link";
import { Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/analyze", label: "Analyser mon profil" },
  { href: "/dashboard", label: "Mes analyses" }
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("hireme-theme") === "dark";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("hireme-theme", next ? "dark" : "light");
  };

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="HireMe AI, accueil">
          <span className="brand-mark"><Sparkles size={17} aria-hidden="true" /></span>
          <span>HireMe <i>AI</i></span>
        </Link>
        <nav className="desktop-nav" aria-label="Navigation principale">
          {navigation.map((item) => (
            <Link className={pathname === item.href ? "active" : ""} key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label={dark ? "Activer le mode clair" : "Activer le mode sombre"}>
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <Link href="/auth" className="button button-small">Se connecter</Link>
          <button className="mobile-menu-button icon-button" type="button" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav shell" aria-label="Navigation mobile">
          {navigation.map((item) => (
            <Link onClick={() => setOpen(false)} className={pathname === item.href ? "active" : ""} key={item.href} href={item.href}>{item.label}</Link>
          ))}
          <Link onClick={() => setOpen(false)} href="/auth">Connexion / inscription</Link>
        </nav>
      )}
    </header>
  );
}
