[![npm badge](https://img.shields.io/npm/v/git-credentials)](https://www.npmjs.com/package/git-credentials)

# git-credentials

Library to access the git credential api. Wraps the `git credential` command.
For more details, read the
[git credential documentation](https://git-scm.com/docs/git-credential).

## Usage

<!-- !test program yarn dlx -q ts-node -I '.*' -->

### git credential fill

<!-- !test check fill -->

```ts
import { gitCredentialFill } from "git-credentials"

gitCredentialFill(
  {
    protocol: "https",
    host: "github.com",
    path: "example/repo.git", // optional
    username: "example-username", // optional
  },
  {
    // optional, sets GIT_ASKPASS
    askpass: "true",
  },
).then((result) => {
  console.log(result)
})

// alternative input format

gitCredentialFill(
  { url: "https://example-username@github.com/example/repo.git" },
  { askpass: "true" },
).then((result) => {
  console.log(result)
})
```

The above examples will output:

```js
{
  protocol: 'https',
  host: 'github.com',
  username: 'example-username',
  password: 'example-password'
}
```

### git credential approve

<!-- !test check approve -->

```ts
import { gitCredentialApprove } from "git-credentials"

gitCredentialApprove({
  protocol: "https",
  host: "github.com",
  path: "example/repo.git", // optional
  username: "example-username",
  password: "example-password",
}).then(() => {
  console.log(`Approved`)
})
```

### git credential reject

<!-- !test check reject -->

```ts
import { gitCredentialReject } from "git-credentials"

gitCredentialReject({
  protocol: "https",
  host: "github.com",
  path: "example/repo.git", // optional
  username: "example-username",
  password: "example-password",
}).then(() => {
  console.log(`Rejected`)
})
```
