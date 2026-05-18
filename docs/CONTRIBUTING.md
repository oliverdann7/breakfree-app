# Contributing to BreakFree

Thank you for helping build BreakFree! This guide covers everything you need to
contribute effectively — from reporting issues to merging code safely.

---

## Table of Contents

1. [Reporting Issues](#reporting-issues)
   - [Bug Report Template](#bug-report-template)
   - [Feature Request Template](#feature-request-template)
2. [Branch Naming Conventions](#branch-naming-conventions)
3. [Commit Message Standards](#commit-message-standards)
4. [Pull Request Workflow](#pull-request-workflow)
5. [PR Review Requirements](#pr-review-requirements)
6. [Merge Conflict Resolution](#merge-conflict-resolution)
7. [Pre-commit Hooks](#pre-commit-hooks)
8. [Code Style Guidelines](#code-style-guidelines)
9. [Linking Issues to PRs](#linking-issues-to-prs)

---

## Reporting Issues

All known problems and planned features must be tracked in
[GitHub Issues](https://github.com/oliverdann7/breakfree-app/issues).
Before opening a new issue, search existing ones to avoid duplicates.

Use the GitHub templates (automatically shown when you open an issue):
- **Bug Report** — for unexpected behaviour, crashes, or visual defects
- **Feature Request** — for new functionality or improvements

The raw templates also live in
[`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/).

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Tap on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- Platform: iOS / Android / Web
- OS Version: e.g. iOS 17.4
- App Version: e.g. 1.0.0
- Device: e.g. iPhone 15

**Logs / Error Output**
```
Paste console logs here
```

**Screenshots**
Attach if applicable.
```

### Feature Request Template

```markdown
**Feature Summary**
One-sentence description of the feature.

**Problem / Motivation**
What user problem does this solve?

**Proposed Solution**
How it should work.

**Acceptance Criteria**
- [ ] Criterion 1
- [ ] Criterion 2

**Mockups / Examples**
Wireframes or links to examples.
```

---

## Branch Naming Conventions

All work happens on short-lived feature branches off `main`. Name branches using
a **type prefix** followed by a brief kebab-case description:

| Prefix | Use for |
|--------|---------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation only |
| `refactor/` | Code restructuring (no behaviour change) |
| `test/` | Adding or fixing tests |
| `chore/` | Dependency updates, build config, tooling |
| `hotfix/` | Critical production fixes that need fast-track review |

**Examples:**

```bash
git checkout -b feat/push-notifications
git checkout -b fix/dashboard-chart-ios
git checkout -b docs/api-authentication
git checkout -b chore/upgrade-expo-51
```

**Rules:**
- Use kebab-case only (no underscores, no capitals)
- Keep descriptions short (2–4 words)
- Include the issue number when applicable: `fix/123-login-crash`
- Delete the branch after the PR is merged

---

## Commit Message Standards

BreakFree follows [Conventional Commits](https://www.conventionalcommits.org/).
This enables automatic changelogs and makes `git log` useful.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer: Closes #123]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature visible to users |
| `fix` | Bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Code restructuring, no behaviour change |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, tooling |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration changes |

### Scopes (optional but encouraged)

`auth`, `dashboard`, `onboarding`, `navigation`, `api`, `store`, `i18n`,
`notifications`, `analytics`, `web`, `ios`, `android`

### Rules

- Subject line is **imperative mood**, max 72 chars: `add`, `fix`, `update` — not `added`, `fixed`
- No period at the end of the subject line
- Body explains *why*, not *what*
- Reference issues in the footer: `Closes #42`

### Examples

```
feat(auth): add biometric login for iOS and Android

fix(dashboard): resolve chart rendering crash on first load

docs(contributing): add branch protection setup instructions

chore(deps): upgrade expo-notifications to ^0.29.0

test(onboarding): add unit tests for step validation logic
Closes #87
```

---

## Pull Request Workflow

1. **Create a branch** from the latest `main`:
   ```bash
   git fetch origin
   git checkout -b feat/your-feature origin/main
   ```

2. **Make focused commits** — each commit should be a logical unit of work.

3. **Run checks locally** before pushing:
   ```bash
   npm run lint:fix        # ESLint auto-fix
   npm run format          # Prettier
   npx tsc --noEmit        # TypeScript type check
   npm test                # Full test suite
   ```
   The pre-commit hook runs these automatically on staged files.

4. **Push and open a PR** against `main`:
   ```bash
   git push -u origin feat/your-feature
   gh pr create --fill
   ```

5. **Fill in the PR template** — all sections are required.

6. **Link the related issue** (see [Linking Issues to PRs](#linking-issues-to-prs)).

7. **Address review feedback** with new commits — do not force-push after
   review has started.

8. **Squash and merge** once approved. Delete your branch after merge.

---

## PR Review Requirements

Branch protection on `main` enforces:

| Requirement | Setting |
|-------------|---------|
| Required reviewers | **1 approval** minimum |
| Dismiss stale reviews | Yes — new commits invalidate old approvals |
| Required CI checks | `lint`, `type-check`, `test` (all must pass) |
| Up-to-date branch | PR must be current with `main` before merge |
| Direct push to `main` | **Blocked** — PRs only |
| Force push to `main` | **Blocked** |

### Reviewer guidelines

- Approve only when you've read all changed files, not just the summary
- Leave actionable comments — suggest the fix, not just the problem
- Distinguish between **blocking** (`must fix`) and **non-blocking** (`nit:`) feedback
- Respond to all comments before approving
- The author resolves conversations, not the reviewer

---

## Merge Conflict Resolution

Conflicts happen when two branches modify the same lines. Here's how to resolve
them without losing work.

### Golden rules

1. **Never force-push a shared branch** — it rewrites history others depend on.
2. **Rebase feature branches, merge into `main`** — keeps history linear.
3. **Resolve conflicts locally**, not via the GitHub web editor (it obscures
   context).
4. **Test after resolving** — conflicts in logic can compile but still be wrong.

### Step-by-step resolution

```bash
# 1. Fetch the latest main
git fetch origin

# 2. Rebase your branch on top of it
git rebase origin/main

# 3. For each conflict, open the file and look for markers:
#    <<<<<<< HEAD         (your changes)
#    =======
#    >>>>>>> origin/main  (incoming changes)

# 4. Edit the file to keep the correct content (may be both sides)
#    Remove all conflict markers when done

# 5. Stage the resolved file
git add <resolved-file>

# 6. Continue the rebase
git rebase --continue

# 7. Push the rebased branch (--force-with-lease is safe, not --force)
git push --force-with-lease origin feat/your-feature
```

### When to use `merge` instead of `rebase`

Use `git merge origin/main` (not rebase) if:
- You're on a **long-lived branch** shared with others
- You've already had your PR reviewed and don't want to invalidate approvals

After a merge-based conflict resolution, notify reviewers so they can re-check
the diff.

### Common conflict scenarios

| Scenario | Resolution |
|----------|-----------|
| Same line edited differently | Manually combine the intent of both changes |
| One branch deleted a file, other edited it | Decide if the deletion or edit should win; communicate in the PR |
| `package-lock.json` conflict | Accept one side, then run `npm install --legacy-peer-deps` to regenerate |
| Import order conflicts | Run `npm run format` after resolving to let Prettier normalise |

### Preventing conflicts

- **Pull `main` frequently** — rebase at least daily on long-running branches
- **Keep PRs small** — single-purpose branches merge faster and conflict less
- **Coordinate on shared files** — if two people must edit the same file, sync first
- **Avoid reformatting unrelated code** — style-only changes in feature PRs
  cause noisy conflicts for others

---

## Pre-commit Hooks

BreakFree uses [Husky](https://typicode.github.io/husky/) and
[lint-staged](https://github.com/lint-staged/lint-staged) to catch issues
before they reach CI.

### What runs on every commit

| Check | Scope | Tool |
|-------|-------|------|
| ESLint (auto-fix) | Staged `.js`, `.jsx`, `.ts`, `.tsx` files | `eslint --fix` |
| Prettier | Staged `.js`, `.jsx`, `.ts`, `.tsx`, `.json` | `prettier --write` |
| TypeScript | Whole project | `tsc --noEmit` |

### Installing the hooks

After cloning the repo, run:

```bash
npm install --legacy-peer-deps
npm run setup:hooks
```

`setup:hooks` calls `husky install`, which writes the Git hook wiring into
`.git/hooks/`. This is a **one-time step per clone**.

If you use `npm install` regularly, the `prepare` script runs `husky install`
automatically.

### Skipping hooks in an emergency

Only skip hooks when absolutely necessary (e.g., a WIP commit you'll amend):

```bash
git commit --no-verify -m "wip: scratch work"
```

Never skip hooks on a commit intended for PR review.

### Troubleshooting

| Problem | Fix |
|---------|-----|
| `husky: command not found` | Run `npm install --legacy-peer-deps` |
| Hook not running | Run `npm run setup:hooks` to re-initialise |
| `tsc` fails on unrelated files | Check `tsconfig.json` `include`/`exclude` paths |
| `lint-staged` changes not staged | Husky auto-stages Prettier/ESLint fixes — review the diff before committing |

---

## Code Style Guidelines

### TypeScript

- Use `strict` mode (already set in `tsconfig.json`)
- Prefer explicit return types on exported functions
- Avoid `any`; use `unknown` and narrow with guards
- Use `interface` for object shapes, `type` for unions and primitives

### React / React Native

- Functional components only — no class components
- Custom hooks for reusable stateful logic
- Co-locate styles with the component (`ComponentName.styles.ts`)
- No inline styles in JSX unless truly one-off

### Naming

| Entity | Convention | Example |
|--------|------------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Functions / variables | camelCase | `getUserData()` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Files (non-component) | camelCase | `authService.ts` |
| Directories | camelCase | `src/hooks/` |

### General

- No `console.log` in committed code (use the logger service)
- No commented-out code — delete it; Git history preserves it
- Imports ordered: external → internal → relative (Prettier handles this)

---

## Linking Issues to PRs

Always link your PR to the issue it addresses. GitHub automatically closes
linked issues when the PR merges.

### In the PR description

```markdown
Closes #42
Fixes #42     # same effect
Refs #42      # references without closing
```

Multiple issues:

```markdown
Closes #42, Closes #51
```

### In commit messages

```
fix(auth): handle token expiry on cold start

Closes #42
```

GitHub recognises these keywords in both the PR body and commit messages:
`close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves`,
`resolved`.

---

## Questions?

Open a [Discussion](https://github.com/oliverdann7/breakfree-app/discussions)
or ask in the relevant GitHub issue. We're here to help.
