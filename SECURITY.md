# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅        |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Email **danezolv@gmail.com** with:

- A clear description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix (optional)

You will receive a response within 72 hours. Once confirmed, a fix will be released as soon as possible and you will be credited in the release notes (unless you prefer to remain anonymous).

## Security Notes for Contributors

- **Never commit secrets**: `.env.local` is gitignored — use it for Firebase credentials. See `.env.local.example`.
- **Environment variables**: All runtime secrets must use the `EXPO_PUBLIC_` prefix so they are intentionally exposed only to the client bundle.
- **Firebase rules**: Ensure Firestore and Storage security rules are configured in the Firebase console before production use.
- **Dependencies**: Run `npm audit` before submitting PRs that add or upgrade packages.
