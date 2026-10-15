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
Course Explorer also has an advanced-comparison reset that preserves actual progress and the simple course choice. Malformed storage is ignored and course/step
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


## Course Explorer / Ders Keşfi

Open **`#/what-if`** from the sidebar or select **Explore this course / Bu dersi
keşfet** on an eligibility card. The existing route remains valid. Search for one
course by code or localized title; the picker displays your choice and results
appear immediately. A small **Clear / Temizle** control clears only this choice.
There is no pass/postpone toggle in the explorer.

The explorer compares actual completed courses with those same completions plus
one explicit assumed successful pass. Its headline counts only **missing → met**
prerequisite-status changes for other courses. Actual completions, the selected
course, unchanged courses, and merely structural descendants are excluded.
Newly ready courses are never automatically completed. No model calls, accounts,
OBS login, or transcript uploads are used.

Current-curriculum completions and exact legacy selections are counted separately.
With no saved completions, the page explains that assumption and links to eligibility.
**Try an example** dynamically chooses a supported, verified, uncompleted course
using the data and actual selections, without a hardcoded result. Completed courses
are disabled in the picker; eligibility links can still focus them to inspect
published connections, with no hypothetical pass or invented new effect.

Results list newly ready courses with localized titles, ECTS, and a **Why? / Neden?**
disclosure containing exact grouped AND/OR requirements and official sources.
**Other courses this helps with** contains only directly referenced, still-blocked
courses, explaining the selected condition and remaining requirements. Indirect
chains appear separately under **Longer-term connections**, which explicitly requires
passing intermediate courses. An OR group shows alternatives, not mandatory combined
requirements. Satisfied actual alternatives keep their readiness independently of
an unnecessary hypothetical pass. A neutral zero-change message does not imply
that the selected course is unnecessary.

Selecting a course with unmet or unknown requirements is allowed for exploration,
with one conditional warning: its own requirements must first be satisfied and the
results assume it is eventually passed. The deterministic engine and verified data
remain shared with course eligibility and the existing planner.

**Optional prerequisite map:** **View prerequisite map** expands a focused SVG and
full accessible text equivalent. Arrows run from required course to dependent;
corequisites use dashed lines. Full AND/OR expressions stay alongside the connections.
Colors show actual completions, assumed passes, ready, blocked and unknown courses.
Direction and color controls stay inside the map; it does not repeat a results
dashboard. The compact graph limits nodes to twelve, with a full relevant text list
and horizontal scrolling to preserve readable labels. Traversal detects cycles and
omits malformed/unverified rules. An optional OR cycle does not necessarily imply
a scheduling deadlock. Referenced legacy courses without their own published rule
remain unknown as graph nodes unless actually completed.

**Advanced comparisons:** **Compare multiple courses — advanced** starts collapsed,
even for existing users. A discreet **Saved comparison available** indicator signals
saved Plan A/B choices. Full controls and A/B evaluation initialize only on expansion.
They retain existing pass/postpone modes, multiple-course assumptions, sequencing
warnings and plan comparisons. Postponing an assumption removes only that assumption;
actual completions remain protected. An iterative ordering check considers only
explicit assumptions, flags missing/unknown requirements and unresolved cycles,
and does not assign semesters or prove simultaneous enrollment. Opening the simple
explorer never writes to saved advanced comparisons.

**Storage and isolation:**

- `regibot-course-explorer-v1`: validated version, curriculum ID and simple selected
  course code. Clear removes this record only.
- `regibot-what-if-v1`: existing Plan A/B codes, target and presentation preferences.
  Existing records keep their meaning; no migration or automatic replacement with
  the simple choice occurs. The advanced reset removes this record only.
- `regibot-planning-v1`: actual completions and checklist progress, never written by
  hypothetical interactions. The global **Reset my planning data** clears all three.

Values are checked against the selected curriculum. Mismatched curriculum/version
or malformed records are ignored. Unavailable storage permits in-memory exploration
with a notice. Actual completion changes recalculate results, and storage events
synchronize actual selections and the separate hypothetical records across tabs.
Search text, map settings and whether advanced comparison is expanded stay in memory.

**Limitations:** checks published prerequisites only; offerings, quotas, timetable,
advisor approval, valid ECTS loads and graduation dates are separate. Curriculum
semester is not an offering calendar. Coverage remains the supported 2025 course
list, not every elective or curriculum version. Corequisites retain the existing
conservative completion-based semantics; concurrent enrollment is not represented.

**Verification:** `npm run test:planning` runs the existing planning and prerequisite
engine tests plus explorer tests for readiness counts, AND/OR and exact legacy
alternatives, no automatic propagation, direct versus indirect effects, completed
and conditional selections, separate storage/reset, saved comparison preservation,
sequencing, cycles and unknown rules. Stub-DOM tests cover TR/EN, light/dark and
narrow/wide configurations, keyboard interaction, clearing, map expansion, advanced
comparison, storage failure and cross-tab updates. Static CSS checks cover responsive
and reduced-motion rules. These are not visual browser tests; no browser was
available for desktop/mobile visual verification in this session.

## Course impacts inside the assistant

Ask **“What happens if I fail SE 1105?”**, **“SE 1105’ten kalırsam ne olur?”**,
**“Which courses would passing this unlock?”**, or **“Can I take COMP 4910 if I fail
EEE 2110?”**. The localized failure suggestion opens a compact course picker without
submitting an incomplete question. **Ask about this course / Bu ders hakkında sor**
on eligibility cards opens chat with that course selected. Course Explorer remains
available at `#/what-if`, with saved explorer choices and advanced plans unchanged.

