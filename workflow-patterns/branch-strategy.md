# Branch Strategy and Git Workflows

## Overview

Consistent branch naming and workflow patterns make collaboration easier and help AI assistants understand project context.

## 🌿 Branch Naming Conventions

### Standard Prefixes

Use these prefixes for all branches:

| Prefix | Purpose | Examples | When to Use |
|--------|---------|----------|-------------|
| `feature/` | New features or enhancements | `feature/user-authentication`<br>`feature/api-endpoints` | Adding new functionality |
| `bugfix/` | Bug fixes | `bugfix/login-error`<br>`bugfix/memory-leak` | Fixing reported bugs |
| `hotfix/` | Critical production fixes | `hotfix/security-patch`<br>`hotfix/data-corruption` | Urgent production issues |
| `refactor/` | Code refactoring | `refactor/extract-services`<br>`refactor/simplify-validation` | Improving code without changing behavior |
| `docs/` | Documentation only | `docs/api-guide`<br>`docs/update-readme` | Documentation changes |
| `test/` | Test-related changes | `test/add-integration-tests`<br>`test/improve-coverage` | Adding or fixing tests |
| `chore/` | Maintenance tasks | `chore/update-dependencies`<br>`chore/config-cleanup` | Non-code changes |
| `perf/` | Performance improvements | `perf/optimize-queries`<br>`perf/reduce-bundle-size` | Performance enhancements |

### Branch Naming Rules

1. **Use lowercase with hyphens**: `feature/user-profile` (NOT `Feature/User_Profile`)
2. **Be descriptive**: `bugfix/fix-login-redirect` (NOT `bugfix/fix`)
3. **Keep it short**: 2-5 words max
4. **Use issue numbers when applicable**: `feature/42-user-dashboard`
5. **No dates in branch names**: Use git log for temporal information

### Good Branch Names

✅ **Good**:
```
feature/oauth-integration
bugfix/null-pointer-in-parser
refactor/extract-validation-logic
docs/api-authentication-guide
test/add-unit-tests-for-auth
hotfix/critical-security-patch
```

❌ **Bad**:
```
my-branch                    # Too vague
Fix                          # Not descriptive, wrong case
feature_new_stuff            # Underscores, vague
bugfix/fix-the-bug          # Redundant "fix"
john-testing-2024-10-31     # Personal, has date
FEATURE/NEW-API             # All caps
```

## Git Workflows

### Workflow 1: GitHub Flow (Recommended for Most Projects)

**Best for**: Continuous deployment, small teams, rapid iteration

```
main (always deployable)
 ↓
feature/new-feature (branch off main)
 ↓
[work, commit, commit]
 ↓
Pull Request → main
 ↓
Deploy
```

**Steps**:

1. **Branch from main**:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/user-profile
   ```

2. **Make changes** with atomic commits:
   ```bash
   git add .
   git commit -m "feat: Add user profile endpoint"
   git commit -m "test: Add profile endpoint tests"
   git commit -m "docs: Document profile API"
   ```

3. **Push to remote**:
   ```bash
   git push -u origin feature/user-profile
   ```

4. **Create pull request** (see Pull Request section below)

5. **Merge and deploy** after approval

6. **Delete branch** after merge:
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/user-profile
   ```

**Pros**:
- Simple and easy to understand
- Always deployable main branch
- Fast feedback loops

**Cons**:
- Not ideal for scheduled releases
- Can be chaotic with many developers

### Workflow 2: Git Flow

**Best for**: Scheduled releases, larger teams, complex projects

```
main (production releases only)
 ↓
develop (integration branch)
 ↓
feature/* (feature branches)
 ↓
release/* (release preparation)
 ↓
hotfix/* (emergency fixes)
```

**Branches**:
- `main` - Production-ready code, tagged releases only
- `develop` - Integration branch for features
- `feature/*` - New features (branch from develop)
- `release/*` - Release preparation (branch from develop)
- `hotfix/*` - Critical production fixes (branch from main)

**Feature Development**:
```bash
# Start feature
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# Work on feature
git commit -m "feat: Add feature"

# Merge back to develop
git checkout develop
git merge --no-ff feature/new-feature
git push origin develop
git branch -d feature/new-feature
```

