# RegiBot

RegiBot is a local retrieval-augmented chatbot for Yaşar University course-registration questions. It answers only from the university's public official documents and academic calendar, then returns the source links used for each answer.

## Setup in 5 steps

1. Open this folder in a terminal.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and paste an API key from [console.anthropic.com](https://console.anthropic.com) into `ANTHROPIC_API_KEY`.
4. Run `npm start`.
5. Open [http://localhost:3000](http://localhost:3000).

## How it works

RegiBot uses RAG: question → BM25 retrieval over document chunks and, for date questions, the academic calendar → Claude receives the relevant passages → concise answer with cited source cards. Retrieval is local and the model is instructed to answer only from the passages included with the request.

```text
┌───────────────┐    ┌────────────────────────┐    ┌────────────────┐
│ Plain web UI  │───▶│ Express API            │───▶│ Claude API     │
│ question/lang │    │ validate + rate limit  │    │ passages only  │
└───────────────┘    └───────────┬────────────┘    └───────┬────────┘
                                 │                         │
                     ┌───────────▼────────────┐            │
                     │ BM25 chunks + calendar │◀───────────┘
                     │ data/chunks.json       │   answer + source IDs
                     └────────────────────────┘
```

### Data pipeline

```text
data/raw → node scripts/extract-pdfs.js → npm run build:chunks → data/chunks.json
```

`data/calendar.json` was hand-checked against the official academic-calendar PDF. The included source set is:

- Yaşar University Associate and Bachelor's Education-Training and Exams Regulation (Turkish and English)
- Student Affairs course-registration pages, OBS registration guide, and Student Affairs contact page
- 2026–2027 academic calendar
- Computer Engineering curriculum and prerequisite chart, and department contact page
- Student Handbook, 2025 revision 12 (its PDF is not committed)

The precise titles, authorities, and official URLs are in [`data/sources.json`](data/sources.json). When sources conflict, authority is **regulation → official Student Affairs/department pages → student handbook**. The documented conflicts and precedence decisions are in [`data/conflicts.md`](data/conflicts.md).

## Configuration

| Variable | Default | Purpose |
|---|---:|---|
| `ANTHROPIC_API_KEY` | empty | API key; required for model answers |
| `CLAUDE_MODEL` | `claude-haiku-5-5` | Claude model name |
| `CLAUDE_EFFORT` | `low` | Model effort setting |
| `DEMO_DATE` | current date in Europe/Istanbul | Fixed date for calendar demos; invalid dates are ignored |
| `PORT` | `3000` | Local HTTP port |
| `RATE_LIMIT_PER_MIN` | `10` | Per-IP requests per rolling minute |
| `RATE_LIMIT_PER_DAY` | `100` | Per-IP requests per day |
| `GLOBAL_DAILY_LIMIT` | `1000` | Requests per day across all IPs |

To switch to Sonnet, set `CLAUDE_MODEL=claude-sonnet-5-5` in `.env` and restart the server.

## Safety and limitations

- Keep the API key only in `.env`; never put it in frontend code or commit it.
- The server limits request rates and question length (500 characters). Do not submit personal or sensitive data.
- RegiBot does not access OBS accounts or require an OBS login.
- Retrieval uses keyword BM25 with light token folding/stemming. Turkish morphology and unusual paraphrases can reduce retrieval quality.
- Computer Engineering prerequisites are represented as a chart link; the chatbot may not resolve every course-specific prerequisite from the chart.
- There are no English Student Affairs pages in the source set.

## Tests

`npm test` is reserved for the Phase 3 test suite.

## Disclaimer

RegiBot is a student project, not an official university service. Always confirm registration decisions with your academic advisor and the official regulation.
