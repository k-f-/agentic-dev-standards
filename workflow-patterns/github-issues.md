# GitHub Issue and PR Management

## Overview

Effective issue management helps track work, communicate with team members, and provide context for AI assistants.

## 🏷️ Label Management (CRITICAL)

### Always Check Labels Exist Before Creating Issues

**When creating GitHub issues with `gh issue create`:**

1. **Check if custom labels exist first**:

   ```bash
   gh label list
   ```

2. **Create missing labels before using them**:

   ```bash
   gh label create <label-name> --description "<description>" --color "<hex-color>"
   ```

3. **Then create issues** with those labels:

   ```bash
   gh issue create --title "..." --body "..." --label "bug,enhancement"
   ```

### Why This Matters

**Problem**: Attempting to use non-existent labels causes `gh issue create` to fail with cryptic errors like:

```
could not add label: 'formatter' not found
```

**Solution**: Always verify labels exist or create them first.

### Standard Label Colors (GitHub Defaults)

| Label Type | Color | Hex Code | Example Labels |
|------------|-------|----------|----------------|
| Bug | Red | `#d73a4a` | `bug` |
| Enhancement | Light Blue | `#a2eeef` | `enhancement` |
| Documentation | Blue | `#0075ca` | `documentation`, `docs` |
| Good First Issue | Purple | `#7057ff` | `good first issue` |
| Help Wanted | Green | `#008672` | `help wanted` |
| Question | Pink | `#d876e3` | `question` |
| Wontfix | White | `#ffffff` | `wontfix`, `invalid` |
| Duplicate | Gray | `#cfd3d7` | `duplicate` |
| Priority: High | Red-Orange | `#e99695` | `priority: high`, `urgent` |
| Priority: Medium | Yellow | `#fbca04` | `priority: medium` |
| Priority: Low | Green-Gray | `#c5def5` | `priority: low` |
| Type: Feature | Teal | `#0e8a16` | `feature`, `type: feature` |
| Type: Refactor | Orange | `#f9d0c4` | `refactor`, `type: refactor` |

### Common Custom Labels for AI-Assisted Projects

**Example label creation**:

```bash
# Type labels
gh label create "type: feature" --description "New features or enhancements" --color "0e8a16"
gh label create "type: bug" --description "Something isn't working" --color "d73a4a"
gh label create "type: refactor" --description "Code refactoring" --color "f9d0c4"
gh label create "type: docs" --description "Documentation improvements" --color "0075ca"
gh label create "type: test" --description "Testing improvements" --color "c5def5"

# Component labels
gh label create "component: api" --description "API-related issues" --color "1d76db"
gh label create "component: ui" --description "UI/Frontend issues" --color "5319e7"
gh label create "component: database" --description "Database-related issues" --color "fbca04"
gh label create "component: auth" --description "Authentication/Authorization" --color "0e8a16"

# Priority labels
gh label create "priority: critical" --description "Critical priority - immediate attention" --color "b60205"
gh label create "priority: high" --description "High priority" --color "e99695"
gh label create "priority: medium" --description "Medium priority" --color "fbca04"
gh label create "priority: low" --description "Low priority" --color "c5def5"

# Status labels
gh label create "status: in-progress" --description "Currently being worked on" --color "0052cc"
gh label create "status: blocked" --description "Blocked by other work" --color "b60205"
gh label create "status: needs-review" --description "Needs code review" --color "fbca04"
gh label create "status: ready" --description "Ready for development" --color "0e8a16"

# AI-specific labels
gh label create "ai-assisted" --description "Issue worked on with AI assistance" --color "bfdadc"
gh label create "needs-human-review" --description "AI work needs human verification" --color "fef2c0"
```

## Issue Creation Workflow

### Complete Example Workflow

```bash
# Step 1: Check existing labels
gh label list

# Step 2: Create missing custom labels if needed
gh label create "formatter" --description "SQL formatting logic issues" --color "0366d6"
gh label create "post-processing" --description "Post-processing passes" --color "d4c5f9"

# Step 3: Create issue with labels
gh issue create \
  --title "Fix FROM/JOIN alias placement" \
  --body "$(cat <<'EOF'
**Problem**:
Aliases in FROM/JOIN clauses are not consistently aligned when comments are present.

**Expected Behavior**:
```sql
SELECT *
FROM users u  -- user table
JOIN orders o -- order table
```

**Actual Behavior**:

```sql
SELECT *
FROM users u-- user table
JOIN orders o-- order table
```

**Steps to Reproduce**:

1. Format SQL with FROM clause containing inline comment
2. Observe missing space before comment

**Proposed Solution**:
Add space preservation logic in alias alignment pass.

**Related Files**:

- `src/formatter/alias-alignment.ts`
- `tests/alias-alignment.test.ts`
EOF
)" \
  --label "bug,formatter,post-processing" \
  --assignee "@me"

# Step 4: Capture issue number

ISSUE_NUM=$(gh issue list --limit 1 --json number --jq '.[0].number')
echo "Created issue #$ISSUE_NUM"

```

