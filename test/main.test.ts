import { rm } from "node:fs/promises"
import { dirname } from "node:path"

import { execaCommand } from "execa"
import { temporaryDirectory } from "tempy"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  gitCredentialApprove,
  gitCredentialFill,
  gitCredentialReject,
} from "../src/index.js"

declare module "vitest" {
  export interface TestContext {
    cwd: string
    home: string
  }
}

beforeEach(async (context) => {
  const home = temporaryDirectory()
  vi.stubEnv(`HOME`, home)
  vi.stubEnv(`GIT_CONFIG_NOSYSTEM`, `1`)
  vi.stubEnv(`GIT_ASKPASS`, ``)

  // add this script's directory to the front of the PATH
  vi.stubEnv(`PATH`, `${dirname(import.meta.url)}:${process.env.PATH!}`)

  const cwd = temporaryDirectory()
  await execaCommand(`git init`, { cwd })
  await execaCommand(`git config credential.helper cache`, { cwd })

  context.cwd = cwd
  context.home = home
})

afterEach(async (context) => {
  vi.unstubAllEnvs()
  await rm(context.cwd, { recursive: true })
  await rm(context.home, { recursive: true })
})

describe.each([
  {
    name: `separate fields`,
    withoutUsername: {
      protocol: `https`,
      host: `example.com`,
    },
    withUsername: {
      protocol: `https`,
      host: `example.com`,
      username: `user`,
    },
  },
  {
    name: `a url field`,
    withoutUsername: { url: `https://example.com` },
    withUsername: { url: `https://example-username@example.com` },
  },
])(`with input as: $name`, ({ withUsername, withoutUsername }) => {
  it(`should throw when terminal prompt is disabled, no password is saved, and no askpass is set`, async ({
    cwd,
  }) => {
    await expect(gitCredentialFill({ ...withoutUsername }, { cwd })).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      "Command failed with exit code 128: git credential fill
      fatal: could not read Username for 'https://example.com': terminal prompts disabled"
    `)

    await expect(
      gitCredentialFill(
        { ...withoutUsername },
        { cwd, terminalPrompt: `disable` },
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Command failed with exit code 128: git credential fill
      fatal: could not read Username for 'https://example.com': terminal prompts disabled"
    `)
  })

  it(`should fill the password with the provided askpass when no password is saved`, async ({
    cwd,
  }) => {
    await expect(
      gitCredentialFill({ ...withoutUsername }, { cwd, askpass: `askpass.js` }),
    ).resolves.toEqual({
      protocol: `https`,
      host: `example.com`,
      username: `askpass-user`,
      password: `askpass-pass`,
    })
  })

  it(`should fill a credential object with empty password when no password is saved`, async ({
    cwd,
  }) => {
    await expect(
      gitCredentialFill({ ...withoutUsername }, { cwd, askpass: `true` }),
    ).resolves.toEqual({
      protocol: `https`,
      host: `example.com`,
      username: ``,
      password: ``,
    })
  })

  it(`should fill a credential object with password when one is approved`, async ({
    cwd,
  }) => {
    await gitCredentialApprove({ ...withUsername, password: `pass` }, { cwd })

    await expect(
      gitCredentialFill({ ...withoutUsername }, { cwd, askpass: `true` }),
    ).resolves.toEqual({
      protocol: `https`,
      host: `example.com`,
      username: `user`,
      password: `pass`,
    })
  })

  it(`should fill a credential object with empty password when one is approved and then rejected`, async ({
    cwd,
  }) => {
    await gitCredentialApprove({ ...withUsername, password: `pass` }, { cwd })

    await gitCredentialReject({ ...withUsername, password: `pass` }, { cwd })

    await expect(
      gitCredentialFill({ ...withoutUsername }, { cwd, askpass: `true` }),
    ).resolves.toEqual({
      protocol: `https`,
      host: `example.com`,
      username: ``,
      password: ``,
    })
  })
})
