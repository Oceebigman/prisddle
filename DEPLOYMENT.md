# Prisddle Deployment Guide

## Server Setup

Ubuntu 22.04 LTS with Node.js 18+, Nginx, and PM2

### Quick Start

1. Install dependencies: `npm install`
2. Configure environment: `cp .env.example .env`
3. Start with PM2: `npm run prod`
4. Configure Nginx as reverse proxy
5. Set up SSL with Let's Encrypt

### Directory Structure
### Nginx Configuration

Place `nginx.conf` in `/etc/nginx/sites-available/prisddle`

### PM2 Management

- Start: `pm2 start ecosystem.config.js --env production`
- Monitor: `pm2 monit`
- Logs: `pm2 logs`
- Restart: `pm2 restart prisddle`

## SSL/TLS

Use Let's Encrypt for free certificates:

```bash
sudo certbot certonly --nginx -d prisddle.com
```

## Monitoring

PM2 provides built-in monitoring. Use `pm2 plus` for advanced features.
