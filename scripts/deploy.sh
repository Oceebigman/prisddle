#!/bin/bash
cd /var/www/prisddle
git fetch origin
git reset --hard origin/main
npm install --production
pm2 reload prisddle
echo "Deployment completed at $(date)" >> /var/www/prisddle/logs/deployments.log
