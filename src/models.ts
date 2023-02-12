import * as t from "typanion"

// https://git-scm.com/docs/git-credential#IOFMT

export const isGitCredentialValue = t.cascade(
  t.isString(),
  // "The value may contain any bytes except newline or NUL."
  t.matchesRegExp(/^[^\0\n\r]*$/),
)

export type GitCredentialValue = t.InferType<typeof isGitCredentialValue>

export const isGitCredential = t.isObject({
  protocol: isGitCredentialValue,
  host: isGitCredentialValue,
  path: t.isOptional(isGitCredentialValue),
  username: isGitCredentialValue,
  password: isGitCredentialValue,
})

export type GitCredential = t.InferType<typeof isGitCredential>

export const isGitCredentialFillInput = t.isObject({
  protocol: isGitCredentialValue,
  host: isGitCredentialValue,
  path: t.isOptional(isGitCredentialValue),
  username: t.isOptional(isGitCredentialValue),
  // no password
})

export type GitCredentialFillInput = t.InferType<
  typeof isGitCredentialFillInput
>
