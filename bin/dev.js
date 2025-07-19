#!/usr/bin/env node_modules/.bin/ts-node

// eslint-disable-next-line unicorn/prefer-top-level-await
;(async () => {
  const oclif = await import('@oclif/core')
  
  // If no command is provided, default to 'welcome'
  if (process.argv.length === 2) {
    process.argv.push('welcome')
  }
  
  await oclif.execute({development: true, dir: __dirname})
})()
