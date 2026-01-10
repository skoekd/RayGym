# GymFlow - Premium Workout Tracker

A sleek, mobile-optimized Progressive Web App (PWA) for tracking workouts with Google Sheets integration.

## 🚀 Features

- **Mobile-First Design**: Optimized for iPhone Pro Max and all mobile devices
- **Google Sheets Sync**: Automatically sync your workouts to Google Sheets
- **5 Workout Programs**: Push, Pull, Legs, Shoulders+Arms, and Weigh-In tracking
- **Quick Logging**: Minimal clicks to log sets - expand exercise and tap "Log Set"
- **Recent Activity**: See your last 5 workouts at a glance
- **Offline Support**: Works offline with local storage
- **Beautiful UI**: Premium dark theme with smooth animations

## 📱 Mobile Optimization

- Large, touch-friendly buttons
- Expandable exercise cards to reduce clutter
- Minimal clicks to log workouts (2-3 taps)
- Smooth animations and transitions
- Bottom navigation for easy thumb access
- Floating action button for quick access

## 🔧 Setup Instructions

### 1. Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push all files to the repository:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/workout-tracker.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to "Pages"
   - Select "main" branch as source
   - Save

Your app will be available at: `https://YOUR_USERNAME.github.io/workout-tracker/`

### 2. Google Sheets Integration

#### Step 1: Prepare Your Google Sheet

1. Open your training log Google Sheet
2. Make sure it has these sheets:
   - "Reverse Weigh In"
   - "Push"
   - "Pull"
   - "Legs"
   - "Shoulders + Arms"

#### Step 2: Create Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code
3. Copy and paste the code from `google-sheets-integration.gs`
4. Click **Save** (💾 icon)

#### Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ and select **Web app**
3. Fill in:
   - **Description**: "Workout Tracker API"
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the Web App URL** (it looks like: `https://script.google.com/macros/s/...`)
6. Click **Done**

#### Step 4: Configure the App

1. Open the workout tracker app
2. Tap the **Settings** icon (⚙️) in the top right
3. Paste your **Web App URL** from Step 3
4. Tap **Save Settings**

## 🎯 How to Use

### Logging a Workout

1. **Select your workout type** from the tabs (Push, Pull, Legs, etc.)
2. **Tap on an exercise** to expand it
3. **Tap "Log Set"** button
4. **Enter weight and reps**
5. **Add notes** (optional)
6. **Tap "Save Workout"**

Your workout will automatically sync to Google Sheets!

### Viewing History

- Scroll down to see your **Recent Activity**
- View the last 5 workouts you logged

## 📊 Data Structure

Workouts are logged in the format: `reps*weight`

Example: `12*135` means 12 reps at 135 lbs

The app will:
- Find the correct exercise row
- Find the next empty date column
- Add your workout entry
- Include notes if provided: `12*135 (felt strong)`

## 🛠 Tech Stack

- **React** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Google Apps Script** - Backend integration
- **LocalStorage** - Offline data persistence

## 📱 Progressive Web App (PWA)

To add to your home screen:

### iOS (iPhone/iPad)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### Android
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home Screen"
4. Tap "Add"

## 🎨 Customization

### Colors
Edit the gradient colors in the code:
```jsx
// Main background
bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950

// Buttons
bg-gradient-to-r from-indigo-600 to-purple-600
```

### Exercises
Edit the `workoutPrograms` object in `workout-tracker.jsx` to add/remove exercises.

## 🔒 Privacy

- All data is stored in YOUR Google Sheet
- No third-party servers
- Works offline with local storage
- You own and control all your data

## 📝 File Structure

```
workout-tracker/
├── index.html              # Main HTML file
├── workout-tracker.jsx     # React component
├── google-sheets-integration.gs  # Apps Script code
├── README.md              # This file
└── package.json           # Dependencies
```

## 🐛 Troubleshooting

**Q: Workouts not syncing to Google Sheets?**
- Check that you've deployed the Apps Script as a Web App
- Verify the Web App URL in Settings is correct
- Make sure sheet names match exactly

**Q: App not loading?**
- Clear browser cache
- Check browser console for errors
- Ensure all dependencies loaded

**Q: Can't find an exercise?**
- Exercise names must match exactly with Google Sheet
- Check spelling and capitalization

## 📄 License

MIT License - Feel free to modify and use for personal or commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 💡 Future Enhancements

- [ ] Progress charts and analytics
- [ ] Personal records tracking
- [ ] Timer for rest periods
- [ ] Exercise form videos
- [ ] Workout templates
- [ ] Social sharing
- [ ] Exercise library

---

Made with 💪 for serious lifters
