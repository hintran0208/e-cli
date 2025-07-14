import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('hello:help', () => {
  it('shows help information', async () => {
    const {stdout} = await runCommand('hello:help')
    expect(stdout).to.contain('Hello Command Helper')
    expect(stdout).to.contain('Usage:')
    expect(stdout).to.contain('Arguments:')
    expect(stdout).to.contain('Flags:')
    expect(stdout).to.contain('Examples:')
  })
})
