# MyApp

React Native task management app with:

- login flow
- task dashboard
- task details editing
- profile screen
- insights screen
- local commit hook that builds mobile artifacts

## Stack

- React Native `0.84.1`
- React `19`
- React Navigation
- TypeScript
- Axios

## App Features

- Sign in flow with local demo mode when no backend is configured
- Task list with add, search, filter, sort, complete, delete, duplicate, and clear-completed actions
- Task details screen with editable title, due label, status, and priority
- Profile screen with task summary
- Insights screen with lightweight task analytics
- Header hamburger menu for app navigation

## Project Structure

```text
src/
  context/       session and tasks state
  navigation/    stack navigation
  screens/       app screens
  services/      API and service adapters
  usecases/      app business logic
scripts/         local build and hook scripts
.githooks/       versioned git hooks
apks/            generated Android APK copies
build/           generated iOS simulator bundles and notes
```

## Getting Started

### Requirements

- Node.js `>= 22.11.0` is the target version in `package.json`
- Android Studio / SDK for Android builds
- Java 17 for Gradle / Android
- Xcode on macOS for iOS builds

### Install

```sh
npm install
```

### Run the App

Start Metro:

```sh
npm start
```

Run Android:

```sh
npm run android
```

Run iOS:

```sh
npm run ios
```

## VS Code

This repo includes VS Code tasks in `./.vscode/tasks.json` for running Metro and Android from the integrated terminal.

Suggested flow:

1. Run the `Metro` task
2. Run the `Android App` task

## Scripts

Important npm scripts:

- `npm start` - start Metro
- `npm run android` - run Android app
- `npm run ios` - run iOS app
- `npm run lint` - lint the project
- `npm test -- --watch=false --runInBand` - run tests once
- `npm run build:apk` - build Android release APK and copy it into `apks/`
- `npm run build:apk:copy-only` - only copy existing APK artifacts into `apks/`
- `npm run build:apk:sh` - shell version of Android APK build
- `npm run build:ios` - build iOS simulator app on macOS
- `npm run build:ios:windows` - shows a message that iOS build requires macOS
- `npm run hooks:install` - point git to `.githooks`
- `npm run postcommit:sync` - Windows post-commit build + push flow

## Build Output

### Android

Android release APKs are copied to:

- `./apks`

The script creates:

- `app-release-latest.apk`
- timestamped archive copies like `app-release-20260318-122949.apk`

### iOS

iOS simulator builds are copied to:

- `./build`

On macOS, the script copies:

- `*-simulator-latest.app`
- timestamped `.app` bundles

## Commit Hook Workflow

This repo includes a local `post-commit` workflow:

- versioned hook: `./.githooks/post-commit`
- local active hook: `./.git/hooks/post-commit`

### What happens on commit

On Windows:

- build Android APK
- copy artifacts to `apks/`
- if the current branch has an upstream, run `git push`

On macOS:

- build Android APK
- build iOS simulator app
- if the current branch has an upstream, run `git push`

### Important Note

This hook builds locally and can push automatically, but it does **not** stop your remote CI from building again after push. If your remote pipeline builds on push, that second build is expected.

## Demo Mode

If no backend base URL is configured in `./src/services/api.ts`, login and tasks use local mock behavior so the app can still be explored.

## Verification

Useful checks:

```sh
npx tsc --noEmit
npm run lint
npm test -- --watch=false --runInBand
```

## Notes

- Android release signing is currently using the debug signing config in development
- iOS build automation is prepared in this repo, but actual iOS builds require macOS and Xcode
- The git hook behavior depends on your branch having an upstream remote
