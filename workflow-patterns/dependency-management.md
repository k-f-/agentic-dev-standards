# Dependency Management Best Practices

## Overview

Managing dependencies effectively prevents bloat, security vulnerabilities, and maintenance headaches. This guide provides standards for adding, updating, and maintaining project dependencies.

## 📦 Before Adding a Dependency

### Evaluation Checklist

Before adding ANY new dependency, evaluate these factors:

#### 1. ✅ Is It Necessary?

**Questions to ask**:

- Can I implement this myself in < 100 lines?
- Does the added complexity justify the benefit?
- Am I adding this just to avoid writing a few lines of code?

**When to implement yourself**:

```javascript
// ❌ Don't add a dependency for this
import isOdd from 'is-odd'
const result = isOdd(5)

// ✅ Just implement it
const isOdd = (n) => n % 2 !== 0
const result = isOdd(5)
```

**When to use a dependency**:

```javascript
// ✅ Use a dependency for complex functionality
import jwt from 'jsonwebtoken'
const token = jwt.sign({ userId: 123 }, secret, { expiresIn: '1h' })
// (Don't implement JWT yourself - use battle-tested library)
```

#### 2. ✅ Is It Actively Maintained?

**Check**:

- Last commit date (< 6 months ago is good)
- GitHub activity (issues being addressed, PRs being merged)
- Release frequency (regular updates indicate active maintenance)
- Number of contributors (more is generally better)

**Red flags**:

- ⚠️ No commits in > 1 year
- ⚠️ Many open issues with no responses
- ⚠️ Deprecated warnings on npm
- ⚠️ Single contributor who's inactive

**How to check**:

```bash
# View package info
npm view <package-name>

# Check GitHub stats
# Visit: https://github.com/<owner>/<repo>
# Look at: Commits, Issues, Pull Requests, Contributors

# Check npm trends
# Visit: https://npmtrends.com/<package-name>
```

#### 3. ✅ What's the License?

**Compatible licenses** (for most projects):

- ✅ MIT - Very permissive
- ✅ Apache 2.0 - Permissive with patent grant
- ✅ BSD (2-Clause, 3-Clause) - Permissive
- ✅ ISC - Similar to MIT

**Incompatible licenses** (check with legal):

- ⚠️ GPL - Requires your code to be GPL (viral)
- ⚠️ AGPL - More restrictive than GPL
- ⚠️ Custom licenses - Need careful review

**How to check**:

```bash
# Check license
npm view <package-name> license

# Check licenses of all dependencies
npx license-checker --summary
```

#### 4. ✅ What's the Bundle Size Impact?

**Size matters** for web applications:

- Frontend apps: Every KB affects load time
- Backend apps: Less critical but still important
- CLI tools: Can affect startup time

**How to check**:

```bash
# Analyze bundle size impact
npx bundlephobia <package-name>

# Or visit: https://bundlephobia.com/package/<package-name>
```

**Size guidelines**:
| Category | Size | Verdict |
|----------|------|---------|
| Tiny | < 10 KB | ✅ Generally fine |
| Small | 10-50 KB | ✅ Acceptable |
| Medium | 50-100 KB | ⚠️ Consider carefully |
| Large | 100-500 KB | ⚠️ Only if critical |
| Huge | > 500 KB | ❌ Avoid if possible |

**Example**:

```bash
$ npx bundlephobia lodash
# lodash: 527 KB (minified)
# Verdict: Too large, use lodash-es or specific functions

$ npx bundlephobia date-fns
# date-fns: 33.8 KB (minified)
# Verdict: Reasonable for date manipulation
```

#### 5. ✅ Are There Security Vulnerabilities?

**How to check**:

```bash
# Check specific package
npm audit <package-name>

# Check all dependencies
npm audit

# Get detailed report
npm audit --json
```

**Vulnerability severity**:

- **Critical**: Fix immediately, consider alternatives
- **High**: Fix soon, evaluate alternatives
- **Moderate**: Fix when convenient
- **Low**: Monitor, fix in regular updates

**Red flags**:

