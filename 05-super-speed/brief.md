# Helping Farlight return to work

Executive one-pager for Helen Achebe · Proposed 4.3 experience · Fictional course scenario

## Who is it for?

Farlight and her handler, Linda Pruitt. Farlight received 11–13 offers and accepted 8–10 per week before release week. In the week starting August 10, she received ten offers and accepted four. In the following weeks she received three, one, then zero, with no acceptances. On September 3, Linda wrote, “I have checked her availability and everything is set to available.” She needs to know what Dispatch recorded and what she can do next. Farlight needs a visible way to confirm readiness and recover from an approved historical disadvantage. [1][2]

The original 4.2 code deducted points for both refusals and timeouts, with no recovery over time. The observed pattern fits that mechanism. Eligibility and ranking snapshots are missing, so we cannot attribute every lost opportunity to it. [3]

## What changes for them?

**Linda discovers the quiet period.** Farlight’s console profile shows offers received and taken in the last seven days, her stated availability, the time of her last readiness confirmation, and any recovery review. Linda sees “No offers recorded in the last seven days” when applicable. Unknown delivery or routing details display “Information unavailable.” Linda can request a review through the existing support channel.

**Farlight confirms readiness.** Her existing phone app provides “I’m available” and “Mark unavailable.” A successful confirmation shows “Availability confirmed” with a timestamp, visible to Linda. Updating availability uses the existing shared record and its established Supply contract. An advisory “Still available?” prompt can appear after repeated confirmed misses. Silence does not pause offers.

**An authorized operator completes an approved repair.** If Farlight’s verified current score is below neutral, the operator can preview a one-time increase to 0.50. Farlight and Linda see “Recovery adjustment applied” only after the change commits. A missing or changed score produces “Review needed” and no success message. This is a bounded recovery policy, not a reconstruction of the exact score she would otherwise have had.

**Future offers give her a chance to respond.** Accepting earns credit. Declining counts as a timely reply. A missed offer expires after 60 seconds without lowering her history score. Offers still depend on availability, travel time, capability match and ranking. The product promises a clear status and a completed adjustment when approved, not a job.

## What won’t it do?

This first version will not guarantee an offer, infer why Farlight was skipped without evidence, pause her automatically, or silently reset everyone’s scores. It will not build a separate handler phone app or change Supply’s maintenance rules. Exact historical replay and a new automatic score-decay policy are outside this proposal.

**Success:** Linda can explain Farlight’s recorded status and next action; Farlight can confirm availability and see whether a repair completed. During a controlled pilot, measure offers among eligible opportunities, timely replies, repeat misses, assignment time and unassigned callouts. Detailed release gates are below.

---

## Engineering appendix

### Proposed defaults and states

These defaults require Helen’s approval. Treat availability, prompt state and repair state as separate fields.

| Area | Trigger and transition | Visible result |
|---|---|---|
| Readiness | Authenticated Farlight selects available or unavailable. Persist through the established availability service before acknowledging. | Selected status and last confirmation time on both surfaces. A failed save retains the previous state and offers retry. |
| Prompt | Three consecutive qualifying misses within a rolling hour. Each needs confirmed device receipt leaving at least 30 seconds before expiry. | Queue “Still available?” with the two readiness actions. Keep eligibility unchanged. |
| Prompt reset | Timely acceptance, explicit decline, or readiness confirmation clears the streak. | Resolve the active prompt. Confirmation of an expired prompt must not overwrite a later unavailable choice. |
| Prompt cooldown | One hour after an attempted prompt unless a timely response clears it. Expired misses leave the rolling window. | Suppress duplicate prompts. Missing, late or invalid receipts do not count and break the consecutive streak. |
| Repair | Review needed → preview ready → applied, or back to review needed if data changes. | “Review needed,” “Adjustment awaiting approval,” or “Recovery adjustment applied.” |

Display aggregate offer counts as observations. Missing eligibility or delivery data must not become a claim that Farlight ignored an offer.

### Data, rules and permissions

- Use stable responder, handler, callout, offer, prompt and repair identifiers. Require sent time, expiry, receipt time and source, response/outcome time, availability version, score version and policy version. Existing database rows lack several of these fields. New instrumentation is required.
- Capture receipt time on a trusted, normalized clock. Device receipt establishes delivery, not attention. A missing receipt cannot trigger the prompt rule.
- Farlight controls her readiness. Linda can view only responders assigned to her, manage their availability through existing permissions, and request a review. A separate authorized operator can approve repair. Neither client can write a score directly.
- Acceptance adds 0.08, capped at 1.00. Declines and misses deduct zero through the proposed offer flow. Reply deadline is 60 seconds. The simulated boundary accepts a reply before expiry and rejects one at expiry.
- Proposed repair for Farlight raises a verified stored score below 0.50 to 0.50. It leaves higher scores untouched. No missing score is silently treated as a stored 0.50. Capture the operator, evidence, reviewed score/version, before/after values and timestamp.
- Preserve the availability record’s schema and semantics for Supply. Keep prompt and repair information in separate records.

