# codygen - Cody CLI Wrapper

This CLI is a wrapper around the [Cody CLI](https://sourcegraph.com/docs/cody/clients/install-cli)

## Why

Cody, the AI assistant, provides responses as chat messages. These messages often contain code snippets embedded between placeholders in a specific format. The format used is ` ```language:path/to/file.ext`, which indicates the programming language and the intended file path for the code snippet.

For example, for a command like

```
cody chat -m "Hello world app in TypeScript"
```

consider the following Cody response:

````
Here's the TypeScript configuration file:

```json:tsconfig.json
{
  "compilerOptions": {
    ...
}
```

Create the main TypeScript file:
```typescript:src/index.ts
class Greeter {
  ...

```
````

As you can see the source files are wrapped in a nested code blocks inside the chat repose. This CLI is capable to parse those bocks and store the content into separated files.

## Installation

```
npm install -g codygen
```

## Usage

```
Usage: codygen [options] [command]

Sourcegraph Cody CLI wrapper with extra features

Options:
  -h, --help         display help for command

Commands:
  chat [options]     Chat with Cody and extract files from the response
  extract [options]  Extract files from the Cody chat response
  help [command]     display help for command
```

## Commands

### Extracting code from a chat reponse

```
Usage: codygen extract [options]

Extract files from the Cody chat response

Options:
  -o,--output <output>  Output folder
  -h, --help            display help for command

Examples:
  # Chat with Cody and extract results by piping to the codygen
  $ cody chat -m "Sample TS app" | codygen extract -o dist
```

### Wrapping cody chat with further extracting

```
Usage: codygen chat [options]

Chat with Cody and extract files from the response

Options:
  -o,--output <output>        Output folder
  -f, --context <context...>  Context file(s)
  -c, --config <config>       Codygen config file
  -h, --help                  display help for command

Examples:
  # Pipe promt directly into the codygen chat command and extract files to a target folder
  $ echo "Sample TS app" | codygen chat -o dist

  # Prepare config a run it just with a config file (ts,cts,mts,js,cjs,mjs,json)
  $ codygen chat --config codygen.config.ts
```

## Configuration

The `codygen` tool can be configured using a configuration file, typically named `codygen.config.ts`. This file allows you to define prompts, context files, and output directories for your Cody interactions.

### Configuration File Format

The configuration file should export a default object that adheres to the `CodygenConfig` interface. Here's an example structure:

```typescript
export default {
  prompt: 'Your prompt here', // or a function returning a string or array of strings
  context: ['path/to/context/file1', 'path/to/context/file2'], // optional context files
  output: 'path/to/output/directory', // optional output directory
};
```

- **prompt**: This can be a string, an array of strings, or a function that returns a string or an array of strings. It defines the prompt to be used in the Cody chat.
- **context**: An optional array of file paths that provide additional context for the Cody chat.
- **output**: An optional path to the directory where the extracted files will be saved.