- ⚠️ Critical vulnerabilities in latest version
- ⚠️ Unmaintained packages with known vulnerabilities
- ⚠️ Dependencies with bad security track record

#### 6. ✅ How Many Dependencies Does It Have?

**Dependency tree matters**:

```bash
# View dependency tree
npm ls <package-name>

# Count all dependencies
npm ls <package-name> --all | wc -l
```

**Guidelines**:
| Dependencies | Verdict |
|--------------|---------|
| 0-5 | ✅ Minimal, good |
| 5-20 | ✅ Reasonable |
| 20-50 | ⚠️ Heavy, consider carefully |
| > 50 | ❌ Very heavy, likely unnecessary |

**Example**:

```bash
# Good: minimal dependencies
$ npm ls date-fns
date-fns@2.30.0
# (no dependencies)

# Bad: heavy dependency tree
$ npm ls moment
moment@2.29.4
├── moment-timezone@0.5.43
└── ... (many indirect dependencies)
```

#### 7. ✅ Is There a Better Alternative?

**Compare options**:

```bash
# Compare on npm trends
# Visit: https://npmtrends.com/package-a-vs-package-b-vs-package-c
```

**Common comparisons**:

| Use Case | Heavy Option | Lightweight Alternative |
|----------|-------------|-------------------------|
| Date manipulation | moment (deprecated) | date-fns, dayjs |
| HTTP requests | axios | native fetch, got |
| Utility functions | lodash | lodash-es (tree-shakeable), native JS |
| Testing | jest (heavy) | vitest, uvu |
| Validation | joi | zod, yup |

### Documentation Requirement

**When adding a dependency, document WHY**:

```javascript
// package.json or DEPENDENCIES.md
{
  "dependencies": {
    // JWT token generation and validation
    // Chosen because: Industry standard, actively maintained, comprehensive
    // Alternatives considered: jose (too minimal), node-jsonwebtoken (deprecated)
    "jsonwebtoken": "^9.0.0",

    // Date manipulation
    // Chosen because: Tree-shakeable, modern API, small bundle size (vs moment)
    // Alternatives considered: moment (deprecated), dayjs (less feature-complete)
    "date-fns": "^2.30.0"
  }
}
```

Or create `docs/development/dependencies.md`:

```markdown
# Project Dependencies

## Core Dependencies

### jsonwebtoken (^9.0.0)
- **Purpose**: JWT token generation and validation
- **Why chosen**: Industry standard, actively maintained, comprehensive
- **Alternatives considered**:
  - jose - Too minimal for our needs
  - node-jsonwebtoken - Deprecated
- **Bundle size**: 67 KB
- **License**: MIT
- **Last reviewed**: 2025-10-31

### date-fns (^2.30.0)
- **Purpose**: Date manipulation and formatting
- **Why chosen**: Tree-shakeable, modern API, small bundle size
- **Alternatives considered**:
  - moment - Deprecated, large bundle
  - dayjs - Less feature-complete
- **Bundle size**: 34 KB (with tree-shaking)
- **License**: MIT
- **Last reviewed**: 2025-10-31
```

## Adding Dependencies

### Step-by-Step Process

1. **Evaluate using checklist above**
2. **Install as exact version** (for critical dependencies):

   ```bash
   npm install --save-exact <package-name>
   ```

3. **Or install with caret** (for less critical):

   ```bash
   npm install <package-name>
   ```

4. **Document the decision** (see above)

5. **Run security audit**:

   ```bash
   npm audit
   ```

6. **Test thoroughly**:

   ```bash
   npm test
   npm run build
   ```

7. **Commit with conventional commit**:

   ```bash
   git add package.json package-lock.json
   git commit -m "chore: Add jsonwebtoken for JWT authentication

   - Evaluated alternatives: jose, node-jsonwebtoken
   - Chose jsonwebtoken for comprehensive feature set
   - No security vulnerabilities
   - Bundle size: 67 KB (acceptable for auth use case)"
   ```

### Development vs Production Dependencies

**Production dependencies** (`dependencies`):