### Issue Template

Use this structure for well-formed issues:

```markdown
**Problem**:
[Clear description of the issue or feature request]

**Expected Behavior** (for bugs):
[What should happen]

**Actual Behavior** (for bugs):
[What actually happens]

**Steps to Reproduce** (for bugs):
1. Step one
2. Step two
3. Step three

**Proposed Solution** (if known):
[How to fix or implement]

**Alternatives Considered** (for features):
- Alternative 1: ...
- Alternative 2: ...

**Related Files**:
- `path/to/file1.ts`
- `path/to/file2.ts`

**Related Issues/PRs**:
- Related to #42
- Depends on #38

**Additional Context**:
[Screenshots, logs, error messages, etc.]
```

## Managing Issues

### Viewing Issues

```bash
# List all open issues
gh issue list

# List issues with specific label
gh issue list --label "bug"

# List issues assigned to you
gh issue list --assignee "@me"

# List issues in specific state
gh issue list --state "closed"

# Search issues
gh issue list --search "authentication"
```

### Updating Issues

```bash
# Add labels
gh issue edit 42 --add-label "priority: high,needs-review"

# Remove labels
gh issue edit 42 --remove-label "status: blocked"

# Assign issue
gh issue edit 42 --add-assignee "username"

# Change title
gh issue edit 42 --title "New, clearer title"

# Add comment
gh issue comment 42 --body "Working on this now"
```

### Closing Issues

**Via commit message** (automatic):

```bash
git commit -m "fix: Correct alias alignment (closes #42)"
# or
git commit -m "feat: Add user auth (fixes #38)"
# or
git commit -m "docs: Update README (resolves #15)"
```

Keywords that close issues:

- `close`, `closes`, `closed`
- `fix`, `fixes`, `fixed`
- `resolve`, `resolves`, `resolved`

**Via GitHub CLI**:

```bash
# Close with comment
gh issue close 42 --comment "Fixed in PR #45"

# Close as not planned
gh issue close 42 --reason "not planned" --comment "Decided not to implement"

# Close as completed
gh issue close 42 --reason "completed" --comment "Implemented in v1.2.0"
```

### Reopening Issues

```bash
gh issue reopen 42 --comment "Bug still present in v1.2.1"
```

## Pull Request Management

### Creating Pull Requests

```bash
# Create PR from current branch
gh pr create \
  --title "feat: Add user authentication" \
  --body "$(cat <<'EOF'
## Summary
Implements JWT-based authentication for API endpoints.

## Changes
- Add authentication middleware
- Implement JWT token generation and validation
- Add login and logout endpoints
- Update user model with password field

## Testing
- Unit tests: 15 new tests
- Integration tests: 3 API tests
- Manual testing: Verified with Postman

## Related Issues
Closes #42
Related to #38

## Checklist
- [x] Tests added
- [x] Documentation updated
- [x] Self-reviewed
- [x] No new warnings
EOF
)" \
  --label "enhancement,api" \
  --assignee "@me" \
  --reviewer "teammate1,teammate2"
```

### PR from Command (Quick)

```bash
# Simple PR with title only
gh pr create --title "fix: Correct validation logic" --fill

# Interactive PR creation
gh pr create --web
```

### Viewing Pull Requests

```bash
# List open PRs
gh pr list

# View specific PR
gh pr view 45

# View PR diff
gh pr diff 45

# View PR checks
gh pr checks 45
```

### Merging Pull Requests

```bash
# Merge with merge commit
gh pr merge 45 --merge

# Squash merge (recommended for feature branches)
gh pr merge 45 --squash

# Rebase merge
gh pr merge 45 --rebase

# Auto-merge when checks pass
gh pr merge 45 --auto --squash

# Delete branch after merge
gh pr merge 45 --squash --delete-branch
```

### Reviewing Pull Requests

