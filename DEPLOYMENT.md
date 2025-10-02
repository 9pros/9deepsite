# Deploying DeepSite to 9gent.com via Cloudflare Pages

## Method 1: GitHub Integration (Recommended)

1. **Go to Cloudflare Dashboard**
   - Navigate to https://dash.cloudflare.com/
   - Select your account with ID: `6d4073c1d8c3841422a19a0f91e50906`

2. **Create New Pages Project**
   - Go to "Pages" in the left sidebar
   - Click "Create a project"
   - Select "Connect to Git"
   - Choose "GitHub" and authorize if needed
   - Select repository: `9pros/9deepsite`
   - Choose branch: `main` (or `leadgen` if you want to deploy current work)

3. **Build Configuration**
   ```
   Framework preset: Next.js (SSR)
   Build command: npm run build
   Build output directory: .next
   Root directory: (leave empty)
   Node.js version: 18.20.8
   ```

4. **Environment Variables**
   Add these in Cloudflare Pages settings:
   ```
   # Mark as serverless environment
   CLOUDFLARE_PAGES=true

   # AI API Configuration (use cloud services instead of localhost)
   LLAMA_API_URL=https://api.llama.com/v1
   LLAMA_API_KEY=your_llama_api_key_here

   # Database (optional - use cloud MongoDB or remove for static deployment)
   # MONGODB_URI=mongodb+srv://your-cloud-mongodb-uri

   # Rate limiting
   MAX_REQUESTS_PER_IP=100

   # Cloudflare configuration (for deployment features)
   CLOUDFLARE_ACCOUNT_ID=6d4073c1d8c3841422a19a0f91e50906
   CLOUDFLARE_API_TOKEN=v9HX-Ex1dPDb-Tnaji83F7Y_EjhDpVerSscPGFsi
   ```

5. **Custom Domain Setup**
   - After deployment, go to "Custom domains" in your Pages project
   - Add custom domain: `9gent.com`
   - Cloudflare will automatically configure DNS

## Method 2: Direct Upload via API

If you prefer to deploy directly from your local machine:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
npm run build

# Deploy to Pages
wrangler pages deploy .next --project-name=deepsite-main --compatibility-date=2024-01-01
```

## Build Configuration for Cloudflare Pages

Create `wrangler.toml` in project root:

```toml
name = "deepsite-main"
compatibility_date = "2024-01-01"

[env.production]
name = "deepsite-main"

[[env.production.routes]]
pattern = "9gent.com/*"
zone_name = "9gent.com"
```

## Important Notes

1. **Environment Variables**: Make sure to add all necessary environment variables in Cloudflare Pages settings
2. **Build Settings**: Use Next.js framework preset for automatic configuration
3. **Branch**: Deploy from `main` branch for production, or `leadgen` for testing
4. **Domain**: After deployment, configure `9gent.com` as custom domain in Pages settings

## Automatic Deployments

Once connected to GitHub, Cloudflare will automatically:
- Deploy on every push to main branch
- Create preview deployments for pull requests
- Handle SSL certificates automatically
- Configure CDN and edge locations globally