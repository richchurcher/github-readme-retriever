import github from 'octonode'

export function getList ({owner, repo, path}, token) {
  const client = github.client(token)

  return new Promise((resolve, reject) => {
    client.repo(`${owner}/${repo}`)
      .contents(path, (err, list) => {
        if (err) {
          return reject(new Error(`Couldn't get contents for ${path} from the ${repo} repo.`))
        }
        if (list.length === 0) {
          return reject(new Error(`Nothing to retrieve found at path ${path}.`))
        }
        const paths = getPaths(list)
        return resolve({
          owner: owner,
          repo: repo,
          path: path,
          paths: paths
        })
      })
  })
}

export function getFiles ({owner, repo, path, paths}, token) {
  return Promise.all(paths.map((path) => {
    return getFile(owner, repo, path, token)
  }))
}

function getFile (owner, repo, path, token) {
  const client = github.client(token)

  return new Promise((resolve, reject) => {
    client.repo(`${owner}/${repo}`)
      .contents(`${path}/README.md`, (err, file) => {
        if (err) {
          return reject(new Error(`Couldn't get a README for ${path}.`))
        }
        return resolve(file)
      })
  })
}

function getPaths (list) {
  return list.map((item) => {
    return item.path
  })
}
