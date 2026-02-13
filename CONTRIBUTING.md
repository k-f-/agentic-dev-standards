# Contributing to Agentic Development Standards

Thank you for considering contributing to this project. These standards help thousands of developers work more effectively with AI coding assistants.

## How to Contribute

### Reporting Issues

1. Check [existing issues](https://github.com/k-f-/agentic-dev-standards/issues) first
2. Open a new issue using the appropriate template:
   - **Bug report** — Something is wrong or misleading in the standards
   - **Feature request** — New standard, pattern, or tool integration

### Suggesting Changes

1. **Fork** the repository
2. **Create a branch**: `feature/your-change` or `docs/your-change`
3. **Make your changes** following the guidelines below
4. **Submit a PR** using the pull request template

### What We Accept

- **New integration guides** for AI coding tools not yet covered
- **New workflow patterns** for common development scenarios
- **Updates to existing standards** when tools evolve or better practices emerge
- **Bug fixes** for incorrect or misleading information
- **Improvements to clarity** — simpler language, better examples

### What We Don't Accept

- Marketing content or promotional material for specific tools
- Standards that only apply to one specific project or team
- Changes that break backward compatibility without discussion
- Content not tested with at least one AI coding tool

## Guidelines

### Writing Standards

1. **Be tool-agnostic where possible** — Universal standards should work across all tools
2. **Provide concrete examples** — Show what to do AND what not to do
3. **Explain the "why"** — Standards are more likely to be followed when the rationale is clear
4. **Keep it concise** — These files are loaded into AI context windows; every token counts
5. **Test with an AI agent** — Verify the agent can follow the standard correctly

### File Organization

- **Core standards** go in the project root (`*.md`)
- **Workflow patterns** go in `workflow-patterns/`
- **Integration guides** go in `integration/`
- Use lowercase-with-hyphens for filenames
- Update the MCP server (`mcp-server.js`) when adding new files

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add Aider integration guide
fix: Correct MCP server path handling on Windows
docs: Update Cursor guide for agent mode
chore: Bump MCP SDK dependency
```

### Updating the MCP Server

If you add a new standard, pattern, or integration guide:

1. Add the file mapping in `mcp-server.js` (in the appropriate `CORE_STANDARDS`, `WORKFLOW_PATTERNS`, or `INTEGRATION_GUIDES` object)
2. Update the tool description strings to mention the new entry
3. Update `list_available_standards` descriptions
4. Verify the server starts without errors: `node -c mcp-server.js`

### Testing

Before submitting:

1. Verify MCP server syntax: `node -c mcp-server.js`
2. Run `npm test` if test files exist
3. Check all internal links are valid
4. Verify markdown renders correctly

## Development Setup

```bash
# Clone the repository
git clone https://github.com/k-f-/agentic-dev-standards.git
cd agentic-dev-standards

# Install dependencies
npm install

# Verify MCP server works
node -c mcp-server.js

# Run tests
npm test
```

## Code of Conduct

Be respectful, constructive, and focused on improving the standards for everyone. We welcome contributors of all experience levels.

## Questions?

Open a [discussion](https://github.com/k-f-/agentic-dev-standards/issues) or reach out via the repository.
