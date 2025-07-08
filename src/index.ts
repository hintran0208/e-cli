#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import ora from 'ora';

// Create a new Command instance
const program = new Command();

// CLI configuration
program
  .name('e-cli')
  .description('A powerful command line interface tool')
  .version('1.0.0');

// Example command
program
  .command('greet')
  .description('Greet the user with a customized message')
  .action(async () => {
    console.log(
      chalk.yellow(
        figlet.textSync('E-CLI', { horizontalLayout: 'full' })
      )
    );

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your name?',
        default: 'User'
      }
    ]);

    const spinner = ora('Generating greeting...').start();
    
    setTimeout(() => {
      spinner.stop();
      console.log(chalk.green(`\nHello, ${answers.name}! Welcome to E-CLI!`));
    }, 1000);
  });

// Parse command line arguments
program.parse();
