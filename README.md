# Flatfile QGenda Integration

## Overview
This project integrates Flatfile with QGenda, allowing for seamless data handling and transformation. It sets up a listener that responds to file uploads and data changes, configured specifically for QGenda data.

## Prerequisites
- Node.js (LTS version 20 or higher)
- npm (Node package manager)
- Access to Flatfile dashboard for API keys and environment ID

## Setup Instructions

### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/YOUR_ORG/flatfile-qgenda.git
cd flatfile-qgenda
```

### 2. Install Dependencies
Install the required dependencies using npm:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file based on the provided template and fill in your Flatfile credentials:
```bash
FLATFILE_API_KEY="your_secret_key_here"
FLATFILE_ENVIRONMENT_ID="your_env_id_here"
```

### 4. Start Development Server
Run the development server to start listening for events:
```bash
npm run dev
```

### 5. Deploy to Production
When ready, deploy your listener to Flatfile servers:
```bash
npm run deploy
```

## Project Structure
- **src/index.ts**: Contains the main listener logic and configuration for the Flatfile integration.
- **.env**: Environment variable template for Flatfile API keys.
- **.gitignore**: Specifies files and directories to be ignored by Git.
- **package.json**: Project metadata and dependencies.
- **tsconfig.json**: TypeScript configuration settings.

## Troubleshooting
- Ensure Node.js and npm are installed correctly.
- Verify that the `.env` file contains valid credentials.
- Check for any port conflicts if the development server does not start.

## Next Steps
- Customize the listener logic in `src/index.ts` to handle specific data transformations.
- Explore additional Flatfile plugins to enhance functionality.

For more information, refer to the Flatfile documentation.