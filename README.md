# extension-main
This is the repository for the extension refresh project.

## Setup

### Clone the repository
1. In the terminal (Linux/MacOS) or Git Bash (Windows), clone the repository:

```bash
git clone git@gitlab.com:caesoit/extension-main.git
```

2. Move into the newly-cloned directory:

```bash
cd extension-main
```

### Install dependencies
1. Install necessary global dependencies.  Note that you may need to prepend the following command with `sudo`

```bash
npm i -g gulp
```

1. Install local dependencies

```bash
npm i
```

### Running and/or compiling
* To run the application server:

```bash
npm run watch
```

Then visit [localhost:3000](http://localhost:3000) in your browser

* To compile static html files into the public folder:

```bash
gulp
```
