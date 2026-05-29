# Development Workflow

## Rules

Before each commit:

1. Run the project locally.
2. Check for TypeScript errors.
3. Run linting.
4. Run tests when available.
5. Commit using a professional English commit message.

## Commit Convention

Examples:

```bash
git commit -m "chore: initialize project structure"
git commit -m "feat: add authentication module"
git commit -m "fix: handle booking availability conflicts"
git commit -m "refactor: improve email service structure"
git commit -m "docs: update deployment guide"

Branching

The main production branch is:
main

Feature branches should follow this format:
feature/authentication
feature/booking-system
feature/email-automation
feature/owner-dashboard