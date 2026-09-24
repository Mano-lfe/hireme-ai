"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, FileSearch, FolderOpen, Trash2 } from "lucide-react";
import type { Analysis } from "@/lib/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const key = "hireme-analyses";

export function DashboardClient() {
  const [history, setHistory] = useState<Analysis[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    async function load() {
      const local = JSON.parse(window.localStorage.getItem(key) || "[]") as Analysis[];
      setHistory(local);
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { data: auth } = await supabase.auth.getUser();
        if (auth.user) {
          const { data } = await supabase.from("analyses").select("id, result").order("created_at", { ascending: false });
          const remote = (data || []).map((item) => ({ ...(item.result as Analysis), id: item.id })).filter((item) => item && item.targetRole);
          const merged = [...remote, ...local.filter((item) => !remote.some((cloud) => cloud.id === item.id))].slice(0, 20);
          setHistory(merged);
          window.localStorage.setItem(key, JSON.stringify(merged));
        }
      }
      setHydrated(true);
    }
    void load();
  }, []);
  const highest = useMemo(() => history.length ? Math.max(...history.map((item) => item.compatibilityScore)) : 0, [history]);
  const remove = async (id: string) => {
    const next = history.filter((item) => item.id !== id); setHistory(next); window.localStorage.setItem(key, JSON.stringify(next));
    const supabase = getSupabaseBrowserClient();
    if (supabase) { await supabase.from("analyses").delete().eq("id", id); }
  };
  if (!hydrated) return <div className="app-section shell"><div className="dashboard-card empty-state"><FileSearch size={36} /><p>Chargement de tes analyses…</p></div></div>;
  return <div className="app-section shell"><div className="dashboard-top"><div><p className="eyebrow">Espace personnel</p><h1>Mes analyses</h1><p>Ton historique est enregistré dans ce navigateur jusqu&apos;à ce que tu le supprimes.</p></div><Link href="/analyze" className="button">Nouvelle analyse <ArrowRight size={17} /></Link></div>{history.length ? <><div className="dashboard-summary"><article className="dashboard-card mini-stat"><p>Analyses réalisées</p><strong>{history.length}</strong></article><article className="dashboard-card mini-stat"><p>Meilleur indicateur pédagogique</p><strong>{highest}%</strong></article><article className="dashboard-card mini-stat"><p>Données stockées</p><strong>Localement</strong></article></div><div className="history-list" aria-live="polite">{history.map((item) => <article key={item.id} className="dashboard-card history-item"><div className="history-score">{item.compatibilityScore}</div><div className="history-main"><h2>{item.targetRole}</h2><p>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(item.createdAt))}{item.sourceFileName ? ` · ${item.sourceFileName}` : " · Saisie de texte"}</p></div><div className="history-actions"><Link href="/analyze" className="button button-secondary button-small">Voir / refaire</Link><button type="button" className="button button-danger button-small" aria-label={`Supprimer l'analyse ${item.targetRole}`} onClick={() => remove(item.id)}><Trash2 size={15} /> Supprimer</button></div></article>)}</div></> : <article className="dashboard-card empty-state"><FolderOpen size={39} /><h2>Ton espace est prêt</h2><p>Tu n&apos;as encore aucune analyse. Commence avec une offre réelle ou avec le scénario de démonstration.</p><Link href="/analyze" className="button">Faire ma première analyse <ArrowRight size={17} /></Link></article>}</div>;
}
