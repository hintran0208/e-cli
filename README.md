e-cli
=================

A new CLI generated with oclif


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/e-cli.svg)](https://npmjs.org/package/e-cli)
[![Downloads/week](https://img.shields.io/npm/dw/e-cli.svg)](https://npmjs.org/package/e-cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g e-cli
$ e-cli COMMAND
running command...
$ e-cli (--version)
e-cli/0.0.0 darwin-x64 node-v23.11.0
$ e-cli --help [COMMAND]
USAGE
  $ e-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`e-cli hello PERSON`](#e-cli-hello-person)
* [`e-cli hello world`](#e-cli-hello-world)
* [`e-cli help [COMMAND]`](#e-cli-help-command)
* [`e-cli plugins`](#e-cli-plugins)
* [`e-cli plugins add PLUGIN`](#e-cli-plugins-add-plugin)
* [`e-cli plugins:inspect PLUGIN...`](#e-cli-pluginsinspect-plugin)
* [`e-cli plugins install PLUGIN`](#e-cli-plugins-install-plugin)
* [`e-cli plugins link PATH`](#e-cli-plugins-link-path)
* [`e-cli plugins remove [PLUGIN]`](#e-cli-plugins-remove-plugin)
* [`e-cli plugins reset`](#e-cli-plugins-reset)
* [`e-cli plugins uninstall [PLUGIN]`](#e-cli-plugins-uninstall-plugin)
* [`e-cli plugins unlink [PLUGIN]`](#e-cli-plugins-unlink-plugin)
* [`e-cli plugins update`](#e-cli-plugins-update)

## `e-cli hello PERSON`

Say hello

```
USAGE
  $ e-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ e-cli hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/AI_30Days/e-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `e-cli hello world`

Say hello world

```
USAGE
  $ e-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ e-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/AI_30Days/e-cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `e-cli help [COMMAND]`

Display help for e-cli.

```
USAGE
  $ e-cli help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for e-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.31/src/commands/help.ts)_

## `e-cli plugins`

List installed plugins.

```
USAGE
  $ e-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ e-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/index.ts)_

## `e-cli plugins add PLUGIN`

Installs a plugin into e-cli.

```
USAGE
  $ e-cli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

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
  Installs a plugin into e-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the E_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the E_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ e-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ e-cli plugins add myplugin

  Install a plugin from a github url.

    $ e-cli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ e-cli plugins add someuser/someplugin
```

## `e-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ e-cli plugins inspect PLUGIN...

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
  $ e-cli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/inspect.ts)_

## `e-cli plugins install PLUGIN`

Installs a plugin into e-cli.

```
USAGE
  $ e-cli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

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
  Installs a plugin into e-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the E_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the E_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ e-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ e-cli plugins install myplugin

  Install a plugin from a github url.

    $ e-cli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ e-cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/install.ts)_

## `e-cli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ e-cli plugins link PATH [-h] [--install] [-v]

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
  $ e-cli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/link.ts)_

## `e-cli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ e-cli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ e-cli plugins unlink
  $ e-cli plugins remove

EXAMPLES
  $ e-cli plugins remove myplugin
```

## `e-cli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ e-cli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/reset.ts)_

## `e-cli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ e-cli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ e-cli plugins unlink
  $ e-cli plugins remove

EXAMPLES
  $ e-cli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/uninstall.ts)_

## `e-cli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ e-cli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ e-cli plugins unlink
  $ e-cli plugins remove

EXAMPLES
  $ e-cli plugins unlink myplugin
```

## `e-cli plugins update`

Update installed plugins.

```
USAGE
  $ e-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.44/src/commands/plugins/update.ts)_
<!-- commandsstop -->
