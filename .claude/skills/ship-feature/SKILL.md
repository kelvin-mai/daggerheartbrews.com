---
name: ship-feature
description: Runs the planner → coder → tester → reviewer → tech-writer pipeline on one feature request.
disable-model-invocation: true
argument-hint: <feature request>
---

Run the pipeline for: $ARGUMENTS

You are the coordinator. Delegate each step to the named subagent and do
not do any role's work yourself. Subagents can't see this conversation,
so always name the .pipeline/ files in your delegation prompt.

0. Preflight:
   - Run `git branch --show-current`. If it's main, STOP and ask me to
     create a feature branch.
   - Run `git status --short`. If it shows anything, STOP and ask me to
     commit or stash first (the reviewer diffs the whole working tree).
   - Then `mkdir -p .pipeline && find .pipeline -name '*.md' -delete`.
1. planner: pass the feature request verbatim. Save its reply to
   .pipeline/spec.md. Show me the Goal, Files, Edge cases, Out of scope,
   and any BLOCKING questions, then WAIT for my approval. Don't continue
   without it. If I request changes, re-run the planner with my feedback
   and the current spec, then ask again.
2. coder: "Implement .pipeline/spec.md; write .pipeline/changes.md."
   If it replies `blocked: …`, STOP and show me the reason. Don't run the
   tester.
3. tester: "Test the change in .pipeline/spec.md and .pipeline/changes.md;
   write .pipeline/tests.md." If it reports source bugs, run the coder once
   more ("Fix the source bugs in .pipeline/tests.md; append to
   .pipeline/changes.md") and then the tester once more. Never loop more
   than once. If the second tester run still fails, continue to the
   reviewer anyway and flag it in the report.
4. reviewer: "Review the uncommitted change against .pipeline/spec.md. Run
   `git diff HEAD` and `git status --short`, and read any new untracked
   files." Save its reply to .pipeline/review.md.
   If the verdict is `fix first` with any finding of medium severity or
   higher, run the coder once more ("Fix the medium-or-higher findings in
   .pipeline/review.md; append to .pipeline/changes.md"), then the tester
   once more, then the reviewer once more (overwrite .pipeline/review.md).
   Never loop more than once. If the verdict is still `fix first`, continue
   to the tech-writer anyway and flag the open findings in the report.
   Low-severity findings and nits don't trigger the fix pass; list them in
   the report.
5. tech-writer: "Update docs and content/changelog/pending.mdx for the
   change in .pipeline/spec.md, .pipeline/changes.md and
   .pipeline/review.md; write .pipeline/docs.md."
6. Report: start with `tests: PASS` or `tests: FAIL (<n> source bugs)`,
   then the reviewer verdict (and whether a review fix pass ran), any open
   review findings, files changed (code and docs separately),
   the changelog bullets added, and any spec deviations from changes.md.
   Remind me that nothing is committed. I review `git diff` and commit
   myself.
