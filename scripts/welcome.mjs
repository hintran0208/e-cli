// scripts/welcome.js
import chalk from 'chalk';
import figlet from 'figlet';

function displayWelcome() {
  // Create the ASCII art
  const logo = figlet.textSync('E-CLI', {
    font: 'Standard',
    horizontalLayout: 'default',
  });

  console.log('\n');
  console.log(chalk.redBright(logo));
  console.log(chalk.greenBright('Your AI-Powered Development Companion 🚀\n'));

  console.log(chalk.yellow.bold('✨ Installation Complete!'));
  console.log(chalk.cyan('Thanks for installing E-CLI.'));
  
  console.log('\n' + chalk.yellow.bold('⚡ Quick Start:'));
  console.log(`${chalk.blue('e-cli')}                 - Interactive workflow menu`);
  console.log(`${chalk.blue('e-cli --help')}          - See all available commands`);
  
  console.log('\n' + chalk.green('✅ Ready to boost your SDLC workflow with AI assistance!\n'));
  console.log(chalk.greenBright.bold('🎉 E-CLI installed successfully! Ready to go! 🚀\n'));

  console.log(chalk.yellow.bold('Next steps:'))
  console.log('1. Type ' + chalk.cyan('e-cli') + ' to start the interactive menu')
  console.log('2. Or try ' + chalk.cyan('e-cli role Developer') + ' for a quick start')
  console.log('3. Configure API keys in .env for full AI capabilities\n')
}

displayWelcome();
