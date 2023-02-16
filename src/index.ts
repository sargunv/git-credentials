import { EOL } from "node:os"
import { Readable } from "node:stream"

import { CommonOptions, execa } from "execa"
import * as t from "typanion"

import {
  GitCredential,
  GitCredentialApproveRejectInput,
  GitCredentialFillInput,
  isGitCredential,
  isGitCredentialApproveRejectInput,
  isGitCredentialFillInput,
  isGitCredentialValue,
} from "./model.js"

export type {
  GitCredential,
  GitCredentialApproveRejectInput,
  GitCredentialFillInput,
} from "./model.js"

export const gitCredentialFill = async (
  input: GitCredentialFillInput,
  options: {
    cwd?: string
    askpass?: string
    terminalPrompt?: boolean
  } = {},
): Promise<GitCredential> => {
  t.assertWithErrors(input, isGitCredentialFillInput)

  const env: Record<string, string> = {}

  if (options.askpass) env[`GIT_ASKPASS`] = options.askpass
  if (options.terminalPrompt) env[`GIT_TERMINAL_PROMPT`] = `1`
  if (options.terminalPrompt === false) env[`GIT_TERMINAL_PROMPT`] = `0`

  const result = await gitCredential(`fill`, input, {
    env,
    cwd: options.cwd,
  })

  return t.as(result, isGitCredential, { errors: true, throw: true })
}

export const gitCredentialApprove = async (
  input: GitCredentialApproveRejectInput,
  options: { cwd?: string } = {},
): Promise<void> => {
  t.assertWithErrors(input, isGitCredentialApproveRejectInput)
  await gitCredential(`approve`, input, options)
}

export const gitCredentialReject = async (
  input: GitCredentialApproveRejectInput,
  options: { cwd?: string } = {},
): Promise<void> => {
  t.assertWithErrors(input, isGitCredentialApproveRejectInput)
  await gitCredential(`reject`, input, options)
}

const gitCredential = async (
  subcommand: `fill` | `approve` | `reject`,
  inputEntries: Record<string, string>,
  options: { env?: CommonOptions<string>[`env`]; cwd?: string } = {},
): Promise<Record<string, string>> => {
  for (const value of Object.values(inputEntries))
    t.assertWithErrors(value, isGitCredentialValue)

  const inputLines = Object.entries(inputEntries).map(
    ([key, value]) => `${key}=${value}`,
  )

  const input = `${inputLines.join(EOL)}${EOL}`

  const execPromise = execa(`git`, [`credential`, subcommand], {
    env: options.env,
    cwd: options.cwd,
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
        if (!key || !value) throw new Error(`Can't parse credential: ${line}`)
        return acc.set(key, value)
      }, new Map<string, string>()),
  )
}
