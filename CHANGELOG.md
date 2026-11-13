# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-11-13

### Added
- **IAM Bounded Context Integration:**
  - Domain layer: `User` entity, `SignInCommand`, and `SignUpCommand`.
  - Application layer: `useIamStore` Pinia store managing authentication state, token persistence, and sign-in/sign-up flows.
  - Infrastructure layer: `IamApi` gateway, `SignInResource`, `SignUpResource`, `UserAssembler`, `SignInAssembler`, `SignUpAssembler`, `iamInterceptor`, and `authenticationGuard`.
  - Presentation layer: `SignInForm` and `SignUpForm` views with kebab-case routing and localized input fields.
- **Session Persistence:**
  - Automatic restoration of authentication state (`token`, `username`, `userId`) from `localStorage` upon page refresh.
- **Render Deployment Blueprint:**
  - Added root `render.yaml` defining Render Static Site deployment with single-page application (SPA) rewrite rules.

### Changed
- Configured production API URL in `.env.production` to point to the deployed Render backend (`https://cryovigil-backend.onrender.com/api/v1`).
- Enabled `iamInterceptor` in `BaseApi` to attach `Bearer` authentication tokens to all outbound HTTP requests.
- Integrated `authenticationGuard` into Vue Router navigation lifecycle to safeguard protected routes.
- Bound user profile display and logout action in `layout.vue` to `useIamStore`.
- Updated application title in `index.html` to `CryoVigil`.
- Excluded mock server files from ESLint checks.

### Fixed
- Fixed undeclared variable `payload` reference in `useHistoryStore` (`src/history/application/history-store.js`).

## [1.0.0] - 2026-10-06

### Added
- **Domain-Driven Design (DDD) Architecture:**
  - Layered directory structure separating Domain, Application, Infrastructure, and Presentation concerns.
- **Laboratories Bounded Context:**
  - Laboratory registration, editing, real-time status monitoring, and sensor configuration.
- **Alerts Bounded Context:**
  - Critical/warning/resolved alert feeds, severity badges, and corrective action workflows.
- **History (Operation Events) Bounded Context:**
  - Incident event logs, filterable timeline, event details panel, and KPI summary.
- **Analytics & Dashboard:**
  - Real-time temperature trend charts, KPI cards, and recent activity monitors.
- **Settings Bounded Context:**
  - Sensor thresholds, notification channels, security policies, and profile settings with local storage fallback.
- **Shared Infrastructure & UI:**
  - Reusable HTTP client `BaseApi` and `BaseEndpoint` based on Axios.
  - Responsive PrimeVue Material theme layout with collapsible sidebar, topbar, and notifications.
  - Multilingual support (English and Spanish) via `vue-i18n`.
