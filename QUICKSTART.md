# 🚀 Quick Start Guide - Deploy in 5 Minutes!

Get your workout tracker up and running in just 5 minutes.

## ⚡ Fastest Path to Success

### Option 1: GitHub Pages (Recommended)

**Time: 3 minutes**

1. **Upload to GitHub**
   ```bash
   # In your terminal
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/workout-tracker.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repo Settings
   - Click "Pages" in the sidebar
   - Select "main" branch
   - Click Save
   - Your app is live at: `https://YOUR_USERNAME.github.io/workout-tracker/`

3. **Add to iPhone Home Screen**
   - Open the URL in Safari
   - Tap the Share button
   - Scroll down and tap "Add to Home Screen"
   - Tap "Add"
   
   ✅ Done! You now have a native-feeling app.

### Option 2: Open Locally (Instant)

**Time: 30 seconds**

1. **Just open `index.html`**
   - Double-click `index.html`
   - Works immediately in any browser
   - No installation needed!

2. **For mobile testing**
   - Run: `npx http-server -p 8080`
   - Open `http://YOUR_IP:8080` on your phone
   - Make sure both devices are on same WiFi

## 📊 Google Sheets Setup (Optional but Awesome)

**Time: 5 minutes** - See `GOOGLE_SHEETS_SETUP.md` for full guide

Quick version:
1. Open your Google Sheet
2. Extensions → Apps Script
3. Paste code from `google-sheets-integration.gs`
4. Deploy → New deployment → Web app
5. Copy URL
6. Paste in app Settings

## 🎨 What You Get

- ✅ Works offline
- ✅ Installable as PWA
- ✅ Mobile-optimized (iPhone Pro Max perfect)
- ✅ Dark theme with smooth animations
- ✅ Google Sheets sync (optional)
- ✅ Recent activity tracking
- ✅ 5 workout programs pre-configured

## 📱 Using the App

### Log a workout (2 taps):
1. Tap exercise to expand
2. Tap "Log Set"
3. Enter weight & reps
4. Tap "Save"

### Switch programs:
- Tap workout type tabs at top
- Push / Pull / Legs / Shoulders / Weigh In

## 🔧 Customization

### Change exercises:
Edit the `workoutPrograms` object in `workout-tracker.jsx` or `index.html`

### Change colors:
Search for `from-indigo` and `to-purple` in the files and replace with your preferred colors

### Change app name:
Search for "GymFlow" and replace with your name

## 🆘 Troubleshooting

**App won't load?**
- Check browser console (F12)
- Try incognito mode
- Clear cache

**Google Sheets not syncing?**
- Check Settings has correct URL
- Verify Apps Script is deployed
- Check browser console for errors

**iPhone install not working?**
- Must use Safari (not Chrome)
- Make sure you tapped "Add to Home Screen"

## 📞 Support

Created an issue on GitHub if you need help!

---

**Pro tip**: Set up Google Sheets sync later. The app works perfectly offline and saves all data locally. You can sync to Sheets whenever you're ready!

**Start tracking now** 💪
