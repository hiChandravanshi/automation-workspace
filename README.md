# Nx Monorepo Guide

This README explains how to work inside our Nx monorepo, how to add new **apps**, how to create reusable **libraries**, and how to publish a shared library to any registry.

---

# 📁 Monorepo Structure

```
automation-workspace/
│
├── apps/              # All runnable projects (web-tests, mobile-tests, api-tests, etc.)
│   └── web-tests/
│   └── mobile-tests/
│   └── api-tests/
│
├── shared/            # Reusable libraries shared across apps
│   └── logger/
│   └── i18n/
│   └── utils/
│
├── nx.json
├── package.json
└── tsconfig.base.json
```

---

# 🚀 1. What is an **App** folder?

An **app** is a runnable project — something that executes tests or performs actions.

Examples:

* **web-tests** → Playwright tests
* **mobile-tests** → WebdriverIO + Appium tests
* **api-tests** → Playwright API tests
* **stress-tests** → k6 load tests

Apps depend on shared libraries but **must not depend on each other**.
Apps contain:

* test code
* configs
* setup files
* environment files

---

# 🛠 1.1 How to create a new App (step‑by‑step)

### Example: Create a new app called `sample-tests`

1️⃣ Navigate to the repo root

```
cd automation-workspace
```

2️⃣ Create the folder manually

```
mkdir -p apps/sample-tests
```

3️⃣ Add a minimal `project.json`

```
apps/sample-tests/project.json
```

```json
{
  "name": "sample-tests",
  "root": "apps/sample-tests",
  "sourceRoot": "apps/sample-tests/src",
  "targets": {}
}
```

4️⃣ Add an entry to `tsconfig.base.json` paths (optional)
This allows imports like:

```
import { logger } from "@automation-workspace/logger";
```

Paths are auto‑picked from shared libs, so apps usually don’t need custom paths.

5️⃣ Add your testing framework (Playwright, WDIO, etc.)

Apps are fully independent: install only what the app needs.

You now have a runnable Nx app.

---

# 📚 2. What is a **Library**?

A **library** (lib) is a shared, reusable package that multiple apps use.

Examples of things that belong in a library:

### ✔ Good candidates for libs

* logging
* env/config helper
* i18n translations
* API clients
* validation utilities
* selectors
* test data builders

### ❌ Things that should NOT go into libs

* test cases
* framework configs (wdio.conf, playwright.config)
* environment-specific secrets
* BrowserStack/Appium device configs

Libraries live under:

```
/libs/<libname>
```

---

# 🛠 2.1 How to create a new Library

### Example: Create a library called `i18n`

1️⃣ Create the folder

```
mkdir -p shared/i18n/src
```

2️⃣ Add entry files

```
shared/i18n/index.ts
shared/i18n/src/... your code
```

3️⃣ Add a `package.json` inside the library

```
shared/i18n/package.json
```

```json
{
  "name": "@automation-workspace/i18n",
  "version": "0.0.1",
  "main": "index.ts",
  "types": "index.ts",
  "private": false
}
```

4️⃣ Add `project.json`

```
shared/i18n/project.json
```

```json
{
  "name": "shared-i18n",
  "root": "shared/i18n",
  "sourceRoot": "shared/i18n/src",
  "targets": {}
}
```

5️⃣ Add TypeScript path alias (for easy imports)
Edit **tsconfig.base.json**:

```json
{
  "compilerOptions": {
    "paths": {
      "@automation-workspace/i18n": ["shared/i18n/index.ts"]
    }
  }
}
```

Now apps can use it like:

```ts
import { t } from "@automation-workspace/i18n";
```

---

# 📦 3. How to Publish a Library

We publish *from inside the library folder*, using the library’s own `package.json`.

Nx no longer provides a built‑in `publish` executor, so we use a simple command.

---

# 🛠 3.1 Steps to Publish a Library (using shared/logger example)

### 1️⃣ Go to the library folder

```
cd shared/logger
```

### 2️⃣ Ensure the package.json is correct

```
{
  "name": "@automation-workspace/logger",
  "version": "0.0.1",
  "main": "index.ts",
  "types": "index.ts",
  "private": false
}
```

Scoped packages MUST be published with:

```
--access public
```

### 3️⃣ Publish manually

```
npm publish --access public 
```
or from the root run

```
npx nx run shared-logger:publish
```
see the shared-logger project.json to learn how to configure this command

This will publish the `.ts` files as-is.

---

# 🛠 3.2 Publish using Nx (optional)

Add this to `shared/logger/project.json`:

```json
{
  "name": "shared-logger",
  "root": "shared/logger",
  "sourceRoot": "shared/logger/src",
  "targets": {
    "publish": {
      "executor": "nx:run-commands",
      "options": {
        "cwd": "shared/logger",
        "command": "npm publish libs/shared-logger/ --access public"
      }
    }
  }
}
```

Now run:

```
npx nx publish shared-logger
```

---

# 4. How to manage package installation

# 4.1 How to manage packages

- project specific dependency should be mentioned in the project specific `package.json` for example if we want a dependecy only needed for the `api-test` app we will put it under `apps/api-tests/package.json` like

```
"dependencies": {
    "@playwright/test": "^1.57.0"
}
```

- do mention the project path under workspace of the root `package.json` like

```
"workspaces": [
    "apps/*",
    "libs/*"
    "apps/api-tests" // like this
],
```

# 4.2 Install all the packages

To install all the packages from all the package.json in the mono repo run the below command

```
npm install
```

# 4.3 To run packages specific to a project like apps/web-tests or apps/api-tests

```
npm run install:api-tests or npm install --workspace apps/api-tests --include-workspace-root
```

```
npm run install:web-tests or npm install --workspace apps/web-tests --include-workspace-root
```

The above command install the dependencies from the workspace and then it installs the dependencies mentioned in the root `package.json`. 

# ✅ Summary

### ✔ Apps

* runnable test projects
* contain test code + config

### ✔ Libs

* reusable shared code
* have their own package.json
* imported via @automation-workspace/*

### ✔ Dependencies

* can handle separate dependencies (project specific package.json) and common dependencies (root specific package.json)

### ✔ Publishing

* use npm publish (or Nx wrapper)
* scoped packages require `--access public` (for public packages)
* ensure correct folder and package.json

---
