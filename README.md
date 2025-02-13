# codygen

Cody CLI wrapper for code generation

## Why?

The `codygen` project provides a command-line interface (CLI) tool designed to streamline and automate code generation tasks. It serves as a wrapper around Cody, enhancing productivity by simplifying repetitive coding tasks and ensuring consistency across projects.

## Packages

- [codygen CLI ](./packages/codygen/README.md).

## Contribution Guide

### Setup

To set up the development environment, it is recommended to use a devcontainer. This ensures a consistent development environment and simplifies the setup process.

### Automatic Commits

Automatic commits using Cody Chat require the Cody CLI to be authenticated.

### Release New Version

To release a new version of the project, use the `nx release` command. This will [automatically](https://nx.dev/recipes/nx-release/automatically-version-with-conventional-commits) create a new tag according to the conventional commits history.

### Publishing

Publishing is handled exclusively through GitLab Actions. This ensures that all releases are consistent and follow the project's CI/CD pipeline. To publish is just enough to release a new version and push it to a main branch.
