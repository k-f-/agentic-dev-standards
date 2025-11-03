# Continue Integration Guide

## Overview

Continue is an open-source AI coding assistant that works as a VSCode/JetBrains extension. It supports multiple AI providers (OpenAI, Anthropic, local models) and is highly customizable.

## Setup

### 1. Install Continue Extension

**VSCode**:

- Install "Continue" extension from marketplace
- Or: Cmd+P → `ext install Continue.continue`

**JetBrains** (IntelliJ, PyCharm, etc.):

- Install "Continue" plugin from marketplace

### 2. Add Submodule

```bash
git submodule add https://github.com/k-f-/agentic-dev-standards.git
git submodule update --init --recursive
```

### 3. Configure Continue

Continue uses `~/.continue/config.json` (global) or `.continue/config.json` (project-level).

**Create `.continue/config.json`** at project root:

```json
{
  "models": [
    {
      "title": "GPT-4",
      "provider": "openai",
      "model": "gpt-4",
      "apiKey": "YOUR_API_KEY"
    },
    {
      "title": "Claude 3.5",
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20241022",
      "apiKey": "YOUR_API_KEY"
    }
  ],
  "contextProviders": [
    {
      "name": "code",
      "params": {}
    },
    {
      "name": "docs",
      "params": {
        "folders": ["docs", "agentic-dev-standards"]
      }
    },
    {
      "name": "file",
      "params": {
        "files": [
          "agentic-dev-standards/universal-agent-rules.md",
          "agentic-dev-standards/terminal-standards.md",
          "agentic-dev-standards/commit-conventions.md"
        ]
      }
    }
  ],
  "systemMessage": "You are an AI coding assistant. Follow universal standards from agentic-dev-standards/:\n\n1. Read agentic-dev-standards/terminal-standards.md for terminal requirements\n2. Read agentic-dev-standards/commit-conventions.md for commit format\n3. Read agentic-dev-standards/universal-agent-rules.md for best practices\n\nWorkflow patterns in agentic-dev-standards/workflow-patterns/:\n- session-management.md\n- branch-strategy.md\n- github-issues.md\n- dependency-management.md"
}
```

**Important**: Add `.continue/config.json` to `.gitignore` if it contains API keys:

```bash
echo ".continue/config.json" >> .gitignore
```

Instead, create `.continue/config.json.example`:

```json
{
  "models": [
    {
      "title": "GPT-4",
      "provider": "openai",
      "model": "gpt-4",
      "apiKey": "YOUR_OPENAI_API_KEY_HERE"
    }
  ],
  "contextProviders": [
    {
      "name": "docs",
      "params": {
        "folders": ["docs", "agentic-dev-standards"]
      }
    }
  ],
  "systemMessage": "Follow standards from agentic-dev-standards/"
}
```

### 4. Configure Terminal

Create `.vscode/settings.json`:

```json
{
  "terminal.integrated.profiles.osx": {
    "Clean-Bash": {
      "path": "/bin/bash",
      "args": ["--noprofile", "--norc"],
      "env": {
        "PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
      }
    }
  },
  "terminal.integrated.defaultProfile.osx": "Clean-Bash"
}
```

### 5. Commit (without API keys)

```bash
git add .continue/config.json.example .vscode/settings.json agentic-dev-standards
git commit -m "chore: Configure Continue with universal standards"
```

## Usage

### Chat Interface

1. **Open Continue sidebar** (icon in activity bar)
2. **Select model** from dropdown
3. **Chat with AI**:

   ```
   "Read the universal standards from agentic-dev-standards/.
   Then help me implement user authentication."
   ```

### Context Providers

Continue automatically includes context from:

- **Current file**
- **Open files**
- **Docs folders** (configured in `contextProviders`)
- **Files** (explicitly listed in config)

### Slash Commands

```
/edit - Edit highlighted code
/comment - Add comments to code
/test - Generate tests
/fix - Fix errors in code
```

### Autocomplete

Continue provides inline completions similar to Copilot (if configured).

## Key Features

**Open Source**:

- ✅ Free to use
- ✅ Self-hosted option
- ✅ Customizable
- ✅ Multi-provider support

**vs Proprietary Tools**:

- ✅ Bring your own API keys (cheaper)
- ✅ Support for local models (Ollama, LM Studio)
- ✅ Highly configurable
- ⚠️ Less polished UX than Copilot/Cursor
- ⚠️ Smaller community

