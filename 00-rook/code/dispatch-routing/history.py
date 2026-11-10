"""Recent acceptance: a running score of how often somebody has been
taking the callouts we send them.

One of the three inputs to ranking. Sits between 0 and 1. Everyone
starts at NEUTRAL_SCORE when we take them on.
"""

from datetime import datetime, timezone
from threading import RLock

from config import (
    ACCEPTANCE_CREDIT,
    DECLINE_PENALTY,
    SCORE_FLOOR,
    SCORE_CEILING,
)

NEUTRAL_SCORE = 0.5

_scores = {}
_score_lock = RLock()
_repairs = {}
REVIEWED_42_REPAIR_COHORT = frozenset({
    "Meteor Mite", "The Undertow", "Farlight", "Vesper",
})


def recent_acceptance(responder):
    """This responder's score right now. Read by routing.score()."""
    with _score_lock:
        return _scores.get(responder.name, NEUTRAL_SCORE)


def repair_42_scores(reviewed_scores, *, apply=False):
    """Preview or apply an approved batch of name-to-stored-score repairs.

    This administrative operation uses the same process-local store as
    routing. A live deployment needs a durable transactional store.
    """
    with _score_lock:
        pending = []
        for name, expected in reviewed_scores.items():
            if name not in REVIEWED_42_REPAIR_COHORT:
                raise ValueError(f"Responder outside the reviewed cohort: {name}")
            if name in _repairs:
                continue
            if name not in _scores:
                raise ValueError(f"No stored score to repair for {name}")
            current = _scores[name]
            if current != expected:
                raise ValueError(f"Score changed since review for {name}")
            if current < NEUTRAL_SCORE:
                pending.append({
                    "responder": name,
                    "before": current,
                    "after": NEUTRAL_SCORE,
                    "reason": "4.2 timeout penalty recovery",
                })
        if apply:
            timestamp = datetime.now(timezone.utc).isoformat()
            for change in pending:
                name = change["responder"]
                change["applied_at"] = timestamp
                _scores[name] = change["after"]
                _repairs[name] = change.copy()
        return pending


def record_accepted(responder):
    """They took the callout. Score goes up."""
    with _score_lock:
        _set(responder, recent_acceptance(responder) + ACCEPTANCE_CREDIT)


# TODO(2019): should this ease back toward NEUTRAL_SCORE on its
# own after a while? For: somebody who had a bad month shouldn't still
# be carrying it in the spring. Against: if somebody has stopped taking
# work, we probably want that to stick until they take work again.
# Leaving it as-is for now.
def record_declined(responder):
    """An explicit refusal lowers the score. Timeouts are not refusals."""
    with _score_lock:
        _set(responder, recent_acceptance(responder) - DECLINE_PENALTY)


def _set(responder, value):
    _scores[responder.name] = max(SCORE_FLOOR, min(SCORE_CEILING, value))
