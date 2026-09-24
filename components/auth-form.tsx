"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm() {
  const [registering, setRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setStatus(""); setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        window.localStorage.setItem("hireme-user", JSON.stringify({ email, createdAt: new Date().toISOString(), demo: true }));
        setStatus("Espace démo activé sur cet appareil. Tu peux maintenant consulter tes analyses."); return;
      }
      if (registering) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/dashboard` } });
        if (signUpError) throw signUpError;
        setStatus("Compte créé. Vérifie ta boîte mail pour confirmer ton adresse.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        window.location.assign("/dashboard");
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Une erreur est survenue. Vérifie tes informations et réessaie."); }
    finally { setLoading(false); }
  }

  return <div className="auth-card"><p className="eyebrow"><Sparkles size={15} /> Ton espace candidature</p><h1>{registering ? "Créer un compte" : "Bon retour parmi nous"}</h1><p>Connecte-toi pour préparer tes candidatures. Sans Supabase configuré, un espace de démonstration local est disponible.</p><div className="auth-toggle" role="tablist" aria-label="Choix d'authentification"><button type="button" className={!registering ? "active" : ""} aria-selected={!registering} onClick={() => { setRegistering(false); setError(""); setStatus(""); }}>Connexion</button><button type="button" className={registering ? "active" : ""} aria-selected={registering} onClick={() => { setRegistering(true); setError(""); setStatus(""); }}>Inscription</button></div><form onSubmit={submit}><div className="field"><label htmlFor="email">Adresse e-mail</label><div style={{ position: "relative" }}><Mail size={17} style={{ position: "absolute", top: 13, left: 13, color: "#4f9fc5" }} /><input style={{ paddingLeft: 40 }} id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="prenom@exemple.com" /></div></div><div className="field"><label htmlFor="password">Mot de passe</label><div style={{ position: "relative" }}><LockKeyhole size={17} style={{ position: "absolute", top: 13, left: 13, color: "#4f9fc5" }} /><input style={{ paddingLeft: 40 }} id="password" type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={registering ? "new-password" : "current-password"} placeholder="6 caractères minimum" /></div></div>{error && <p className="form-error" role="alert"><AlertCircle size={16} /> {error}</p>}{status && <p className="file-name" role="status"><CheckCircle2 size={16} /> {status}</p>}<div className="form-buttons"><button className={`button ${loading ? "loading-button" : ""}`} disabled={loading} type="submit">{loading ? <><span className="spinner" /> Un instant…</> : registering ? "Créer mon compte" : "Me connecter"}</button></div></form></div>;
}
