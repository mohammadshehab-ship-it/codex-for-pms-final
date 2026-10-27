# Troubleshooting

Symptom by symptom. You do every repair yourself; the student never does
file work by hand. For each one: commit the student's work first (see
saving-work.md), tell them in one plain sentence what you're about to do,
wait for their yes, do it, and tell them the result. Rename instead of
deleting. When a fix doesn't work, tell the student to post
in their course Slack channel: what they were trying to do, the exact error
message, and whether they're on a Mac or Windows.

Most fixes start with `checkup.sh`. Run the scripts as "How to run the
scripts" in SKILL.md says. Your own `git` and GitHub commands in a repair
(fetch, merge, commit, remote changes, `gh`) need approval to run outside the
sandbox: Codex keeps the folder's `.git` read-only and blocks the network
inside it. Ask for that approval up front; the student sees its
justification, so make it a short plain question about what it does for
them.

## GitHub tool missing or not signed in

`CHECK2=fail:gh-missing` or `fail:not-signed-in`, or git says "Authentication
failed", "could not read Username", or "Permission denied" (403).

First make sure the check ran outside the sandbox: inside it, gh can't reach
GitHub and looks signed out. If it did run outside and still fails:

The GitHub tool (gh) lives in `~/.codex-for-pms/gh` and keeps the student
signed in. It may be missing if the folder was renamed or another tool cleaned
it up; the sign-in may be gone if they signed out or GitHub ended it.

**Signed in, but git isn't using the sign-in.** `CHECK2=fail:git-not-connected`
(`SIGNED_IN=yes`, `GIT_SIGNIN=not-connected`), or `SIGNED_IN=yes` but git
says "could not read Username" or "Authentication failed".

1. Say: "Your computer is signed in to GitHub, but saving isn't using that
   sign-in yet. Can I connect the two?"
2. On yes, run `checkup.sh connect-git`. It sets the course folder's own git
   setting, the same one Step 5 of `setup/SETUP.md` sets (an empty
   `credential.https://github.com.helper` entry, then one that runs the
   GitHub tool with `auth git-credential`), and checks it with
   `GIT_TERMINAL_PROMPT=0 git ls-remote origin`. It needs no password and
   never changes git's settings for the rest of their computer: never run
   `auth setup-git` or `git config --global`. `RESULT=connected` is what you
   want; `RESULT=failed`: post in Slack with the `ERROR` line and Mac or
   Windows.
3. Run `save.sh "<message>"` again and tell them whether their work is saved
   now.

**Missing or signed out.** Tell the student, "Your GitHub sign-in needs a
refresh. In the ChatGPT app, with Codex selected, start a new thread on any
other folder (Documents is fine), paste the course setup prompt again (the
one-line prompt from your pre-class materials), and approve each step when
Codex asks. It only redoes what's missing. Then come back to this folder and
type: check my setup." Don't sign them in yourself, and never ask for a
password or token.

## My repo is Private, or my instructor can't see my work

`CHECK_PUBLIC=fail:private`, or the student says their instructor can't see
their work or their repo link shows "404". Their repo stays Public until the
course ends, so their instructor (and the instructor's setup check) can see
it.

1. Say: "Your repo on GitHub is set to Private, so your instructor can't see
   your work. Can I switch it back to Public?"
2. On yes: `checkup.sh make-public`.
3. `RESULT=public` or `already-public`: tell them it's Public again and give
   the link `https://github.com/<GH_USER>/codex-for-pms-final`.
   `RESULT=failed`: post in Slack with the `ERROR` line and Mac or Windows.

If `CHECK_PUBLIC=pass` and the instructor still can't see the work, it
probably hasn't been saved yet: run "save my work".

## A Rook connector doesn't show up

This thread has no rook-wiki or rook-database tools.

1. Check the folder: `CHECK1` must pass and the folder must have
   `.codex/config.toml` at its top. No `.codex/config.toml`? See "Repo created
   before the connectors".
2. Codex turns on the folder's connectors (and the course's rule for the setup
   scripts) only when the student has trusted the folder, and only in a
   thread started after that. The first time a student opens the course
   folder, Codex asks whether they trust it. Tell the student: "Start a new
   thread on your course folder: in the ChatGPT app, with Codex selected, open
   your course folder (<full path>), start a new thread there, and type:
   check my setup. If Codex asks whether you trust this folder, say yes."
