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

`tests/questions.json` holds 30 student questions (15 Turkish, 15 English): 25 with expected facts and sources, and 5 the documents cannot answer, where RegiBot must say it doesn't know and point to Student Affairs. With the server running (`npm start`), run:

```
npm test
```

It sends every question to `/api/chat`, grades the answers, prints a table and writes `tests/report.md` (results, failures, run history, and the before → after notes). Each run is also saved in `tests/results/`. Use `BASE_URL=http://localhost:3001` to test another server, and set `RATE_LIMIT_PER_MIN=60` on the test server so 30 questions are not rate-limited. Current result: **30/30** (25/25 answers, 5/5 refusals) on `claude-haiku-5-5`. A run costs a few cents.

## Disclaimer

RegiBot is a student project, not an official university service. Always confirm registration decisions with your academic advisor and the official regulation.

## Student planning tools

The sidebar includes **Course Eligibility / Ders Uygunluğu** (`#/uygunluk`) and
**Registration Checklist / Ders Kayıt Kontrol Listesi** (`#/kontrol-listesi`). Both
support Turkish/English, responsive layouts and the existing themes. They work
without a model API key. The checklist covers curriculum review, course selection,
manual timetable comparison, ECTS review, OBS finalization and checking advisor
approval. Each step links to a guide/tool and its official source. Checkboxes are
personal notes; the app never registers courses or confirms approval.

Only the selected curriculum, completed course codes and manually checked steps
are saved under `regibot-planning-v1` in local storage. Existing language/theme
preferences remain separate. Email drafts and chat content are not persisted.
**Reset my planning data / Planlama verilerimi sıfırla** on either planning page
removes the shared planning record. Malformed storage is ignored and course/step
identifiers are filtered against the supported data. Unavailable browser storage
allows in-memory planning; failed writes/resets display a notice.

### Supported curriculum and remaining official data

`data/curricula.json` currently contains Computer Engineering **2025–2026** course
codes from `data/raw/ce-curriculum.txt`, which references the department's
[curriculum page](https://ce.yasar.edu.tr/mufredat-ve-on-kosul-iliskileri/) and
[official prerequisite chart](https://ce.yasar.edu.tr/wp-content/uploads/2025/09/prequistes2526.png).
The chart could not be retrieved for reliable verification during this implementation.
The text extract has course codes and semester groupings, but **no titles, ECTS,
prerequisite arrows or corequisite annotations**. Therefore all those fields remain
unverified. Uncompleted courses display **Cannot verify**, even if other courses
have been checked off. Elective slots without actual course codes are omitted;
this is not a complete elective catalogue. No sample rules are served to students.
Synthetic rules exist only in unit tests.

Before enabling verified decisions, obtain an accessible official chart or an
official department-approved structured export and review every arrow, legend,
course title, ECTS value, alternative condition, and corequisite designation.
Confirm which admission cohorts use that curriculum. Never derive rules from course
names, semester order or model output. Meeting checked requirements still does not
confirm availability, quota, timetable compatibility or advisor approval.

To update rules:

1. Add a curriculum object with a stable `id`, bilingual `program`, `version`, and
   `courses`; keep old versions for students assigned to them.
2. Each course needs `code`, bilingual `title` (or `null` when unknown), `ects`
   (or `null`), `source`, `verification`, `prerequisites`, and `corequisites`.
3. Rule leaves are `{ "op": "course", "code": "SE 1105" }`. Combine them with
   `{ "op": "and", "items": [...] }` or `{ "op": "or", "items": [...] }`.
   Nest groups as needed. Referenced course codes must exist in the dataset.
4. `null` means **verified absence of requirements only when verification is
   `verified`**. Otherwise it means unknown. Mark `verified` only after both the
   prerequisite and corequisite rules have been officially checked. Attach the
   exact official source URL; current validation allows CE/ECTS university hosts.
   Keep a source review record when updating the dataset.
5. Run `npm run test:planning`. The shared validator rejects unsupported operators,
   empty groups, unknown codes and malformed datasets. Corequisites are evaluated
   separately; this UI collects completed courses only, so an uncompleted
   corequisite must be confirmed as a concurrent enrolment by the student/advisor.

### Deadlines and assistant actions

Procedures use the [official Student Affairs registration page](https://oim.yasar.edu.tr/ders-kayitlari/)
(checked 15 October 2026) and the existing regulation sources. Deadline data uses
`data/calendar.json`, already hand-checked against the official 2026–2027 calendar
PDF in the repository. No extra advisor-approval deadline is invented. Update the
JSON against a newly published official calendar before supporting a new year.
Both the actual Europe/Istanbul date and any configured `DEMO_DATE` are shown;
event status uses the explicitly identified effective date.

Chat actions are generated by ordinary code after source mapping. The schema is
`{type: "navigate", destination: <allowlisted key>}`, `{type: "calendar", eventId}`,
or `{type: "email", topic: "quota" | "advisor"}`. The allowlist lives in
`public/planning-core.js`; `lib/actions.js` requires matching question/answer topics
and cited sources. Refusals, errors and unsupported actions have no buttons.
Calendar downloads in chat are deliberately conservative: the answer must include
the exact event title and matching ISO or Turkish/English date ranges and cite the official calendar.
Otherwise only the calendar page link is offered. Each structured checklist event
also has a direct calendar download. No model-provided destination, HTML or URL is
used for actions. Existing answer text, citation cards and rate limits are preserved.

`GET /api/calendar/:eventId.ics?lang=tr|en` accepts only a known structured event.
Current official events are date-only, so downloads use all-day `VALUE=DATE`
entries with an exclusive end one day after the displayed inclusive end. They do
not apply UTC conversions to local all-day dates or invent a deadline time.
Europe/Istanbul is used for today's date; timed events are not currently supported.
The generator escapes iCalendar text and folds UTF-8 lines.

Quota/advisor actions open an editable bilingual draft with placeholders for
unknown personal/course details. The recipient starts blank and must be verified
from official contact information (department for quota; assigned advisor for
approval). Opening the user's mail application never sends mail automatically.

Run `npm run test:planning` for deterministic rule, unknown-data, storage, action,
and calendar boundary tests without a model key. `npm test` remains the existing
30-question live-model regression suite and requires a running configured server.
