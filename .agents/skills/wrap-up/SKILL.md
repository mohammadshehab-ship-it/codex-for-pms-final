---
name: wrap-up
description: Ends a class session in the Codex for PMs course. Use it when the student says "wrap up" (or "wrap up this session", "let's wrap up", "end of session", "we're done for today", "I'm done with this module"). It saves the prompts the student wrote this session into that module's prompts.md, adds what the session figured out to the Working context in AGENTS.md, and saves everything to GitHub.
---

# Wrap up

You're closing out a class session for a student in Product School's "Codex for PMs" course. They aren't technical, and they typed two words so they wouldn't have to type anything else. Their request is their yes: start right away with one plain sentence such as "Wrapping up today's session now." Don't ask them to type or paste anything unless a step below says to.

## 1. Work out which module this was

The module folders are 01-origin-story (Module 1), 02-super-hearing (Module 2), 03-rewind (Module 3), 04-x-ray-vision (Module 4), 05-super-speed (Module 5) and 06-sidekicks (Module 6).

- Use this thread: the module the student's work and questions were about.
- Database ping work is Module 3, folder 03-rewind. That is weekly ping numbers, responder-week rows, acceptance before and after 12 August, and SQL against Rook's database. File that work in 03-rewind even when 04-x-ray-vision/prompts.md describes those numbers as last session.
- The dispatch-routing code is Module 4, folder 04-x-ray-vision. That is offer.py, availability.py, config.py, history.py, the ranking weights, and the 60 second timeout. File that work in 04-x-ray-vision.
- If this thread both queried the ping database and opened the routing code, do not guess. Ask one short question: "Which module was today, 1 to 6?"
- If the thread doesn't make it clear, use the first module folder whose prompts.md still has an empty numbered slot.
- If you still can't tell, ask one short question: "Which module was today, 1 to 6?"

## 2. Save the student's own prompts

- Look back through this thread for the prompts the student wrote themselves. Leave out: the starter prompt each lab gives the whole room (the long, polished prompt the student pasted from a slide or the Zoom chat), "wrap up", "check my setup", "save my work", and short replies such as "yes", "ok" or "go ahead".
- Module 5 Lab A has no starter prompt. The student writes the first brief prompt themselves, usually a long one that names the Director's request, Meteor Mite or the handover note. Keep it, however polished it looks, unless it starts with one of the lines below.
- Also leave out any message that is, or starts with, one of the lines below. These are the slide starters and the stuck prompts the whole room is given. Saving them makes the graded prompt library look like the slides. A few words added at the end does not make one of these the student's own prompt.
  - What can you reach from here?
  - I just joined Rook Industries as PM for Rook Dispatch.
  - What's contradictory or missing between the Company section of Rook's wiki
  - Based on everything you now know about Rook, what should I be worried about
  - Group these, tell me how many are in each group
  - Read the four customer interviews in the Research section of Rook's wiki.
  - Read every support ticket in Rook's database.
  - Only look at what came in after 12 August.
  - You've now read both piles.
  - If I'd only read the interviews
  - Ask Rook's database for every ping since June.
  - Compare the support tickets against the pings
  - Pick one responder from the database who went quiet.
  - If I'd only asked for the number
  - Open the folder 00-rook/code/dispatch-routing/.
  - Ask Rook's database for last session's weekly numbers
  - Which file has last session's numbers
  - Find me the part of this code that takes points off somebody
  - Somebody has been quiet for a month.
  - If I'd only asked what the code does
  - The note says this shouldn't just be a setting we flip.
  - Save the brief exactly as it stands now
  - Take the brief you just wrote and build me a working prototype
  - Show me this happening to Meteor Mite
  - What would you have said if I'd asked you this an hour ago
  - I want to save a habit as something I can reuse.
  - Make a skill called review-checklist
  - Schedule review-checklist to run
  - Read AGENTS.md and all six prompts.md files in this repo.
- Write them into that module's prompts.md, one per numbered slot (### 1., ### 2., ### 3.), in the order the student typed them, exactly as typed. Don't fix spelling, trim, reword or summarize.
- If there are more prompts than empty slots, add ### 4., ### 5. and so on.
- If some slots already hold prompts (from an earlier wrap-up), keep them and add the new ones after them. Never overwrite or delete anything already in the file.
- Leave the file's header text as it is.
- If the student wrote no prompts of their own this thread, leave the file alone and say so.

## 3. Add to the Working context in AGENTS.md

- Under "## Working context", after everything already there, add three to six short plain lines: what this session figured out about Rook that isn't written there yet and that you'd want to know at the start of the next session. That means findings, which sources mattered, and questions still open.
- If the section still holds only the placeholder "_You'll fill this in during Module 1._", replace just that placeholder line.
- Don't repeat what's already there, don't add headings, and don't paste in whole documents.
- Never change anything above the "---" line (the session scope block).
- Rook is fictional. Keep all of this in AGENTS.md: never save it to memory or anywhere outside the course folder.

## 4. Module 5 only: check the build files

If today was Module 5, check that 05-super-speed/brief.md and 05-super-speed/prototype.html are both there. If either is missing, tell the student which one. Don't recreate it.

## 5. Save to GitHub

Follow the "save my work" routine in the course-setup skill (.agents/skills/course-setup/SKILL.md and its references/saving-work.md), with a short message such as "Module 2 wrap-up". Run its scripts exactly as that skill's "How to run the scripts" says, and handle every problem exactly the way that routine says.

## 6. Tell the student

A short checklist, then the link:

✓ Saved your prompts to <module folder>/prompts.md (how many)
✓ Added what we learned today to AGENTS.md
✓ Saved to GitHub: https://github.com/<their username>/codex-for-pms-final

If a step didn't work, mark it ✗ and give the fix in one plain sentence. If saving to GitHub failed, tell them their prompts and notes are safe on this computer and what to do next, per the save routine.