3. If they said no to trusting the folder before, Codex remembers that in its
   settings file, `config.toml` in the `.codex` folder in their home folder,
   as a `[projects."<this folder's full path>"]` table with
   `trust_level = "untrusted"`. With their OK:
   1. Say: "Earlier, Codex was told not to trust your course folder, which
      keeps the Rook connections off. Can I change that one setting? I'll
      keep a copy of Codex's settings file first."
   2. On yes, copy the settings file to `config-old.toml` next to it (if that
      name is taken, `config-old-2.toml` and so on). Then change only that
      one value, for this exact folder, from `"untrusted"` to `"trusted"`.
      Change nothing else in the file. This needs approval to run outside the
      sandbox.
   3. Tell them to start a new thread on the course folder and type: check my
      setup.
   If there's no such line, don't edit the file: the trust question simply
   hasn't been answered yet, so step 2 is the fix.
4. Still missing: the computer may not reach the connectors (a company
   network can block them). Post in Slack with "Mac or Windows" and whether
   they're on a work network.

## A Rook connector is busy

The reply says "The Rook connector is busy right now. Wait a minute and try
again." or "The Rook wiki is not available yet. Try again in a few minutes."
This means it's busy, not broken: many students are using it at once, or the
wiki is being refreshed. Wait about 30 seconds and try again, up to 3 times.
Still busy: tell the student to try again in a few minutes. It isn't
anything on their computer.

## Wrong folder

`CHECK1=fail:not-a-repo` or `fail:inside-subfolder`, or the student opened
something like their home folder, a module folder, or an old unzipped copy of
the course.

Fix: "This thread is open on the wrong folder. In the ChatGPT app, with Codex
selected, open <home folder>/codex-for-pms-final, start a new thread there,
and type: check my setup." Write the path the way their computer shows paths.
If `codex-for-pms-final` doesn't exist in their home folder, they need to
paste the course setup prompt (the one-line prompt from their pre-class
materials; see first-time-setup.md).

If they have work in the wrong folder (for example, from an old unzipped
copy) and the course folder exists, copy it in for them. Do this from a
thread open on the course folder, so the scripts run from its top:

1. Say: "You have course work in <that folder>. Can I copy it into your
   course folder? If a file is in both places, I'll keep both copies, and I
   won't change anything in <that folder>."
2. On yes: `copy-in.sh "<that folder's full path>"`, written out in full
   (never `~` or `$HOME`). It commits the course folder first,
   copies new files, and saves a file that's already there with different
   content next to it as `<name>-from-old-folder`. It skips identical files
   and course settings.
3. `save.sh "Copy in work from another folder"`.
4. Tell them how many files came over (`NEW_FILES`), and name any file that
   now has a `-from-old-folder` copy (`KEPT_BOTH=` lines) so they can compare
   the two.

If this thread is open on the wrong folder, give them the new-thread
instructions above first, and offer the copy once they're in the course
folder.

## Linked to the course template

`CHECK1=fail:linked-to-template`. The folder is a copy of Product School's
course template, not the student's own repo, so their work can't be saved to
GitHub from here.

Fix: "This folder is linked to the course template instead of your own
GitHub repo. In the ChatGPT app, with Codex selected, start a new thread on
any other folder (your Documents folder is fine), paste the course setup
prompt (the one-line prompt from your pre-class materials), and approve each
step when Codex asks. It will set the old folder aside as
codex-for-pms-final-old and give you a fresh one linked to your repo."

