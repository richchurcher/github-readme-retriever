import test from 'blue-tape'
import nock from 'nock'

import * as grr from '../src/index.js'
import readmeList from './json/readmeList.json'
import readme from './json/readme.json'
import getFiles from './json/getFiles.json'

const org = 'wombats'
const repo = 'aardvarks'
const path = 'assignments'

//"IyAxLjAgQQoKIyMgQgoKLSBbIF0gQwo=\n",

test('mock API reponses', (t) => {
  nock('https://api.github.com')
    .persist()
    .get(`/repos/${org}/${repo}/contents/${path}?access_token=1`)
    .reply(200, readmeList)
    .get(`/repos/${org}/${repo}/contents/${path}/week-1/README.md?access_token=1`)
    .reply(200, readme)
  t.end()
})

test('grr.getList gets list of paths', (t) => {
  const expected = {
    paths: [
      'assignments/week-1',
      'assignments/week-2',
      'assignments/week-3'
    ]
  }
  return grr.getList({
    owner: org,
    repo: repo,
    path: path
  }, '1')
    .then((actual) => {
      t.deepEqual(actual.paths, expected.paths)
    })
})

test('grr.getFiles retrieves the correct contents', (t) => {
  const readmeStub = {
    content: "IyAxLjAgQQoKIyMgQgoKLSBbIF0gQwo=\n"
  }
  nock('https://api.github.com')
    .get('/repos/org/repo/contents/path/directory/README.md?access_token=1')
    .reply(200, readmeStub)
  const list = [ 'assignments/week-1',
  'assignments/week-1' ]
  const expected = getFiles
  return grr.getFiles({
    owner: org,
    repo: repo,
    path: path,
    paths: list
  }, '1')
    .then((actual) => {
      t.equal(actual[0].content, expected[0].content)
    })
})
