# Flatfile Environment Setup - Copilot Instructions

## Prerequisite Check & Install Commands

### 1. Check Current Environment
```bash
# Check what's already installed
node --version          # Check if Node.js exists
npm --version           # Check if npm exists  
brew --version          # Check if Homebrew exists (macOS)
git --version           # Check if git exists
```

### 2. Install Missing Prerequisites (macOS)
```bash
# If Homebrew missing:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# If Node.js missing:
brew install node@20
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc  
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

# Alternative for Node.js (if no sudo access):
# Download from https://nodejs.org/ and use installer
```

### 3. Install Missing Prerequisites (Windows)
```powershell
# If Node.js missing - download from https://nodejs.org/
# If git missing - download from https://git-scm.com/
```

## Project Setup Commands

### 4. Create/Navigate to Project
```bash
# If creating new project:
mkdir flatfile-qgenda && cd flatfile-qgenda
git init

# If cloning existing:
git clone <REPO_URL>
cd <PROJECT_NAME>
```

### 5. Create Required Files

**package.json:**
```json
{
  "name": "qgenda",
  "version": "1.0.0",
  "description": "Flatfile QGenda Integration",
  "main": "dist/index.js",
  "engines": { "node": ">=20.0.0" },
  "scripts": {
    "dev": "flatfile develop src/index.ts",
    "deploy": "flatfile deploy src/index.ts"
  },
  "dependencies": {
    "@flatfile/api": "^1.19.0",
    "@flatfile/http-logger": "^1.0.3",
    "@flatfile/listener": "^1.1.1",
    "@flatfile/plugin-export-workbook": "^5.2.3",
    "@flatfile/plugin-job-handler": "^0.8.1",
    "@flatfile/plugin-record-hook": "^1.11.2",
    "@flatfile/plugin-space-configure": "^0.8.0",
    "@flatfile/plugin-xlsx-extractor": "^4.0.5",
    "flatfile": "^3.5.9",
    "typescript": "^5.6.2"
  },
  "devDependencies": {
    "@types/node": "^18.19.74"
  }
}
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**src/index.ts:**
```typescript
import { FlatfileListener } from '@flatfile/listener';
import { configureSpace } from '@flatfile/plugin-space-configure';

export default function (listener: FlatfileListener) {
  console.log('🎉 Flatfile listener initialized');
  
  listener.use(
    configureSpace({
      workbooks: [
        {
          name: 'QGenda Data',
          sheets: [
            {
              name: 'Demographics', 
              slug: 'demographics',
              fields: [
                { key: 'firstName', type: 'string', label: 'First Name' },
                { key: 'lastName', type: 'string', label: 'Last Name' },
                { key: 'email', type: 'string', label: 'Email' }
              ]
            }
          ]
        }
      ]
    })
  );
}
```

**.env:**
```bash
# Get these from Flatfile dashboard -> "API Keys & Secrets"
FLATFILE_API_KEY="sk_your_actual_key_here"
FLATFILE_ENVIRONMENT_ID="us_env_your_actual_id_here"
```

**.gitignore:**
```
node_modules/
.env
.env.*
dist/
*.log
.DS_Store
```

### 6. Install and Test
```bash
# Install dependencies
npm install

# Start development server  
npm run dev
```

## Success Indicators
- ✅ `✔ Connected to event stream for scope us_env_XXXXXX`
- ✅ `File change detected. 🚀`

## Troubleshooting Commands
```bash
# If npm install fails due to permissions:
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# If development server won't start:
pkill node                    # Kill existing Node processes
npm run dev                   # Try again

# If connection fails:
cat .env                      # Verify credentials are set
```

## Validation Steps
1. Check Node.js: `node --version` (should be 20.x.x or higher)
2. Check npm: `npm --version` (should be 10.x.x or higher)  
3. Check files exist: `ls -la` (should show package.json, src/, .env)
4. Check dependencies: `npm list --depth=0` (should show @flatfile packages)
5. Check connection: `npm run dev` (should connect to Flatfile)

## Essential Commands Reference
- `npm run dev` - Start local development (connects to live Flatfile environment)
- `npm run deploy` - Deploy listener to Flatfile servers
- `Ctrl+C` - Stop development server
- `npm install` - Install/reinstall dependencies