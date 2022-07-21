# In class Svelte demo

This is an example of a Svelte chart that uses D3 and SVG.

## Getting setup

In order to run this locally on your computer you will need to have several things installed:

- NodeJS ([instructions](https://github.com/jsoma/interactives-class-content/blob/main/301-setup-node.md))
- [VSCode](https://code.visualstudio.com/) (or another editor + terminal)
- A web browser

You can either clone this repo with git or the github desktop app onto your computer, or you can download this folder [here](https://github.com/mitchthorson/lede-2022-dataviz/releases/download/v1.1/completed-svelte.zip).

Once you have this folder on your computer, open it in VSCode.

Open a `terminal` in VSCode and run the command:

```
npm install
```

And then start the local server with:

```
npm start
```

You will need to be able to run these commands to use this project, as Svelte is dependent on running a compiler to process all of the code we write here. If you aren't able to run `npm` commands, try Svelte out by [using the online REPL](https://svelte.dev/repl/hello-world).

## Notes on the Svelte starter template

This project was started with the `npm create vite@latest my-app -- --template svelte` command. It made all the files and subfolders I needed to get started. I then simplified it a bit and took out what I didn't need.

This template should help get you started developing with Svelte in Vite.

## Recommended IDE Setup

There is a nice VS Code extension for working with Svelte projects.

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).