When they come back in the new course folder and `OLD_FOLDER=yes` (a
`codex-for-pms-final-old` folder sits next to it), copy their work across for
them:

1. Say: "Your earlier work is in codex-for-pms-final-old. Can I copy it into
   your course folder? If a file is in both places, I'll keep both copies,
   and I won't change the old folder."
2. On yes: `copy-in.sh "<full path of the -old folder>"`, written out in
   full (for example `/Users/name/codex-for-pms-final-old`, never with `~` or
   `$HOME`, which keeps the course's rule from matching), then
   `save.sh "Copy in earlier work"`.
3. Tell them the result, as in "Wrong folder".

## Linked to the wrong repo

`CHECK1=fail:not-linked`, `fail:linked-elsewhere`, or `fail:someone-elses-repo`
(the repo belongs to a different GitHub account than the one signed in), or
git says "Repository not found".

1. If `SIGNED_IN=yes`, check the student's repo exists:
   `<gh> repo view <GH_USER>/codex-for-pms-final --json url`.
2. It exists, and this folder is otherwise the course folder: with the
   student's OK, point the folder at it:
   `git remote set-url origin https://github.com/<GH_USER>/codex-for-pms-final.git`
   (or `git remote add origin …` if there's none). Then run `save.sh`, which
   merges anything already on GitHub.
3. It doesn't exist, or they signed in with a different account than the one
   they meant to use: the course setup prompt fixes both. Tell them to paste
   it again (the one-line prompt from their pre-class materials) in a new
   thread on another folder.

## Repo created before the connectors

The folder has no `.codex/config.toml`, or no `.agents/skills/course-setup/`,
because the student's repo was made from an older version of the course
template.

Fix, with the student's OK:

1. Save their work first (`save.sh "Before course update"`; if the folder has
   no scripts yet, commit with `git add -A` and `git commit -m "Before course
   update"`).
2. `GIT_TERMINAL_PROMPT=0 git fetch https://github.com/Product-School-Platform/codex-for-pms-template.git main`
3. If any file under `.codex/` or `.agents/` that the template also has
   already exists here and is different, rename it with `-old` first and tell
   the student.
4. `git checkout FETCH_HEAD -- .codex .agents`
5. `save.sh "Add the course connectors and setup skill"`.
6. Tell them to start a new thread on the course folder and type: check my
   setup. If Codex asks whether they trust the folder, they say yes.

## Not on the main branch

`RESULT=detached`, or `git status` says "HEAD detached" or names a branch
other than main. Commit first (`git add -A`, `git commit -m "Save before
switching back"` works even when detached), then with their OK:
`git branch saved-work-old` (keeps that commit), `git checkout main`,
`git merge saved-work-old`, and save again. If the merge clashes, use
"Keeping both versions" in saving-work.md.

## Name or email not set

git says "Please tell me who you are" or "empty ident name". `save.sh` fixes
this itself when gh is signed in. If it reports `RESULT=no-identity`, fix the
sign-in first ("GitHub tool missing or not signed in").

## Something is in the way

A file or folder blocks setup: a half-finished file or leftover copy in the
course folder, or something outside it (for example, a leftover
`codex-for-pms-final` that isn't their course folder). Outside the course
folder, rename only the thing that blocks setup, and only by adding `-old` to
its name.

1. Say: "<name> is in the way. Can I rename it to <name>-old? Nothing in it
   will be deleted or changed."
2. On yes, rename it by adding `-old` to its name (if that name is already
   taken, `-old-2`, `-old-3` and so on), the same rule `setup/SETUP.md`
   follows. Never delete it.
3. Tell them what you renamed and where it is now.

## Offline

"Could not resolve host", "Failed to connect", or timeouts, from a command
that ran outside the sandbox. (Inside the sandbox those errors are expected
and mean nothing: run it again outside first.) The work is safe on this
computer (it's committed). Tell the student to try "save my work" again when
they're back online.
