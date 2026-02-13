# Context Preservation for AI-Assisted Development

## Overview

AI coding assistants have context window limitations that can cause them to "forget" earlier parts of long conversations or lose critical project context. This guide provides techniques for preserving context across sessions and managing token budgets effectively.

## 🎯 The Challenge

**Context Window Constraints**:
- AI models have finite context windows (e.g., 200k tokens for Claude, 128k-1M+ for Gemini, 128k for GPT-4o)
- Long conversations can exceed these limits
- Context loss leads to:
  - Repeated questions
  - Forgotten decisions
  - Inconsistent implementation
  - Wasted time re-explaining

**Session Boundaries**:
- Each new session starts with zero context
- Previous work must be explicitly loaded
- Critical decisions can be lost
- Patterns and conventions may be forgotten

## 📊 Token Budget Awareness

### Understanding Token Usage

**What counts as tokens**:
- Your messages to the AI
- AI's responses
- File contents that have been read
- Code that has been written
- Tool outputs (bash commands, grep results, etc.)

**Monitoring token usage**:
- Most AI tools show token usage in their interface
- Claude Code shows: "Token usage: X/200000; Y remaining"
- Monitor this throughout your session

### Token Budget Strategies

#### 1. Prioritize Critical Context

**Always preserve first** (in order of importance):
1. Project-specific rules and conventions
2. Current task/goal
3. Recent decisions and their rationale
4. Active file contexts
5. Test results and error messages

**Can summarize or drop**:
- Verbose command outputs
- Detailed exploration that led to dead ends
- Repeated similar operations
- Historical context older than current task

#### 2. Summarize When Approaching Limits

When token usage reaches **~70% of limit**, create a summary:

```markdown
## Context Summary (Created at 140k/200k tokens)

**Current Goal**: Implement rate limiting for API endpoints

**Key Decisions Made**:
- Using express-rate-limit library (lightweight, well-maintained)
- 100 requests per 15 minutes per IP
- Different limits for authenticated vs unauthenticated users

**Current State**:
- Feature branch: feature/api-rate-limiting
- Files modified: src/middleware/rate-limit.ts, src/app.ts
- Tests: 8/8 passing
- Ready for: Integration testing

**Next Steps**:
1. Test with load testing tool
2. Document configuration options
3. Create PR

**Can be dropped from context**:
- Initial exploration of alternative libraries (already decided)
- Debugging steps that are now resolved
- Earlier draft implementations (superseded by current code)
```

#### 3. Use External Storage

**Don't rely solely on conversation history**:

✅ **Store externally**:
- Session summaries in `docs/archive/session-summaries/`
- Key decisions in commit messages
- Architecture docs in `docs/development/`
- Design rationale in code comments
- Open questions in GitHub issues

❌ **Don't rely on conversation**:
- "Remember when we discussed X?" (AI may not)
- Long lists of TODOs (use session summaries or issues)
- Complex architecture explained only in chat

### Token-Efficient Practices

#### Use Targeted File Reading

```bash
# ❌ Wasteful - reads entire large file
Read src/very-large-file.ts

# ✅ Efficient - read specific section
Read src/very-large-file.ts (lines 100-150)

# ✅ Efficient - use grep to find relevant sections first
Grep "function calculateTotal" src/
# Then read only relevant files
```

#### Combine Related Operations

```bash
# ❌ Wasteful - multiple separate bash calls
Bash: git status
Bash: git diff
Bash: git log --oneline -5

# ✅ Efficient - combined
Bash: git status && git diff && git log --oneline -5
```

#### Reference, Don't Repeat

```markdown
# ❌ Wasteful
"Follow these 20 rules: [paste entire rule list again]"

# ✅ Efficient
"Follow rules in agentic-dev-standards/universal-agent-rules.md"
```

## 🔑 Key Decisions Tracking

### Why Track Decisions

**Problem**: "Why did we choose library X over Y?"
- 2 weeks later, you've forgotten
- New team member doesn't know
- AI can't explain in new session

**Solution**: Document decisions when made, with rationale.

### Decision Documentation Format

```markdown
## Decision: [Short title]

**Date**: YYYY-MM-DD
**Context**: What problem we were solving
**Decision**: What we chose to do
**Rationale**: Why we chose this approach
**Alternatives Considered**: What else we looked at
**Trade-offs**: What we gained/lost
**Consequences**: Impact on the project
**References**: Links, commits, issues

---

## Example: Use PostgreSQL for Database

**Date**: 2025-10-15
**Context**: Need to store user data with relationships and transactions
**Decision**: Use PostgreSQL as primary database
**Rationale**:
- Strong ACID compliance for financial data
- Excellent JSON support for flexible fields
- Team has PostgreSQL experience
- Free and open source

**Alternatives Considered**:
- MongoDB: Too loose for financial data
- MySQL: Weaker JSON support
- SQLite: Not scalable for multi-user

**Trade-offs**:
- Gain: Data integrity, powerful queries
- Lose: Some simplicity (vs MongoDB)

**Consequences**:
- Need PostgreSQL in dev/staging/prod
- Migration scripts for schema changes
- Team training on advanced PostgreSQL features

**References**:
- Issue #23
- Commit abc123f
- [PostgreSQL vs MongoDB comparison](https://example.com)
```

