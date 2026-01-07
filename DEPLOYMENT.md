# Deployment Guide

This guide explains how to deploy the Personal Website MCP Server to production.

## Prerequisites

- A hosting platform account (Railway, Render, Fly.io, or similar)
- Git repository access
- Domain name configured (optional but recommended)

## Deployment Options

### Option 1: Railway

Railway provides an easy deployment with automatic HTTPS.

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login to Railway:**
```bash
railway login
```

3. **Initialize Railway project:**
```bash
railway init
```

4. **Configure environment:**
```bash
railway run npm install
railway run npm run build
```

5. **Deploy:**
```bash
railway up
```

6. **Get the deployment URL:**
   - Go to Railway dashboard
   - Find your service URL (e.g., `https://your-app.railway.app`)
   - Your MCP endpoint will be at the root when using stdio transport

### Option 2: Render

Render offers free tier with automatic deployments from Git.

1. **Create a new Web Service on Render:**
   - Connect your GitHub repository
   - Choose "Node" as the environment

2. **Configure build settings:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Add health check endpoint (optional):**
   - For HTTP-based deployments, add a simple health check route

4. **Deploy:**
   - Render will automatically deploy on every git push

### Option 3: Fly.io

Fly.io provides edge deployment with global presence.

1. **Install flyctl:**
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login to Fly.io:**
```bash
flyctl auth login
```

3. **Create a Fly app:**
```bash
flyctl launch
```

4. **Configure fly.toml:**
```toml
app = "personal-website-mcp"

[build]
  builder = "heroku/buildpacks:20"

[deploy]
  release_command = "npm run build"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

5. **Deploy:**
```bash
flyctl deploy
```

### Option 4: Custom VPS (DigitalOcean, Linode, AWS EC2, etc.)

For more control, deploy to your own VPS.

1. **SSH into your server:**
```bash
ssh user@your-server-ip
```

2. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone your repository:**
```bash
git clone https://github.com/pmcbride/chatgpt-apps-sdk-example.git
cd chatgpt-apps-sdk-example
```

4. **Install dependencies and build:**
```bash
npm install
npm run build
```

5. **Set up PM2 for process management:**
```bash
npm install -g pm2
pm2 start dist/server.js --name personal-website-mcp
pm2 save
pm2 startup
```

6. **Configure Nginx as reverse proxy (optional):**
```nginx
server {
    listen 80;
    server_name mcp.pmmcbride.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Set up SSL with Let's Encrypt:**
```bash
sudo certbot --nginx -d mcp.pmmcbride.com
```

## Environment Variables

If needed, configure environment variables for your deployment:

```bash
NODE_ENV=production
WEBSITE_URL=https://pmmcbride.com
MCP_API_URL=https://mcp.pmmcbride.com
```

## Post-Deployment

### 1. Test the deployment

```bash
# Test that the server is running
curl https://your-deployment-url/health

# Test with MCP inspector
npx @modelcontextprotocol/inspector <your-deployment-url>
```

### 2. Configure in ChatGPT

1. Go to ChatGPT Settings → Connectors
2. Add a new connector
3. Enter your MCP endpoint URL
4. Test the connection

### 3. Monitor the deployment

Set up monitoring and logging:
- Railway/Render provide built-in logging
- For custom deployments, use PM2 logs: `pm2 logs personal-website-mcp`
- Set up error tracking (e.g., Sentry)

## Updating the Deployment

### For Railway/Render:
Just push to your Git repository, and the platform will auto-deploy.

### For Fly.io:
```bash
flyctl deploy
```

### For Custom VPS:
```bash
cd chatgpt-apps-sdk-example
git pull
npm install
npm run build
pm2 restart personal-website-mcp
```

## Rollback

If something goes wrong:

### Railway/Render:
Use the platform's rollback feature in the dashboard

### Custom VPS:
```bash
git checkout <previous-commit-hash>
npm install
npm run build
pm2 restart personal-website-mcp
```

## Security Considerations

1. **Use HTTPS:** Always deploy with HTTPS enabled
2. **Environment Variables:** Store sensitive data in environment variables, not in code
3. **Rate Limiting:** Consider adding rate limiting for production
4. **CORS:** Configure CORS appropriately for your domain
5. **Authentication:** Add authentication if your tools require it
6. **Input Validation:** Validate all user inputs
7. **Keep Dependencies Updated:** Regular `npm audit` and updates

## Troubleshooting

### Server won't start
- Check logs for errors
- Verify all dependencies are installed
- Ensure Node.js version is 18+

### Can't connect from ChatGPT
- Verify the URL is correct and accessible
- Check that HTTPS is working
- Ensure CORS is configured properly
- Check firewall settings

### Tools not working
- Check server logs for errors
- Verify website URL is accessible
- Test tools locally first

## Cost Estimates

- **Railway:** Free tier available, paid plans start at $5/month
- **Render:** Free tier available, paid plans start at $7/month
- **Fly.io:** Free tier available, paid plans start at $1.94/month
- **DigitalOcean Droplet:** Starting at $6/month
- **AWS EC2:** Variable, t2.micro eligible for free tier

## Domain Configuration

To use a custom domain like `mcp.pmmcbride.com`:

1. Add a CNAME or A record in your DNS settings
2. Point it to your deployment URL
3. Configure SSL/TLS certificate
4. Update the domain in your ChatGPT connector settings

## Support

For deployment issues:
- Check platform-specific documentation
- Review server logs
- Test locally first with the test script
- Consult the MCP SDK documentation
