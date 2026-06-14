# Contributing to flow-team-skill

Thanks for helping improve the Flow agent skill! This repo is small and dependency-free
by design — contributions should keep it that way.

## Ground rules

- **Never commit secrets.** API keys live only in your local `.env` (gitignored). If you
  ever paste a real key into a file, issue, or PR, rotate it immediately from Flow's
  키관리 page.
- **Keep it zero-dependency.** `scripts/flow.mjs` uses only Node 18+ built-ins. Don't add
  npm dependencies without a strong reason and a discussion in an issue first.
- **Verify against the real API.** When you add or change an endpoint, confirm the
  request/response shape with a live call and mark it ✅ in `reference/API.md`. Use a
  throwaway/test project for any write.

## Dev setup

```bash
git clone https://github.com/Mrbaeksang/flow-team-skill.git
cd flow-team-skill
cp .env.example .env          # paste your Flow API key
npm run check                 # syntax-check the client
npm run me                    # live smoke test (needs a valid key)
```

No build step — it's plain ES modules.

## Making changes

1. Open an issue describing the change (bug, new endpoint, doc fix).
2. Branch from `main`: `git switch -c feat/short-description`.
3. Keep edits focused. Match the existing style (small functions, clear names).
4. If you touched the API surface:
   - Update `skills/flow-team/reference/API.md` (schema + status marker).
   - Update `skills/flow-team/scripts/flow.mjs` if a convenience method fits.
   - Note the change in `CHANGELOG.md` under "Unreleased".
5. Run `npm run check` before pushing.
6. Open a PR using the template; link the issue.

## Commit messages

Conventional-ish prefixes are appreciated: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
Write the body in whatever language is clearest (Korean or English both fine).

## Scope

This repo wraps the **Flow Open API** for AI agents. Things that belong here: endpoint
coverage, schema accuracy, the client helper, agent guidance (SKILL.md), and recipes.
Things that don't: app-specific business logic, UI, or anything that bundles a key.
