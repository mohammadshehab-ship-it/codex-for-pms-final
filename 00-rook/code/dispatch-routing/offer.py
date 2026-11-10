"""Putting the offer on somebody's phone and waiting for an answer.

We work down the ranked list one at a time. Each responder gets the
callout and a fixed window to answer. If they take it we're done. If
they don't, we move on.
"""

import time

from config import OFFER_TIMEOUT_SECONDS
import history
import routing

TAKEN = "taken"
TURNED_DOWN = "turned down"
MISSED = "missed"

# Pilot defaults, in seconds. Availability checks do not change eligibility.
CONFIRMED_MISS_LIMIT = 3
MIN_REPLY_TIME = 30
MISS_WINDOW = 3600
CHECK_COOLDOWN = 3600
_misses = {}
_checks = {}


def confirm_available(responder):
    """Clear the miss streak and check cooldown after a timely response."""
    _misses.pop(responder.name, None)
    _checks.pop(responder.name, None)


def _record_miss(responder, callout, started, deadline):
    delivered = delivery_time(responder, callout)
    if delivered is None or not started <= delivered <= deadline - MIN_REPLY_TIME:
        _misses.pop(responder.name, None)
        return
    name = responder.name
    if deadline < _checks.get(name, float("-inf")):
        return
    recent = [miss for miss in _misses.get(name, []) if deadline - miss <= MISS_WINDOW]
    recent.append(deadline)
    if len(recent) < CONFIRMED_MISS_LIMIT:
        _misses[name] = recent
        return
    _misses.pop(name, None)
    _checks[name] = deadline + CHECK_COOLDOWN
    send_availability_check(responder)


def dispatch(callout):
    """Offer a callout down the ranked list until somebody takes it.

    Returns the responder who took it, or None if we got to the bottom
    of the list without a yes.
    """
    for responder in routing.rank_for_callout(callout):
        answer = offer_to(responder, callout)
        if answer == TAKEN:
            confirm_available(responder)
            history.record_accepted(responder)
            return responder
        if answer == TURNED_DOWN:
            confirm_available(responder)
    return None


def offer_to(responder, callout):
    """Push the callout to a responder's phone and wait for a tap.

    Returns TAKEN, TURNED_DOWN or MISSED. A decline or miss advances
    the offer without lowering the history score.
    """
    started = time.time()
    push_to_device(responder, callout)
    deadline = time.time() + OFFER_TIMEOUT_SECONDS
    while time.time() < deadline:
        answer = poll_device(responder, callout)
        if answer is not None:
            return answer
    withdraw_from_device(responder, callout)
    _record_miss(responder, callout, started, deadline)
    return MISSED


def delivery_time(responder, callout):
    """Return confirmed phone receipt time on the offer clock, or None."""
    return None


def send_availability_check(responder):
    """Queue a nonblocking availability prompt through the app integration."""
    ...


def push_to_device(responder, callout):
    """Send the offer to whatever device they're signed in on."""
    ...


def poll_device(responder, callout):
    """Has this responder answered yet? None if they haven't."""
    ...


def withdraw_from_device(responder, callout):
    """Take the offer off their phone. It's gone to somebody else."""
    ...
