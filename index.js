const Promise = require('bluebird');
const readFile = require('fs').readFileSync;
const co = Promise.coroutine;

const github = require('github')({
  Promise,
});

const prompt = require('prompt');

co(function* () {
  console.log('Github credentials for API');
  const input = yield Promise.promisify(prompt.get)(
    [
      {
        name: 'username',
        required: true
      },
      {
        name: 'password',
        hidden: true,
      }
    ]
  );

  github.authenticate({
      type: "basic",
      username: input.username,
      password: input.password
  });

  const follow = Promise.promisify(github.users.followUser)

  const usersURLs = readFile('users.txt').toString();
  const regx = /\.com\/([a-zA-Z0-9\-]*)/g;
  let match;
  let users = [];
  while ((match = regx.exec(usersURLs)) !== null) users.push(match[1]);

  users.forEach(username => {
    follow({username})
      .then(() => console.log('Followed ' + username))
      .catch(() => console.log('Could not follow ' + username));
  });
})();
