# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Made OAuth credentials (Discord, Google) and email API key (Resend) optional for local development
- Social login buttons are now conditionally rendered based on configured OAuth credentials
- Emails are logged to the console with clickable URLs when Resend is not configured
- Updated `.env.example` to mark optional variables with comments
- Updated README.md with a Quick Start section for contributors
- Updated CONTRIBUTING.md with streamlined development setup
- Updated CLAUDE.md to reflect optional vs required environment variables

### Added

- `.env.local.example` — minimal 3-variable config for instant local development
- Console email fallback with `[DEV EMAIL]` prefix showing verification/reset URLs
- Null guards in broadcast and inbox actions for missing Resend configuration
