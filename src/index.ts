import { EOL } from "node:os"
import { Readable } from "node:stream"

import execa, { CommonOptions } from "execa"
import * as t from "typanion"

import {
  GitCredential,
  GitCredentialFillInput,
  isGitCredential,
  isGitCredentialFillInput,
  isGitCredentialValue,
} from "./model.js"

export const gitCredentialFill = async (
  input: GitCredentialFillInput,
  options: { askpass?: string } = {},
): Promise<GitCredential> => {
  t.assertWithErrors(input, isGitCredentialFillInput)
  const result = await gitCredential(`fill`, input, {
    env: options.askpass ? { GIT_ASKPASS: options.askpass } : undefined,
  })
  return t.as(result, isGitCredential, { errors: true, throw: true })
}

export const gitCredentialApprove = async (
  input: GitCredential,
): Promise<void> => {
  t.assertWithErrors(input, isGitCredential)
  await gitCredential(`approve`, input)
}

export const gitCredentialReject = async (
  input: GitCredential,
): Promise<void> => {
  t.assertWithErrors(input, isGitCredential)
  await gitCredential(`reject`, input)
}

const gitCredential = async (
  subcommand: `fill` | `approve` | `reject`,
  inputEntries: Record<string, string>,
  options: { env?: CommonOptions<string>[`env`] } = {},
): Promise<Record<string, string>> => {
  for (const value of Object.values(inputEntries))
    t.assertWithErrors(value, isGitCredentialValue)

  const inputLines = Object.entries(inputEntries).map(
    ([key, value]) => `${key}=${value}`,
  )

  const input = `${inputLines.join(EOL)}${EOL}`

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
