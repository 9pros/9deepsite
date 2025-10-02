# Cloudflare Pages Setup Guide

This guide will walk you through setting up Cloudflare Pages to deploy websites with wildcard *.9gent.com subdomains.

## Prerequisites

1. A Cloudflare account (free tier works)
2. Access to the 9gent.com domain in Cloudflare
3. Admin permissions to create API tokens

## Step 1: Domain Setup

### 1.1 Add Domain to Cloudflare
1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click "Add a Site" and enter `9gent.com`
3. Choose your plan (Free works fine)
4. Update nameservers at your domain registrar to point to Cloudflare

### 1.2 Set Up Wildcard DNS
1. Go to **DNS** > **Records**
2. Add a new record:
   - **Type**: `A` or `CNAME`
   - **Name**: `*` (this creates the wildcard)
   - **Content**: `192.0.2.1` (placeholder IP, will be overridden by Pages)
   - **Proxy status**: ✅ Proxied (orange cloud)
3. Click **Save**

## Step 2: Create API Token

### 2.1 Generate API Token
1. Go to **My Profile** > **API Tokens**
2. Click **Create Token**
3. Use **Custom token** template
4. Configure permissions:
   - **Account**: `Cloudflare Pages:Edit`
   - **Zone**: `Zone Settings:Read`
   - **Zone**: `DNS:Edit`
5. **Account Resources**: Include your account
6. **Zone Resources**: Include `9gent.com`
7. Click **Continue to summary** > **Create Token**
8. **Copy the token** (you won't see it again!)

### 2.2 Get Account ID
1. In Cloudflare Dashboard, go to the right sidebar
2. Copy your **Account ID** from the API section

## Step 3: Environment Variables

### 3.1 Update Your .env File
Add these variables to your `.env` file:

```bash
# Cloudflare Pages Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here
```

Replace:
- `your_account_id_here` with your Account ID from Step 2.2
- `your_api_token_here` with your API Token from Step 2.1

## Step 4: Test the Setup

### 4.1 Create a Test Deployment
1. Start your development server: `npm run dev`
2. Create a simple website in the editor
3. Click the **Publish your Project** button
4. Choose **Deploy to Cloudflare**
5. Enter:
   - **Website title**: "Test Site"
   - **Subdomain**: "test" (will create test.9gent.com)
6. Click **Deploy to Cloudflare**

### 4.2 Verify Deployment
1. Check the deployment succeeds without errors
2. Visit `https://test.9gent.com` to see your site
3. Verify SSL certificate is working (🔒 in browser)

## Step 5: Domain Verification (Important!)

### 5.1 Verify Wildcard Domain Setup
After your first deployment, check in Cloudflare:

1. Go to **Pages** in your Cloudflare dashboard
2. Find your project (named like `9gent-test`)
3. Go to **Custom domains**
4. Verify `test.9gent.com` is listed and active

### 5.2 DNS Propagation
- DNS changes can take up to 24 hours to propagate globally
- Use [DNS Checker](https://dnschecker.org) to verify propagation
- Test from different locations/devices

## Step 6: Advanced Configuration (Optional)

### 6.1 Custom Error Pages
1. Go to **Pages** > Your Project > **Settings**
2. Configure custom 404/500 pages if needed

### 6.2 Security Headers
1. Go to **Security** > **Headers**
2. Add security headers like:
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`

### 6.3 Analytics
1. Enable **Web Analytics** in your Cloudflare dashboard
2. Add the analytics script to your pages

## Troubleshooting

### Common Issues

**"Project creation failed"**
- Verify API token has correct permissions
- Check Account ID is correct
- Ensure domain is added to Cloudflare

**"Domain not found"**
- Verify 9gent.com is in your Cloudflare account
- Check wildcard DNS record exists
- Wait for DNS propagation

**"SSL Certificate Error"**
- Wait 15-30 minutes for SSL provisioning
- Verify domain is proxied (orange cloud) in DNS

**"Subdomain already taken"**
- Choose a different subdomain
- Check if you previously deployed with that name

### API Token Permissions Checklist
Your API token needs these permissions:
- ✅ **Account**: Cloudflare Pages:Edit
- ✅ **Zone**: Zone Settings:Read
- ✅ **Zone**: DNS:Edit
- ✅ **Account Resources**: Include your account
- ✅ **Zone Resources**: Include 9gent.com

### Testing API Access
Test your API token with curl:

```bash
curl -X GET "https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/pages/projects" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"
```

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify environment variables are set correctly
3. Test API token permissions
4. Check Cloudflare audit logs for API errors
5. Ensure DNS propagation is complete

## Security Notes

- **Never commit API tokens to version control**
- Rotate API tokens regularly
- Use least-privilege permissions
- Monitor API usage in Cloudflare dashboard

## Limits

### Cloudflare Free Tier Limits
- 1 build at a time
- 500 deployments per month
- 100 custom domains per project
- 20,000 files per deployment

### Pages Deployment Limits
- 25MB max file size
- 20,000 files max per deployment
- 300 seconds build timeout

---

**Success!** 🎉 Your Cloudflare Pages deployment should now be working with wildcard *.9gent.com subdomains.