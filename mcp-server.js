#!/usr/bin/env node

/**
 * MCP Server for Agentic Development Standards
 *
 * Provides on-demand access to development standards, conventions, and workflow patterns
 * via the Model Context Protocol (MCP). Reduces token usage by 74-86% per session.
 *
 * Tools:
 * - get_core_standard: Retrieve core standards (universal-agent-rules, terminal-standards, commit-conventions)
 * - get_workflow_pattern: Retrieve workflow patterns (context-preservation, session-management, multi-agent-orchestration, agent-safety, etc.)
 * - get_integration_guide: Retrieve tool-specific integration guides (opencode, claude-code, cursor, etc.)
 * - search_standards: Search across all standards for keywords
 * - list_available_standards: Discover all available standards, patterns, and guides
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File mappings for core standards
const CORE_STANDARDS = {
  'universal-agent-rules': 'universal-agent-rules.md',
  'terminal-standards': 'terminal-standards.md',
  'commit-conventions': 'commit-conventions.md',
};

// File mappings for workflow patterns
const WORKFLOW_PATTERNS = {
  'context-preservation': 'workflow-patterns/context-preservation.md',
  'session-management': 'workflow-patterns/session-management.md',
  'branch-strategy': 'workflow-patterns/branch-strategy.md',
  'github-issues': 'workflow-patterns/github-issues.md',
  'dependency-management': 'workflow-patterns/dependency-management.md',
  'multi-agent-orchestration': 'workflow-patterns/multi-agent-orchestration.md',
  'agent-safety': 'workflow-patterns/agent-safety.md',
};

// File mappings for integration guides
const INTEGRATION_GUIDES = {
  'overview': 'integration/README.md',
  'opencode': 'integration/opencode.md',
  'vscode-copilot': 'integration/vscode-copilot.md',
  'cursor': 'integration/cursor.md',
  'claude-code': 'integration/claude-code.md',
  'windsurf': 'integration/windsurf.md',
  'continue': 'integration/continue.md',
};

/**
 * Read a file from the standards repository
 */
function readStandardFile(relativePath) {
  const fullPath = path.join(__dirname, relativePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Standard file not found: ${relativePath}`);
  }

  return fs.readFileSync(fullPath, 'utf-8');
}

/**
 * Search across all markdown files for a keyword
 */
function searchStandards(keyword, options = {}) {
  const results = [];
  const searchTerm = keyword.toLowerCase();
  const maxResults = options.maxResults || 10;
  const contextLines = options.contextLines || 2;

  // Collect all markdown files to search
  const filesToSearch = [
    ...Object.values(CORE_STANDARDS),
    ...Object.values(WORKFLOW_PATTERNS),
    ...Object.values(INTEGRATION_GUIDES),
    'README.md',
  ];

  for (const relativePath of filesToSearch) {
    try {
      const content = readStandardFile(relativePath);
      const lines = content.split('\n');

      // Search through lines
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.toLowerCase().includes(searchTerm)) {
          // Get context (lines before and after)
          const startIdx = Math.max(0, i - contextLines);
          const endIdx = Math.min(lines.length - 1, i + contextLines);
          const contextSnippet = lines.slice(startIdx, endIdx + 1).join('\n');

          results.push({
            file: relativePath,
            lineNumber: i + 1,
            matchedLine: line.trim(),
            context: contextSnippet,
          });

          // Stop if we've reached max results
          if (results.length >= maxResults) {
            return results;
          }
        }
      }
    } catch (error) {
      // Skip files that can't be read
      continue;
    }
  }

  return results;
}

/**
 * Format search results for display
 */
function formatSearchResults(results, keyword) {
  if (results.length === 0) {
    return `No results found for "${keyword}"`;
  }

  let output = `Found ${results.length} result(s) for "${keyword}":\n\n`;

  for (const result of results) {
    output += `## ${result.file}:${result.lineNumber}\n\n`;
    output += '```\n';
    output += result.context;
    output += '\n```\n\n';
  }

  return output;
}

