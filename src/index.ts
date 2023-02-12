import * as t from "typanion"

import { runGitCredentialCommand } from "./impl.js"
import {
  GitCredential,
  GitCredentialFillInput,
  isGitCredential,
  isGitCredentialFillInput,
} from "./models.js"

export const gitCredentialFill = async (
  input: GitCredentialFillInput,
  options: { askpass?: string } = {},
) => {
  t.assertWithErrors(input, isGitCredentialFillInput)
  const result = await runGitCredentialCommand(`fill`, input, {
    env: options.askpass ? { GIT_ASKPASS: options.askpass } : undefined,
  })
  return t.as(result, isGitCredential, { errors: true, throw: true })
}

export const gitCredentialApprove = async (input: GitCredential) => {
  t.assertWithErrors(input, isGitCredential)
  await runGitCredentialCommand(`approve`, input)
}

export const gitCredentialReject = async (input: GitCredential) => {
  t.assertWithErrors(input, isGitCredential)
  await runGitCredentialCommand(`reject`, input)
}
