# Flatfile Rollout Plugin Implementation

This implementation adds the Flatfile Rollout plugin to automatically update existing spaces and workbooks whenever the development listener environment is restarted.

## Implementation Details

### 1. Workbook Namespace
- Added namespace `"workbook:qgenda-company"` to the company workbook configuration
- This namespace identifies which spaces should be updated by the rollout plugin

### 2. Rollout Plugin Configuration
- Located in: `src/plugins/rollout.plugin.ts`
- Namespace: `"workbook:qgenda-company"`
- Development mode enabled: `dev: true`
- Updater function handles workbook configuration updates

### 3. Plugin Registration
- Dual listener registration pattern implemented in `src/index.ts`:
  - Root event handler: `listener.use(rolloutPlugin.root)` - handles `agent:created` and `agent:updated` events
  - Namespaced handler: `listener.namespace(['workbook:qgenda-company'], ...)` - handles the `space:auto-update` job

### 4. Update Process
When the development environment restarts:
1. The rollout plugin detects the agent restart event
2. It identifies spaces with the `workbook:qgenda-company` namespace
3. For each matching space, it updates workbook configurations with the latest schema
4. Returns updated workbooks to re-trigger data hooks and validation

## Requirements for Spaces

For spaces to be updated by the rollout plugin, they must:
1. Have the namespace `workbook:qgenda-company`
2. Have a secret named `FF_AUTO_UPDATE_DEV` with value `'true'` (for development)
3. Have a secret named `FF_AUTO_UPDATE` with value `'true'` (for production)

## Features

- **Development Mode**: Automatically enabled (`dev: true`) for local development
- **Error Handling**: Continues processing other workbooks if one fails
- **Logging**: Comprehensive console logging for debugging
- **Hook Re-triggering**: Returns updated workbooks to re-run data validation hooks

## Usage

The rollout plugin is automatically active when the development server runs:
```bash
npm run dev
```

When you see this message in the console, the rollout plugin is working:
```
running local dev refresh based update of spaces, suppress this with dev=false in the autoUpdate plugin config
```

## API Permissions Required

The agent requires these API permissions:
- `space:read` (for `spaces.list`, `spaces.get`)
- `secret:read` (for `secrets.list`)
- `workbook:read` (for `workbooks.list`)
- `workbook:write` (for `workbooks.update`)
- `job:write` (for `jobs.create`)