- Required for the app to run
- Included in production bundle
- Examples: express, react, database drivers

```bash
npm install <package>
```

**Development dependencies** (`devDependencies`):

- Only needed during development/build
- NOT included in production
- Examples: testing tools, build tools, linters

```bash
npm install --save-dev <package>
# or
npm install -D <package>
```

**Examples**:

```json
{
  "dependencies": {
    "express": "^4.18.0",      // ✅ Needed at runtime
    "jsonwebtoken": "^9.0.0"   // ✅ Needed at runtime
  },
  "devDependencies": {
    "typescript": "^5.0.0",    // ✅ Only for building
    "jest": "^29.0.0",         // ✅ Only for testing
    "eslint": "^8.0.0"         // ✅ Only for linting
  }
}
```

## Updating Dependencies

### Regular Update Schedule

**Recommended schedule**:

- **Patch updates** (e.g., 1.2.3 → 1.2.4): Weekly or bi-weekly
- **Minor updates** (e.g., 1.2.0 → 1.3.0): Monthly
- **Major updates** (e.g., 1.0.0 → 2.0.0): Quarterly, with careful testing

### Checking for Updates

```bash
# Check for outdated packages
npm outdated

# Interactive update tool
npx npm-check-updates --interactive

# Or use npm-check
npx npm-check --update-all
```

### Update Process

**For patch/minor updates**:

```bash
# Update specific package
npm update <package-name>

# Update all packages (respecting semver ranges)
npm update

# Commit
git add package.json package-lock.json
git commit -m "chore: Update dependencies (patch/minor updates)"
```

**For major updates**:

```bash
# Check what would change
npx npm-check-updates --target major

# Update specific package
npm install <package-name>@latest

# Run full test suite
npm test
npm run build

# Check for breaking changes
# Read: CHANGELOG, GitHub releases, migration guide

# Commit each major update separately
git commit -m "chore: Update express to v5

- Breaking changes: [list changes]
- Updated code to handle: [list fixes]
- All tests passing"
```

### Security Updates

**When security vulnerabilities are found**:

```bash
# Run audit
npm audit

# Try automatic fix
npm audit fix

# If that doesn't work, fix manually
npm audit fix --force  # ⚠️ May introduce breaking changes

# Or update specific vulnerable package
npm install <package-name>@latest
```

**Process**:

1. Run `npm audit` regularly (weekly)
2. Fix critical/high vulnerabilities immediately
3. Fix moderate/low vulnerabilities in regular updates
4. Document what was fixed:

   ```bash
   git commit -m "security: Update lodash to fix prototype pollution

   - CVE-2024-XXXXX (High severity)
   - Updated from 4.17.19 to 4.17.21
   - All tests passing"
   ```

## Lock Files

### Why Lock Files Matter

**package-lock.json** (or yarn.lock, pnpm-lock.yaml) ensures:

- ✅ Reproducible installs across machines
- ✅ Same versions in dev, CI, and production
- ✅ Protection against supply chain attacks
- ✅ Faster installs (npm knows exact versions)

### Lock File Best Practices

1. **Always commit lock files**:

   ```bash
   git add package.json package-lock.json
   git commit -m "chore: Add dependency"
   ```

2. **Never manually edit lock files**:

   ```bash
   # ❌ Wrong
   vim package-lock.json

   # ✅ Correct
   npm install <package>
   ```

3. **Regenerate if corrupted**:

   ```bash
   rm package-lock.json
   npm install
   git add package-lock.json
   git commit -m "chore: Regenerate package-lock.json"
   ```

4. **Use `npm ci` in CI/CD** (not `npm install`):

   ```bash
   # In CI/CD pipelines
   npm ci  # Installs exact versions from lock file
   ```

## Dependency Hygiene

### Regular Maintenance Tasks

**Monthly**:

- [ ] Run `npm outdated` to check for updates
- [ ] Update patch and minor versions
- [ ] Run `npm audit` for security issues
- [ ] Review and remove unused dependencies

**Quarterly**:

