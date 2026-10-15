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
- The eligibility checker uses a reviewed Bologna snapshot; legacy alternatives are accepted only when their exact published course code is marked completed. Chat retrieval still has a limited chart text extract and may not resolve every course-specific question.
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

The selected curriculum, completed course codes and manually checked steps
are saved under `regibot-planning-v1` in local storage. Existing language/theme
preferences remain separate. Email drafts and chat content are not persisted.
**Reset my planning data / Planlama verilerimi sıfırla** on either planning page
removes the shared planning record and the separate hypothetical scenarios. The
What-if page also has a scenario-only reset that preserves actual progress. Malformed storage is ignored and course/step
identifiers are filtered against the supported data. Unavailable browser storage
allows in-memory planning; failed writes/resets display a notice.

### Supported curriculum and remaining official data

`data/curricula.json` supports the 41 course codes already included for Computer
Engineering **2025–2026**, now checked using the links on the
[English department homepage](https://ce.yasar.edu.tr/en/):

- [Public Bologna course catalogue](https://obs.yasar.edu.tr/oibs/bologna/progCourses.aspx?curSunit=71&lang=en),
  default selected curriculum **2025 (2025 COMPUTER ENGINEERING)**, value `402794`.
  The catalogue exposes two similarly named 2025 versions; only the default selected
  version was checked. Confirm your assigned version in OBS.
- Individual Bologna course records in Turkish and English, linked per course.
  All 41 supported codes now have official bilingual titles, ECTS values and semesters.
- [English prerequisite page](https://ce.yasar.edu.tr/en/program-prerequisite-relationships/).
  This page links a different image (`2025/08/prequistes2025-1024x369.png`) from the
  older Turkish chart reference. Direct image downloads returned HTTP 403, so no
  rules were inferred from that image.
- [2026–2027 fall course schedule announcement](https://ce.yasar.edu.tr/en/2026/09/2026-2027-fall-semester-course-schedule/),
  now linked from the planning pages for manual timetable checks. The schedule
  spreadsheet is not imported or used to claim availability.

The review snapshot is `data/raw/ce-bologna-2025.json` (15 October 2026). It records
course metadata, exact requirement text, course IDs and source URLs. The English
records use the combined label “Prerequisites and co-requisities”; the corresponding
Turkish records explicitly label non-empty conditions “Ön Koşulları”, allowing those
conditions to be classified as prerequisites. No separate corequisites are specified
in the reviewed records; the interface says this explicitly rather than presenting
an invented corequisite rule.

**All 41 supported courses have verified prerequisite expressions**: 26 explicitly
list no prerequisite (`None` or `Yok`), and fifteen have prerequisite expressions
verified against the Turkish record. For example, COMP 2215 requires SE 1105;
COMP 4910 requires EEE 2110 **AND** ISG 9110 **AND** SE 2228.

Six OR expressions also name seven prior-curriculum codes. These are preserved as
literal alternatives in `priorCourses`, with direct source links. Students may mark
an exact prior course as completed in the optional **Completed courses from an older
curriculum?** section. For example, the published MATH 1132 rule accepts MATH 1131
**OR** MATH 131 **OR** MATH 111. This is not an inferred alias table: checking one
code never marks another code completed. Prior courses do not increase the current
curriculum's completion count. Their titles, ECTS and full old curricula were not
imported. Unavailable or malformed rules still return **Cannot verify**.

Elective slots and other curriculum versions are not imported; this is not a
complete elective catalogue. Semester is presentation/filter metadata, never a rule.
No sample rules are served to students. Synthetic rules exist only in unit tests.
Meeting checked requirements does not confirm availability, quota, timetable
compatibility or advisor approval.

To update rules:

1. Add a curriculum object with a stable `id`, bilingual `program`, `version`, and
   `courses`; keep old versions for students assigned to them.
2. Each course needs `code`, bilingual `title` (or `null` when unknown), `ects`
   (or `null`), `source`, `verification`, `prerequisites`, and `corequisites`.
   Exact prior-curriculum alternatives can be declared in `priorCourses` as
   `{ "code": "MATH 131", "source": "<official Bologna record>" }`.
3. Rule leaves are `{ "op": "course", "code": "SE 1105" }`. Combine them with
   `{ "op": "and", "items": [...] }` or `{ "op": "or", "items": [...] }`.
   Nest groups as needed. Referenced course codes must exist in the current course list or the
   explicitly sourced `priorCourses` list.
4. `null` means **verified absence of requirements only when verification is
   `verified`**. Otherwise it means unknown. Mark `verified` only after both the
   prerequisite and corequisite rules have been officially checked. Attach the
   exact official source URL; current validation allows CE/ECTS university hosts and the official OBS Bologna path.
   Keep a source review record when updating the dataset.
5. Retain the original `requirementsText` / `requirementsTextTr`, `semester`,
   source URL and verification reason in the review snapshot. Never invent an alias
   mapping: prior codes must be explicitly named in the cited rule.
6. Run `npm run test:planning`. The shared validator rejects unsupported operators,
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

### Planning page interactions

The planning pages match the Assistant's centered logo/title, quiet rounded cards,
gold accents, responsive spacing and dark theme. Course search, semester filters,
status filters and expandable requirement details stay in memory only. Progress
summaries count user-marked completions, independently of eligibility status.

On both pages, checked items move to the **Completed** section below pending items.
The browser animates the existing-to-new positions for 440 ms, preserves scroll,
expanded course details and keyboard focus, and announces the update. Unchecking
returns an item to its original position among pending items. Reduced-motion users
get the same ordering immediately, without animations. No timers defer persistence.
The deadline sidebar emphasizes upcoming dates and keeps past dates expandable.


## What if? Planner / Ya şöyle olursa?

Open **`#/what-if`** in the sidebar or choose **Explore what if / Olasılıkları
incele** on a course eligibility card. The selected curriculum and actual completed
course selections remain the baseline. Plan A and Plan B add *explicit hypothetical
successful passes* to independent sets. An optional searchable target selects the
requirements and paths to inspect. No account, OBS login, transcript or model key
is needed; no model is called for any dependency or readiness calculation.

Each plan distinguishes assumed passes, newly ready courses, unchanged baseline-ready
options, still-blocked courses and unknown rules. Comparison cards show baseline,
A and B statuses, ECTS, localized titles, grouped requirements and official records.
Explanations are generated from rule evaluations and satisfied proofs; an OR group
is a choice, not a list of mandatory courses. The proof prefers an already satisfied
baseline alternative over a redundant hypothetical pass. Exact legacy alternatives
are accepted from existing baseline selections without inventing aliases. Hypothetical
selectors contain the current supported course list; they do not offer unverified
old curricula or extra elective courses.

**No automatic completion propagation:** if passing SE 1105 makes COMP 2215 ready,
COMP 2215 is still not passed. COMP 3304 therefore does not become ready through
that chain unless COMP 2215 is actually completed or explicitly assumed passed.
Adding an assumption with unsatisfied requirements is allowed as a *conditional
input*, with a visible warning; its downstream results are not presented as a feasible
registration plan. An iterative ordering check adds only explicitly assumed courses
whose requirements can be satisfied, flags sequencing between them, and reports
unmet/unknown assumptions or unresolved circular orders. It does not assign semesters.

**Postponement:** remove an assumed pass using its postpone shortcut. The planner
reevaluates the before/after completion sets and lists actual losses of readiness,
plus cases preserved by a satisfied OR alternative. It does not label all descendants
as blocked. Postponing an actually completed course shows an explanation and leaves
the baseline intact. A course assumed passed is not itself counted as a newly ready
option. Plan A/B option differences also exclude a course already assumed passed
in the other plan, since that is a completed hypothetical choice rather than a lost
prerequisite opportunity.

**Dependency view:** an SVG focuses on a selected target's prerequisite ancestors
or published dependents, with a twelve-node compact limit and a full relevant text
list. Arrows point from the required course to its dependent; corequisites have
separate dashed edges. Full AND/OR expressions remain adjacent in the text view.
Colors distinguish actual completions, hypothetical passes, ready, blocked and
unknown nodes. Referenced legacy codes with no course-detail rule remain unknown
as graph nodes unless actually completed. Direct references and indirect chains
are structural relationships; whole-plan readiness changes are shown separately.
The graph uses iterative traversal, detects possible cycles and omits malformed or
unverified rules. A structural OR cycle may be avoidable and is not automatically
classified as a real scheduling deadlock. The comparison engine does not recursively
complete anything while traversing the graph.

**Corequisites:** the existing checker evaluates them separately and treats them
as satisfied only by a completion in the chosen set. Concurrent enrollment is not
represented. Sequencing checks follow those same conservative semantics; confirm
any concurrent-enrollment arrangement with an advisor.

**Storage and isolation:** `regibot-what-if-v1` contains only version, selected
curriculum ID, Plan A/B course codes and optional target. It is separate from
`regibot-planning-v1`. Searches, display filters, graph view and the last postponement
comparison are in memory only. Values are checked against the selected curriculum;
a mismatching curriculum or storage version resets the effective scenario rather
than applying old course choices to a new curriculum. Malformed storage is discarded;
unavailable storage allows in-memory use with a notice. Scenario-only reset removes
this record without touching actual completions or checklist progress. Actual
baseline changes trigger recalculation, including storage events from another tab.
Scenario writes never mark actual courses completed.

Results compare published prerequisites. They **do not confirm offerings, quotas,
timetable compatibility, advisor approval, a valid ECTS load, or graduation dates**.
Curriculum semester is not an offering calendar. The data covers the supported 2025
course list, not all electives or curriculum versions.

`npm run test:planning` runs both the existing planning suite and
`tests/what-if.test.js`: AND/OR and legacy alternatives, direct/indirect relationships,
OR-preserved descendants, absence of automatic completion, sequencing, unknown and
malformed rules, cycles (including avoidable OR cycles), corequisites, A/B and baseline
isolation, storage validation/reset and curriculum changes. DOM tests exercise TR/EN,
light/dark settings and narrow/wide configurations, including search, target selection,
postponement, protected actual completions and cross-tab baseline updates. These DOM
and CSS checks complement visual browser QA; they are not screenshot-based layout tests.
