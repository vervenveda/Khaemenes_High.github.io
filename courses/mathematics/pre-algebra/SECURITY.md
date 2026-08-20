# Security Policy

Khaemenes High is an educational project intended for students, families, educators, and schools. Security, privacy, accessibility, and learner safety must be treated as core product requirements.

## Supported versions

The project is currently in its foundation phase.

Security fixes will be applied to the latest version on the default branch. Once formal releases begin, this section will list the supported release series.

| Version | Supported |
|---|---|
| Current default branch | Yes |
| Earlier unmaintained copies | No guarantee |

## Reporting a vulnerability

Do not disclose a suspected vulnerability in a public issue, discussion, pull request, social post, or classroom forum.

Use GitHub’s private vulnerability reporting or Security Advisory feature for this repository when available:

1. Open the repository.
2. Select **Security**.
3. Select **Advisories**.
4. Choose **Report a vulnerability**.

Include:

- A clear description
- The affected file, page, feature, or workflow
- Reproduction steps
- Expected and observed behavior
- Potential impact
- Browser, device, and operating system
- Screenshots or proof-of-concept material that does not expose real student data
- A suggested fix, when known

Never include real student records, passwords, access tokens, private keys, or unnecessary personal information in a report.

## Responsible disclosure

Please allow maintainers a reasonable opportunity to investigate and correct a valid issue before public disclosure.

Maintainers should:

1. Acknowledge the report
2. Assess severity and affected versions
3. Limit access to sensitive details
4. Develop and test a correction
5. Release or deploy the correction
6. Credit the reporter when requested and appropriate
7. Publish a clear advisory when users need to act

No response-time guarantee is made during the foundation phase.

## Security priorities

High-priority reports include:

- Exposure of student or family information
- Authentication or authorization bypass
- Cross-site scripting
- Remote code execution
- Malicious file upload or download
- Supply-chain compromise
- Unsafe service-worker behavior
- Cache poisoning
- Progress-record tampering
- Unauthorized grade or transcript changes
- Leakage of secrets or access tokens
- Dependence on compromised third-party resources
- Accessibility failures that prevent emergency or safety information from being reached

## Student data and privacy

The public curriculum should function without collecting personal information.

Contributors must not add:

- Advertising trackers
- Fingerprinting
- Undocumented analytics
- Sale or brokerage of learner information
- Hidden recording
- Unnecessary precise location collection
- Public exposure of names, grades, disability information, or family records
- Default transmission of local progress to a remote service

Any future feature involving accounts, classrooms, messaging, grades, transcripts, cloud storage, payments, health information, or minors’ personal information requires a separate privacy and security review.

## Local storage

Browser `localStorage`, IndexedDB, and downloadable progress files may be useful for local-first learning, but they are not secure systems of record.

Do not store in browser storage:

- Passwords
- Private keys
- Government identifiers
- Medical records
- Full legal student records
- Unencrypted high-risk personal information

Progress export files should clearly state what they contain and should avoid unnecessary identifying details.

## Dependencies and external services

Prefer small, auditable, dependency-free components.

Before adding a third-party library or service:

- Confirm that it is necessary
- Review its license
- Review its privacy behavior
- Pin or control versions
- Document its purpose
- Provide a safe failure mode
- Avoid exposing credentials in client-side code

Secrets must never be committed to the repository.

## Service-worker safety

Service-worker changes require careful review because a service worker can continue operating after a page update.

Every service-worker revision should:

- Use a new cache version
- Cache only intended same-origin resources
- Avoid caching private or authenticated responses
- Remove obsolete caches
- Handle failed requests safely
- Avoid intercepting non-GET requests
- Be tested for update and rollback behavior

## Educational safety

Security also includes protection from harmful educational behavior.

Course features must not:

- Shame or publicly rank students
- Lock essential learning behind payment
- Manipulate learners through dark patterns
- Expose private performance to other students
- Present unverified medical, legal, financial, or safety claims as professional advice
- Encourage unsafe experiments without suitable warnings and supervision
- Use generative or automated output without clear review expectations

## Scope exclusions

The following are generally not treated as security vulnerabilities by themselves:

- Missing features
- Typographical errors
- Broken public links
- General curriculum disagreement
- Lack of support for an old browser
- Issues requiring physical access to an already unlocked device
- Social engineering reports without a technical or procedural weakness

These concerns may still be reported through the ordinary issue process when public reporting is safe.
