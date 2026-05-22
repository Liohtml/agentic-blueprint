# Multi-Agent Koordinationsprotokoll

## Grundregel
Der Mensch ist der Dirigent. Agents arbeiten autonom innerhalb ihrer Chunks, aber der Mensch weist Arbeit zu und trifft Entscheidungen bei Konflikten.

## Kollisions-Vermeidung

### Verzeichnis-Grenzen
Jeder Agent hat zugewiesene Verzeichnisse (definiert in config.md).
Ein Agent arbeitet NIE in den Verzeichnissen eines anderen Agents.

### Shared Contracts
- Shared Types und API-Interfaces werden in Phase 1 definiert
- Waehrend Phase 2 sind sie READ-ONLY
- Aenderungen an Shared Contracts erfordern: STOPP aller Agents, Mensch entscheidet, Neustart der betroffenen Chunks

### Branch-Konventionen
- Format: `feature/<chunk-nr>-<agent>-<beschreibung>`
- Beispiele:
  - `feature/01-claude-code-api-endpoints`
  - `feature/02-antigravity-dashboard-ui`
  - `feature/03-claude-code-auth-logic`

### File-Locking (implizit)
Kein technisches Locking, aber:
- Der Plan definiert welcher Agent welche Dateien beruehrt
- Wenn zwei Chunks dieselbe Datei brauchen: sie sind NICHT parallelisierbar
- Der Plan muss das in Phase 1 explizit markieren

## Uebergabe-Artefakte

Wenn ein Agent Output produziert den ein anderer Agent braucht:

1. **API-Contracts:** JSON-Schema oder TypeScript-Interface
2. **Shared Types:** TypeScript Types/Interfaces in shared Verzeichnis
3. **Status-Updates:** Agent meldet "Chunk X fertig" an den Mensch
4. **Blocker:** Agent meldet "Chunk X blockiert wegen Y" an den Mensch

## Eskalations-Kette

```
Agent hat Blocker
    |
    v
Agent dokumentiert Blocker (was, warum, was versucht)
    |
    v
Agent STOPPT
    |
    v
Mensch entscheidet:
    ├── Scope reduzieren
    ├── Ansatz aendern
    ├── Manuell fixen
    └── Anderen Agent beauftragen
```

## Reihenfolge bei Konflikten

1. Shared Contract muss geaendert werden? → Alle Agents stoppen, Mensch entscheidet
2. Zwei Agents brauchen dieselbe Datei? → Chunks sind sequentiell, nicht parallel
3. Agent kommt nicht weiter? → Eskalation, nicht endlos loopen
4. Widerspruch zwischen Agents? → Mensch entscheidet, nicht der "staerkere" Agent
