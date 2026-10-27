# First-time setup

Setup happens once, before Module 1, in two parts.

## Part 1: the setup prompt (already done if this skill is running)

The student pastes the course setup prompt (the one-line prompt from their
pre-class materials) into a Codex thread in the ChatGPT app. Codex downloads
the setup steps from `setup/SETUP.md` (setup v2.0) and follows them. Most
steps go online or write outside the thread's folder, so Codex asks the
student's permission for each; the student approves.

1. Checks that git works (on a Mac it may install Apple's command line
   developer tools; on Windows the student installs Git for Windows).
2. Installs GitHub's command-line tool, gh, into `~/.codex-for-pms/gh`. No
   administrator password.
3. Signs the student in to GitHub in their web browser, with a one-time code.
   gh remembers the sign-in. If the computer was already signed in, it asks
   the student to confirm that's their own account, not an employer's.
4. Creates their own public repo, `<username>/codex-for-pms-final`, from the
   course template, and copies it to `codex-for-pms-final` in their home
   folder.
5. Connects that folder only to their GitHub sign-in: their name, a private
   GitHub email (so their personal email stays off their work), and git's
   sign-in setting (set by `checkup.sh connect-git`). Nothing else on their
   computer changes.
6. Tells them to open the course folder in Codex, start a new thread there,
   and type "check my setup".

Pasting the course setup prompt again is always safe: it skips what's done and
repairs what isn't. It's the fix for anything to do with gh or signing in.

The student gets the one-line setup prompt from their pre-class materials
(the course's Learning Platform or the Module 1 slides). Don't write your own
version of it or of `setup/SETUP.md`.

## Part 2: "check my setup" (this skill)

Opening the course folder in Codex gives it the two Rook connectors
(rook-wiki and rook-database, set up in the folder's `.codex/config.toml`) and
the course's rule that lets the setup scripts run without a permission prompt
on a Mac (`.codex/rules/course-setup.rules`). Codex reads both only after the
student says yes to trusting the folder, which it asks the first time the
folder is opened. This skill and the wrap-up skill (`.agents/skills/`) load
either way. The check confirms the folder, the sign-in, both connectors and
saving, and leaves `setup/setup-complete.md` on GitHub so the instructor can
see who's ready.

## If the student hasn't run the setup prompt

If there's no `~/.codex-for-pms/gh`, no sign-in, and this folder isn't linked
to their own repo, tell them: "It looks like setup hasn't run on this computer
yet. In the ChatGPT app, with Codex selected, start a new thread on any folder
(Documents is fine), paste the course setup prompt (the one-line prompt from
your pre-class materials), and approve each step when Codex asks. Then come
back to this folder and type: check my setup."
