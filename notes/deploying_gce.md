
1. set up a new server on google compute engine. choose ubuntu as the operating system.

2. ssh into your new server:
```
  ssh your_username@your_server_ip` 
```
or 
use the google cloud interface (easier for scaredycats)
((its okay to be a scaredycat))

3. update your server's package lists:
```
  sudo-apt-get update
```

4. install node.js and npm:
```
   curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
   sudo apt-get install -y nodejs
```

5. clone your vue app:
```
   git clone https://github.com/your_username/your_vue_app.git
```

6. build your vue app:
```
   cd your_vue_app
   npm install
   npm run build
```

7. install nginx:
```
   sudo apt-get install nginx
```

8. configure nginx to serve your vue app. open the default nginx configuration file:
```
   sudo nano /etc/nginx/sites-available/default
```

and replace the existing server block with:
```
   server {
       listen 80;
       server_name cogmate.app your_server_ip;

       location / {
           root /path/to/your/vue/app/dist;
           try_files $uri $uri/ /index.html;
       }
   }
```
save and close the file, then restart nginx:
```
   sudo systemctl restart nginx
```

9. register a domain (like cogmate.app) with a domain registrar (like Namecheap).

10. set up DNS records to point your domain at your server's IP address. in Namecheap, create a new A record with host @ and value your_server_ip.

11. wait for DNS propagation. this can take up to 48 hours, but is often much faster.

12. install certbot:
```
    sudo apt-get install certbot python3-certbot-nginx
```

13. get an SSL certificate from Let's Encrypt:
```
    sudo certbot --nginx -d cogmate.app
```
when asked if you want to redirect http traffic to https, choose 'yes'.

14. set up auto-renewal for your SSL certificate:
```
    sudo certbot renew --dry-run
```













- we've set up a vue.js frontend on a google compute engine ubuntu server, accessible at https://cogmate.app and the server's IP address.
- the frontend is secured with an SSL certificate from Let's Encrypt, installed using certbot.
- nginx is installed on the server and configured to serve the frontend and handle SSL.
- the frontend communicates with a fastapi python backend via both HTTP POST requests and websockets. the backend is currently running on a separate server, but we're planning to move it to the same server as the frontend.
- the frontend and backend are on different origins (different IP addresses), but we haven't run into any CORS issues yet, likely because websockets handle cross-origin connections differently than HTTP/HTTPS.
- we've been creating "checkpoint" machine images in google compute engine as we go along, to save our progress and allow us to quickly revert back if needed.

next steps are to deploy the fastapi backend on the same server, update the frontend to point to the new backend location, and possibly configure nginx to proxy requests to the backend. we'll also need to keep an eye out for any potential CORS issues as we make these changes.