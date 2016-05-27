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

  var client = _octonode2.default.client(token);

  return new Promise(function (resolve, reject) {
    client.repo(owner + '/' + repo).contents(path, function (err, list) {
      if (err) {
        return reject(new Error('Couldn\'t get contents for ' + path + ' from the ' + repo + ' repo.'));
      }
      if (list.length === 0) {
        return reject(new Error('Nothing to retrieve found at path ' + path + '.'));
      }
      var paths = getPaths(list);
      return resolve({
        owner: owner,
        repo: repo,
        path: path,
        paths: paths
      });
    });
  });
}

function getFiles(_ref2, token) {
  var owner = _ref2.owner;
  var repo = _ref2.repo;
  var path = _ref2.path;
  var paths = _ref2.paths;

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
      return resolve(file);
    });
  });
}

function getPaths(list) {
  return list.map(function (item) {
    return item.path;
  });
}
