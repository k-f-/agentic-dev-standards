# Terminal Standards for AI Agents

## Universal Problem Statement

AI agents operating in terminal environments face challenges when dealing with customized user shells. User-specific configurations cause:

1. **Unpredictable command behavior** - Custom aliases (e.g., `cat` → `bat`, `ls` → `exa`) break standard assumptions
2. **Token waste** - Custom prompts, slow initialization scripts consume tokens without providing value
3. **Parsing failures** - Agents cannot reliably parse non-standard output formats
4. **Extended execution times** - Shell frameworks and custom configs delay every command

**These issues affect ALL AI coding assistants**: GitHub Copilot, Cursor, Claude Code, Windsurf, Continue, and others.

## Universal Solution: Clean Shell Environments

**CRITICAL RULE**: All terminal commands executed by AI agents MUST use clean, minimal shell environments with:

- ✅ No custom aliases
- ✅ No custom prompt configurations
- ✅ No plugin systems (oh-my-zsh, powerlevel10k, fish plugins, etc.)
- ✅ Minimal, predictable PATH (system defaults + essential dev tools)
- ✅ Fast initialization (no slow rc file processing)
- ✅ Standard command behavior

## Why This Matters for AI Agents

**User Shell Customizations**:

```bash
# User's ~/.zshrc might contain:
alias cat='bat'
alias ls='exa --icons'
alias grep='rg'
PROMPT='%F{cyan}➜ %f%F{yellow}${PWD/#$HOME/~}%f $(git_prompt_info)'
```

**Impact on AI Agents**:

- Agent runs `cat file.txt` → Gets `bat` output with colors/line numbers → Cannot parse reliably
- Agent reads prompt → Wastes tokens on colorized unicode characters
- Agent waits for oh-my-zsh to load → 2-3 second delay per command

**With Clean Environment**:

- `cat file.txt` → Standard output, predictable format
- Minimal prompt → No token waste
- Instant startup → Commands execute immediately

## Platform-Specific Standards

### macOS / Linux

