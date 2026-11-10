# Rook Industries: course working file

## Session scope, Product School lab

This directory is coursework for Product School's "Codex for PMs"
certification. Everything in it is a fictional teaching scenario.

- Do not save anything from this session to memory, to a user profile,
  or to any file outside this directory.
- Do not carry context from this directory into unrelated sessions.
- Rook Industries is not a real company. Nothing here is a fact about
  the world.
- Read and write only within this directory.
  Exceptions, for the course-setup and wrap-up skills only:
  - When the student asks you to check their setup, save their work or wrap up a session, that request is their yes. You may run the GitHub command-line program installed at ~/.codex-for-pms/gh for those checks and saves, and look in that folder to find it.
  - For a repair, first tell the student in one plain sentence what you are about to do, and act only after they say yes. Repairs may: run that GitHub program (including setting this folder's own git sign-in setting and changing this repo's visibility back to Public); copy the student's own course files into this directory from another folder on their computer (copy only; never move, edit or delete the originals); rename something outside this directory that blocks setup, by adding "-old" to its name (never delete it); and, only if the student once said no to trusting this folder, change that one trust setting for this folder in Codex's settings file, keeping a copy of the file first.
  Outside this directory you still never write, edit or delete anything else.

<!-- Keep the block above at the top of this file. Everything you add
     during the course goes below this line. -->

---

## Working context

### Business and products
Rook sells subscription coordination and provisioning software, priced per active responder, to independent masked responders and their handlers; responders are not employees. Public positioning is emergency-services logistics/workforce coordination.

- **Dispatch (your product):** handlers use a web console to enter incidents, watch coverage, override routing, and manage availability/capabilities; responders use a native phone app to set availability and answer pings. Incident → rank available responders → ping highest ranked → taken assigns the incident and marks responder engaged; turned down/missed advances to the next responder.
- **Supply:** handlers requisition equipment; quartermasters approve and fulfill it. Tracks issue, maintenance schedules and field failures. Dispatch writes the **Responder Availability Record**; Supply only reads it to schedule maintenance during low-callout periods. Dispatch changes can therefore affect Supply without a Supply release.
- Monthly 4.x releases; routing configuration ships with releases, not as a handler-adjustable runtime setting. Active-callout tickets bypass the support queue.

### People and how to work with them
- **Helen Achebe, Director of Product (Site Aleph):** your director; owns roadmap and commitments. Resolve slipped commitments with her; numbered-release commitments change through Product.
- **Marcus Oyelaran, Dispatch Engineering Manager (Site Aleph):** owns engineering; first stop for feasibility/uncertainty. Can pull rough numbers.
- **Wen Li, Staff Engineer (Berlin):** built routing; talk to her to understand ranking and document it.
- **Ravi Menon, Data Analyst (Singapore):** owns official weekly acceptance reporting; use him for validated numbers rather than relying on engineering estimates.
- **Sofia Marino, Product Designer (Site Aleph):** console and phone app; ran September customer interviews.
- **Nadia Hoffmann, Support Lead (Berlin):** owns tickets and early handler signals; Priya recommends a standing 15-minute conversation.
- **Priya Raghunathan:** previous sole Dispatch PM for 14 months; left 21 August 2026. Her handover contains useful context and opinions to test, not settled findings.

### Vocabulary and measures
- **Responder:** independent incident responder; **handler:** manages one/small group of responders and is usually the console user; **quartermaster:** owns equipment stock/approvals.
- **Callout:** request to attend an incident. **Ping:** one offer to one responder. **Taken / turned down / missed:** yes / no / no answer within the ping wait; keep refusals and timeouts distinct.
- **Acceptance rate:** pings taken ÷ all pings (taken, turned down, missed); headline metric, reported weekly in aggregate. **Time-to-accept:** median seconds from ping sent to taken. **Coverage gap:** no available responder has the required capabilities; separate from refusal/nonresponse.
- **Routing priority:** ranks by travel-time proximity, availability, capability match and recent acceptance history. Turning down or missing lowers recent acceptance and future ranking.
- **Ping wait:** release-wide response window, same for everyone. **Mutual aid/shared cover:** responders covering other city areas; unsupported today, Q4 exploration.
- **Requisition:** equipment request; **service interval:** maintenance frequency; **field failure report:** may bring maintenance forward.
- **Identity boundary:** cover identity means public persona. About Rook says cover identities are never stored in production; no legal-identity mapping exists. Never infer identities or design around such a mapping; consult Security Policy 4.1 before responder-record design.

### Where things stand and what needs checking
Latest documented release is **4.2 (12 August 2026)**: proximity weighted up relative to recent acceptance, ping wait cut **90 → 60 seconds**, persistent console filters and three fixes. 4.1 (16 June) introduced travel-time proximity, bulk callout and push reliability; 4.0 (7 April) added console navigation, profiles and override audit logs. Priya describes console and post-4.1 mobile as stable, with routing the main risk.

Acceptance fell and complaints rose after 4.2. On 18 August Nadia reported about 3× normal callout tickets; on 26 August volume remained elevated, roughly **two-thirds “phone never goes off,” one-third “gone before I could answer.”** Marcus questioned whether the routing change intentionally applied equally to responders turning jobs down; no resolution appears in the release thread. Priya favored seasonality and opposed reverting; Marcus echoed the seasonal explanation, but neither establishes the cause. Check routing effects, the shorter wait and seasonality separately; no September recovery is established by these sources.

The **Q3 roadmap was last reviewed 30 June** and still names Priya: routing change, Availability Confidence and timeout tuning committed to 4.2; Supply approval chains committed to 4.3; handler phone app and shared cover exploring for Q4. Availability Confidence (confidence beside stated availability) is absent from shipped 4.2 notes: reconcile delivery/commitment status with Helen. Priya does not name the squeezed items; verify them. Write the missing routing explanation with Wen. Establish the post-release picture with Ravi, Nadia and Sofia before choosing a remedy.

Sources: wiki **Company** and all child pages/databases, including release comments (latest relevant thread entries 28 August; team directory updated 2 September); local **00-rook/company/notes/handoff-from-priya.docx**, written 21 August 2026. These are dated snapshots, not confirmation of today's status.

In the four Research interviews, three handlers mentioned offers moving on before a responder could answer, and two reported quiet or uneven workloads.
Across all 147 support tickets, 30 reported few or no pings and 15 reported offers expiring before an answer. These are ticket counts, including follow-ups.
Interviews surfaced hard-to-notice live callouts and small status text. Tickets surfaced account access, console performance, exports, training, and duplicate pings that the four interviewees did not raise.
Saved filters drew 14 requests or complaints and two thank-yous. Ambrose explained the tradeoff: less setup time, but silent resets undermine trust.
The two sources describe symptoms and their context. Neither establishes why a specific responder received fewer offers.