### Where to Store Decisions

**Option 1**: Architecture Decision Records (ADRs)

```
docs/
├── development/
│   ├── decisions/
│   │   ├── README.md                    # Index
│   │   ├── 001-use-postgresql.md
│   │   ├── 002-api-versioning-strategy.md
│   │   ├── 003-authentication-approach.md
```

**Option 2**: Session Summaries (for smaller decisions)

Include in "Key Decisions Made" section of session summary.

**Option 3**: Commit Messages (for code-level decisions)

```bash
git commit -m "refactor: Use factory pattern for validators

Previously using direct instantiation, which made testing difficult
and violated DI principles. Factory pattern allows:
- Easy mocking in tests
- Centralized validator configuration
- Better separation of concerns

Trade-off: Slightly more code, but much better testability."
```

**Option 4**: Code Comments (for implementation decisions)

```typescript
/**
 * Using debounce instead of throttle here because we want
 * the LAST value after user stops typing, not periodic values
 * during typing. Throttle would cause partial search terms.
 *
 * Decision date: 2025-10-15
 * Alternatives: throttle (rejected - see above)
 */
const debouncedSearch = debounce(performSearch, 300);
```

## 🔄 Context Handoff Pattern

### Session End Checklist

Before ending a session:

- [ ] **Create session summary** (see `session-management.md`)
- [ ] **Document key decisions** (in session summary or ADRs)
- [ ] **Commit all work** (don't leave uncommitted changes)
- [ ] **Note current state** (what's working, what's broken)
- [ ] **List next steps** (prioritized)
- [ ] **Capture open questions** (things to research/decide)
- [ ] **Tag important context** (what must be remembered)

### Session Start Checklist

When starting a new session:

- [ ] **Load universal standards** (from agentic-dev-standards/)
- [ ] **Read latest session summary**
- [ ] **Review current branch state** (git status, last commits)
- [ ] **Verify test status** (run tests if quick)
- [ ] **Check for blockers** (from previous session)
- [ ] **Confirm next steps** (from previous session)

### Session Start Template

```markdown
"I'm starting a new session. Please:

1. Read these files for context:
   - agentic-dev-standards/universal-agent-rules.md
   - agentic-dev-standards/terminal-standards.md
   - agentic-dev-standards/commit-conventions.md
   - docs/archive/session-summaries/[latest-date]_[topic].md

2. Run: git status && git log --oneline -5

3. Summarize:
   - Current state of the project
   - What we were working on
   - What the next steps are

4. Confirm you understand the context before we proceed."
```

## 🏷️ Tagging for Easy Retrieval

### Use Consistent Markers

**In session summaries**:
```markdown
**🚨 BLOCKER**: Database migration failing in CI
**❓ QUESTION**: Should we add caching to this endpoint?
**⚠️ TECH DEBT**: Quick fix applied, needs refactoring
**💡 INSIGHT**: Discovered that X causes Y
**🎯 DECISION**: Using library X for reason Y
```

**In code**:
```typescript
// 🚨 BLOCKER: Waiting for API endpoint to be available
// ❓ TODO: Should this handle edge case X?
// ⚠️ TECH DEBT: Refactor this to use proper pattern
// 💡 NOTE: This must run before initialization
// 🎯 DECISION: Using approach X (see ADR-005)
```

**In commit messages**:
```bash
# Tag type of work
feat: ...
fix: ...
docs: ...

# Tag blockers in branch name
bugfix/blocker-database-migration-fails
```

### Searchable Patterns

Use consistent phrases for easy grep/search:

**Decisions**: Always use "Decision:" prefix
```markdown
**Decision**: Use PostgreSQL
**Decision**: API versioning via URL path
```

**Blockers**: Always use "Blocker:" prefix
```markdown
**Blocker**: Waiting for design approval
**Blocker**: CI environment missing credentials
```

**Questions**: Always use "Question:" prefix
```markdown
**Question**: Should we support IE11?
**Question**: What's the rate limit for external API?
```

Then search easily:
```bash
# Find all decisions
grep -r "Decision:" docs/

# Find all blockers
grep -r "Blocker:" docs/

# Find all questions
grep -r "Question:" docs/
```

## 🧠 Memory Techniques for Long Sessions

### Progressive Summarization

As conversation gets longer, create layers of summary:

**Hour 1-2**: Full detail, all context
```
Read files, explore codebase, discuss approaches...
```

**Hour 3-4**: Create checkpoint summary
```markdown
## Checkpoint (2 hours in)
- Decided on approach X
- Files modified: A, B, C
- Current focus: Implementing feature Y
- Drop from context: Initial exploration of Z (dead end)
```

**Hour 5-6**: Create compressed summary
```markdown
## Compressed Context (4 hours in)
**Goal**: Add feature Y
**Progress**: 60% complete, tests passing
**Remaining**: Integration testing, documentation
**Key decision**: Using library X (see earlier checkpoint)
**Next**: Focus on integration tests only
```

**Hour 7+**: Consider starting fresh session
```markdown
Create final session summary, commit all work, start new session
with fresh context by loading previous session summary.
```

### Context Layers

Organize context in layers by importance:

**Layer 1 - Critical** (always preserve):
- Current goal/task
- Active files being edited
- Recent test failures/errors
- Immediate next step

**Layer 2 - Important** (preserve if space):
- Key decisions from this session
- Related files not currently editing
- Recent commit messages
- Design patterns being used

**Layer 3 - Background** (summarize or drop):
- How we got to current approach
- Alternatives we explored and rejected
- Historical context
- Earlier attempts/iterations

**When approaching token limits**: Drop Layer 3, summarize Layer 2, preserve Layer 1.

## 🛠️ Tool-Specific Strategies

### GitHub Copilot / VSCode

**Context is per-file**:
- Copilot sees current file + nearby files
- Limited conversation history
- Use code comments to preserve decisions
- Keep related code close together

**Strategies**:
- Document decisions in code comments
- Use consistent naming for related functions
- Keep context files open in editor

### Cursor

**Composer has larger context**:
- Can see multiple files
- Conversation persists in chat
- Use @-mentions to reference files

**Strategies**:
- Use @docs to reference documentation
- @-mention related files for context
- Create checkpoints in long conversations

### OpenCode

**Provider-agnostic context**:
- Context window depends on model chosen (200k+ for Claude, 128k-1M+ for Gemini)
- Plan/Build mode split helps preserve context (Plan mode for exploration, Build for changes)
- Plugin ecosystem for automated context management

**Strategies**:
- Use MCP server for on-demand standard loading
- Use Dynamic Context Pruning plugin for automatic token management
- Use Handoff plugin for automated session summaries
- Switch to Plan mode for research to avoid wasting context on edits
- Use `@general` sub-agent to offload search tasks

### Claude Code

**Large context window**:
- 200k token context window
- Excellent at understanding large codebases
- Sub-agents (Task tool) for context-efficient delegation

**Strategies**:
- Use MCP server for on-demand standard loading
- Create comprehensive session summaries
- Use session handoff pattern
- Delegate search tasks to `explore` sub-agent
- Monitor token usage (shown in output)

### Windsurf / Continue

**Similar to Cursor**:
- Multi-file awareness
- Persistent chat history
- Reference-based context

**Strategies**:
- Use file references liberally
- Create checkpoints in long sessions
- Document in external files, not just chat

## 📋 Context Preservation Checklist

### During Development

- [ ] Document decisions as they're made (not later)
- [ ] Update session summary incrementally (not at end)
- [ ] Monitor token usage if shown
- [ ] Keep related context together (files, commits, docs)
- [ ] Tag important items for retrieval

### At Checkpoints (every 2 hours or 50k tokens)

- [ ] Create checkpoint summary
- [ ] Identify what can be dropped from context
- [ ] Commit work in progress
- [ ] Note current state clearly

### At Session End

- [ ] Create comprehensive session summary
- [ ] Document all key decisions
- [ ] Commit all work
- [ ] List next steps with priority
- [ ] Tag blockers and questions

### At Session Start

- [ ] Load universal standards
- [ ] Read latest session summary
- [ ] Check current state (git status)
- [ ] Verify AI understands context
- [ ] Confirm next steps

## 🎯 Best Practices Summary

**Do**:
- ✅ Create session summaries regularly
- ✅ Document decisions with rationale
- ✅ Use external storage (files, not just chat)
- ✅ Monitor token usage
- ✅ Tag important context
- ✅ Load context explicitly at session start
- ✅ Create checkpoints in long sessions

**Don't**:
- ❌ Rely on AI to "remember" from earlier in conversation
- ❌ Let token usage reach 90%+ without summarizing
- ❌ Leave critical context only in chat history
- ❌ Start new sessions without loading previous context
- ❌ Skip documenting important decisions
- ❌ Forget to commit work before session ends

## 📚 Related Resources

- **[session-management.md](session-management.md)** - Session summary templates and practices
- **[branch-strategy.md](branch-strategy.md)** - Git workflow and branch management
- **[github-issues.md](github-issues.md)** - Issue and PR documentation
- **[universal-agent-rules.md](../universal-agent-rules.md)** - Universal best practices

## 🚀 Quick Reference

**Token budget critical?**
→ Create checkpoint summary, drop Layer 3 context

**Starting new session?**
→ Load standards + latest session summary + git status

**Made important decision?**
→ Document immediately with rationale

**Approaching end of session?**
→ Create session summary, commit all work, list next steps

**AI seems confused?**
→ Check token usage, may need to summarize or start fresh

**Long running task?**
→ Create checkpoints every 2 hours, commit frequently

---

**Last Updated**: 2026-02-12
**Version**: 1.1.0
**Related Standards**: Session Management, Universal Agent Rules, Multi-Agent Orchestration
