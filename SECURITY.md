# Security Policy

## The API key is the only secret here

This project is a thin wrapper around the Flow Open API. The single sensitive value is
your **Flow API key**.

- Store it **only** in a local `.env` file (gitignored). Never in code, docs, issues,
  PRs, screenshots, or slides.
- The client (`scripts/flow.mjs`) reads the key from `FLOW_API_KEY` / `.env` and never
  prints it.
- Writes hit a real workspace immediately. Experiment in a throwaway/test project.

## If a key is exposed

Rotate it right away from Flow's **키관리 (Key Management)** page — issuing a new key
invalidates the old one. Then scrub it from wherever it leaked (and from git history if
it was committed).

## Reporting a vulnerability

Found a security issue in this repo (e.g. a code path that could leak the key, or a
dependency risk)?

- **Do not** open a public issue for anything that could expose secrets.
- Email **qortkdgus95@gmail.com** with details and steps to reproduce.
- For non-sensitive hardening ideas, a regular issue is fine.

We'll acknowledge within a few days and aim to address confirmed issues promptly.

## Supported versions

This is an early-stage project; only the latest `main` is supported.
