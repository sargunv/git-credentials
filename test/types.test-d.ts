/* eslint-disable unicorn/consistent-function-scoping */

import { describe, it } from "vitest"

import {
  gitCredentialApprove,
  gitCredentialFill,
  gitCredentialReject,
} from "../src/index.js"

describe("git credential fill", () => {
  it("should allow an unfilled credential object as input", () => {
    const _1 = async () => {
      await gitCredentialFill({
        url: "https://github.com",
      })
    }

    const _2 = async () => {
      await gitCredentialFill({
        protocol: "https",
        host: "github.com",
      })
    }

    const _3 = async () => {
      await gitCredentialFill({
        protocol: "https",
        host: "github.com",
        path: "sargunv/credential-fill.git",
      })
    }

    const _4 = async () => {
      await gitCredentialFill({
        protocol: "https",
        host: "github.com",
        path: "sargunv/credential-fill.git",
        username: "username",
      })
    }
  })

  it("should disallow a filled credential object as input", () => {
    const _1 = async () => {
      await gitCredentialFill({
        url: "https://github.com",
        // @ts-expect-error
        password: "password",
      })
    }

    const _2 = async () => {
      await gitCredentialFill({
        protocol: "https",
        host: "github.com",
        path: "sargunv/credential-fill.git",
        username: "username",
        // @ts-expect-error
        password: "password",
      })
    }
  })

  it("should return a credential with all fields required", () => {
    const _1 = async () => {
      const _: {
        protocol: string
        host: string
        path?: string
        username: string
        password: string
      } = await gitCredentialFill({
        url: "https://github.com",
      })
    }
  })
})

describe("git credential approve", () => {
  it("should allow a filled credential object as input", () => {
    const _1 = async () => {
      await gitCredentialApprove({
        protocol: "https",
        host: "github.com",
        username: "username",
        password: "password",
      })
    }
  })

  it("should disallow an unfilled credential object as input", () => {
    const _1 = async () => {
      // @ts-expect-error
      await gitCredentialApprove({
        protocol: "https",
        host: "github.com",
        username: "username",
      })
    }
  })
})

describe("git credential reject", () => {
  it("should allow a filled credential object as input", () => {
    const _1 = async () => {
      await gitCredentialReject({
        protocol: "https",
        host: "github.com",
        username: "username",
        password: "password",
      })
    }
  })

  it("should disallow an unfilled credential object as input", () => {
    const _1 = async () => {
      // @ts-expect-error
      await gitCredentialReject({
        protocol: "https",
        host: "github.com",
        username: "username",
      })
    }
  })
})
