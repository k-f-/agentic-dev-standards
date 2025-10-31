# GitHub Copilot Terminal Configuration

## Problem Statement

AI agents operating in VS Code terminals consume excessive tokens when dealing with customized shell environments. User-specific aliases, prompt configurations, and shell customizations cause:

1. **Terminal output parsing failures** - Agents can't reliably read command output
2. **Workarounds that waste tokens** - Agents resort to reading files directly instead of using terminal commands
3. **Unpredictable behavior** - Custom aliases (e.g., `cat` → `bat`) break standard command assumptions
4. **Extended wait times** - Custom prompts and slow shell initialization delay command execution

## Solution: Enforce Vanilla Shell Environment for Agents

**CRITICAL RULE**: All terminal commands executed by AI agents MUST use a clean, minimal shell environment with:

- No custom aliases
- No custom prompt configurations
- No plugin systems (oh-my-zsh, powerlevel10k, etc.)
- Minimal, predictable PATH (system defaults + essential dev tools)
- Fast initialization (no slow rc file processing)

## Platform-Specific Configuration

### macOS / Linux

**Shell to use**: `bash` (NOT zsh, fish, or user's default shell)

**Configuration**:

```bash
# Agent terminal should launch with:
SHELL=/bin/bash
ENV=''
BASH_ENV=''
# No .bashrc, no .bash_profile processing

# Minimal PATH - system defaults + essential tools
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# For development tools, extend minimally:
# PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$HOME/.nvm/versions/node/vXX/bin
# PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$HOME/.pyenv/shims
```

**Command pattern for agents**:

```bash
# COMPLETE FORMAT - Use this exact pattern for ALL commands
# Apple Silicon Mac (Homebrew in /opt/homebrew):
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'command here'

# Intel Mac (Homebrew in /usr/local):
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'command here'

# Linux:
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'command here'

# Examples:
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'npm run compile'
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'git status'
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c '/bin/cat file.txt'
```

**Component breakdown**:
- `PATH=...` - Sets minimal, predictable PATH (overrides user's custom PATH)
- `/bin/bash` - Uses system bash (NOT user's default shell like zsh)
- `--noprofile` - Skips reading ~/.bash_profile
- `--norc` - Skips reading ~/.bashrc
- `-c 'command'` - Runs command in clean environment

**Why bash, not zsh**:

- More predictable default behavior across systems
- Faster initialization (no framework loading)
- Standard on all Unix-like systems
- User's zsh customizations don't interfere

### Windows

**Shell to use**: `cmd.exe` (NOT PowerShell)

**Configuration**:

```cmd
# Agent terminal should launch with:
cmd.exe /K
# No AutoRun registry keys processed
```

**Why cmd.exe, not PowerShell**:

- Faster initialization
- More predictable output formatting
- No module auto-loading
- No profile scripts

## Implementation for AI Agents

### Terminal Creation Rules

**When agents need to run terminal commands**:

1. **DO NOT** use the user's default shell
2. **DO NOT** inherit user's shell configuration files
3. **DO** explicitly specify shell and environment
4. **DO** use absolute paths for common utilities

### Command Execution Pattern

**macOS/Linux**:

```bash
# COMPLETE FORMAT - Apple Silicon Mac
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'command here'

# COMPLETE FORMAT - Intel Mac or Linux  
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'command here'

# Examples:
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'npm run compile'
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c '/bin/cat file.txt'
```

**Component breakdown**:

- `PATH=...` - Sets minimal, predictable PATH (overrides user's custom PATH)
- `/bin/bash` - Uses system bash (NOT user's default shell like zsh)
- `--noprofile` - Skips reading ~/.bash_profile
- `--norc` - Skips reading ~/.bashrc
- `-c 'command'` - Runs command in clean environment

**Windows**:

```cmd
# COMPLETE FORMAT - Use cmd.exe with /c flag
cmd.exe /c command here

# Examples:
cmd.exe /c type file.txt
cmd.exe /c dir
cmd.exe /c npm run compile
```

**Component breakdown**:

- `cmd.exe` - Uses system command prompt (NOT PowerShell)
- `/c` - Runs command and terminates
- No profile loading (cmd.exe doesn't have complex profiles like PowerShell)

### Standard Utilities - Use Absolute Paths

**macOS/Linux**:

```bash
/bin/cat          # NOT cat (might be aliased to bat)
/bin/ls           # NOT ls (might have color/format aliases)
/bin/grep         # NOT grep (might have custom options)
/usr/bin/git      # NOT git (path predictable)
/usr/bin/node     # NOT node (use environment-specific path)
```

**Windows**:

```cmd
%SystemRoot%\System32\cmd.exe /c type
%SystemRoot%\System32\findstr.exe
```

## PATH Management Strategy

### Core Principle

**Use minimal, predictable PATH** that includes:

1. **System binaries**: `/usr/bin`, `/bin`, `/usr/sbin`, `/sbin`
2. **Common tool locations**: `/usr/local/bin` (Homebrew, system-wide installs)
3. **Project-specific tools**: `node_modules/.bin` (when in project directory)

### What to EXCLUDE from PATH

- ❌ User-specific tool directories that might have overrides
- ❌ Custom script directories that shadow standard commands
- ❌ Shell framework paths (oh-my-zsh plugins, etc.)
- ❌ Anything that loads slowly or has side effects

### Accessing Development Tools

**Option 1: Rely on VS Code's integrated terminal**
VS Code already sets up proper PATH for development tools (Node.js, Python, etc.) based on workspace configuration.

**Option 2: Use tool-specific version managers explicitly**

```bash
# Node.js via nvm (if needed)
source ~/.nvm/nvm.sh && nvm use && npm run compile

# Python via pyenv (if needed)
eval "$(pyenv init -)" && python script.py

# Or use full paths to active versions
~/.nvm/versions/node/v20.0.0/bin/node script.js
```

**Option 3: Workspace-local tools**

```bash
# npm scripts already use node_modules/.bin
npm run compile  # Works with minimal PATH

# Direct execution of workspace tools
./node_modules/.bin/tsc
```

### Recommended Minimal PATH

**macOS/Linux**:

```bash
# Apple Silicon Mac (Homebrew in /opt/homebrew)
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# Intel Mac (Homebrew in /usr/local)
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# Linux
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# Covers:
# - Homebrew-installed tools (git, node, npm, python, etc.) - Apple Silicon: /opt/homebrew/bin
# - System utilities (cat, ls, grep, etc.) - /bin, /usr/bin
# - Standard system administration tools - /sbin, /usr/sbin
```

**Windows**:

```cmd
PATH=%SystemRoot%\System32;%SystemRoot%;C:\Program Files\Git\cmd;C:\Program Files\nodejs
```

## VS Code Integration

### Workspace Settings

Add to `.vscode/settings.json`:

```json
{
  "terminal.integrated.profiles.osx": {
    "Copilot-Clean-Bash": {
      "path": "/bin/bash",
      "args": ["--noprofile", "--norc"],
      "icon": "robot"
    }
  },
  "terminal.integrated.profiles.linux": {
    "Copilot-Clean-Bash": {
      "path": "/bin/bash",
      "args": ["--noprofile", "--norc"],
      "icon": "robot"
    }
  },
  "terminal.integrated.profiles.windows": {
    "Copilot-Clean-Cmd": {
      "path": "${env:SystemRoot}\\System32\\cmd.exe",
      "args": ["/K"],
      "icon": "robot"
    }
  },
  "github.copilot.chat.terminalProfile.osx": "Copilot-Clean-Bash",
  "github.copilot.chat.terminalProfile.linux": "Copilot-Clean-Bash",
  "github.copilot.chat.terminalProfile.windows": "Copilot-Clean-Cmd"
}
```

### Repository-Level Enforcement

Add to `.github/copilot-instructions.md`:

```markdown
## Terminal Usage Rules

**CRITICAL**: When executing terminal commands, ALWAYS use clean shell environment:

### macOS/Linux

- Use `/bin/bash -c 'command'` for one-off commands
- Use absolute paths: `/bin/cat`, `/bin/ls`, `/bin/grep`
- Never rely on user aliases or shell functions
- Launch terminals with: `bash --noprofile --norc`

### Windows

- Use `cmd.exe /c command` for one-off commands
- Launch terminals with: `cmd.exe /K`

### Never

- ❌ Use user's default shell without explicit configuration
- ❌ Rely on aliases (cat, ls, grep, etc.)
- ❌ Assume shell-specific features (zsh arrays, PowerShell cmdlets)
- ❌ Use commands without absolute paths for core utilities
```

## Testing the Configuration

### Validation Steps

1. **Create test terminal with clean profile**:

   ```bash
   /bin/bash --noprofile --norc
   ```

2. **Verify no aliases loaded**:

   ```bash
   alias  # Should return empty or minimal output
   ```

3. **Test standard commands**:

   ```bash
   /bin/cat /etc/hosts  # Should work predictably
   /bin/ls -la          # Should have standard output format
   ```

4. **Verify PATH is minimal**:

   ```bash
   echo $PATH  # Should be system default only
   ```

### Expected Behavior

- Commands execute quickly (no slow rc file processing)
- Output is predictable and parseable
- No custom prompt interfering with output detection
- Standard utilities behave as documented

## Benefits

1. **Reduced token usage** - No workarounds needed for reading command output
2. **Predictable behavior** - Standard commands work as documented
3. **Faster execution** - No shell framework loading overhead
4. **Cross-platform consistency** - Same patterns work on all platforms
5. **Easier debugging** - No mystery aliases or functions

## Migration Plan for Existing Projects

For each repository where agents operate:

1. ✅ Add `.vscode/settings.json` with clean terminal profiles
2. ✅ Update `.github/copilot-instructions.md` with terminal rules
3. ✅ Test agent commands in new environment
4. ✅ Document any project-specific terminal requirements
5. ✅ Commit changes with: `chore: Configure clean shell environment for AI agents`

## Rollout Order

1. **Pilot**: kf.sql.formatter (this repository) - CURRENT
2. **Validate**: Ensure all agent operations work correctly
3. **Template**: Create reusable template files
4. **Deploy**: Roll out to all agent-touched repositories
5. **Monitor**: Track token usage reduction

## Future Enhancements

- Create VS Code extension to automatically configure clean agent terminals
- Add pre-commit hooks to validate terminal commands use absolute paths
- Build terminal output parser that works with vanilla shells only
- Document common cross-platform command patterns
