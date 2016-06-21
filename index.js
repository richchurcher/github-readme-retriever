'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getList = getList;
exports.getFiles = getFiles;

var _octonode = require('octonode');

var _octonode2 = _interopRequireDefault(_octonode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getList(_ref, token) {
  var owner = _ref.owner;
  var repo = _ref.repo;
  var path = _ref.path;
  var branch = _ref.branch;

  var client = _octonode2.default.client(token);

  return new Promise(function (resolve, reject) {
    client.repo(owner + '/' + repo).contents(path, branch, function (err, list) {
      return handleList(err, list, { owner: owner, repo: repo, path: path });
    });
  });
}

function handleList(err, list, _ref2) {
  var owner = _ref2.owner;
  var repo = _ref2.repo;
  var path = _ref2.path;

  if (err) {
    return Promise.reject(new Error('Couldn\'t get contents for ' + path + ' from the ' + repo + ' repo.'));
  }
  if (list.length === 0) {
    return Promise.reject(new Error('Nothing to retrieve found at path ' + path + '.'));
  }
  var paths = getPaths(list);
  return Promise.resolve({
    owner: owner,
    repo: repo,
    path: path,
    paths: paths
  });
}

function getFiles(_ref3, token) {
  var owner = _ref3.owner;
  var repo = _ref3.repo;
  var path = _ref3.path;
  var paths = _ref3.paths;

  return Promise.all(paths.map(function (path) {
    return getFile(owner, repo, path, token);
  }));
}

function getFile(owner, repo, path, token) {
  var client = _octonode2.default.client(token);

  return new Promise(function (resolve, reject) {
    client.repo(owner + '/' + repo).contents(path + '/README.md', function (err, file) {
      if (err) {
        return reject(new Error('Couldn\'t get a README for ' + path + '.'));
      }
      return resolve(getParts(file));
    });
  });
}

function getParts(file) {
  var body = Buffer.from(file.content, 'base64').toString();
  var title = body.split('\n')[0];
  title = title.replace(/[\W]*/, '').trim();
  return {
    title: title,
    body: body
  };
}

function getPaths(list) {
  return list.map(function (item) {
    return item.path;
  });
}