Course codes, pass/fail/postpone intent, and name matching are resolved in ordinary
code on the server. Full localized titles and uniquely matching whole-word fragments
are supported; ambiguous names return matching choices. Pronouns use an unambiguous
recent subject (or the previously analyzed course shown in the picker). Unsupported
codes and missing context ask for clarification rather than inventing a dependency.
Unrelated failures such as login, payment or registration failures retain normal chat.
There is no model-based extraction or trusted model-supplied intent/code/graph.

**Privacy:** before submitting a course question, the browser offers an explicit,
per-answer choice to use saved completions or analyze without them. The prompt says
that the curriculum identifier and course codes will go to the assistant server.
Without opt-in, no browser-local completion list is included. General results assume
no supplied completions and say so; supplied selections are identified separately.
The usual question and recent chat history are still sent as part of chat. When
configured, the explanation provider receives the server-calculated result, relevant
course records and supplied course codes to explain that answer. No name, student
number, OBS credentials or transcript is requested. Chat, consent, snapshots and map
state remain in session memory; no new browser storage records are written. The
server does not persist completion records or modify actual progress/checklist state.

**Deterministic consequences:** the server uses `WhatIf.explorer` and the existing
prerequisite engine to compare the supplied completion set with that set plus one
explicit assumed pass. Not passing means leaving that course incomplete, never
removing an actual completion. Counts exclude the assumed course itself, completed
or unchanged courses, and merely indirect descendants. Remaining AND/OR conditions,
exact legacy alternatives, direct references, indirect chains, unknown rules and
the selected course's own requirements come from the same verified dataset as
eligibility. Newly ready courses are not automatically passed. A target course can
remain blocked even if the selected pass satisfies one of its conditions.

If the analyzed course is already marked completed, chat first asks whether the
student means a retake or a separate hypothetical comparison. The explicit override
removes the selected code **only from the answer's temporary completion set**, while
retaining the original supplied list and labeling the assumption. It never changes
actual completion data. Historical/legacy codes are accepted exactly as baseline
alternatives; hypothetical passes are restricted to the supported current courses.

**Cards and maps:** a compact card below the answer shows the analyzed course,
passed/incomplete comparison, immediate-change count and a short affected list.
Requirements, grouped AND/OR expressions and official record links are expandable.
Longer-term chains are labeled separately and require intermediate passes. The map
starts collapsed and uses the shared `public/course-map.js` renderer also used by
Course Explorer. Each message has its own SVG/DOM IDs, disclosure state and
passed/incomplete switch. Graph scrolling stays inside the map on narrow screens;
a readable list provides the full conditions and official links. Rendered labels
are escaped, sources pass the official course URL allowlist, and the model cannot
supply HTML, SVG, source URLs or graph definitions for these components.

Each answer captures a validated curriculum snapshot, original/effective completion
sets and calculation results. Later planning changes mark old cards as based on
changed selections and offer **Recalculate**, which opens a fresh consent choice.
They do not silently rewrite old facts or maps. Recalculation produces a new answer.

**API:** `POST /api/chat` retains its normal text, citations, actions, error handling
and rate limits. Course questions additionally accept:

```json
{
  "message": "What happens if I fail SE 1105?",
  "lang": "en",
  "planning": {
    "dataset": "ce-2025-2026",
    "sharing": "saved",
    "completed": ["MATH 131"]
  }
}
```

Use `sharing: "none"` and omit `completed` for a general comparison. Context validates
against the selected supported curriculum, allows at most 100 exact course codes
(including supported legacy alternatives), and rejects unknown codes, extra context
fields, and completion lists with `sharing: "none"`. Optional `courseChoice` must be
a supported choice for the question/clarification. Optional
`planning.hypotheticalIncomplete` must identify the analyzed course and occur in
the supplied list; it is accepted only as the separate hypothetical override.

A successful course response adds optional `analysis` with `version: 1`,
`type: "course-impact"`, a sanitized verified `dataset` snapshot, canonical `course`,
validated `intent`/`target`, `context` metadata, deterministic `result` and `createdAt`.
The frontend validates the snapshot and checks results against the shared engine
before rendering. Unresolved questions return `coursePrompt` instead of unsupported
analysis. The model receives structured calculated consequences and source records,
with instructions to explain rather than calculate. If the provider is absent,
fails, returns no text or truncates its answer, a deterministic explanation and the
valid impact card remain available. A model refusal still returns the existing
refusal response without an impact card.

**Checks:** `npm run test:planning` now includes focused course-impact and stub-DOM
chat tests: EN/TR resolution, ambiguous/missing context, AND/OR and legacy rules,
engine consistency, non-propagation, direct versus indirect effects, consent before
network submission, general/supplied context, completed-course conflicts/overrides,
stale snapshots, independent maps, escaping/validation, and provider failure/refusal.
Both language/theme settings and narrow/wide configurations are exercised by
stub-DOM/static CSS checks. `npm run test:chat-api` starts a temporary local server
with model calls disabled and tests the real HTTP validation, clarification,
fallback, normal errors, served components and rate limits. No browser was available
for real desktop/mobile visual verification; these checks are not visual QA. The
live explanation provider was not called during verification.

The existing curriculum coverage and completion-based corequisite limitations
remain. These comparisons do not establish offerings, quota, timetable compatibility,
advisor approval, GPA/scholarship consequences, or graduation delays.
