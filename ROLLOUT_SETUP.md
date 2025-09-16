# Flatfile Rollout Deployment Guide

## Overview
The rollout plugin has been configured to automatically update your workbooks when a new version of your Flatfile agent is deployed. This ensures that all existing spaces stay up-to-date with your latest schema changes.

## Configuration Details

### Namespace
- **Production**: `workbook:qgenda-company`
- **Development**: Enabled when `NODE_ENV === 'development'` or running locally

### What Gets Updated
- State License sheet (newly added)
- All existing sheets with any schema changes
- Automatic re-triggering of data validation hooks

## Required Setup

### 1. Environment Secrets (Important!)
For the rollout to work, you need to set up secrets in your Flatfile spaces:

#### For Production Spaces:
```
Secret Name: FF_AUTO_UPDATE
Secret Value: true
```

#### For Development Spaces (if testing locally):
```
Secret Name: FF_AUTO_UPDATE_DEV  
Secret Value: true
```

### 2. How to Add Secrets
1. Go to your Flatfile dashboard
2. Navigate to the space you want to enable auto-updates for
3. Go to Settings → Secrets
4. Add the appropriate secret (FF_AUTO_UPDATE or FF_AUTO_UPDATE_DEV)
5. Set the value to `true`

## Deployment Process

### Step 1: Test Locally
```bash
npm run dev
```
This will start your local development server with rollout enabled.

### Step 2: Deploy to Production
```bash
npm run deploy
```
This will deploy your agent with the rollout configuration.

### Step 3: Verify Rollout
After deployment, check the logs in your Flatfile dashboard for:
- `🚀 Starting rollout update for space [space-id]`
- `📝 Processing workbook: [workbook-name]`
- `🎉 Rollout completed. Processed X workbook(s)`

## What Happens During Rollout

1. **Agent Deployment Event**: When you run `npm run deploy`, Flatfile triggers an `agent:updated` event
2. **Space Detection**: The plugin finds all spaces matching the `workbook:qgenda-company` namespace
3. **Secret Check**: Only spaces with `FF_AUTO_UPDATE=true` are processed
4. **Schema Update**: The updater function processes each workbook and applies new configurations
5. **Hook Re-triggering**: All data validation hooks are re-run on existing records

## New Features Added

✅ **State License Sheet**: Now included in your Company Workbook  
✅ **Automatic Updates**: Schema changes deploy automatically  
✅ **Data Validation**: State License validation hooks included  
✅ **Development Mode**: Test updates locally before production  

## Troubleshooting

### Updates Not Triggering
- Verify the `FF_AUTO_UPDATE` secret exists and equals `"true"`
- Check that your space has the correct namespace
- Look for deployment events in Flatfile logs

### Local Updates Not Working
- Ensure `dev: true` is set in the rollout configuration (already configured)
- Add `FF_AUTO_UPDATE_DEV=true` secret to your development space

### Hooks Not Re-running
- Check that the updater function returns the workbooks array
- Verify console logs show successful processing

## Security Notes

- The rollout only affects spaces that explicitly opt-in via secrets
- The `FF_AUTO_UPDATE` secret acts as a safety mechanism
- You can disable rollout for any space by removing/changing the secret value

## Next Steps

1. **Add the secrets** to your Flatfile spaces
2. **Test locally** with `npm run dev`
3. **Deploy** with `npm run deploy`
4. **Monitor logs** to verify successful rollout
5. **Upload test data** to verify State License validation works