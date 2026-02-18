# Contributing to @tuteliq/sdk

Thank you for your interest in contributing to the Tuteliq SDK! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We are committed to providing a welcoming experience for everyone.

## How to Contribute

### Reporting Bugs

Before submitting a bug report:

1. Check the [existing issues](https://github.com/tuteliq/sdk-typescript/issues) to avoid duplicates
2. Use the latest version of the SDK
3. Collect relevant information (Node.js version, OS, error messages)

When submitting a bug report, include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Code samples if applicable
- Environment details

### Suggesting Features

We welcome feature suggestions! Please:

1. Check existing issues and discussions first
2. Clearly describe the use case
3. Explain why this would benefit other users

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our coding standards
4. **Add tests** for new functionality
5. **Run tests**: `npm test`
6. **Run build**: `npm run build`
7. **Submit a pull request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/sdk-typescript.git
cd sdk-typescript

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the project
npm run build
```

## Coding Standards

### TypeScript

- Use TypeScript for all source files
- Enable strict mode
- Provide JSDoc comments for public APIs
- Use explicit return types for functions

### Style

- Use 4 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line arrays/objects
- Keep lines under 100 characters when practical

### Naming Conventions

- `camelCase` for variables and functions
- `PascalCase` for classes and types
- `SCREAMING_SNAKE_CASE` for constants
- Descriptive names over abbreviations

### Testing

- Write tests for all new functionality
- Maintain existing test coverage
- Use descriptive test names
- Test edge cases and error conditions

Example test structure:

```typescript
describe('FeatureName', () => {
    describe('methodName', () => {
        it('should do something specific', async () => {
            // Arrange
            // Act
            // Assert
        });

        it('should handle error case', async () => {
            // ...
        });
    });
});
```

## Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(client): add batch analysis method
fix(retry): handle timeout errors correctly
docs(readme): update installation instructions
```

## Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Update CHANGELOG.md if applicable
5. Request review from maintainers

## Release Process

Releases are managed by the Tuteliq team. Version numbers follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

## Getting Help

- **Documentation**: [docs.tuteliq.ai](https://docs.tuteliq.ai)
- **Discord**: [discord.gg/tuteliq](https://discord.gg/tuteliq)
- **Issues**: [GitHub Issues](https://github.com/tuteliq/sdk-typescript/issues)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Tuteliq! Your efforts help make the internet safer for children.
