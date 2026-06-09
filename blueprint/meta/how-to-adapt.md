# Blueprint fuer ein neues Projekt einrichten

## Schritt 1: Blueprint kopieren

Kopiere den gesamten `blueprint/` Ordner und `AGENTIC-BLUEPRINT.md` in dein neues Projekt-Root.

```bash
cp -r /pfad/zum/blueprint-repo/blueprint/ ./blueprint/
cp /pfad/zum/blueprint-repo/AGENTIC-BLUEPRINT.md ./
```

## Schritt 2: config.md ausfuellen

Oeffne `blueprint/config.md` und fuell alle Felder aus:

1. **Projektname und Beschreibung** — was baust du?
2. **Tech-Stack** — welche Sprachen, Frameworks, Datenbanken?
3. **Agents** — welche Agents nutzt du? Welches Antigravity-Profil?
4. **Review-Tool** — `/code-review` Skill + zweiter Agent (Default), Greptile, oder manuell?
5. **Verzeichnis-Zuweisungen** — welcher Agent arbeitet wo?
6. **Dependencies (Fallback)** — welche Repos sind nicht direkt via grep/read/web_fetch
   erreichbar und sollen via open-source geladen werden?

## Schritt 3: CLAUDE.md und AGENTS.md generieren

Gib dem Agent folgendes Prompt:

```
Lies blueprint/config.md und blueprint/templates/CLAUDE.md.template.
Generiere eine projektspezifische CLAUDE.md basierend auf der Konfiguration.
Ersetze alle {{PLATZHALTER}} mit den Werten aus config.md.

Mach dasselbe fuer AGENTS.md mit blueprint/templates/AGENTS.md.template.
```

Review die generierten Dateien und committe sie.

## Schritt 4: Dependencies laden (optional, Fallback)

Default ist direkter Source-Zugriff (grep/read in `node_modules`, web_fetch).
Nur fuer Repos, die so nicht erreichbar sind und in config.md gelistet wurden:

```bash
npx open-source <github-url>
```

Stelle sicher dass `open-source/` in `.gitignore` steht.

## Schritt 5: Los gehts

Starte mit Phase 0 (Ideation) gemaess dem Blueprint.

## Anpassungen

### Loop-Limits aendern
Editiere die Dateien unter `blueprint/loops/`. Passe `Max Iterationen` an.

### Neue Phase hinzufuegen
1. Erstelle `blueprint/phases/XX-name.md` nach dem Muster der existierenden Phasen
2. Fuege die Phase in die Tabelle in `AGENTIC-BLUEPRINT.md` ein
3. Aktualisiere `blueprint/meta/changelog.md`

### Neuen Agent hinzufuegen
1. Erstelle `blueprint/agents/neuer-agent.md` nach dem Muster der existierenden Agents
2. Fuege den Agent in `AGENTIC-BLUEPRINT.md` ein
3. Definiere Verzeichnis-Zustaendigkeiten in `blueprint/config.md`
4. Aktualisiere das Koordinationsprotokoll in `blueprint/agents/coordination.md`

### Prompt-Templates verfeinern
Die Prompt-Templates stehen in den jeweiligen Phase-Dateien. Passe sie nach Erfahrung an — besonders nach Retros.
