# 🤝 Contributing to AI Document Insight Tool

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- Docker and Docker Compose
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/your-username/ai-document-insight-tool.git
cd ai-document-insight-tool
```

2. **Set up Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your SARVAM_API_KEY
```

3. **Set up Frontend**
```bash
cd frontend
npm install --force
```

4. **Run Development Servers**
```bash
# Terminal 1 - Backend
cd backend
python start.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🛠️ Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- 🐛 **Bug Reports**: Report bugs using GitHub issues
- 💡 **Feature Requests**: Suggest new features or improvements
- 📝 **Documentation**: Improve or add documentation
- 🔧 **Code Contributions**: Fix bugs or implement features
- 🧪 **Testing**: Add or improve tests
- 🎨 **UI/UX**: Improve user interface and experience

### Before You Start

1. **Check existing issues** to avoid duplicates
2. **Create an issue** for major changes
3. **Discuss your approach** with maintainers
4. **Follow coding standards** outlined below

## 🔄 Pull Request Process

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Changes
- Write clean, readable code
- Follow existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test

# Integration tests
docker-compose up --build
# Test the application manually
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add new feature description"
# or
git commit -m "fix: resolve bug description"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference related issues
- Screenshots for UI changes
- Test results

## 📏 Coding Standards

### Python (Backend)

- Follow **PEP 8** style guide
- Use **type hints** for function parameters and returns
- Write **docstrings** for functions and classes
- Use **meaningful variable names**
- Keep functions **small and focused**

```python
def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extract text content from PDF file.
    
    Args:
        pdf_content: Raw PDF file content as bytes
        
    Returns:
        Extracted text as string
        
    Raises:
        HTTPException: If PDF cannot be processed
    """
    # Implementation here
```

### JavaScript/React (Frontend)

- Use **ES6+ features**
- Follow **React best practices**
- Use **functional components** with hooks
- Write **JSDoc comments** for complex functions
- Use **meaningful component names**

```javascript
/**
 * Upload section component for PDF file uploads
 * @param {Function} onUploadSuccess - Callback when upload succeeds
 * @returns {JSX.Element} Upload section component
 */
export default function UploadSection({ onUploadSuccess }) {
    // Implementation here
}
```

### General Guidelines

- **DRY**: Don't Repeat Yourself
- **SOLID**: Follow SOLID principles
- **Error Handling**: Always handle errors gracefully
- **Security**: Validate inputs and sanitize outputs
- **Performance**: Consider performance implications

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/ -v
python -m pytest --cov=. tests/
```

### Frontend Testing
```bash
cd frontend
npm test
npm run test:coverage
```

### Integration Testing
```bash
# Start services
docker-compose up -d

# Run integration tests
python tests/integration/test_api.py
```

### Test Guidelines

- Write tests for new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test both success and failure cases
- Mock external dependencies

## 📚 Documentation

### Code Documentation

- Write clear docstrings/comments
- Document complex algorithms
- Explain business logic
- Update API documentation

### User Documentation

- Update README.md for new features
- Add examples and screenshots
- Keep deployment guides current
- Write troubleshooting guides

### API Documentation

FastAPI automatically generates API docs, but ensure:
- Proper request/response models
- Clear endpoint descriptions
- Example requests and responses
- Error code documentation

## 🐛 Bug Reports

When reporting bugs, include:

1. **Environment details**
   - OS and version
   - Python/Node.js versions
   - Docker version (if applicable)

2. **Steps to reproduce**
   - Detailed step-by-step instructions
   - Expected vs actual behavior
   - Screenshots or videos

3. **Error messages**
   - Full error messages
   - Stack traces
   - Log files

4. **Additional context**
   - When did it start happening?
   - Does it happen consistently?
   - Any recent changes?

## 💡 Feature Requests

For feature requests, provide:

1. **Problem description**
   - What problem does this solve?
   - Who would benefit?
   - Current workarounds?

2. **Proposed solution**
   - Detailed description
   - Alternative approaches
   - Implementation ideas

3. **Additional context**
   - Mockups or wireframes
   - Similar features in other tools
   - Priority level

## 🏷️ Issue Labels

We use labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high/medium/low` - Priority levels
- `status: in progress` - Currently being worked on

## 🎉 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- GitHub contributors page
- Special mentions for significant contributions

## 📞 Getting Help

If you need help:

1. **Check documentation** first
2. **Search existing issues**
3. **Ask in discussions**
4. **Contact maintainers**

### Contact Information

- **GitHub Issues**: For bugs and features
- **GitHub Discussions**: For questions and ideas
- **Email**: For security issues or private matters

## 📈 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Critical fixes

### Release Process

1. Features merged to `develop`
2. Testing and QA on `develop`
3. Release branch created
4. Final testing and bug fixes
5. Merge to `main` and tag release
6. Deploy to production

## 🔒 Security

### Reporting Security Issues

**Do not** report security vulnerabilities in public issues.

Instead:
1. Email security@example.com
2. Include detailed description
3. Provide steps to reproduce
4. Allow time for fix before disclosure

### Security Guidelines

- Never commit secrets or API keys
- Validate all user inputs
- Use HTTPS in production
- Follow OWASP guidelines
- Regular dependency updates

Thank you for contributing to the AI Document Insight Tool! 🙏