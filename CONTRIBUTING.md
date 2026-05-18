# Contributing to BreakFree

First off, thank you for considering contributing to BreakFree! It's people like you that make BreakFree such a great wellness community.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the [issue list](https://github.com/yourusername/breakfree-app/issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem** in as many details as possible
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots if possible**
- **Include your environment details**: OS, Node version, Expo version, device/emulator info

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and the expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required PR template
- Document new code with JSDoc comments
- End all files with a newline
- Follow the [Code Style Guidelines](#code-style-guidelines)
- Ensure all tests pass: `npm test`
- Ensure linting passes: `npm run lint`

## Development Workflow

1. **Fork the repository** and clone it locally
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit regularly with clear messages
4. **Run tests and linting**:
   ```bash
   npm run test
   npm run lint:fix
   ```
5. **Push to your fork** and submit a **Pull Request**

### Branch Naming Convention

- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring
- `test/description` - for adding or updating tests

### Commit Message Convention

Use clear, descriptive commit messages following this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type** should be one of:

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Changes that don't affect code meaning (formatting, missing semicolons, etc)
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `test` - Adding missing tests or correcting existing tests
- `chore` - Changes to build process, dependencies, etc

**Examples:**

```
feat(auth): add social login with Google

fix(dashboard): resolve chart rendering on iOS

docs(readme): update installation instructions
```

## Code Style Guidelines

### TypeScript

- Use **strict mode** in `tsconfig.json`
- Define explicit types for function parameters and return values
- Avoid `any` type; use `unknown` if needed and handle it properly
- Use interfaces for object shapes, types for unions/primitives

### React/React Native

- Use **functional components** with hooks
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks
- Use proper TypeScript types for props

### Naming Conventions

- Components: `PascalCase` (e.g., `UserProfile.tsx`)
- Functions/Variables: `camelCase` (e.g., `getUserData()`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`)
- Private methods: prefix with `_` (e.g., `_handleInternalError()`)

### File Organization

```
/src
├── components/
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.styles.ts
│   │   ├── ComponentName.test.tsx
│   │   └── index.ts
├── screens/
├── services/
├── redux/
├── types/
├── utils/
├── hooks/
└── i18n/
```

## Testing

- Write tests for new features and bug fixes
- Maintain or improve code coverage
- Run tests before submitting PR: `npm test`
- Use descriptive test names

Example test structure:

```typescript
describe('UserProfile', () => {
  it('should display user name', () => {
    // test code
  });

  it('should handle logout correctly', () => {
    // test code
  });
});
```

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments to exported functions and components
- Document any new environment variables needed
- Update type definitions when changing data structures

## Additional Notes

### Issue and Pull Request Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `in progress` - Currently being worked on
- `blocked` - Blocked by another issue/PR

## Questions?

Feel free to open a discussion or ask in the issues. We're here to help!

## Recognition

Contributors will be recognized in:

- The [README.md](README.md) contributors section
- GitHub's automatic contributor recognition

Thank you for contributing to BreakFree! 🎉
