[![npm badge](https://img.shields.io/npm/v/git-credentials)](https://www.npmjs.com/package/git-credentials)

# git-credentials

Library to access the git credential api. Wraps the `git credential` command.

## Usage

<!-- !test program yarn dlx -q ts-node -I '.*' -->

<!-- !test check usage -->

```ts
import { gitCredentialFill } from "git-credentials"

gitCredentialFill({
  host: "github.com",
  protocol: "https",
}).then((result) => {
  console.log(result)
})
```

The above example will output:

```txt
{
  protocol: 'https',
  host: 'github.com',
  username: 'example-username',
  password: 'example-password'
}
```
