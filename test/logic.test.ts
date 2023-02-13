import { rm } from "node:fs/promises"

import { execaCommand } from "execa"
import { temporaryDirectory } from "tempy"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  gitCredentialApprove,
  gitCredentialFill,
  gitCredentialReject,
} from "../src/index.js"

vi.stubEnv(`GIT_ASKPASS`, `true`)
vi.stubEnv(`GIT_CONFIG_NOSYSTEM`, `1`)

declare module "vitest" {
  export interface TestContext {
    cwd: string
  }
}

beforeEach(async (context) => {
  const cwd = temporaryDirectory()
  await execaCommand(`git init`, { cwd })
  await execaCommand(`git config credential.helper cache`, { cwd })
  context.cwd = cwd
})

afterEach(async (context) => {
  await rm(context.cwd, { recursive: true })
})

describe(`with separate input fields`, () => {
  it(`should fill a credential object with empty password when none is stored`, async ({
    cwd,
  }) => {
    const credential = await gitCredentialFill(
      {
        protocol: `https`,
        host: `example.com`,
      },
      { cwd },
    )

    expect(credential).toEqual({
      protocol: `https`,
      host: `example.com`,
      username: ``,
      password: ``,
    })
  })

  it(`should fill a credential object with password when one is approved`, async ({
    cwd,
  }) => {
    await gitCredentialApprove(
      {
        protocol: `https`,
        host: `example.com`,
        username: `user`,
        password: `pass`,
      },
      { cwd },
    )

    const credential = await gitCredentialFill(
      {
        protocol: `https`,
        host: `example.com`,
      },
      { cwd },
    )

    expect(credential).toEqual({
      protocol: `https`,
      host: `example.com`,
      username: `user`,
      password: `pass`,
    })
  })

  it(`should fill a credential object with empty password when one is approved and then rejected`, async ({
    cwd,
  }) => {
    await gitCredentialApprove(
      {
        protocol: `https`,
        host: `example.com`,
        username: `user`,
        password: `pass`,
      },
      { cwd },
    )

    await gitCredentialReject(
      {
        protocol: `https`,
        host: `example.com`,
        username: `user`,
        password: `pass`,
      },
      { cwd },
    )

    const credential = await gitCredentialFill(
      {
        protocol: `https`,
        host: `example.com`,
      },
      { cwd },
    )

    expect(credential).toEqual({
      protocol: `https`,
      host: `example.com`,
      username: ``,
      password: ``,
    })
  })
})

describe(`with a url input field`, () => {
  it(`should fill a credential object with empty password when none is stored`, async ({
    cwd,
  }) => {
    const credential = await gitCredentialFill(
      { url: `https://example.com` },
      { cwd },
    )

    expect(credential).toEqual({
      protocol: `https`,
      host: `example.com`,
      username: ``,
      password: ``,
    })
  })

  it(`should fill a credential object with password when one is approved`, async ({
    cwd,
  }) => {
    await gitCredentialApprove(
      {
        url: `https://user@example.com`,
        password: `pass`,
      },
      { cwd },
    )

    const credential = await gitCredentialFill(
      { url: `https://example.com` },
      { cwd },
    )

    expect(credential).toEqual({
      protocol: `https`,
      host: `example.com`,
      username: `user`,
      password: `pass`,
    })
  })

  it(`should fill a credential object with empty password when one is approved and then rejected`, async ({
    cwd,
  }) => {
    await gitCredentialApprove(
      {
        url: `https://user@example.com`,
        password: `pass`,
      },
      { cwd },
    )

    await gitCredentialReject(
      {
        url: `https://user@example.com`,
        password: `pass`,
      },
      { cwd },
    )

    const credential = await gitCredentialFill(
      { url: `https://example.com` },
      { cwd },
    )

    expect(credential).toEqual({
      protocol: `https`,
      host: `example.com`,
      username: ``,
      password: ``,
    })
  })
})