- [ ] Evaluate major version updates
- [ ] Review dependency tree for bloat
- [ ] Check for deprecated packages
- [ ] Update documentation of why dependencies are needed

**Annually**:

- [ ] Full dependency audit
- [ ] Re-evaluate if each dependency is still necessary
- [ ] Consider replacing heavy dependencies with lighter alternatives
- [ ] Update dependency documentation

### Finding Unused Dependencies

```bash
# Find unused dependencies
npx depcheck

# Remove unused dependencies
npm uninstall <unused-package>

# Commit
git commit -m "chore: Remove unused dependencies

- Removed <package1>: No longer used after refactoring
- Removed <package2>: Functionality replaced by native APIs"
```

## Common Pitfalls

### ❌ Pitfall 1: Adding Dependencies Too Easily

**Bad**:

```bash
# Need to check if string is odd
npm install is-odd
```

**Good**:

```javascript
// Just implement it
const isOdd = (n) => n % 2 !== 0
```

### ❌ Pitfall 2: Using Deprecated Packages

**Bad**:

```json
{
  "dependencies": {
    "moment": "^2.29.4"  // ❌ Deprecated
  }
}
```

**Good**:

```json
{
  "dependencies": {
    "date-fns": "^2.30.0"  // ✅ Active, modern alternative
  }
}
```

### ❌ Pitfall 3: Ignoring Bundle Size

**Bad**:

```javascript
// Importing entire lodash (527 KB)
import _ from 'lodash'
const result = _.chunk([1,2,3,4], 2)
```

**Good**:

```javascript
// Import only what you need
import chunk from 'lodash-es/chunk'
const result = chunk([1,2,3,4], 2)

// Or use native JavaScript
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )
```

### ❌ Pitfall 4: Not Reading Documentation

**Always read**:

- README
- CHANGELOG (especially for major updates)
- Migration guides (for major version updates)
- Security advisories

### ❌ Pitfall 5: Updating Everything at Once

**Bad**:

```bash
# Update all to latest (including major versions)
npx npm-check-updates -u
npm install
# 💥 Everything breaks
```

**Good**:

```bash
# Update incrementally
npm update  # Only patch/minor
# Test thoroughly
# Then update major versions one at a time
npm install express@latest
# Test
npm install react@latest
# Test
```

## AI Assistant Guidelines

### When AI Suggests Dependencies

**AI should**:

1. Explain why the dependency is needed
2. Provide alternatives considered
3. Show bundle size impact
4. Verify license compatibility
5. Check for security issues
6. Ask user for approval before installing

**Example**:

```
AI: "To implement JWT authentication, I recommend adding 'jsonwebtoken'.

Evaluation:
- Purpose: JWT token generation and validation
- Bundle size: 67 KB (minified)
- License: MIT ✅
- Security: No known vulnerabilities ✅
- Alternatives: jose (too minimal), node-jsonwebtoken (deprecated)
- Maintenance: Last updated 2 months ago, 800+ contributors ✅

Should I add this dependency?"

User: "Yes"

AI: [installs dependency, documents decision, commits]
```

## Summary

### Quick Checklist for Adding Dependencies

Before adding a dependency, ask:

- [ ] Is it really necessary? (Can I implement in < 100 lines?)
- [ ] Is it actively maintained? (commits in last 6 months)
- [ ] What's the license? (MIT, Apache, BSD = good)
- [ ] What's the bundle size? (< 100 KB preferred)
- [ ] Are there security issues? (npm audit)
- [ ] How many dependencies does it have? (< 20 preferred)
- [ ] Is there a better alternative? (check npm trends)
- [ ] Have I documented why? (in code or docs)

### Commands Reference

```bash
# Evaluate
npm view <package-name>
npx bundlephobia <package-name>
npm audit <package-name>

# Install
npm install <package-name>
npm install --save-dev <package-name>

# Update
npm outdated
npm update
npm install <package-name>@latest

# Maintenance
npm audit
npx depcheck
npm ls <package-name>

# CI/CD
npm ci  # Use in pipelines, not npm install
```
