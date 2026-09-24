# HireMe AI

> Un assistant pédagogique pour aider les étudiants à préparer une candidature en alternance.

HireMe AI compare un CV à une offre d'alternance afin de faire ressortir les compétences déjà valorisables, les axes à travailler et les prochaines actions concrètes. Il ne prend aucune décision de recrutement et ne doit jamais être utilisé pour sélectionner ou écarter une candidature.

## Fonctionnalités

- Accueil responsive, inscription / connexion Supabase ou espace démo local.
- Import d'un CV PDF (5 Mo maximum) et champ texte pour une analyse plus précise.
- Collage d'une offre et sélection du poste recherché.
- Analyse pédagogique : résumé, compétences CV / offre, correspondances, priorités, plan d'action, projets et message de candidature.
- Indicateur de compatibilité explicitement présenté comme pédagogique.
- Mode démo complet si `OPENAI_API_KEY` n'est pas configurée.
- Historique supprimable, synchronisé avec Supabase pour un utilisateur connecté.
- Thème clair / sombre, navigation clavier, états de chargement et erreurs explicites.
- Politique de confidentialité courte intégrée.

## Aperçus à ajouter

Ajoutez dans `public/screenshots/` vos propres captures puis référencez-les ici :

1. Accueil — proposition de valeur et aperçu de résultat.
2. Analyse — formulaire CV / offre.
3. Résultats — score pédagogique, plan d'action et message.
4. Espace personnel — historique et suppression.

## Démarrer le projet

### Prérequis

- Node.js 20 ou version plus récente.
- Un compte Supabase (facultatif pour le mode démo).
- Une clé API OpenAI (facultative : le mode démo fonctionne sans elle).

### Installation

```bash
git clone https://github.com/VOTRE-COMPTE/hireme-ai.git
cd hireme-ai
npm install
copy .env.example .env.local
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Créez `.env.local` à partir de `.env.example`.

| Variable | Obligatoire | Rôle |
| --- | --- | --- |
| `OPENAI_API_KEY` | Non | Active l'analyse IA côté serveur. Ne jamais la préfixer par `NEXT_PUBLIC_`. |
| `OPENAI_MODEL` | Non | Modèle utilisé par l'API, `gpt-5` par défaut. |
| `NEXT_PUBLIC_SUPABASE_URL` | Non | URL de votre projet Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Non | Clé anonyme publique Supabase. |

Sans ces variables, l'application reste utilisable grâce à des données et règles fictives de démonstration. Aucune clé IA n'est exposée dans le navigateur : la requête vers OpenAI passe seulement par `app/api/analyze/route.ts` et utilise `store: false`.

## Configurer Supabase

1. Créez un projet sur [Supabase](https://supabase.com/).
2. Dans **Authentication**, activez la connexion par e-mail et configurez l'URL de redirection de votre environnement (`http://localhost:3000/dashboard` puis votre URL Vercel).
3. Copiez l'URL et la clé anonyme dans `.env.local`.
4. Ouvrez le **SQL Editor** et exécutez [`supabase/schema.sql`](./supabase/schema.sql).

La table `analyses` est protégée par Row Level Security : chaque utilisateur ne peut accéder qu'à ses propres résultats. Par défaut, les PDF ne sont jamais envoyés vers Supabase et seuls les résultats, le poste visé et le nom de fichier facultatif peuvent être synchronisés.

## Confidentialité et sécurité

- Le consentement est requis avant chaque analyse.
- Les analyses démo restent dans le stockage local du navigateur ; elles peuvent être supprimées dans « Mes analyses ».
- Les PDF ne sont pas conservés en mode démo.
- Retirez les informations sensibles inutiles avant de soumettre un CV.
- La compatibilité est une aide de préparation et non une évaluation de candidature réelle.
- Les clés restent dans `.env.local`, fichier ignoré par Git.

## Tests et vérifications

```bash
npm test
npm run build
```

Les tests couvrent la détection des compétences et le calcul indicatif de compatibilité. La commande de build reproduit la vérification faite lors d'un déploiement Vercel.

## Déployer sur Vercel

1. Créez un dépôt GitHub nommé `hireme-ai` puis poussez ce dossier.
2. Dans [Vercel](https://vercel.com/new), importez le dépôt.
3. Ajoutez les variables d'environnement de production dans **Settings → Environment Variables**.
4. Si vous utilisez Supabase, ajoutez l'URL Vercel dans les URLs de redirection de Supabase Auth.
5. Déployez. Vercel détecte automatiquement Next.js.

## Structure du projet

```text
app/                  Pages, styles et route serveur
components/           Composants UI réutilisables
lib/                  Analyse démo, scoring et client Supabase
supabase/schema.sql   Table, RLS et bucket privé optionnel
tests/                Tests simples des fonctions clés
```

## Limites du MVP

L'extraction PDF intégrée récupère le texte simple lorsqu'il est disponible. Pour la meilleure qualité d'analyse, collez aussi le texte du CV dans le champ prévu. Une prochaine itération peut intégrer un extracteur PDF complet et, après consentement séparé, la conservation chiffrée de documents dans un bucket privé.

## Licence

Projet personnel — adaptez cette section avant une publication publique.