**Shell to Use**: `bash` (NOT zsh, fish, or user's default shell)

**Command Pattern** (Universal - all tools should use this):

```bash
# Apple Silicon Mac (Homebrew in /opt/homebrew):
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'command'

# Intel Mac / Linux (Homebrew in /usr/local):
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'command'

# Examples:
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'npm run test'
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'git status'
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c '/bin/cat README.md'
```

**Component Breakdown**:

- `PATH=...` - Sets minimal, predictable PATH (overrides user's custom PATH)
- `/bin/bash` - Uses system bash (NOT user's default shell like zsh)
- `--noprofile` - Skips reading `~/.bash_profile`
- `--norc` - Skips reading `~/.bashrc`
- `-c 'command'` - Runs command in clean environment

**Why Bash Instead of Zsh**:

- More predictable default behavior across all systems
- Faster initialization (no framework loading overhead)
- Standard on all Unix-like systems
- User's zsh customizations don't interfere
- POSIX-compatible for maximum portability

### Windows

**Shell to Use**: `cmd.exe` (NOT PowerShell)

**Command Pattern** (Universal):

```cmd
cmd.exe /c command

# Examples:
cmd.exe /c type README.md
cmd.exe /c dir
cmd.exe /c npm test
```

**Why cmd.exe Instead of PowerShell**:

- Faster initialization (no module loading)
- More predictable output formatting
- No profile scripts or auto-loading features
- Simpler parsing for AI agents

## Standard Utilities - Use Absolute Paths

**CRITICAL**: Always use absolute paths for core utilities to avoid alias interference.

### macOS / Linux

```bash
/bin/cat          # NOT cat (might be aliased to bat)
/bin/ls           # NOT ls (might be aliased to exa)
/bin/grep         # NOT grep (might be aliased to rg)
/usr/bin/git      # NOT git (when path is predictable)
/bin/echo         # NOT echo (shell builtin variations)
```

### Windows

```cmd
%SystemRoot%\System32\cmd.exe
%SystemRoot%\System32\findstr.exe
%SystemRoot%\System32\type.exe
```

## CRITICAL: Never Use Pagers

**Commands that trigger pagers will HANG most AI agent environments** and kill the session:

```bash
# ❌ WRONG - These trigger pagers
git log
git diff
less file.txt
more file.txt
man command

# ✅ CORRECT - Disable pagers or limit output
git --no-pager log -10 --oneline
git --no-pager diff
git --no-pager show HEAD
/bin/cat file.txt
command --help 2>&1 | head -20
```

**Why This Matters**:

- Pagers (`less`, `more`) wait for user input to scroll
- AI agents cannot provide interactive input
- Terminal session hangs indefinitely
- Session must be killed and restarted

**Always Use**:

- `git --no-pager <subcommand>`
- `head -n <lines>` to limit output
- `/bin/cat` for file reading
- Direct file reads instead of viewing commands

## PATH Management Strategy

### Recommended Minimal PATH

**macOS (Apple Silicon)**:

```bash
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

**macOS (Intel) / Linux**:

```bash
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

**Windows**:

```cmd
PATH=%SystemRoot%\System32;%SystemRoot%;C:\Program Files\Git\cmd;C:\Program Files\nodejs
```

### What's Included

✅ **System binaries**: `/usr/bin`, `/bin`, `/usr/sbin`, `/sbin`
✅ **Common tool locations**: `/usr/local/bin`, `/opt/homebrew/bin` (Homebrew)
✅ **Essential dev tools**: Git, Node.js, Python (system-wide installs)
✅ **Project-specific tools**: `node_modules/.bin` (automatically in npm/yarn commands)

### What to EXCLUDE

❌ User-specific tool directories with command overrides
❌ Custom script directories that shadow standard commands
❌ Shell framework paths (oh-my-zsh, fish plugins)
❌ Version managers with slow initialization (rvm, nvm with slow loading)
❌ Anything that loads slowly or has side effects

### Accessing Development Tools

**npm/yarn** scripts already include `node_modules/.bin`:

```bash
npm test          # Automatically finds node_modules/.bin/jest
npm run build     # Automatically finds node_modules/.bin/webpack
```

**Explicit tool paths** when needed:

```bash
./node_modules/.bin/typescript-formatter
~/.nvm/versions/node/v20.0.0/bin/node
```

## Command Efficiency Rules

**Minimize terminal calls to reduce token usage**:

### 1. Combine Commands with `&&`

```bash
# ✅ GOOD - One terminal call
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'npm test && npm run build && git status'

# ❌ BAD - Three separate terminal calls (wastes tokens)
PATH=... /bin/bash --noprofile --norc -c 'npm test'
PATH=... /bin/bash --noprofile --norc -c 'npm run build'
PATH=... /bin/bash --noprofile --norc -c 'git status'
```

### 2. Batch Related Operations

```bash
# ✅ GOOD - Run all checks together
PATH=... /bin/bash --noprofile --norc -c 'echo "=== Lint ===" && npm run lint && echo "=== Test ===" && npm test && echo "=== Build ===" && npm run build'

# ❌ BAD - Individual calls
# (Multiple separate bash invocations)
```

### 3. Use File Reads When Appropriate

```bash
# ✅ GOOD - Direct file read (agent tool)
Read file: package.json

# ❌ BAD - Unnecessary terminal command
PATH=... /bin/bash --noprofile --norc -c '/bin/cat package.json'
```

## Testing Your Clean Environment

**Validation Steps**:

1. **Launch clean bash**:

   ```bash
   /bin/bash --noprofile --norc
   ```

2. **Verify no aliases**:

   ```bash
   alias  # Should return empty or minimal output
   ```

3. **Test standard commands**:

   ```bash
   /bin/cat /etc/hosts    # Should work predictably
   /bin/ls -la            # Should have standard format
   echo $PATH             # Should show minimal PATH
   ```

4. **Verify fast startup**:

   ```bash
   time /bin/bash --noprofile --norc -c 'echo test'
   # Should complete in < 0.1 seconds
   ```

## Expected Benefits

✅ **Reduced token usage** - No custom prompts, no workarounds needed
✅ **Predictable behavior** - Commands work as documented
✅ **Faster execution** - No shell framework loading (2-3 second improvement)
✅ **Cross-platform consistency** - Same patterns work everywhere
✅ **Easier debugging** - No mystery aliases or functions
✅ **Reliable parsing** - Standard output formats

## Tool-Specific Integration

Different AI tools have different ways to enforce these standards:

- **VSCode Copilot**: Configure terminal profiles in `.vscode/settings.json`
- **Cursor**: Configure terminal profiles in settings
- **Claude Code**: Uses system shell, wrap commands explicitly
- **Continue**: Configure in `config.json`
- **Windsurf**: Similar to Cursor

See the `integration/` directory for tool-specific setup guides.

## Summary: Universal Rules

1. ✅ **Always use clean bash** with `--noprofile --norc`
2. ✅ **Use absolute paths** for standard utilities (`/bin/cat`, `/bin/ls`)
3. ✅ **Never use pagers** (`git --no-pager`, avoid `less`, `more`, `man`)
4. ✅ **Minimal PATH** (system defaults + essential tools)
5. ✅ **Combine commands** with `&&` to reduce terminal calls
6. ✅ **Fast initialization** (no slow frameworks or plugins)
7. ✅ **Standard behavior** (no aliases, no custom functions)

---

**These standards apply to ALL AI coding assistants** regardless of the tool you use. Implement them consistently across all projects for best results.
