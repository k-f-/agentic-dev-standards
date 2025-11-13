# Session Management for AI-Assisted Development

## Overview

When working with AI coding assistants over extended periods, maintaining session context and tracking progress is critical. This guide provides standards for documenting work sessions.

## 🚀 Session Start Checklist

**IMPORTANT**: At the beginning of each new AI coding session, follow this checklist to ensure proper context and capabilities.

### Core Standards Loading

**CRITICAL - Read these files first**:

1. **`agentic-dev-standards/universal-agent-rules.md`**
   - Universal AI agent guidelines and meta-rules
   - **Includes**: Model Context Protocol (MCP) guidance - prefer MCPs when available
   - Submodule management rules
   - Terminal usage rules overview

2. **`agentic-dev-standards/terminal-standards.md`**
   - MANDATORY terminal command patterns
   - Clean shell environment requirements
   - Avoids issues with user's custom shell configurations

3. **`agentic-dev-standards/commit-conventions.md`**
   - Conventional Commits standard
   - Atomic commit requirements
   - Changelog generation format

### Session Context Restoration

4. **Read latest session summary** (if exists):
   - Location: `docs/archive/session-summaries/[latest-date]_[topic].md`
   - Provides: Previous decisions, pending items, blockers, next steps

5. **Check current branch state**:
   ```bash
   git status                    # Current state
   git log --oneline -10         # Recent commits
   git branch -vv                # All branches
   ```

### Submodule and Dependencies

6. **Update agentic-dev-standards submodule**:
   ```bash
   git submodule update --remote agentic-dev-standards
   ```
   - Ensures you have the latest universal standards
   - Check if new standards have been added

7. **Verify dependencies** (if applicable):
   - Check for outdated packages
   - Review any security advisories
   - Confirm build tools are working

### Tool Capabilities Check

8. **Check for Model Context Protocol (MCP) servers**:
   - Verify which MCP servers are available
   - Prefer using MCP tools over built-in tools when reasonable
   - See `agentic-dev-standards/universal-agent-rules.md` for MCP guidance
   - See `agentic-dev-standards/integration/claude-code.md` for Claude Code MCP setup

### Project-Specific Context

9. **Read project-specific instructions**:
   - GitHub Copilot: `.github/copilot-instructions.md`
   - Cursor: `.cursorrules`
   - Windsurf: `.windsurfrules`
   - Continue: `.continue/config.json`
   - Claude Code: `docs/development/claude-code-context.md` (if exists)

10. **Review project documentation**:
    - `README.md` - Project overview and setup
    - `docs/development/` - Development guidelines
    - `CHANGELOG.md` - Recent changes
    - `docs/planning/` - Outstanding work and TODOs

### Quick Session Start Template

For quick session starts, copy and paste this to your AI assistant:

```
I'm starting a new session. Please read these files for context:

Core Standards:
1. agentic-dev-standards/universal-agent-rules.md
2. agentic-dev-standards/terminal-standards.md
3. agentic-dev-standards/commit-conventions.md

Session Context:
4. docs/archive/session-summaries/[latest-date]_[topic].md

After reading, please:
- Update the agentic-dev-standards submodule
- Run git status to see current state
- Check for available MCP servers
- Confirm you understand the current context
```

### What This Achieves

✅ **Consistent behavior** - AI follows universal standards
✅ **Context awareness** - AI knows what happened in previous sessions
✅ **Best practices** - AI uses proper terminal commands, commit formats, etc.
✅ **MCP usage** - AI prefers specialized MCP tools when available
✅ **Up-to-date rules** - AI has latest standards from submodule

---

## 📋 Session Summary Requirements

**IMPORTANT**: At the end of each work session, create a comprehensive summary to preserve context and decisions.

### When to Create Session Summaries

Create a session summary when:

- ✅ User indicates session is ending ("leaving", "pausing", "done for now")
- ✅ After completing major milestones
- ✅ Every 24 hours of active work
- ✅ Before switching to a different major task
- ✅ When significant decisions or discoveries were made

### Where to Store Session Summaries

```
project-root/
├── docs/
│   ├── archive/
│   │   ├── session-summaries/
│   │   │   ├── README.md                    # Index of all sessions
│   │   │   ├── 2025-10-31_terminal-setup.md
│   │   │   ├── 2025-11-01_api-refactor.md
│   │   │   └── 2025-11-02_bug-fixes.md
```

**File naming**: `YYYY-MM-DD_topic.md`

## Session Summary Template