**Release Process**:
```bash
# Create release branch
git checkout -b release/1.2.0 develop

# Final tweaks and version bump
git commit -m "chore: Bump version to 1.2.0"

# Merge to main and tag
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff release/1.2.0
git branch -d release/1.2.0
```

**Hotfix Process**:
```bash
# Create hotfix branch from main
git checkout -b hotfix/1.2.1 main

# Fix the critical bug
git commit -m "fix: Critical security patch"

# Merge to both main and develop
git checkout main
git merge --no-ff hotfix/1.2.1
git tag -a v1.2.1 -m "Hotfix v1.2.1"

git checkout develop
git merge --no-ff hotfix/1.2.1

git branch -d hotfix/1.2.1
```

**Pros**:
- Clear separation of concerns
- Supports scheduled releases
- Parallel development and releases

**Cons**:
- More complex than GitHub Flow
- Can be overkill for simple projects

### Workflow 3: Trunk-Based Development

**Best for**: Mature teams, high automation, continuous integration

```
main (trunk)
 ↓
short-lived feature branches (< 1 day)
 ↓
Direct commits to main (with feature flags)
```

**Key Principles**:
- Keep branches very short-lived (hours, not days)
- Commit to main frequently
- Use feature flags for incomplete features
- Heavy reliance on automated testing

**Not recommended for**:
- AI-assisted development (harder to track changes)
- Teams without extensive CI/CD

## Pull Request Best Practices

### Creating Pull Requests

**PR Title**: Use conventional commit format
```
feat: Add user authentication system
fix: Correct validation in profile update
docs: Update API documentation
```

**PR Description Template**:

```markdown
## Summary

Brief description of what this PR does and why.

## Changes

- Added user authentication endpoint
- Implemented JWT token validation
- Updated user model with password field
- Added authentication middleware

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [x] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [x] Unit tests added/updated
- [x] Integration tests added/updated
- [x] Manual testing completed
- [ ] Tested on staging environment

### Test Coverage

- New code coverage: 95%
- Overall coverage change: +2%

### Manual Testing Steps

1. Create new user account via API
2. Login with credentials
3. Access protected endpoint with JWT token
4. Verify token expiration handling

## Related Issues

Closes #42
Related to #38, #41

## Screenshots (if applicable)

[Include API response examples or UI screenshots]

## Checklist

- [x] My code follows the project's style guidelines
- [x] I have performed a self-review of my own code
- [x] I have commented my code, particularly in hard-to-understand areas
- [x] I have made corresponding changes to the documentation
- [x] My changes generate no new warnings
- [x] I have added tests that prove my fix is effective or that my feature works
- [x] New and existing unit tests pass locally with my changes
- [x] Any dependent changes have been merged and published

## Additional Notes

- Consider adding rate limiting in future PR
- Profile image upload will be separate PR (#45)
```

### PR Size Guidelines

**Keep PRs small** for easier review:

| Size | Lines Changed | Files Changed | Review Time | Recommendation |
|------|---------------|---------------|-------------|----------------|
| **Tiny** | < 50 | 1-2 | 5-10 min | ✅ Ideal |
| **Small** | 50-200 | 2-5 | 15-30 min | ✅ Good |
| **Medium** | 200-500 | 5-10 | 30-60 min | ⚠️ Acceptable |
| **Large** | 500-1000 | 10-20 | 1-2 hours | ⚠️ Consider splitting |
| **Huge** | > 1000 | > 20 | > 2 hours | ❌ Too large, split it |

**How to keep PRs small**:
- One logical change per PR
- Split large features into multiple PRs
- Use feature flags for partial implementations
- Extract refactoring into separate PRs

### Code Review Process

**For Reviewers**:

1. **Check for**:
   - Code quality and readability
   - Test coverage and test quality
   - Edge cases and error handling
   - Security vulnerabilities
   - Performance implications
   - Breaking changes

2. **Use conventional comments**:
   ```
   **praise:** Excellent use of dependency injection here!

   **nitpick:** Consider renaming `data` to `userData` for clarity

   **suggestion:** We could extract this into a helper function

   **issue:** This could cause a race condition if called concurrently

   **question:** Why did we choose JWT over sessions?
   ```

3. **Approve when**:
   - Code meets quality standards
   - Tests are adequate
   - Documentation is updated
   - No major issues remain

