import { Readable } from "node:stream"

import execa, { CommonOptions } from "execa"

import { isGitCredentialValue } from "./models.js"

export const runGitCredentialCommand = async (
  subcommand: `fill` | `approve` | `reject`,
  inputEntries: Record<string, string>,
  options: { env?: CommonOptions<string>[`env`] } = {},
): Promise<Record<string, string>> => {
  const errors: string[] = []
  if (
    Object.values(inputEntries).some(
      (value) => !isGitCredentialValue(value, { errors }),
    )
  ) {
    throw new Error(
      `Values must not contain newline or NUL: ${errors.join(`, `)}.`,
    )
  }

  const inputLines = Object.entries(inputEntries)
    .filter(([_key, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${key}=${value}`)

  const input = `${inputLines.join(`\n`)}\n`

  const execPromise = execa(`git`, [`credential`, subcommand], {
    env: options.env,
  })

  Readable.from([input]).pipe(execPromise.stdin!)

  const { stdout } = await execPromise

  return Object.fromEntries(
    stdout
      .split(/\r?\n/)
      .filter(Boolean)
      .reduce((acc, line) => {
        // use a regex with a capturing group to ensure a single split
        // in case there's an = in the value
        const [key, value] = line.split(/=(.*)/s)
        return acc.set(key, value)
      }, new Map<string, string>()),
  )
}
