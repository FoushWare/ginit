#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

const files = require("./lib/files");
const github = require("./lib/github");
const repo = require("./lib/repo");

// const inquirer = require("./lib/inquirer");

/**
    * chalk — colorizes the output
    * clear — clears the terminal screen
    * clui — draws command-line tables, gauges and spinners
    * figlet — creates ASCII art from text
    * inquirer — creates interactive command-line user interface
    * minimist — parses argument options
    * configstore — easily loads and saves config without you having to think about where and how.
 */


// 1. clear the screen and then display a banner
clear();

console.log(
  chalk.yellow(figlet.textSync("Ginit", { horizontalLayout: "full" }))
);


// 2. run a simple check to ensure that the current folder isn’t already a Git repository
if (files.directoryExists(".git")) {
  console.log(chalk.red("Already a Git repository!"));
  process.exit();
}

// 3. asks the user a series of questions, provided in the form of an array as the first argument. Each question is made up of an object which defines the name of the field, the type (we’re just using input and password respectively here, but later we’ll look at a more advanced example), and the prompt (message) to display.

//The input the user provides will be passed in to the calling function as a Promise. If successful, we’ll end up with a simple object with two properties — username and password.
// const run = async () => {
//   const credentials = await inquirer.askGithubCredentials();
//   console.log(credentials);
// };

// run();
const getGithubToken = async () => {
  // Fetch token from config store
  let token = github.getStoredGithubToken();
  if (token) {
    return token;
  }

  // No token found, use credentials to access GitHub account
  token = await github.getPersonalAccesToken();

  return token;
};

const run = async () => {
  try {
    // Retrieve & Set Authentication Token
    const token = await getGithubToken();
    github.githubAuth(token);

    // Create remote repository
    const url = await repo.createRemoteRepo();

    // Create .gitignore file
    await repo.createGitignore();

    // Set up local repository and push to remote
    await repo.setupRepo(url);

    console.log(chalk.green("All done!"));
  } catch (err) {
    if (err) {
      switch (err.status) {
        case 401:
          console.log(
            chalk.red(
              "Couldn't log you in. Please provide correct credentials/token."
            )
          );
          break;
        case 422:
          console.log(
            chalk.red(
              "There is already a remote repository or token with the same name"
            )
          );
          break;
        default:
          console.log(chalk.red(err));
      }
    }
  }
};

run();
