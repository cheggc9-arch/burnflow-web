# Timer Configuration Guide

This guide explains how to switch between manual testing mode and automatic timer mode.

## 🧪 Current Mode: Manual Testing

**Environment Variables:**
```bash
ENABLE_AUTOMATIC_DISTRIBUTION=false
DISTRIBUTION_INTERVAL_MINUTES=20
```

**Behavior:**
- ✅ Manual trigger button works
- ✅ Timer shows "MANUAL MODE"
- ✅ No automatic distributions
- ✅ Perfect for testing

## 🚀 Switching to Automatic Mode

**Step 1: Update Environment Variables**
```bash
ENABLE_AUTOMATIC_DISTRIBUTION=true
DISTRIBUTION_INTERVAL_MINUTES=20
```

**Step 2: Deploy/Restart**
- Deploy to Railway with new environment variables
- Or restart local development server

**Step 3: Verify**
- Timer shows "AUTOMATIC MODE"
- Countdown timer appears
- Distributions run automatically

## ⚙️ Configuration Options

### Timer Interval
```bash
# Every 5 minutes (for testing)
DISTRIBUTION_INTERVAL_MINUTES=5

# Every 20 minutes (default)
DISTRIBUTION_INTERVAL_MINUTES=20

# Every hour
DISTRIBUTION_INTERVAL_MINUTES=60

# Every 6 hours
DISTRIBUTION_INTERVAL_MINUTES=360
```

### Mode Control
```bash
# Manual testing mode
ENABLE_AUTOMATIC_DISTRIBUTION=false

# Automatic production mode
ENABLE_AUTOMATIC_DISTRIBUTION=true
```

## 🔄 Easy Switching

### For Testing:
1. Set `ENABLE_AUTOMATIC_DISTRIBUTION=false`
2. Use manual trigger button
3. Test distributions safely

### For Production:
1. Set `ENABLE_AUTOMATIC_DISTRIBUTION=true`
2. Set desired `DISTRIBUTION_INTERVAL_MINUTES`
3. Deploy with new environment variables
4. Automatic distributions start immediately

## 📊 UI Indicators

**Manual Mode:**
- 🧪 "MANUAL MODE" indicator
- ⏸️ Timer disabled icon
- Manual trigger button visible

**Automatic Mode:**
- 🚀 "AUTOMATIC MODE" indicator
- ⏰ Active timer icon
- Countdown display
- Manual trigger button hidden (unless `SHOW_DISTRIBUTION_TRIGGER=true`)

## 🛡️ Safety Features

- **No double distributions**: Timer resets after each distribution
- **Error handling**: Failed distributions don't break the timer
- **Manual override**: Can still trigger manually if needed
- **Status tracking**: All distributions logged to Supabase

## 🚀 Production Checklist

Before switching to automatic mode:

1. ✅ Test manual distributions thoroughly
2. ✅ Verify Supabase integration works
3. ✅ Check environment variables are set
4. ✅ Confirm timer interval is correct
5. ✅ Monitor first few automatic distributions

**Ready to switch? Just change `ENABLE_AUTOMATIC_DISTRIBUTION=true` and deploy!** 🎉