```markdown
# Session Summary: [Topic] - [YYYY-MM-DD]

## Session Goals

- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

## What Was Accomplished

### Completed Tasks

1. **Task name**
   - Description of what was done
   - Files modified: `path/to/file.ts`, `path/to/test.ts`
   - Commits: `abc123f`, `def456a`

2. **Another task**
   - Details
   - Files: ...
   - Commits: ...

### Commits Made

All commits use Conventional Commits format:

- `abc123f` - `feat: Add new API endpoint for user profile`
- `def456a` - `test: Add unit tests for profile endpoint`
- `ghi789b` - `docs: Update API documentation`
- `jkl012c` - `fix: Correct validation in profile update`

**Total commits**: 4
**Branches**: `feature/user-profile-api`

## Pending Items

### Blockers

- [ ] **Blocker 1**: Description
  - Why it's blocking
  - Potential solutions
  - Owner: [Name or "unassigned"]

### Outstanding Work

- [ ] **Item 1**: Description
  - Related to: [commit/file/issue]
  - Priority: High/Medium/Low
  - Estimated effort: [timeframe]

- [ ] **Item 2**: ...

### Technical Debt Created

- **Debt 1**: Quick fix applied, needs proper refactoring
  - Location: `path/to/file.ts:123`
  - Proper solution: ...
  - Issue created: #42

## Technical Details

### Files Modified/Created

**Modified**:
- `src/api/profile.ts` - Added profile endpoint
- `src/api/validation.ts` - Added profile validation rules
- `tests/api/profile.test.ts` - Added test suite

**Created**:
- `src/types/profile.ts` - Profile type definitions
- `docs/api/profile-endpoint.md` - API documentation

### Key Decisions Made

1. **Decision**: Use JWT tokens for authentication
   - **Rationale**: Standard, secure, widely supported
   - **Alternatives considered**: Session cookies, OAuth
   - **Trade-offs**: Requires client to manage token storage

2. **Decision**: ...

### Design Patterns Used

- **Repository Pattern**: For data access layer
- **Dependency Injection**: For service instantiation
- **Factory Pattern**: For creating validators

### Testing Approach

- Unit tests: 15 new tests, 100% coverage on new code
- Integration tests: 3 new API endpoint tests
- Manual testing: Verified in Postman

## Lessons Learned

### What Worked Well

- ✅ Test-driven development caught edge cases early
- ✅ Using type definitions prevented runtime errors
- ✅ Conventional commits made changelog generation easy

### What Could Be Improved

- ⚠️ Should have written API docs before implementation
- ⚠️ Need better error messages for validation failures
- ⚠️ Integration tests are slow (3s each) - optimize

### New Patterns/Rules Discovered

1. **Pattern**: Always validate input at API boundary
   - **Where to document**: Project-specific guidelines
   - **Applied to**: All new endpoints

2. **Rule**: Use absolute imports for better refactoring
   - **Where to document**: Universal standards?
   - **Needs discussion**: Yes

## Context for Next Session

### Where We Left Off

Currently working on:
- Feature branch: `feature/user-profile-api`
- Last commit: `jkl012c` (fix: Correct validation in profile update)
- All tests passing
- Ready for: Code review and PR creation

### Next Steps (Priority Order)

1. **High Priority**: Create pull request for user profile API
   - Ensure all tests pass
   - Update CHANGELOG
   - Request review from team

2. **Medium Priority**: Address technical debt in validation layer
   - Refactor validation.ts
   - Extract common patterns
   - Add more test coverage

3. **Low Priority**: Optimize integration test performance
   - Investigate why tests are slow
   - Consider test database optimization

### Questions/Unknowns

- ❓ Should we add rate limiting to profile endpoint?
- ❓ Do we need admin-only profile fields?
- ❓ What's the plan for profile image uploads?

## References

### Related Issues/PRs

- Issue #38: User profile management
- PR #41: Authentication system (dependency)

### Documentation

- `docs/api/profile-endpoint.md` - API documentation
- `docs/development/testing-strategy.md` - Testing guidelines

### External Resources

- [JWT Best Practices](https://example.com/jwt-guide)
- [Repository Pattern](https://example.com/repo-pattern)

---

**Session Duration**: ~4 hours
**Next Session**: Focus on PR creation and code review
**Session Lead**: [AI Assistant Name] + [Human Developer Name]
</markdown>
```

## Session Summary Index

Maintain a `README.md` in `docs/archive/session-summaries/` with an index:

```markdown
# Session Summaries Index

## 2025

### November

- [2025-11-02 - Bug Fixes](2025-11-02_bug-fixes.md) - Fixed validation and error handling
- [2025-11-01 - API Refactoring](2025-11-01_api-refactor.md) - Refactored API layer for better maintainability

### October

- [2025-10-31 - Terminal Setup](2025-10-31_terminal-setup.md) - Configured clean terminal environment for AI agents

## Quick Links

- [Latest Session](2025-11-02_bug-fixes.md)
- [Active Feature Branches](#active-branches)
- [Open Blockers](#open-blockers)

## Active Branches

- `feature/user-profile-api` - User profile management (2025-11-01)
- `bugfix/validation-errors` - Fix validation error handling (2025-11-02)

## Open Blockers

- None currently

---

**Total Sessions**: 3
**Last Updated**: 2025-11-02
```

## Benefits of Session Summaries

### For Humans

✅ **Context Preservation**: Pick up where you left off days/weeks later
✅ **Decision Tracking**: Remember why choices were made
✅ **Team Communication**: Share progress with teammates
✅ **Retrospectives**: Learn from past sessions
✅ **Onboarding**: Help new team members understand project history

### For AI Assistants

✅ **Context Restoration**: Understand previous work in new sessions
✅ **Avoid Rework**: Don't repeat mistakes or recreate solutions
✅ **Better Suggestions**: Make informed recommendations based on past decisions
✅ **Continuity**: Maintain coding style and patterns from previous sessions

## Best Practices

### During the Session

1. **Track as you go**: Note major decisions when they happen
2. **Document blockers immediately**: Don't wait until end of session
3. **Reference commits**: Link commits to specific tasks
4. **Capture unknowns**: Write down questions as they arise

### End of Session

1. **Review all commits**: Ensure all work is documented
2. **Verify test status**: Note passing/failing tests
3. **Update index**: Add session to README.md
4. **Commit the summary**: Use conventional commit format

   ```bash
   git commit -m "docs: Add session summary for YYYY-MM-DD"
   ```

### Session Summary Commit

Always commit session summaries with this pattern:

```bash
git add docs/archive/session-summaries/
git commit -m "docs: Add session summary for 2025-10-31"
```

## Anti-Patterns

### ❌ Don't Do This

**Overly brief summaries**:

```markdown
# Session Summary - 2025-10-31
Fixed some bugs. Made 3 commits.
```

*Problem*: No context, no decisions, no next steps

**Missing technical details**:

```markdown
Worked on the API. It's better now.
```

*Problem*: What changed? Why? How?

**No pending items**:

```markdown
Everything is done!
```

*Problem*: There's always something pending or that could be improved

**Created at project root**:

```
project-root/
├── SESSION_SUMMARY.md  ❌ Wrong location
```

*Problem*: Should be in `docs/archive/session-summaries/`

## Integration with AI Tools

### VSCode Copilot

At end of session, ask Copilot:

```
"Create a session summary for today's work in docs/archive/session-summaries/YYYY-MM-DD_topic.md"
```

### Cursor

At end of session:

```
"Generate a comprehensive session summary following the template in workflow-patterns/session-management.md"
```

### Claude Code

```
"We're wrapping up this session. Please create a session summary documenting all the work we did today."
```

## Automation Opportunities

### Git Hooks

Create a pre-commit hook reminder:

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check if it's been > 24 hours since last session summary
LAST_SUMMARY=$(ls -t docs/archive/session-summaries/*.md | head -1)
if [ -n "$LAST_SUMMARY" ]; then
    HOURS_AGO=$(( ($(date +%s) - $(stat -f %m "$LAST_SUMMARY")) / 3600 ))
    if [ $HOURS_AGO -gt 24 ]; then
        echo "⚠️  Reminder: It's been $HOURS_AGO hours since last session summary"
        echo "Consider creating a session summary before ending this session."
    fi
fi
```

### CI/CD Integration

Add a check to ensure session summaries exist for long-running branches:

```yaml
# .github/workflows/session-check.yml
name: Session Summary Check
on: [pull_request]
jobs:
  check-session-summaries:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Check for session summaries
        run: |
          # Verify session summaries directory exists
          # Warn if PR branch is > 7 days old without summary
```

---

## Summary

**Session summaries are critical for**:

- Preserving context across sessions
- Documenting decisions and rationale
- Tracking progress and blockers
- Enabling better AI assistance in future sessions

**Create them**:

- At end of every work session
- After major milestones
- Every 24 hours of active work

**Store them**:

- `docs/archive/session-summaries/YYYY-MM-DD_topic.md`
- Update index in `docs/archive/session-summaries/README.md`

**Commit them**:

```bash
git commit -m "docs: Add session summary for YYYY-MM-DD"
```
