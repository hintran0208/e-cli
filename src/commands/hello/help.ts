import {Command} from '@oclif/core'

export default class HelloHelp extends Command {
  static description = 'Show help and examples for the hello command'
  static examples = [
    '$ <%= config.bin %> hello:help',
    '$ <%= config.bin %> hello friend --from oclif',
    '$ <%= config.bin %> hello world --from developer',
  ]

  async run(): Promise<void> {
    this.log('Hello Command Helper')
    this.log('==================')
    this.log('\nDescription:')
    this.log('  The hello command lets you say hello to someone from someone.')
    this.log('\nUsage:')
    this.log('  $ <%= config.bin %> hello PERSON --from SENDER')
    this.log('\nArguments:')
    this.log('  PERSON  Required - The person you want to say hello to')
    this.log('\nFlags:')
    this.log('  --from, -f  Required - Who is saying hello')
    this.log('\nExamples:')
    this.log('  $ <%= config.bin %> hello friend --from oclif')
    this.log('  $ <%= config.bin %> hello world --from developer')
    this.log('  $ <%= config.bin %> hello colleague -f coworker')
  }
}
