# Mistral Chat App

Application web de chat minimale qui appelle l'API Mistral avec le SDK TypeScript
officiel (`@mistralai/mistralai`), avec le modèle `mistral-small-latest`.

La clé `MISTRAL_API_KEY` n'est jamais exposée au navigateur : elle est lue
uniquement côté serveur (via `.env`) et utilisée dans `POST /api/chat`.

## Prérequis

- Node.js >= 20 (testé avec Node 22)
- Une clé API Mistral (https://console.mistral.ai/)

## Installation

```bash
npm install
```

## Configuration

```bash
cp .env.example .env
```

Puis éditez `.env` et renseignez votre clé :

```
MISTRAL_API_KEY= votre-cle-ici
```

`.env` est ignoré par git (voir `.gitignore`) : ne commitez jamais votre clé.

## Lancer localement

Mode développement (redémarre à chaque changement) :

```bash
npm run dev
```

Mode simple :

```bash
npm start
```

Puis ouvrez http://localhost:3000 dans votre navigateur.

### Sous Windows (PowerShell 5.1)

```powershell
git clone https://github.com/DEVGERAN/mistral-chat-app.git C:\ACQUSITION
cd C:\ACQUSITION
npm install
Copy-Item .env.example .env
notepad .env          # renseigner : MISTRAL_API_KEY=votre-cle
npm run dev           # puis ouvrir http://localhost:3000
```

Notes Windows : utilisez `npm run typecheck` (ou `npx tsc --noEmit`) plutôt que
`tsc` seul, qui n'est pas une commande globale mais une dépendance locale du
projet. `npm start` lance le serveur sans mode watch.

## Vérification

```bash
npm run typecheck
```

## Structure

```
server.ts          Serveur Express : sert public/ et relaie /api/chat vers Mistral
public/index.html  Interface de chat
public/app.js      Logique du chat (appelle uniquement /api/chat, jamais l'API Mistral directement)
public/style.css   Styles
.env.example       Exemple de configuration (la vraie clé va dans .env)
```

## Fonctionnement

1. Le navigateur envoie l'historique des messages à `POST /api/chat`.
2. Le serveur valide les messages, puis appelle `client.chat.complete` avec
   `mistral-small-latest`.
3. Seul le contenu de la réponse est renvoyé au navigateur.
