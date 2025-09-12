# Flatfile Development Environment Setup Guide

This guide will help you set up a complete Flatfile development environment on macOS from scratch.

## Prerequisites
- macOS computer
- Admin/sudo access
- Access to your Flatfile dashboard

## Step 1: Install Homebrew Package Manager

```bash
# Install Homebrew (will prompt for password)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to your shell profile
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile

# Load Homebrew for current session
eval "$(/opt/homebrew/bin/brew shellenv)"

# Verify installation
brew --version
```

## Step 2: Install Node.js LTS

```bash
# Install Node.js LTS version 20
brew install node@20

# Add Node.js to PATH
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc

# Load Node.js for current session
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

## Step 3: Create GitHub Repository

1. Go to GitHub and create a new repository
2. Name it `flatfile-qgenda` (or your preferred name)
3. Create in your organization account for team access
4. Clone locally:

```bash
# Clone your repository
git clone https://github.com/YOUR_ORG/flatfile-qgenda.git
cd flatfile-qgenda
```

## Step 4: Set Up Project Structure

Create the basic Flatfile project files:

```bash
# Create package.json
cat > package.json << 'EOF'
{
  "name": "qgenda",
  "version": "1.0.0",
  "description": "Flatfile QGenda Integration",
  "main": "dist/index.js",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "dev": "flatfile develop src/index.ts",
    "deploy": "flatfile deploy src/index.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
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
EOF

# Create TypeScript configuration
cat > tsconfig.json << 'EOF'
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
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Create source directory and basic listener
mkdir -p src
cat > src/index.ts << 'EOF'
import { FlatfileListener } from '@flatfile/listener';
import { configureSpace } from '@flatfile/plugin-space-configure';

export default function (listener: FlatfileListener) {
  // Configure your space and listeners here
  console.log('Flatfile listener initialized');
  
  // Basic space configuration
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
                {
                  key: 'firstName',
                  type: 'string',
                  label: 'First Name'
                },
                {
                  key: 'lastName',
                  type: 'string',
                  label: 'Last Name'
                },
                {
                  key: 'email',
                  type: 'string',
                  label: 'Email'
                }
              ]
            }
          ]
        }
      ]
    })
  );
}
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*

# Environment variables
.env
.env.local
.env.production

# Build output
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/
EOF
```

## Step 5: Configure Environment Variables

```bash
# Create environment file template
cat > .env << 'EOF'
# Flatfile Environment Configuration
# Get these values from your Flatfile dashboard under "API Keys & Secrets"

FLATFILE_API_KEY=
FLATFILE_ENVIRONMENT_ID=
EOF
```

**Important:** You must manually add your credentials:
1. Log into your Flatfile dashboard
2. Go to "API Keys & Secrets" in the left sidebar
3. Copy your **Secret Key** → paste as `FLATFILE_API_KEY` value
4. Copy your **Environment ID** → paste as `FLATFILE_ENVIRONMENT_ID` value

Example:
```bash
FLATFILE_API_KEY="sk_your_secret_key_here"
FLATFILE_ENVIRONMENT_ID="us_env_your_env_id_here"
```

## Step 6: Install Dependencies and Test

```bash
# Install all project dependencies
npm install

# Start development server
npm run dev
```

**Success indicators:**
- ✅ `Connected to event stream for scope us_env_XXXXXX`
- ✅ `File change detected. 🚀`

## Step 7: Commit Initial Setup

```bash
# Add files to git (excluding .env)
git add .
git commit -m "Initial Flatfile project setup"
git push origin main
```

## Troubleshooting

### Node.js Version Issues
If you get engine warnings, the project expects Node.js 22+:
```bash
# Install Node.js 22 instead
brew uninstall node@20
brew install node@22
# Update PATH in ~/.zshrc to use node@22
```

### npm Install Fails
- **Corporate firewall**: Contact IT to whitelist npm registry
- **Permissions**: Ensure you have proper file permissions in project directory

### Development Server Won't Start
- **Missing credentials**: Verify `.env` file has valid API key and environment ID
- **Port conflicts**: Kill any existing Node.js processes: `pkill node`

### Connection Issues
- **Invalid credentials**: Double-check API key and environment ID from Flatfile dashboard
- **Network restrictions**: Ensure your network allows connections to Flatfile servers

## Next Steps

Once setup is complete, you can:
1. **Develop locally**: Use `npm run dev` to test changes in real-time
2. **Deploy to production**: Use `npm run deploy` to push to Flatfile servers
3. **Add custom logic**: Modify `src/index.ts` to add data validation and transformation
4. **Configure workbooks**: Customize sheet schemas for your data requirements

## Architecture Overview

- **Flatfile Platform**: Handles UI, file parsing, and data storage
- **Your Listener**: Responds to events (file uploads, data changes) with custom logic
- **Local Development**: `npm run dev` runs listener locally against live environment
- **Production Deployment**: `npm run deploy` runs listener on Flatfile's servers

Your listener code handles automated data transformations, validations, and business logic while Flatfile manages the user interface and data persistence.