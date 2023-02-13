#!/usr/bin/env node

// This script is used to test the askpass functionality of git.

const prompt = process.argv[2]
if (prompt.startsWith(`Password`)) console.log(`askpass-pass`)
else if (prompt.startsWith(`Username`)) console.log(`askpass-user`)
else process.exit(1)
