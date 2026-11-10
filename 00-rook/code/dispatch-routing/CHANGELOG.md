# Dispatch routing: changelog

## 4.3 (proposed)
- Missed offers still expire after 60 seconds and advance to the next responder without lowering the history score.
- Explicit refusals count as timely replies and no longer lower the score. Acceptances still earn credit. Existing scores carry forward.
- Three consecutive confirmed misses within an hour, each with at least 30 seconds to reply, can trigger an availability prompt. A one-hour cooldown limits repeat prompts while the responder stays silent. A timely reply or availability confirmation clears the streak and cooldown.
- Availability prompts do not pause offers or change eligibility. The course device hooks require app integration for delivery receipts and prompt delivery.
- Added a preview-first neutral-score repair for four reviewed responders affected by 4.2. It raises verified scores below 0.50 to 0.50, rejects stale reviews, and records applied changes in the local process. Live execution requires durable score and audit storage.

## 4.2, 12 Aug 2026
- Rebalanced ranking weights: proximity up, recent acceptance down.
- Callout offer timeout 90s -> 60s.
- Console filter persistence (not in this service).

## 4.1, 16 Jun 2026
- Proximity now uses a travel-time estimate instead of straight-line
  distance.
- Bulk callout.
- Mobile push reliability.

## 4.0, 7 Apr 2026
- Console navigation.
- Responder profile redesign.
- Routing override audit log.