## Configuration Options

### Multiple Models

```json
{
  "models": [
    {
      "title": "GPT-4 (OpenAI)",
      "provider": "openai",
      "model": "gpt-4"
    },
    {
      "title": "Claude 3.5 (Anthropic)",
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20241022"
    },
    {
      "title": "Local Llama (Ollama)",
      "provider": "ollama",
      "model": "codellama:34b"
    }
  ]
}
```

### Custom Context

```json
{
  "contextProviders": [
    {
      "name": "file",
      "params": {
        "files": [
          "docs/development/architecture.md",
          "docs/development/testing-strategy.md"
        ]
      }
    },
    {
      "name": "folder",
      "params": {
        "folders": ["src/types", "src/models"]
      }
    },
    {
      "name": "url",
      "params": {
        "urls": ["https://docs.yourframework.com"]
      }
    }
  ]
}
```

### Custom Slash Commands

```json
{
  "slashCommands": [
    {
      "name": "commit",
      "description": "Generate conventional commit message",
      "prompt": "Generate a conventional commit message following agentic-dev-standards/commit-conventions.md for these changes:\n\n{{{ diff }}}"
    }
  ]
}
```

## Best Practices

**Use `systemMessage` for standards**:

- Reference universal standards in system message
- Continue will always have this context
- No need to repeat in every chat

**Configure context providers**:

- Include `agentic-dev-standards/` folder
- Include project-specific docs
- Explicit files for critical standards

**Use API keys wisely**:

- Store in `.continue/config.json` (gitignored)
- Or use environment variables
- Provide `.continue/config.json.example` for team

**Multiple models**:

- Fast model (GPT-3.5) for autocomplete
- Powerful model (GPT-4, Claude) for chat
- Local model for offline work

## Troubleshooting

### Continue not reading standards

**Solution**: Ensure standards are in context providers:

```json
{
  "contextProviders": [
    {
      "name": "docs",
      "params": {
        "folders": ["agentic-dev-standards"]
      }
    }
  ]
}
```

Or reference explicitly:

```
"Read agentic-dev-standards/terminal-standards.md"
```

### API keys not working

**Solution**:

- Verify API key is valid
- Check provider name matches (openai, anthropic, etc.)
- Ensure no extra whitespace in API key
- Check API quota/billing

### Autocomplete not working

**Solution**: Enable in config:

```json
{
  "enableTabAutocomplete": true,
  "models": [
    {
      "title": "GPT-3.5 Turbo",
      "provider": "openai",
      "model": "gpt-3.5-turbo",
      "useLegacyCompletionsEndpoint": false
    }
  ]
}
```

## Advanced: Local Models

Use Continue with local models (no API costs):

```json
{
  "models": [
    {
      "title": "CodeLlama (Local)",
      "provider": "ollama",
      "model": "codellama:34b"
    }
  ]
}
```

**Prerequisites**:

- Install [Ollama](https://ollama.ai/)
- Pull model: `ollama pull codellama:34b`
- Ollama running: `ollama serve`

## Example Project Structure

```
my-project/
├── .continue/
│   ├── config.json                     # Gitignored (has API keys)
│   └── config.json.example             # Committed (template)
├── .vscode/
│   └── settings.json                    # Terminal config
├── agentic-dev-standards/              # Submodule
│   ├── universal-agent-rules.md
│   ├── terminal-standards.md
│   └── workflow-patterns/
├── docs/
│   └── development/
└── [project files]
```

## Summary

**Key Files**:

- `.continue/config.json` - Continue configuration (gitignore if has API keys)
- `.continue/config.json.example` - Template for team
- `.vscode/settings.json` - Terminal config
- `agentic-dev-standards/` - Universal standards

**Advantages**:

- Open source
- Multi-provider support
- Bring your own API keys
- Local model support
- Highly customizable

**Best For**:

- Cost-conscious developers
- Open-source enthusiasts
- Teams wanting flexibility
- Offline/local model usage

**Setup**:

1. Install Continue extension
2. Add `agentic-dev-standards` submodule
3. Create `.continue/config.json` with context providers
4. Reference standards in `systemMessage`

---

For universal standards applicable to all tools:

- [`universal-agent-rules.md`](../universal-agent-rules.md)
- [`terminal-standards.md`](../terminal-standards.md)
- [`commit-conventions.md`](../commit-conventions.md)