**For Authors**:

1. **Self-review first**: Review your own PR before requesting review
2. **Respond to all comments**: Even if just "acknowledged"
3. **Push additional commits**: Don't force-push during review
4. **Request re-review**: After addressing feedback
5. **Merge promptly**: After approval, merge quickly to avoid conflicts

## Branch Protection Rules

### Recommended Settings for `main` branch

```yaml
# .github/branch-protection.yml (conceptual)
branch: main
protection:
  required_pull_request_reviews:
    required_approving_review_count: 1
    dismiss_stale_reviews: true
    require_code_owner_reviews: false
  required_status_checks:
    strict: true
    contexts:
      - "ci/tests"
      - "ci/lint"
      - "ci/build"
  enforce_admins: false
  restrictions: null
  allow_force_pushes: false
  allow_deletions: false
```

### Via GitHub UI

Settings → Branches → Add rule → `main`:
- ✅ Require pull request reviews before merging (1 approval)
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
- ✅ Include administrators
- ❌ Allow force pushes
- ❌ Allow deletions

## Working with AI Assistants

### Branch Context

**Start of session**, AI should check:
```bash
git branch --show-current  # What branch am I on?
git status                 # What's changed?
git log -5 --oneline       # Recent commits
```

**Provide context to AI**:
```
We're on feature/user-authentication branch.
Working on adding JWT-based authentication.
Last commit: feat: Add user model with password field
Need to: Add authentication middleware
```

### Branch Naming by AI

When AI creates branches:
```bash
# AI should ask first
"I'll create a new feature branch for user authentication.
Proposed name: feature/user-auth-jwt
Does this name work, or would you prefer something else?"

# Then create
git checkout -b feature/user-auth-jwt
```

## Common Scenarios

### Scenario 1: Feature Branch with Multiple Commits

```bash
# Create branch
git checkout -b feature/user-profile

# Make atomic commits
git commit -m "feat: Add user profile endpoint"
git commit -m "test: Add profile endpoint tests"
git commit -m "docs: Document profile API"
git commit -m "fix: Correct validation in profile update"

# Push and create PR
git push -u origin feature/user-profile

# After PR approval, merge (via GitHub UI or CLI)
gh pr merge --squash  # or --merge or --rebase

# Clean up
git checkout main
git pull origin main
git branch -d feature/user-profile
```

### Scenario 2: Fixing a Bug During Feature Development

**Option A: Fix in same branch** (if closely related):
```bash
# On feature/new-ui
git commit -m "feat: Add new dashboard layout"
git commit -m "fix: Correct sidebar alignment"
```

**Option B: Separate bugfix branch** (if unrelated):
```bash
# On feature/new-ui, noticed unrelated bug
git stash  # Save current work

git checkout main
git checkout -b bugfix/login-redirect

# Fix bug
git commit -m "fix: Correct login redirect URL"
git push -u origin bugfix/login-redirect

# Create PR for bugfix
gh pr create --title "fix: Correct login redirect URL"

# Return to feature work
git checkout feature/new-ui
git stash pop
```

### Scenario 3: Long-Running Feature Branch

**Problem**: Feature branch is 2 weeks old, main has moved forward

**Solution**: Regularly sync with main
```bash
# On feature/complex-feature
git fetch origin

# Option A: Merge main into feature (preserves all history)
git merge origin/main

# Option B: Rebase feature onto main (cleaner history, but rewrites commits)
git rebase origin/main

# Resolve conflicts if any
# Then push (force push required after rebase)
git push origin feature/complex-feature --force-with-lease
```

**Best practice**: Sync every few days to avoid large merge conflicts

## Summary

### Quick Reference

**Branch naming**:
```
feature/descriptive-name
bugfix/specific-issue
hotfix/critical-fix
docs/update-topic
test/test-description
chore/maintenance-task
```

**Workflow choice**:
- **Small team, rapid deployment** → GitHub Flow
- **Scheduled releases, structured** → Git Flow
- **Mature team, high automation** → Trunk-Based

**PR guidelines**:
- Keep PRs small (< 500 lines)
- Use conventional commit format in title
- Include comprehensive description
- Self-review before requesting review
- Respond to all feedback

**Branch protection**:
- Require PR reviews
- Require status checks
- No force pushes to main
- No direct commits to main
