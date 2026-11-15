JARVIS MOBILE — PHONE-ONLY STARTER

What this is:
A mobile-first installable web app (PWA). It is not yet a native APK. You can use it on Android with Chrome and add it to your Home screen.

FASTEST WAY TO USE:
1. Extract this ZIP on your Android phone using Files by Google or another ZIP manager.
2. The app must be hosted over HTTPS for installation and offline features. You can publish this folder using a static hosting service such as GitHub Pages or Netlify from your phone browser.
3. Once published, open the HTTPS site in Chrome.
4. Chrome menu (⋮) > Add to Home screen / Install app.
5. Open JARVIS from your home screen.

CUSTOM CATEGORIES:
1. Open Customize.
2. Under Add a search category, enter a name such as Scholarships or ECET.
3. Enter a search template. Use {query} where your search phrase should be inserted.
   Example category: "ECET updates"
   Template: {query} AP ECET latest updates
4. Tap Add Category. It appears under Category search.
5. You can delete custom categories and export settings as JSON.

AI:
- Basic local commands and category searches work without an AI API.
- For open-ended AI chat, configure an HTTPS backend endpoint in Customize.
- Do not put API keys in this app or a public frontend. Keep them on a backend server.
- Endpoint contract: POST JSON {"messages":[{"role":"user","content":"hello"}]} and return JSON {"reply":"Hello"}.
- This starter currently sends the latest message only; conversation memory can be expanded in a later phase.

VOICE:
- Voice input uses browser SpeechRecognition where available (best chance with Chrome).
- Spoken replies use the phone/browser Text-to-Speech voices. Available voices depend on installed language packs. Pick a voice in Customize.
- A specifically male voice cannot be guaranteed on every Android phone.

LIMITS:
- For first publish/install, use an HTTPS static host. Opening index.html directly from a file manager may allow basic testing but install/offline functions may not work.
- Search opens Google results in a new browser tab.
- This is a starter, not an always-listening wake-word app. Continuous microphone listening is restricted by mobile browser/OS power and privacy controls.
- For native Android APK later, we can use a cloud Android build workflow from the phone, but that is a separate packaging step.
