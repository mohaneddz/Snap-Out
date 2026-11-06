![Snap Out cover](screenshots/cover.avif)

# Snap Out

**Pause before a distracting site. Say why you are going there. Then decide.**

Snap Out is a small Chrome extension for intentional browsing. Add websites you want to pause on; when you navigate to one, the extension asks for a reason before continuing. The reason and time appear in a private visit history.

## Install

1. Download or clone [this repository](https://github.com/mohaneddz/Snap-Out).
2. Open `chrome://extensions/` and enable **Developer mode**.
3. Choose **Load unpacked** and select the repository folder containing `manifest.json`.
4. Open the extension's **Settings** page and add a domain such as `youtube.com` (or paste a URL on that domain).

The blocked list starts empty. The extension is not published to the Chrome Web Store.

## Use

- **Pause:** A main-frame visit to a listed HTTP(S) domain or its subdomains opens the reason page. Blank reasons cannot be submitted.
- **Continue:** The reason is saved locally, then that domain is allowed in the current tab. Other tabs still pause. Granting access to a different listed domain in the same tab replaces the previous grant. Access resets when the tab closes or the browser session ends.
- **Review:** The popup shows the three most recent entries. **View All History** shows the full log and counts for today and the last seven days. You can clear the log there.
- **Edit:** Settings accepts domains or URLs, removes duplicates, and lets you remove a domain at any time. Changes to the blocked list sync through Chrome when browser sync is enabled.

## How it works

Chrome Manifest V3 `declarativeNetRequest` rules redirect listed domains to `block.html` before the main-frame request completes. The original destination is carried in the extension page's URL fragment. After a reason is recorded, a tab-scoped session rule allows that domain. The rules survive extension service-worker suspension; session grants disappear at browser shutdown. Domain matching uses host boundaries, so `youtube.com.evil.test` does not match `youtube.com`.

The extension only handles top-level HTTP(S) navigation. It does not inspect page content, embedded frames, or navigation that stays entirely inside an already loaded page. Browser-internal pages are outside its scope.

## Data and permissions

The blocked domains live in `chrome.storage.sync`. Visit URLs, reasons, and timestamps live in `chrome.storage.local` on your device, capped at the latest 1,000 entries. Snap Out does not send them to a project server. The extension requests access to web URLs so Chrome can apply the redirect rules; it does not inject scripts into websites.

## Verify

Run the dependency-free domain and rule tests with:

```sh
node --test tests/shared.test.js
```

For a manual check, add a domain in Settings, visit it in two tabs, give a reason in one tab, and confirm that the second tab still pauses. Then check the popup and full history, remove the domain, and verify that navigation no longer pauses.

## License

[MIT](LICENSE)
