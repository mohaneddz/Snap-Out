# 🛑 Snap Out - Mindful Browsing Extension

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat&logo=googlechrome&logoColor=white)](https://github.com)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green?style=flat)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](LICENSE)

A Chrome extension that helps you break the cycle of mindless browsing by making you conscious of *why* you're visiting distracting websites.

> **Note:** This is a quick small project I made to stop myself from procrastinating. I'm sharing it so that others might benefit as well. Feel free to use, modify, or improve it!

---

## 🎯 Features

- ✅ **Intentional Browsing** – Before accessing blocked sites, you must state your reason
- 📊 **Visit Tracking** – Keep a complete history of all visits with timestamps and reasons
- 🔓 **Session-Based Access** – Once you enter a reason, browse freely in that tab until you close it
- 🎨 **Beautiful UI** – Modern, gradient-based design with smooth animations
- 📈 **Statistics** – Track your total visits, today's visits, and weekly patterns
- ⚙️ **Easy Management** – Simple interface to add/remove blocked websites

---

## 📸 Screenshots

### 🚫 Block Screen
When you try to visit a blocked website, you'll see a beautiful prompt asking for your reason.

### 📊 Visit History
Track all your visits with detailed logs including:
- Website domain name
- Your reason for visiting
- Relative timestamps (e.g., "5m ago", "2h ago")
- Visit statistics dashboard

### ⚙️ Settings
Easily manage your list of blocked websites with a clean, intuitive interface.

---

## 🚀 Installation

1. **Download** or clone this repository
   ```bash
   git clone https://github.com/yourusername/snap-out.git
   ```

2. Open **Chrome** and navigate to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top-right corner)

4. Click **Load unpacked**

5. Select the `Snap Out` folder

6. ✨ The extension is now installed!

---

## 📖 How to Use

### 🔧 Setting Up Blocked Websites

1. Click the **Snap Out** extension icon in Chrome
2. Click the **Settings** button
3. Enter website domains (e.g., `youtube.com`, `twitter.com`, `reddit.com`)
4. Click **+ Add Website**

### 🌐 Visiting a Blocked Website

1. Try to navigate to any blocked website
2. You'll be presented with a block screen
3. Enter your reason in the text field (minimum 1 character required)
4. Click **Continue to Website**
5. Browse freely in that tab until you close it

### 📜 Viewing Your History

1. Click the extension icon to see your **3 most recent visits**
2. Click **View All History** for complete logs and statistics
3. Clear history anytime from the full history page

---

## 🎨 Design Features

- 🌈 **Gradient Backgrounds** – Modern purple gradient theme throughout
- ✨ **Smooth Animations** – Hover effects, transitions, and micro-interactions
- 📱 **Responsive Design** – Works beautifully on all screen sizes
- 🔢 **Character Counter** – Real-time feedback while typing
- 💬 **Visual Feedback** – Status messages and loading states
- 🎴 **Card-Based Layout** – Clean, organized information display
- 🎭 **Animated Icons** – Pulse and float effects for visual interest

---

## 🛠️ Technical Stack

### **Core Technologies**

![Manifest V3](https://img.shields.io/badge/Manifest_V3-4285F4?style=flat&logo=googlechrome&logoColor=white) **[Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)** – Latest Chrome extension format

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) **[Vanilla JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** – No frameworks needed

![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) **[CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS)** – Modern styling with gradients and animations

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) **[HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML)** – Semantic markup

### **Chrome APIs Used**

![Chrome Storage](https://img.shields.io/badge/Storage_API-4285F4?style=flat&logo=googlechrome&logoColor=white) **[Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)** – Sync and local storage

![Chrome Tabs](https://img.shields.io/badge/Tabs_API-4285F4?style=flat&logo=googlechrome&logoColor=white) **[Chrome Tabs API](https://developer.chrome.com/docs/extensions/reference/tabs/)** – Tab management and lifecycle

![Chrome WebNavigation](https://img.shields.io/badge/WebNavigation_API-4285F4?style=flat&logo=googlechrome&logoColor=white) **[Chrome WebNavigation API](https://developer.chrome.com/docs/extensions/reference/webNavigation/)** – Navigation interception