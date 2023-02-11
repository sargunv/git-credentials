import { Readable } from "node:stream"

import execa from "execa"
import splitLines from "split-lines"

export const gitCredentialFill = async (params: {
  host: string
  protocol: string
  path?: string
}): Promise<Record<string, string>> => {
  const inputLines = [`host=${params.host}`, `protocol=${params.protocol}`]
  if (params.path) inputLines.push(`path=${params.path}`)
  const input = `${inputLines.join(`\n`)}\n`

  const execPromise = execa(`git`, [`credential`, `fill`], {
    env: {
      // If no credentials are stored, we want to error out, but git will attempt to
      // prompt instead. GIT_ASKPASS is a variable that tells git which program to
      // use to prompt for credentials. We set it to `true`, a program that does
      // nothing and exits with a zero status code.
      GIT_ASKPASS: `true`,
    },
  })

  Readable.from([input]).pipe(execPromise.stdin!)

  const { stdout } = await execPromise

  const entries = splitLines(stdout).reduce((acc, line) => {
    // use a regex with a capturing group to ensure a single split
    // in case there's an = in the value
    const [key, value] = line.split(/=(.*)/s)
    return acc.set(key, value)
  }, new Map<string, string>())

  return Object.fromEntries(entries)
}