### Failure handling and acceptance criteria

| Case | Required behavior and check |
|---|---|
| Normal reply | Acceptance adds credit once and assigns the offer once. Decline advances immediately without score deduction. Both clear the streak. |
| Timeout | Expire and advance once. Score is unchanged. Unknown or late delivery never counts as a qualifying miss. |
| Prompt threshold | Two qualifying misses produce no prompt. The third within an hour produces one. Three outside the window produce none. No prompt state blocks routing, including when Farlight is the sole candidate. |
| Duplicate events/actions | Unique event and operation keys prevent double credit, duplicate prompt sends and repeated repair. Retries return the prior committed result. |
| Stale review | A score-version mismatch aborts the entire repair batch before writes and requests a fresh preview. Compare versions as well as values. |
| Concurrent acceptance and repair | Serialize score changes in shared storage. Preserve the acceptance credit or reject the stale repair. Multiple workers must observe the same state. |
| Restart or write failure | Score and audit event commit atomically. A restart retains the applied-operation key. A partial failure cannot show success or apply the repair twice. |
| Prompt delivery failure | Queue delivery asynchronously with bounded retries using the same prompt ID. Record delivery state. Routing continues even if the prompt service fails. |
| Repair reversal | Require a fresh, reviewed compensating adjustment. Do not blindly restore an old snapshot over newer acceptances. |
| Availability conflict | Reject a stale availability update. Reload current state and ask the user to confirm their intended change. |

### Gaps in the local proposal

The current code stores scores, streaks, cooldowns and repair records in process memory. Its lock covers a single process. It has no persistent operation keys, score versions, authorization layer, UI, or completed device integration. The prompt hook runs directly in the timeout path and could block or fail dispatch when integrated; move it behind a reliable queue. The legacy decline-penalty function remains callable although the new dispatch flow no longer invokes it. Audit all callers before rollout. [3]

The current confirmation function clears the streak but does not write availability. The proposed readiness actions therefore require the availability service integration described above. The stored weekly data ends September 6; launch screens require fresh events rather than these historical totals.

### Pilot evaluation

Proposed owners are Wen and Marcus for implementation, Ravi for measurement, Sofia for usability and Nadia for support follow-up.

- Test the three-screen flow with Farlight and Linda. Both should identify the current status, perform their permitted action, and distinguish an applied adjustment from a pending review.
- Compare offer share only among eligible opportunities using new candidate traces. Confirm any change is not solely a change in availability or incident mix.
- Track timely replies among confirmed-delivered offers with adequate reply time, repeat first-offer timeouts, median and 90th-percentile time to assignment, and unassigned callouts.
- Before launch, agree the baseline window, pilot duration, minimum observations and numerical guardrails. Pause expansion for breached assignment/coverage limits. Any incorrect score write or unauthorized adjustment stops repair application immediately.
- Run prompt and repair experiments separately where feasible, so their effects can be interpreted. A four-responder repair cohort is too small for broad statistical claims.

### Evidence

1. [Module 3 weekly rows and query](../03-rewind/weekly-pings.md), including Farlight’s ten recorded weeks.
2. Rook database, support tickets #3060 (August 17), #3110 (August 29), and #3130 (September 3). Linda reports correct availability, prolonged silence and a rare offer expiring.
3. [Current offer logic](../00-rook/code/dispatch-routing/offer.py), [history and repair](../00-rook/code/dispatch-routing/history.py), [ranking](../00-rook/code/dispatch-routing/routing.py), [configuration](../00-rook/code/dispatch-routing/config.py), and original course commit 06670ce for 4.2 behavior. The local files are a proposal, not evidence of deployment.
4. [Helen’s request](director-request.txt) asks for a one-page experience proposal before implementation and welcomes a clickable walkthrough.
5. [4.2 release notes and comments](https://app.notion.com/p/4-2-3eac8516f50181499fc4c5cf15c1ace7) document the timeout and weighting changes and the unresolved intent question.

### Decisions Helen must make before engineering builds

1. Approve the Farlight/Linda experience and the rule that both timely acceptance and decline avoid a ranking penalty.
2. Approve advisory prompts and their proposed threshold, reply-time requirement and cooldown.
3. Authorize the bounded neutral-score repair and designate its approver, accepting that it may soften some legitimate historical penalties.
4. Approve the instrumentation and durable storage work, then agree pilot guardrails and what work this displaces on the roadmap.
