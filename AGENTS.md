# Lumi agent guidelines

Lumi is a nonprofit, child-facing, accessibility-first platform created by Make IT Group in collaboration with AMI.

## Product principles

- Keep the child experience visual, calm, simple and friendly.
- Do not diagnose autism, classify autism levels or imply clinical treatment.
- Do not promise clinical outcomes.
- Use positive reinforcement. Avoid wording like "fallaste", "mal", "incorrecto" or punitive language.
- Avoid automatic sounds, fast animations, visual clutter and overstimulating UI.
- Prefer large touch targets, short text, clear pictograms and predictable navigation.
- Treat clinic/directorate data as unverified unless a source and verification date are stored.

## Technical principles

- Do not rebuild the app from scratch for incremental tasks.
- Preserve existing routes and UI unless the task explicitly requires a redesign.
- Keep Vite + React + TypeScript as the current stack.
- Keep localStorage as the persistence layer until a backend/privacy plan exists.
- Run `npm run build` and `npm run lint` before merging when possible.
- Avoid collecting sensitive health data in this prototype.

## Release readiness

Before beta/public release, confirm:

- Build passes.
- Accessibility basics are reviewed.
- Health/parent content has safe disclaimers.
- Real-world directory entries are verified or clearly marked as samples.
- Deployment target and environment variables are documented.
