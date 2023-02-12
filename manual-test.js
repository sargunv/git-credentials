const {
  gitCredentialFill,
  gitCredentialApprove,
  gitCredentialReject,
} = require(`git-credentials`)

;(async () => {
  const result1 = await gitCredentialFill(
    {
      protocol: `https`,
      host: `github.com`,
      path: `sargunv/git-credentials.git`,
      username: `sargunv`,
    },
    { askpass: `true` },
  )

  console.log(result1)

  const result2 = await gitCredentialFill(
    { url: `https://sargunv@github.com/sargunv/git-credentials.git` },
    { askpass: `true` },
  )

  console.log(result2)

  await gitCredentialApprove({
    protocol: `https`,
    host: `github.com`,
    path: `example/repo.git`,
    username: `example-username`,
    password: `example-password`,
  })

  console.log(`Approved`)

  await gitCredentialReject({
    protocol: `https`,
    host: `github.com`,
    path: `example/repo.git`,
    username: `example-username`,
    password: `example-password`,
  })

  console.log(`Rejected`)
})()
