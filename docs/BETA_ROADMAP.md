# Lumi beta / v1.0 roadmap

This document tracks the remaining work to move Lumi from prototype to public beta / v1.0.

## Current status

Lumi currently has a React + Vite + TypeScript frontend with child and parent modes, localStorage persistence, accessibility settings, visual support modules, parent guidance and multiple learning activities.

The repository still needs release engineering, content validation, QA, privacy/legal preparation and deployment documentation before public promotion.

## Beta readiness checklist

### Product and UX

- [ ] Run a full navigation QA pass on mobile, tablet and desktop.
- [ ] Validate all child-facing flows: routine, feelings, needs, calm zone, stories, games, learning, pain, plan changes and achievements.
- [ ] Reduce oversized components by extracting focused modules from `ChildModule.tsx` and `ParentModule.tsx`.
- [ ] Add clear empty states and reset flows for every localStorage-backed module.
- [ ] Review child-facing copy for positive language and low cognitive load.

### Accessibility and inclusion

- [ ] Audit contrast, focus states, keyboard navigation and reduced-motion behavior.
- [ ] Add automated accessibility checks where possible.
- [ ] Validate button sizes and touch targets on mobile.
- [ ] Confirm that sound/voice is always user-triggered, not automatic.

### Content and safety

- [ ] Review all parent-facing autism content with a qualified specialist.
- [ ] Keep the medical disclaimer visible in parent-facing pages and footer.
- [ ] Verify every clinic/directorate entry before using real data.
- [ ] Add source and last-verification date to directory entries.
- [ ] Add privacy notice explaining local-only storage for beta.

### Engineering

- [ ] Add GitHub Actions CI for `npm ci`, `npm run lint` and `npm run build`.
- [ ] Add CodeRabbit configuration and ensure the GitHub app is installed for PR reviews.
- [ ] Add PR and issue templates.
- [ ] Add smoke tests or component tests for critical flows.
- [ ] Remove unused dependencies or document why they are needed.
- [ ] Confirm dependency health before release.

### Deployment

- [ ] Decide final public domain/subdomain.
- [ ] Create production build and deploy static assets to Hostinger.
- [ ] Document Hostinger deployment steps.
- [ ] Configure cache headers and SPA fallback.
- [ ] Validate `.env` usage and avoid exposing secrets.
- [ ] Add basic analytics only if privacy-safe and disclosed.

### Promotion

- [ ] Prepare landing copy focused on support, learning and inclusion.
- [ ] Prepare screenshots or short demo video.
- [ ] Prepare one-page family guide.
- [ ] Prepare feedback form for beta families.

## Suggested milestones

### Beta 0.9 — Release hardening

Focus: CI, CodeRabbit, QA checklist, deployment documentation and critical fixes.

### Beta 1.0 — Public beta

Focus: Hostinger publication, safe content review, directory validation and family feedback loop.

### v1.0 — Stable nonprofit release

Focus: privacy policy, content review, accessibility audit, verified directory and release notes.
