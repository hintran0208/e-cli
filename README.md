ECLI - AI CLI Wrapper
====================

A CLI wrapper for Claude Code and Gemini CLI - Choose your AI assistant from the command line.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ecli.svg)](https://npmjs.org/package/ecli)
[![Downloads/week](https://img.shields.io/npm/dw/ecli.svg)](https://npmjs.org/package/ecli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ecli
$ ecli COMMAND
running command...
$ ecli (--version)
ecli/0.0.0 darwin-x64 node-v23.11.0
$ ecli --help [COMMAND]
USAGE
  $ ecli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ecli`](#ecli)
* [`ecli claude [PROMPT]`](#ecli-claude-prompt)
* [`ecli gemini [PROMPT]`](#ecli-gemini-prompt)
* [`ecli help [COMMAND]`](#ecli-help-command)
* [`ecli plugins`](#ecli-plugins)
* [`ecli plugins add PLUGIN`](#ecli-plugins-add-plugin)
* [`ecli plugins:inspect PLUGIN...`](#ecli-pluginsinspect-plugin)
* [`ecli plugins install PLUGIN`](#ecli-plugins-install-plugin)
* [`ecli plugins link PATH`](#ecli-plugins-link-path)
* [`ecli plugins remove [PLUGIN]`](#ecli-plugins-remove-plugin)
* [`ecli plugins reset`](#ecli-plugins-reset)
* [`ecli plugins uninstall [PLUGIN]`](#ecli-plugins-uninstall-plugin)
* [`ecli plugins unlink [PLUGIN]`](#ecli-plugins-unlink-plugin)
* [`ecli plugins update`](#ecli-plugins-update)

## `ecli`

AI CLI wrapper - Choose your AI assistant

```
USAGE
  $ ecli

DESCRIPTION
  Shows available AI assistants and usage examples

EXAMPLES
  $ ecli
  🤖 Welcome to ECLI - AI CLI Wrapper
  
  Available AI assistants:
    claude  - Claude Code CLI wrapper  
    gemini  - Gemini CLI wrapper
```

_See code: [src/commands/index.ts](https://github.com/AI_30Days/ecli/blob/v0.0.0/src/commands/index.ts)_

## `ecli claude [PROMPT]`

Execute Claude Code CLI commands

```
USAGE
  $ ecli claude [PROMPT] [-v]

ARGUMENTS
  PROMPT  Prompt to send to Claude Code CLI

FLAGS
  -v, --version  show claude version

DESCRIPTION
  Execute Claude Code CLI commands

EXAMPLES
  $ ecli claude "help me debug this function"
  $ ecli claude --version
```

_See code: [src/commands/claude/index.ts](https://github.com/AI_30Days/ecli/blob/v0.0.0/src/commands/claude/index.ts)_

## `ecli gemini [PROMPT]`

Execute Gemini CLI commands

```
USAGE
  $ ecli gemini [PROMPT] [-v]

ARGUMENTS
  PROMPT  Prompt to send to Gemini CLI

FLAGS
  -v, --version  show gemini version

DESCRIPTION
  Execute Gemini CLI commands

EXAMPLES
  $ ecli gemini "explain this code"
  $ ecli gemini --version
```

_See code: [src/commands/gemini/index.ts](https://github.com/AI_30Days/ecli/blob/v0.0.0/src/commands/gemini/index.ts)_

## `ecli help [COMMAND]`

Display help for ecli.

```
USAGE
  $ ecli help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ecli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.31/src/commands/help.ts)_

## `ecli plugins`

List installed plugins.

```
USAGE
  $ ecli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ ecli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/index.ts)_

## `ecli plugins add PLUGIN`

Installs a plugin into ecli.

```
USAGE
  $ ecli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ecli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the ECLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ECLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ecli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ecli plugins add myplugin

  Install a plugin from a github url.

    $ ecli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ecli plugins add someuser/someplugin
```

## `ecli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ ecli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ ecli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/inspect.ts)_

## `ecli plugins install PLUGIN`

Installs a plugin into ecli.

```
USAGE
  $ ecli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ecli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the ECLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ECLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ecli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ecli plugins install myplugin

  Install a plugin from a github url.

    $ ecli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ecli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/install.ts)_

## `ecli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ ecli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ ecli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/link.ts)_

## `ecli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ecli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ecli plugins unlink
  $ ecli plugins remove

EXAMPLES
  $ ecli plugins remove myplugin
```

## `ecli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ ecli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/reset.ts)_

## `ecli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ecli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ecli plugins unlink
  $ ecli plugins remove

EXAMPLES
  $ ecli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/uninstall.ts)_

## `ecli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ecli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ecli plugins unlink
  $ ecli plugins remove

EXAMPLES
  $ ecli plugins unlink myplugin
```

## `ecli plugins update`

Update installed plugins.

```
USAGE
  $ ecli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/update.ts)_
<!-- commandsstop -->
