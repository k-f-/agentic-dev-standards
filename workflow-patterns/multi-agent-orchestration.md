# Multi-Agent Orchestration Patterns

**Purpose**: Guidance for effectively using sub-agents, multi-agent delegation, and model specialization in agentic coding workflows.

**Applies to**: Claude Code, OpenCode, Cursor, and any tool with sub-agent or multi-model capabilities.

---

## Table of Contents

- [When to Use Sub-Agents](#when-to-use-sub-agents)
- [Decomposition Strategies](#decomposition-strategies)
- [Context Passing Between Agents](#context-passing-between-agents)
- [Agent Communication Patterns](#agent-communication-patterns)
- [Error Handling & Recovery](#error-handling--recovery)
- [Model Specialization & Routing](#model-specialization--routing)
- [Cost Management](#cost-management)
- [Tool-Specific Implementation](#tool-specific-implementation)
- [Anti-Patterns](#anti-patterns)
- [Quick Reference](#quick-reference)

---

## When to Use Sub-Agents

### Use Sub-Agents When

- **Exploring unfamiliar codebases**: Spawn read-only agents to search in parallel across different directories or patterns
- **Parallel independent tasks**: Multiple files need changes that don't depend on each other
- **Large-scale refactoring**: Rename a symbol across 50 files — one agent per batch
- **Research + implement**: One agent investigates the current state, another implements changes once the picture is clear
- **Complex search queries**: Multiple agents searching for different patterns simultaneously
- **Test + fix cycles**: One agent runs tests while another starts fixing known issues

### Stay Single-Agent When

- **Sequential logic**: Each step depends on the previous step's output
- **Small changes**: A single file edit or simple commit doesn't need delegation
- **Tight coupling**: Changes that must be coordinated line-by-line across files
- **Context is critical**: The full conversation history matters for making the right decision
- **Simple questions**: Asking about code structure or explaining a function

### Complexity Threshold

As a rule of thumb, consider sub-agents when a task involves **3+ independent units of work** that can proceed in parallel. Below that threshold, the overhead of spawning agents, passing context, and merging results exceeds the benefit.

---

## Decomposition Strategies

### Strategy 1: Map-Reduce Over Files

Split work across files or directories, then merge results.

```
Lead Agent:
  1. Identify all files matching pattern (e.g., all API route handlers)
  2. Spawn Agent A → process files 1-10
  3. Spawn Agent B → process files 11-20
  4. Spawn Agent C → process files 21-30
  5. Collect results, verify consistency, resolve conflicts
```

**Best for**: Bulk refactoring, adding types, updating imports, applying consistent patterns.

### Strategy 2: Parallel Search / Investigation

Multiple agents explore different aspects of a question simultaneously.

```
Lead Agent:
  1. "How does authentication work in this project?"
  2. Spawn Agent A → search for auth middleware and config
  3. Spawn Agent B → search for token/session handling
  4. Spawn Agent C → search for route protection patterns
  5. Synthesize findings into a coherent answer
```

**Best for**: Codebase exploration, architecture understanding, impact analysis.

### Strategy 3: Specialist Delegation

Assign tasks based on domain expertise required.

```
Lead Agent:
  1. Plan the feature
  2. Spawn Agent A → implement database migration
  3. Spawn Agent B → write API endpoint
  4. Spawn Agent C → create test suite
  5. Integrate and verify all pieces work together
```

**Best for**: Feature implementation, multi-layer changes (DB + API + UI + tests).

### Strategy 4: Plan-Then-Execute

One agent (or mode) plans, another executes.

```
Planning Agent (read-only):
  1. Analyze requirements
  2. Identify affected files
  3. Propose approach with specific changes
  4. Output structured plan

Execution Agent (full access):
  1. Receive plan
  2. Implement changes
  3. Run tests
  4. Report results
```

**Best for**: Complex features where getting the approach right matters more than speed. OpenCode's Plan/Build mode split is designed for exactly this.

---

## Context Passing Between Agents

### What to Include in Sub-Agent Prompts

- **Specific file paths** to examine or modify
- **The exact task** — be precise about what the sub-agent should do and return
- **Constraints** — what NOT to change, formatting rules, patterns to follow
- **Expected output format** — tell the agent what information you need back

### What to Exclude

- **Full conversation history** — sub-agents don't need your entire chat log
- **Unrelated context** — don't pass the database schema when asking about CSS
- **Vague instructions** — "look into the auth stuff" is worse than "find all files in `src/auth/` that import `jsonwebtoken` and list their exports"

### Example: Good vs. Bad Sub-Agent Prompt

**Bad**:
```
Search the codebase for anything related to user authentication.
```

**Good**:
```
Search for files in src/ that contain the pattern 'authenticate|isAuthenticated|requireAuth'.
For each match, return:
1. File path and line number
2. The function/class name containing the match
3. Whether it's a definition or a usage
Do NOT read file contents beyond the matching lines and their immediate context.
```

### Context Budget Rule

Each sub-agent gets its own context window. The cost formula is:

```
Total tokens = (lead agent context) + (sub-agent A context) + (sub-agent B context) + ...
```

Keep sub-agent prompts focused to avoid blowing through token budgets. A sub-agent that loads 10 files "just in case" wastes tokens — load only what's needed.

---

## Agent Communication Patterns

### Pattern 1: Hub and Spoke (Most Common)

```
        ┌─── Agent A (search) ───┐
        │                        │
Lead ───┼─── Agent B (search) ───┼─── Lead (synthesize)
        │                        │
        └─── Agent C (search) ───┘
```

One lead agent coordinates all sub-agents. Sub-agents report back only to the lead. The lead merges results and makes decisions.

**When to use**: Most multi-agent tasks. Simple, predictable, easy to debug.

### Pattern 2: Pipeline

```
Agent A (analyze) → Agent B (plan) → Agent C (implement) → Agent D (test)
```

Each agent's output feeds into the next agent's input. Sequential but each stage is focused.

**When to use**: Multi-phase work where each phase requires a different focus (e.g., investigate → design → build → verify).

### Pattern 3: Competitive / Redundant

```
Lead ─── Agent A (approach 1) ──┐
     │                          ├─── Lead (choose best)
     └── Agent B (approach 2) ──┘
```

Multiple agents attempt the same task with different approaches. The lead compares results and picks the best one.

**When to use**: Rarely. Only for high-stakes decisions where exploring multiple approaches is worth the cost (e.g., "what's the best way to refactor this module?").

---

## Error Handling & Recovery

### When a Sub-Agent Fails

1. **Check the failure reason** — Was it a context issue, a tool failure, or a logic error?
2. **Retry with adjusted prompt** — Often a more specific prompt resolves the issue
3. **Fall back to single-agent** — If sub-agents consistently fail, do the work inline
4. **Partial results are valuable** — If 3 of 4 agents succeed, use those results and handle the 4th manually

### Common Sub-Agent Failures

| Failure | Cause | Fix |
|---------|-------|-----|
| Agent returns nothing useful | Prompt too vague | Be more specific about what to search/return |
| Agent modifies wrong files | Insufficient constraints | Explicitly list which files to touch and which to leave alone |
| Agent contradicts lead's plan | Context not passed correctly | Include the plan/constraints in the sub-agent prompt |
| Agent times out | Task too large | Break into smaller sub-tasks |
| Agent hallucinates file paths | No verification step | Always verify agent output against actual filesystem |

### Verification Checklist

After merging sub-agent results:

- [ ] All modified files compile/parse correctly
- [ ] No unintended changes outside the specified scope
- [ ] Tests still pass
- [ ] Changes are consistent across all sub-agent outputs
- [ ] No duplicate or conflicting modifications

---

## Model Specialization & Routing

### The Case for Multi-Model Workflows

Different models have different strengths. Using a single model for all tasks leaves performance on the table:

| Domain | Stronger Models (as of early 2026) | Why |
|--------|-------------------------------------|-----|
| Complex reasoning & architecture | Claude Opus, o3 | Deep chain-of-thought, nuanced design decisions |
| Code implementation | Claude Sonnet, GPT-4.1 | Fast, accurate code generation |
| Visual/UI/layout work | Gemini 2.5 Pro | Strong spatial reasoning, CSS/HTML generation |
| Quick tasks & triage | Gemini Flash, Haiku, GPT-4.1-mini | Fast, cheap, good enough for simple work |
| Large context analysis | Gemini 2.5 Pro | 1M+ token context window |

**Important**: Model strengths shift rapidly. Treat the table above as a snapshot, not gospel. Reference live benchmarks:
- [Aider LLM Leaderboard](https://aider.chat/docs/leaderboards/)
- [Chatbot Arena](https://lmarena.ai/)
- [SWE-bench](https://www.swebench.com/)

### Current Routing Patterns

#### Pattern 1: Manual Model Switching (All Multi-Model Tools)

Switch models mid-session when the task domain changes.

```
Session: Working on backend API (Claude Opus)
  → "Now let's style the dashboard" 
  → Switch to Gemini 2.5 Pro (Ctrl+O in OpenCode)
  → Complete CSS/layout work
  → Switch back to Claude for integration tests
```

**Pros**: Human judgment is the best router. Works today in OpenCode, Crush, and Aider.
**Cons**: Requires awareness of when to switch.

#### Pattern 2: Agent-Level Model Assignment (OpenCode, Aider)

Configure different models for different agent roles.

**OpenCode** (`.opencode/config.json`):
```json
{
  "agents": {
    "build": {
      "model": "anthropic/claude-opus-4"
    },
    "plan": {
      "model": "google/gemini-2.5-pro"
    }
  }
}
```

**Aider** (architect mode):
```bash
# One model designs, another implements
aider --architect --model claude-opus-4 --editor-model gemini-2.5-pro
```

**Pros**: Semi-automatic, role-based split is natural. Planning benefits from large context and reasoning; implementation benefits from speed and code accuracy.
**Cons**: The split is role-based, not domain-based.

#### Pattern 3: MCP Model Router (Conceptual Architecture)

An MCP server that routes specific generation tasks to specialized model APIs. This doesn't exist as a package yet but is architecturally sound and buildable.

```
┌─────────────────────────────────────────────┐
│  Primary Session (e.g., Claude in OpenCode) │
│                                             │
│  "Generate a responsive dashboard layout    │
│   with sidebar navigation"                  │
│                                             │
│  → Calls MCP tool: model_route              │
│    domain: "ui-layout"                      │
│    prompt: "Generate responsive dashboard..." │
└──────────────┬──────────────────────────────┘
               │ MCP stdio
               ▼
┌──────────────────────────────────────┐
│  MCP Model Router Server             │
│                                      │
│  Route config:                       │
│    ui-layout    → gemini-2.5-pro     │
│    code-logic   → claude-opus-4      │
│    quick-task   → gemini-flash       │
│    code-review  → claude-sonnet-4    │
│                                      │
│  1. Receive request                  │
│  2. Match domain → model             │
│  3. Call model API                   │
│  4. Return result to session         │
└──────────────────────────────────────┘
```

**How it would work**:
1. Primary agent (Claude/Gemini/etc.) orchestrates the session
2. When encountering a domain-specific task, it calls the MCP `model_route` tool
3. The MCP server matches the domain to a configured model
4. Makes the API call to the specialized model
5. Returns the result to the primary agent for integration

**Configuration would look like**:
```json
{
  "mcpServers": {
    "model-router": {
      "command": "node",
      "args": ["path/to/model-router-mcp/server.js"],
      "env": {
        "ANTHROPIC_API_KEY": "...",
        "GEMINI_API_KEY": "...",
        "OPENAI_API_KEY": "..."
      }
    }
  }
}
```

**Pros**: Automatic domain-based routing, configurable, model-agnostic orchestrator.
**Cons**: Doesn't exist yet as a package. Adds latency (double API call). Cost of maintaining routing config.

### Routing Decision Framework

When deciding whether to route a task to a different model:

1. **Is the domain mismatch significant?** If your current model handles the task at 80%+ quality, switching isn't worth the friction
2. **Is the task large enough?** Switching for a 5-line CSS fix is overkill. Switching for a full page layout redesign makes sense
3. **Do you have the model configured?** If switching requires setup mid-session, the context cost may exceed the quality gain
4. **Will the output need integration?** Code from a different model may follow different patterns — plan for harmonization

---

## Cost Management

### Token Economics of Multi-Agent Workflows

Each sub-agent spawns with its own context window:

```
Single-agent task:  ~50K tokens (one context window)
3 sub-agent task:   ~50K + 20K + 20K + 20K = ~110K tokens
                    (lead + 3 sub-agents)
```

Sub-agents trade **cost** for **speed** and **parallelism**. Make sure the trade is worth it.

### Cost Optimization Strategies

1. **Use cheaper models for sub-agents**: If the lead uses Opus, sub-agents doing search/grep work can use Sonnet or Haiku
2. **Minimize sub-agent context**: Pass only what's needed — specific file paths, not "read the whole project"
3. **Batch similar tasks**: Instead of 10 agents editing 1 file each, use 2-3 agents editing batches
4. **Cache prompt prefixes**: When sending similar prompts to multiple sub-agents, structure them to maximize prompt caching (same prefix, different suffix)
5. **Kill early**: If a sub-agent is clearly going down the wrong path, cancel and retry with a better prompt rather than letting it consume tokens

### When NOT to Multi-Agent

The cost threshold: if a task takes a single agent < 5 minutes and < 20K tokens, sub-agents add overhead without benefit. Reserve multi-agent orchestration for tasks where parallelism or specialization delivers measurable improvement.

---

## Tool-Specific Implementation

### Claude Code

- **Sub-agent mechanism**: `Task` tool with `subagent_type` parameter
- **Agent types**: `general` (multi-step tasks), `explore` (fast codebase search)
- **Model routing**: Sub-agents use the same model as the parent (no per-agent model selection)
- **Best for**: Map-reduce over files, parallel exploration

```
Example: "Search for all TODO comments" 
→ Spawns 'explore' agent with focused search prompt
→ Returns consolidated results
```

### OpenCode

- **Sub-agent mechanism**: `@general` in messages invokes the sub-agent
- **Mode split**: Plan mode (Tab) for read-only analysis, Build mode for changes
- **Model routing**: Different models per agent type in config (build, plan, title)
- **Best for**: Plan-then-execute pattern, model specialization

```
Example: Tab → Plan mode (Gemini) → "Analyze the auth flow"
         Tab → Build mode (Claude) → "Implement the changes from the plan"
```

### Cursor

- **Sub-agent mechanism**: Background agents (run in background while you work)
- **Agent mode**: Composer with agent capabilities
- **Model routing**: Manual model switching per chat, no automatic routing
- **Best for**: Background tasks, parallel feature work

### Aider

- **Sub-agent mechanism**: Architect mode (plan model + edit model)
- **Model routing**: Explicit `--model` and `--editor-model` flags
- **Best for**: Explicit two-model workflows (reasoning + implementation)

---

## Anti-Patterns

### 1. Over-Delegation
**Problem**: Spawning sub-agents for trivial tasks.
**Example**: Creating a sub-agent to rename a single variable.
**Fix**: Only delegate when the overhead is justified by parallelism or specialization.

### 2. Context Dumping
**Problem**: Passing the entire conversation history to every sub-agent.
**Example**: "Here's everything we've discussed for the last hour, now find a file."
**Fix**: Extract only the relevant context. Sub-agents work best with focused, specific prompts.

### 3. Unverified Merge
**Problem**: Blindly accepting all sub-agent results without verification.
**Example**: Three agents edit overlapping files, creating conflicts nobody checks.
**Fix**: Always verify merged results. Run tests. Check for consistency.

### 4. Agent Sprawl
**Problem**: Spawning more agents than the task warrants.
**Example**: 10 agents for a 5-file change.
**Fix**: 2-3 focused agents almost always outperform 10 unfocused ones.

### 5. Wrong Model for the Job
**Problem**: Using an expensive reasoning model for simple search tasks.
**Example**: Opus agent doing `grep` across files.
**Fix**: Match model capability to task complexity. Use fast/cheap models for mechanical work.

---

## Quick Reference

### Decision Tree

```
Is the task parallelizable?
├── No → Single agent
└── Yes → Are there 3+ independent units?
    ├── No → Single agent (overhead not worth it)
    └── Yes → Multi-agent
        ├── All same type of work? → Map-reduce (batch files across agents)
        ├── Different domains? → Specialist delegation
        ├── Need exploration first? → Plan-then-execute
        └── Multiple approaches? → Competitive (rare, expensive)
```

### Sub-Agent Prompt Template

```
TASK: [Specific, measurable objective]
SCOPE: [Exact files/directories to examine or modify]
CONSTRAINTS: [What NOT to do, patterns to follow]
OUTPUT: [What information to return, in what format]
```

### Cost Estimation

| Pattern | Typical Token Multiplier | When Worth It |
|---------|--------------------------|---------------|
| Single agent | 1x | Tasks < 5 min |
| 2 sub-agents | ~2x | Moderate parallelism |
| 3-5 sub-agents | ~3-4x | Large refactors, broad search |
| 5+ sub-agents | ~5x+ | Massive codebase operations |

---

**Last Updated**: February 12, 2026
**Version**: 1.0.0

---

**Related Standards**:
- [`agent-safety.md`](agent-safety.md) - Permission models and safety guardrails
- [`context-preservation.md`](context-preservation.md) - Token management strategies
- [`session-management.md`](session-management.md) - Session lifecycle management
