# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.0] - 2026-02-12

### Added

- **OpenCode integration guide** (`integration/opencode.md`) — Full setup guide for OpenCode terminal agent including MCP configuration, AGENTS.md, rules, Plan/Build modes, sub-agents, custom commands, model configuration, LSP integration, and recommended plugins from the awesome-opencode ecosystem
- **Multi-agent orchestration pattern** (`workflow-patterns/multi-agent-orchestration.md`) — Task decomposition strategies, context passing between agents, agent communication patterns, model specialization and routing (with MCP router architecture), cost management, tool-specific implementation guides, and anti-patterns
- **Agent safety and permissions pattern** (`workflow-patterns/agent-safety.md`) — Permission models by tool, destructive operations detection, secrets management, sandboxing strategies, audit trails, rollback patterns, permission escalation, and the YOLO anti-pattern
- **`list_available_standards` MCP tool** — Discover all available standards, workflow patterns, and integration guides with descriptions
- **Project instruction file conventions** in universal-agent-rules.md — Documents AGENTS.md, CLAUDE.md, .cursor/rules/, and other tool-specific instruction file standards
- **CHANGELOG.md** — This file
- **CONTRIBUTING.md** — Contribution guidelines
- **GitHub issue and PR templates** — Bug report, feature request, and pull request templates

### Changed

- **Claude Code guide rewritten** (`integration/claude-code.md`) — Updated for CLAUDE.md auto-read, hooks system, sub-agents (general/explore), custom slash commands, Skills, Agent SDK, CI/CD integration (GitHub Actions, GitLab), multi-surface support, and new installation method
- **Cursor guide updated** (`integration/cursor.md`) — Added agent mode, background agents, `.cursor/rules/` directory (replacing deprecated `.cursorrules`)
- **Integration overview rewritten** (`integration/README.md`) — Added OpenCode to all tables, updated capability matrix with MCP/sub-agent rows, modernized model/pricing info, added Aider mention, updated integration patterns for MCP-first approach
- **MCP server updated** (`mcp-server.js`) — Added multi-agent-orchestration and agent-safety to workflow patterns, added opencode to integration guides, added list_available_standards tool, bumped server version to 2.0.0
- **Universal agent rules updated** (`universal-agent-rules.md`) — Updated MCP section for multi-tool support, added project instruction file conventions, added references to new workflow patterns, updated tool support matrix
- **Context preservation updated** (`workflow-patterns/context-preservation.md`) — Updated model references, added OpenCode-specific strategies
- **Copilot essentials updated** (`copilot-essentials.md`) — Added references to new workflow patterns
- **Package version bumped to 2.0.0** — Added opencode keyword, added npm test script

### Fixed

- Stale model references ("Claude 3.5 Sonnet", "GPT-4 only") replaced with current model names across all files
- Outdated pricing information updated
- Stale date references updated to February 2026

## [1.0.0] - 2025-10-31

### Added

- Initial release with universal development standards
- Core standards: universal-agent-rules, terminal-standards, commit-conventions
- Workflow patterns: context-preservation, session-management, branch-strategy, github-issues, dependency-management
- Integration guides: GitHub Copilot (VSCode), Cursor, Claude Code, Windsurf, Continue
- MCP server for on-demand standard access
- Copilot essentials distilled reference
- Migration guide from tool-specific to universal standards
