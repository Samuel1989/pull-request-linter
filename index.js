const core = require('@actions/core');
const github = require('@actions/github');

var createReview = function(client, pullRequest, comment) {
  client.pulls.createReview({
    owner: pullRequest.owner,
    repo: pullRequest.repo,
    pull_number: pullRequest.number,
    body: comment,
    event: 'REQUEST CHANGES'
  });
}

var approveReview = function(client, pullRequest, comment) {
  client.pulls.createReview({
    owner: pullRequest.owner,
    repo: pullRequest.repo,
    pull_number: pullRequest.number,
    event: 'APPROVE'
  });
}

var addLabel = function(client, pullRequest, label) {
  client.issues.addLabels({
    owner: pullRequest.owner,
    repo: pullRequest.repo,
    issue_number: pullRequest.number,
    labels: [label]
  });
}

var removeLabel = function(client, pullRequest, label) {
  client.issues.removeLabel({
    owner: pullRequest.owner,
    repo: pullRequest.repo,
    issue_number: pullRequest.number,
    name: label
  });
}

try {
  const token = core.getInput('github-token');
  const titleRegex = core.getInput('title-regex');
  const labelText = core.getInput('label-text');
  const client = new github.GitHub(token);
  const payload = github.context.payload;
  const pullRequest = github.context.issue;
  const title = payload.pull_request.title;
  const body = payload.pull_request.body;
  const labels = payload.pull_request.labels;

  if (!new RegExp(titleRegex).test(title)) {
    createReview(client, pullRequest, `Incorrect title format, regex for correct format is "${titleRegex}".`);
    addLabel(client, pullRequest, labelText);
    return;
  }

  removeLabel(client, pullRequest, labelText);
} catch (error) {
  console.error(error.message);
}
