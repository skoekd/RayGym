# Google Sheets Integration Setup Guide

This guide will walk you through setting up the Google Sheets integration for GymFlow.

## Prerequisites

- Your workout tracking Google Sheet (the one you uploaded)
- A Google account with access to Google Apps Script

## Step-by-Step Setup

### Part 1: Prepare Your Google Sheet

1. **Open your Training Log workbook** in Google Sheets
2. **Verify sheet names** - Make sure your workbook has these exact sheet names:
   - `Reverse Weigh In`
   - `Push`
   - `Pull`
   - `Legs`
   - `Shoulders + Arms`

3. **Check exercise names** - The exercise names in column A should match the app:
   - Push: "Dumbbell Incline Chest Press", "Machine Chest Press", etc.
   - Pull: "T-Bar Row", "Lat Pulldown", etc.
   - Legs: "Seated Hamstring Curl", "Bulgarian Split Squat", etc.
   - Shoulders: "Seated Shoulder Press", "Dumbbell Side Lateral Raise", etc.

### Part 2: Create Google Apps Script

1. **Open Apps Script**
   - In your Google Sheet, click **Extensions → Apps Script**
   - This opens a new tab with the script editor

2. **Clear default code**
   - Delete any existing code in the editor (usually has `function myFunction()`)

3. **Paste the integration code**
   - Copy ALL the code from `google-sheets-integration.gs`
   - Paste it into the script editor

4. **Save the script**
   - Click the 💾 save icon or press `Ctrl+S` (Windows) / `Cmd+S` (Mac)
   - Name your project (e.g., "Workout Tracker API")

### Part 3: Deploy as Web App

1. **Click Deploy**
   - In the top right corner, click **Deploy → New deployment**

2. **Configure deployment**
   - Click the gear/settings icon ⚙️ next to "Select type"
   - Select **Web app**

3. **Fill in deployment settings**:
   - **Description**: "Workout Tracker API v1"
   - **Execute as**: "Me (your-email@gmail.com)"
   - **Who has access**: "Anyone"
   
   ⚠️ **Important**: Choose "Anyone" - this allows the app to access the script

4. **Authorize the script**
   - Click **Deploy**
   - You'll see a permissions dialog
   - Click **Review Permissions**
   - Choose your Google account
   - Click **Advanced** (at the bottom)
   - Click **Go to [Your Project Name] (unsafe)**
   - Click **Allow**

5. **Copy your Web App URL**
   - After authorization, you'll see a "Web app" URL
   - It looks like: `https://script.google.com/macros/s/ABC123.../exec`
   - **Copy this entire URL** - you'll need it for the app
   - Click **Done**

### Part 4: Configure the App

1. **Open GymFlow** in your browser
2. **Tap the Settings icon** (⚙️) in the top right
3. **Paste your Web App URL** into the "Google Sheets URL" field
4. **Tap "Save Settings"**

## Testing the Integration

1. **Select a workout type** (e.g., Push Day)
2. **Tap an exercise** to expand it
3. **Tap "Log Set"**
4. **Enter weight and reps** (e.g., 135 lbs, 10 reps)
5. **Tap "Save Workout"**

6. **Check your Google Sheet**:
   - Go to the corresponding sheet (e.g., "Push")
   - Find the exercise row (e.g., "Dumbbell Incline Chest Press")
   - You should see a new entry in the format `10*135` in the next available date column
   - The date header should be automatically added

## How It Works

### Data Format
- Workouts are stored as: `reps*weight`
- Example: `12*135` = 12 reps at 135 lbs
- With notes: `12*135 (felt strong)`

### Column Management
- The script automatically finds the next empty column
- Date headers are added to row 1
- Each exercise has its own row
- Multiple sets can be logged across different columns

### Data Flow
```
App → Google Apps Script → Your Google Sheet
```

1. You log a workout in the app
2. App sends data to your Apps Script URL
3. Script finds the correct sheet and exercise
4. Script writes to the next empty column
5. Data appears in your Google Sheet instantly

## Troubleshooting

### "Please configure Google Sheets URL"
- You haven't set the Web App URL yet
- Go to Settings and paste your URL

### "Invalid Google Sheets URL"
- Make sure you copied the FULL URL including `https://`
- The URL should contain `/macros/s/` and end with `/exec`

### Workouts save locally but not to Sheets
- Check that you deployed the script as "Anyone" can access
- Verify the Web App URL is correct
- Try redeploying the script with a new version

### "Exercise not found" error
- Exercise names must match EXACTLY (including capitalization)
- Check your Google Sheet column A for the exercise name
- Update either the app or sheet to match

### Permissions issues
- Make sure you clicked "Allow" when authorizing
- Try redeploying and authorizing again
- Check that the script is deployed as "Execute as: Me"

## Updating the Script

If you need to make changes to the script:

1. **Edit the code** in the Apps Script editor
2. **Save your changes**
3. **Deploy again**:
   - Click **Deploy → Manage deployments**
   - Click the pencil icon ✏️ to edit
   - Change "Version" to "New version"
   - Add a description of what changed
   - Click **Deploy**
4. **Copy the NEW Web App URL** if it changed
5. **Update the app settings** with the new URL

## Privacy & Security

- **Your data stays in YOUR Google Sheet**
- The app uses YOUR Google Apps Script
- No data is stored on external servers
- Only you have access to your workout data
- The "Anyone" permission only means anyone with the URL can POST to it
- Keep your Web App URL private

## Advanced: Customizing the Script

You can modify the script to:
- Change the data format
- Add additional validation
- Send notifications
- Create automatic backups
- Generate summary reports

See the comments in `google-sheets-integration.gs` for more details.

## Need Help?

If you're stuck:
1. Check the browser console for errors (F12 → Console)
2. Check the Apps Script logs (View → Logs in the script editor)
3. Verify all sheet names and exercise names match
4. Try redeploying from scratch

---

Once set up, your workouts will automatically sync to your Google Sheet! 💪
