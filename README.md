# ECHO

**https://github.com/grldadrcks/strata-app**

A 7-realm psychological mind game. You solve it. It studies you.

ECHO profiles your behavioral patterns across seven cognitive layers — nature, abstraction, perception, psychology, sociology, attachment, and detachment — then reveals your psychological profile at the end. Every choice is tracked silently.

## Stack

- React 19 + Vite + Tailwind CSS
- Capacitor 7 (Android)
- localStorage persistence
- No backend, no accounts

## Realms

| # | Realm | What it measures |
|---|-------|-----------------|
| 1 | NATURE | Response speed — intuitive vs analytical |
| 2 | ABSTRACTION | Ethical reasoning style |
| 3 | PERCEPTION | Attention focus and framing susceptibility |
| 4 | PSYCHOLOGY | Cognitive bias awareness |
| 5 | SOCIOLOGY | Conformity vs independence |
| 6 | ATTACHMENT | What you hold longest |
| 7 | DETACHMENT | Acceptance vs questioning |

## Dev

```bash
npm install
npm run dev          # Vite dev server
npm run build        # Production build
npm run cap:sync     # Sync to Android
npm run cap:android  # Open in Android Studio
```

## Android (build APK directly)

```powershell
cd android
.\gradlew.bat assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`
