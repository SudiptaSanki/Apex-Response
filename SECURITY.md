# Security Policy

## Supported Scope

This repository is currently a public demo and starter project, not a production emergency system.

Security-sensitive areas to review carefully:

- Any future auth flows
- Responder link sharing
- Guest status submissions
- Incident data storage
- Integrations with building systems

## Reporting a Vulnerability

Please do not open a public issue for sensitive vulnerabilities that could affect future deployments.

Instead:

1. Contact the maintainers privately
2. Include reproduction steps
3. Describe impact clearly
4. Suggest mitigation if known

## Current Status

The current codebase should be treated as a frontend demo foundation. Before production use, contributors should add:

- Proper authentication and authorization
- Backend-side secret handling
- Audit logging
- Access controls for responder views
- Rate limiting and abuse protection
- Secure hosting and environment management