// Create MCP server
const server = new Server(
  {
    name: 'agentic-dev-standards',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_core_standard',
        description: 'Retrieve a core development standard. Available standards: universal-agent-rules (meta-rules, MCP guidance, testing, code quality), terminal-standards (CRITICAL: clean shell environment requirements), commit-conventions (conventional commits format)',
        inputSchema: {
          type: 'object',
          properties: {
            standard: {
              type: 'string',
              enum: Object.keys(CORE_STANDARDS),
              description: 'The core standard to retrieve',
            },
          },
          required: ['standard'],
        },
      },
      {
        name: 'get_workflow_pattern',
        description: 'Retrieve a workflow pattern document. Available patterns: context-preservation (token management, ADRs), session-management (session start checklist, summaries), branch-strategy (git workflows, PR guidelines), github-issues (issue/PR management), dependency-management (dependency evaluation), multi-agent-orchestration (sub-agents, model routing, decomposition), agent-safety (permissions, destructive ops, secrets, sandboxing)',
        inputSchema: {
          type: 'object',
          properties: {
            pattern: {
              type: 'string',
              enum: Object.keys(WORKFLOW_PATTERNS),
              description: 'The workflow pattern to retrieve',
            },
          },
          required: ['pattern'],
        },
      },
      {
        name: 'get_integration_guide',
        description: 'Retrieve a tool-specific integration guide. Available guides: overview (comparison matrix), opencode (OpenCode terminal agent + MCP setup), vscode-copilot (GitHub Copilot setup), cursor (Cursor IDE setup), claude-code (Claude CLI + MCP setup), windsurf (Windsurf IDE setup), continue (Continue extension setup)',
        inputSchema: {
          type: 'object',
          properties: {
            tool: {
              type: 'string',
              enum: Object.keys(INTEGRATION_GUIDES),
              description: 'The integration guide to retrieve',
            },
          },
          required: ['tool'],
        },
      },
      {
        name: 'search_standards',
        description: 'Search across all standards for a keyword or phrase. Returns matching lines with context from all markdown files.',
        inputSchema: {
          type: 'object',
          properties: {
            keyword: {
              type: 'string',
              description: 'The keyword or phrase to search for',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results to return (default: 10)',
              default: 10,
            },
            contextLines: {
              type: 'number',
              description: 'Number of lines of context to show before/after matches (default: 2)',
              default: 2,
            },
          },
          required: ['keyword'],
        },
      },
      {
        name: 'list_available_standards',
        description: 'List all available standards, workflow patterns, and integration guides with descriptions. Use this to discover what standards are available before fetching specific ones.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_core_standard': {
        const { standard } = args;

        if (!CORE_STANDARDS[standard]) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: Unknown core standard "${standard}". Available: ${Object.keys(CORE_STANDARDS).join(', ')}`,
              },
            ],
            isError: true,
          };
        }

        const content = readStandardFile(CORE_STANDARDS[standard]);

        return {
          content: [
            {
              type: 'text',
              text: content,
            },
          ],
        };
      }

      case 'get_workflow_pattern': {
        const { pattern } = args;

        if (!WORKFLOW_PATTERNS[pattern]) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: Unknown workflow pattern "${pattern}". Available: ${Object.keys(WORKFLOW_PATTERNS).join(', ')}`,
              },
            ],
            isError: true,
          };
        }

        const content = readStandardFile(WORKFLOW_PATTERNS[pattern]);

        return {
          content: [
            {
              type: 'text',
              text: content,
            },
          ],
        };
      }

      case 'get_integration_guide': {
        const { tool } = args;

        if (!INTEGRATION_GUIDES[tool]) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: Unknown integration tool "${tool}". Available: ${Object.keys(INTEGRATION_GUIDES).join(', ')}`,
              },
            ],
            isError: true,
          };
        }

        const content = readStandardFile(INTEGRATION_GUIDES[tool]);

        return {
          content: [
            {
              type: 'text',
              text: content,
            },
          ],
        };
      }

      case 'search_standards': {
        const { keyword, maxResults, contextLines } = args;

        if (!keyword || keyword.trim().length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: keyword parameter is required and must not be empty',
              },
            ],
            isError: true,
          };
        }

        const results = searchStandards(keyword, { maxResults, contextLines });
        const formattedResults = formatSearchResults(results, keyword);

        return {
          content: [
            {
              type: 'text',
              text: formattedResults,
            },
          ],
        };
      }

      case 'list_available_standards': {
        const STANDARD_DESCRIPTIONS = {
          core: {
            'universal-agent-rules': 'Universal best practices for all AI coding agents — meta-rules, MCP guidance, testing, code quality, documentation organization',
            'terminal-standards': 'CRITICAL: Clean shell environment requirements for predictable AI agent behavior — PATH setup, pager avoidance, command combining',
            'commit-conventions': 'Conventional Commits format — types, scopes, atomic commits, examples',
          },
          workflows: {
            'context-preservation': 'Token budget management, progressive summarization, Architecture Decision Records (ADRs), session handoff patterns',
            'session-management': 'Session start/end checklists, summary templates, context loading, session tracking',
            'branch-strategy': 'Git branch naming conventions, workflows (GitHub Flow, Git Flow, trunk-based), PR guidelines',
            'github-issues': 'Issue and PR management — label conventions, templates, linking, automation',
            'dependency-management': 'Evaluation checklist before adding dependencies — maintenance, licensing, security, bundle size',
            'multi-agent-orchestration': 'Sub-agent patterns, task decomposition, context passing, model specialization & routing, cost management, anti-patterns',
            'agent-safety': 'Permission models, destructive operation detection, secrets management, sandboxing, audit trails, rollback patterns',
          },
          integrations: {
            'overview': 'Tool comparison matrix, capability tables, integration patterns, when to choose each tool',
            'opencode': 'OpenCode terminal agent — MCP setup, AGENTS.md, rules, Plan/Build modes, plugins, model config',
            'claude-code': 'Claude Code CLI — CLAUDE.md, hooks, sub-agents, Skills, CI/CD, Agent SDK, multi-surface',
            'cursor': 'Cursor AI IDE — .cursor/rules/, agent mode, background agents, Composer',
            'vscode-copilot': 'GitHub Copilot in VSCode — copilot-instructions.md, terminal config, inline suggestions',
            'windsurf': 'Windsurf IDE — .windsurfrules, Cascade mode, AI features',
            'continue': 'Continue extension — config.json, context providers, multi-provider, open-source',
          },
        };

        let output = '# Available Standards\n\n';

        output += '## Core Standards\n\nUse `get_core_standard` to retrieve these:\n\n';
        for (const [key, desc] of Object.entries(STANDARD_DESCRIPTIONS.core)) {
          output += `- **${key}**: ${desc}\n`;
        }

        output += '\n## Workflow Patterns\n\nUse `get_workflow_pattern` to retrieve these:\n\n';
        for (const [key, desc] of Object.entries(STANDARD_DESCRIPTIONS.workflows)) {
          output += `- **${key}**: ${desc}\n`;
        }

        output += '\n## Integration Guides\n\nUse `get_integration_guide` to retrieve these:\n\n';
        for (const [key, desc] of Object.entries(STANDARD_DESCRIPTIONS.integrations)) {
          output += `- **${key}**: ${desc}\n`;
        }

        output += '\n## Search\n\nUse `search_standards` to search across all files by keyword.\n';

        return {
          content: [
            {
              type: 'text',
              text: output,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Error: Unknown tool "${name}"`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr (stdout is used for MCP protocol)
  console.error('Agentic Dev Standards MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
