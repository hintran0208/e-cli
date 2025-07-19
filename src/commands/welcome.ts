import {Command} from '@oclif/core';
import chalk from 'chalk';
import figlet from 'figlet';
// Remove the direct import of Big.js
import inquirer from 'inquirer';

// Instead of parsing the font, we'll use a standard font
// figlet.parseFont("Big", Big);

export default class WelcomeCommand extends Command {
  static description = 'Welcome to my CLI!';
  // Define the command name explicitly
  static id = 'welcome';

  async run(): Promise<void> {
    // const logo = figlet.textSync('E-CLI', {
    //   font: 'Standard', // Use a standard font that comes with figlet
    //   horizontalLayout: 'default',
    // })

    // this.log(chalk.redBright(logo))
    // this.log(chalk.greenBright('Your AI-Powered Development Companion 🚀\n'))

    // this.log(chalk.yellow.bold('✨ Key Features:'))
    // this.log(`${chalk.cyan('👨‍💻 Developer Tools')}  - Code review, debugging, architecture`)
    // this.log(`${chalk.magenta('📋 Product Owner')}   - Requirements analysis, backlog management`)
    // this.log(`${chalk.blue('🧪 Tester Support')}    - Test strategy, automation frameworks`)
    // this.log(`${chalk.red('🤖 AI Integration')}    - GPT-4.1, Claude, Gemini Pro\n`)

    // this.log(chalk.yellow.bold('⚡ Quick Start:'))
    // this.log(`${chalk.blue('e-cli')}                 - Interactive workflow menu`)
    // this.log(`${chalk.blue('e-cli role Tester')}     - Start with Tester role`)
    // this.log(`${chalk.blue('e-cli template')}        - Search templates`)
    // this.log(`${chalk.blue('e-cli agent Claude')}    - Start with AI agent`)
    // this.log(`${chalk.blue('e-cli execute')}         - Full execution workflow\n`)

    // this.log(chalk.magenta.bold('📌 System Status:'))
    // this.log(`${chalk.yellow('⚠️  Demo mode')} – Add API keys to .env for full functionality`)
    // this.log(`${chalk.gray('📝 Copy .env.example → .env and add your API keys\n')}`)

    // this.log(chalk.cyan('💡 Tip: Run ') + chalk.whiteBright.bold('e-cli --help') + chalk.cyan(' to see all available commands.'))
    // this.log(chalk.green('✅ Ready to boost your SDLC workflow with AI assistance!\n'))

    // this.log(chalk.greenBright.bold('🎉 E-CLI initialized successfully! Ready to go! 🚀\n'))

    this.log(chalk.yellow.bold('Next steps:'))
    this.log('Help us answer some question before using  ' + chalk.cyan('e-cli'))

    const response = await inquirer.prompt([
      {
        choices: ['Default – single AI provider', 'Scenario – multi-agent project workflow'],
        message: 'Choose a mode:',
        name: 'mode',
        type: 'list',
      },
      {
        choices: ['Claude', 'Gemini', 'OpenAI Codex'],
        message: 'Select your AI provider for default mode:',
        name: 'provider',
        type: 'list',
        when: (answers) => answers.mode === 'Default – single AI provider',
      },
      {
        message: 'Help me to describe about your project?',
        name: 'project',
        type: 'input',
        when: (answers) => answers.mode === 'Scenario – multi-agent project workflow',
      },
    ]);

    if (response.project) {
      this.log(`👋 Hello, let me summarize about your project: ${response.project}`);
    }

    if (response.provider) {
      this.log(`📁 Provider: ${response.provider}`);
    }

    this.log(`🧑‍💻 Your mode: ${response.mode}`);
  }
}