```bash
# Checkout PR locally for testing
gh pr checkout 45

# Comment on PR
gh pr comment 45 --body "Looks good, just a few minor suggestions"

# Review PR
gh pr review 45 --approve --body "LGTM! Great work on the tests."

# Request changes
gh pr review 45 --request-changes --body "Please address the security concern in auth.ts:42"

# Add inline comments
gh pr review 45 --comment --body "Great implementation!"
```

## Issue/PR Templates

### Creating Templates

**`.github/ISSUE_TEMPLATE/bug_report.md`**:

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: 'bug'
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment**
- OS: [e.g. macOS 14.0]
- Node version: [e.g. 20.0.0]
- Package version: [e.g. 1.2.3]

**Additional context**
Add any other context about the problem here.
```

**`.github/ISSUE_TEMPLATE/feature_request.md`**:

```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: 'enhancement'
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

**`.github/pull_request_template.md`**:

```markdown
## Summary
Brief description of what this PR does and why.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Changes
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Related Issues
Closes #
Related to #

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or feature works
- [ ] New and existing unit tests pass locally
```

## AI Assistant Integration

### When AI Creates Issues

**AI should**:

1. Check existing labels first: `gh label list`
2. Create missing labels if needed
3. Use proper issue template
4. Include detailed context
5. Assign appropriate labels and assignees

**Example**:

```
AI: "I found a bug in the validation logic. Should I create an issue for this?"
User: "Yes, please."
AI: "I'll check the existing labels first..."
[runs: gh label list]
AI: "I don't see a 'validation' label. Should I create it?"
User: "Yes, use color #fbca04"
[creates label]
AI: "Creating issue now..."
[creates issue with proper template and labels]
AI: "Created issue #47: Fix validation logic for empty strings"
```

### When AI Works on Issues

**AI should**:

1. Reference issue number in commits: `fix: ... (relates to #47)`
2. Close issues in final commit: `fix: ... (closes #47)`
3. Update issue with progress comments
4. Request human review when needed

## Project Management

### Milestones

```bash
# Create milestone
gh api repos/:owner/:repo/milestones -f title="v1.2.0" -f description="Release 1.2.0" -f due_on="2025-12-01T00:00:00Z"

# Add issue to milestone
gh issue edit 42 --milestone "v1.2.0"

# List milestones
gh api repos/:owner/:repo/milestones | jq '.[] | {title, open_issues, closed_issues}'
```

### Projects (GitHub Projects v2)

```bash
# Add issue to project
gh issue edit 42 --add-project "Development Board"

# View project
gh project list
```

## Best Practices Summary

### For Issue Creation

✅ **Do**:

- Check labels exist first
- Use descriptive titles
- Include reproduction steps for bugs
- Add relevant labels and assignees
- Link related issues/PRs
- Include code examples or screenshots

❌ **Don't**:

- Create vague issues ("fix bug")
- Forget to check for existing similar issues
- Use non-existent labels
- Skip the issue template

### For Pull Requests

✅ **Do**:

- Link to related issues
- Keep PRs small and focused
- Include comprehensive description
- Self-review before requesting review
- Ensure all tests pass
- Update documentation

❌ **Don't**:

- Create huge PRs (> 1000 lines)
- Skip the PR template
- Force-push during active review
- Merge without approval (unless hotfix)

### Terminal Command Pattern

**Always use clean bash for `gh` commands**:

```bash
# CORRECT
/bin/bash -c 'gh label list'
/bin/bash -c 'gh issue create --title "..." --body "..." --label "bug"'

# Even better: combine multiple commands
/bin/bash -c 'gh label list && gh issue create --title "Fix validation" --body "..." --label "bug,validation"'
```

See `terminal-standards.md` for details on why this matters.

---

## Summary

**Key Points**:

1. Always check labels exist before creating issues
2. Use descriptive titles and comprehensive descriptions
3. Link issues to PRs and commits
4. Keep PRs small and focused
5. Use templates for consistency
6. Close issues via commit messages when appropriate

**Command Reference**:

```bash
# Labels
gh label list
gh label create "name" --description "desc" --color "hex"

# Issues
gh issue create --title "..." --body "..." --label "..." --assignee "@me"
gh issue list --label "bug" --assignee "@me"
gh issue close 42 --comment "Fixed in PR #45"

# Pull Requests
gh pr create --title "..." --body "..." --label "..."
gh pr merge 45 --squash --delete-branch
gh pr review 45 --approve
```
