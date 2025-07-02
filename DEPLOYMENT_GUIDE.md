# DECARBONIZE.world Deployment Rehberi

Bu rehber, DECARBONIZE.world platformunu kendi sunucunuza veya hosting sağlayıcınıza nasıl deploy edeceğinizi adım adım açıklar.

## 📋 Gereksinimler

### Minimum Sistem Gereksinimleri
- **Node.js**: v18.0.0 veya üzeri
- **npm**: v8.0.0 veya üzeri
- **RAM**: En az 2GB
- **Disk**: En az 10GB boş alan
- **Bandwidth**: Aylık en az 100GB

### Önerilen Hosting Sağlayıcıları
1. **Netlify** (Ücretsiz/Ücretli)
2. **Vercel** (Ücretsiz/Ücretli)
3. **GitHub Pages** (Ücretsiz)
4. **AWS S3 + CloudFront** (Ücretli)
5. **DigitalOcean** (Ücretli)

## 🚀 Deployment Seçenekleri

### Seçenek 1: Netlify (Önerilen - En Kolay)

#### Adım 1: Netlify Hesabı Oluşturun
1. [netlify.com](https://netlify.com) adresine gidin
2. "Sign up" butonuna tıklayın
3. GitHub, GitLab veya e-posta ile hesap oluşturun

#### Adım 2: Projeyi GitHub'a Yükleyin
```bash
# Yeni bir GitHub repository oluşturun
# Projeyi klonlayın veya indirin
git clone [PROJE_URL]
cd decarbonize-platform

# Bağımlılıkları yükleyin
npm install

# Build alın
npm run build

# GitHub'a push edin
git add .
git commit -m "Initial deployment"
git push origin main
```

#### Adım 3: Netlify'da Deploy Edin
1. Netlify dashboard'a gidin
2. "New site from Git" butonuna tıklayın
3. GitHub'ı seçin ve repository'nizi bulun
4. Build ayarları:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. "Deploy site" butonuna tıklayın

#### Adım 4: Domain Ayarları (Opsiyonel)
1. Site settings > Domain management
2. "Add custom domain" ile kendi domain'inizi ekleyin
3. DNS ayarlarını yapın

### Seçenek 2: Vercel

#### Adım 1: Vercel CLI Kurulumu
```bash
npm install -g vercel
```

#### Adım 2: Deploy
```bash
# Proje dizininde
vercel

# İlk defa deploy ediyorsanız:
# - Vercel hesabınızla giriş yapın
# - Proje ayarlarını onaylayın
# - Deploy işlemi otomatik başlar
```

### Seçenek 3: GitHub Pages

#### Adım 1: GitHub Actions Workflow
`.github/workflows/deploy.yml` dosyası oluşturun:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### Adım 2: Repository Ayarları
1. GitHub repository > Settings > Pages
2. Source: "Deploy from a branch"
3. Branch: "gh-pages"
4. Folder: "/ (root)"

### Seçenek 4: Kendi Sunucunuz (VPS/Dedicated)

#### Adım 1: Sunucu Hazırlığı
```bash
# Ubuntu/Debian için
sudo apt update
sudo apt install nginx nodejs npm git

# Node.js'i güncelleyin
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Adım 2: Proje Kurulumu
```bash
# Projeyi klonlayın
git clone [PROJE_URL] /var/www/decarbonize
cd /var/www/decarbonize

# Bağımlılıkları yükleyin
npm install

# Production build alın
npm run build

# Dosya izinlerini ayarlayın
sudo chown -R www-data:www-data /var/www/decarbonize
sudo chmod -R 755 /var/www/decarbonize
```

#### Adım 3: Nginx Konfigürasyonu
`/etc/nginx/sites-available/decarbonize` dosyası oluşturun:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    root /var/www/decarbonize/dist;
    index index.html;
    
    # SPA routing için
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static dosyalar için cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

#### Adım 4: SSL Sertifikası (Let's Encrypt)
```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası alın
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Otomatik yenileme
sudo crontab -e
# Şu satırı ekleyin:
0 12 * * * /usr/bin/certbot renew --quiet
```

#### Adım 5: Nginx'i Başlatın
```bash
# Site'ı aktif edin
sudo ln -s /etc/nginx/sites-available/decarbonize /etc/nginx/sites-enabled/

# Nginx'i test edin
sudo nginx -t

# Nginx'i yeniden başlatın
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## 🔧 Çevre Değişkenleri (Environment Variables)

Deployment öncesi aşağıdaki çevre değişkenlerini ayarlayın:

### Netlify/Vercel için
Site settings > Environment variables bölümünden ekleyin:

```
VITE_API_URL=https://api.your-domain.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_WALLET_CONNECT_PROJECT_ID=your-walletconnect-id
VITE_ENVIRONMENT=production
```

### VPS için
`.env.production` dosyası oluşturun:

```bash
# .env.production
VITE_API_URL=https://api.your-domain.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_WALLET_CONNECT_PROJECT_ID=your-walletconnect-id
VITE_ENVIRONMENT=production
```

## 🔒 Güvenlik Ayarları

### 1. HTTPS Zorunlu
```nginx
# HTTP'den HTTPS'e yönlendirme
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 2. Security Headers
```nginx
# Nginx'e güvenlik header'ları ekleyin
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 3. Rate Limiting
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20 nodelay;
}
```

## 📊 Monitoring ve Analytics

### 1. Google Analytics
`index.html` dosyasına ekleyin:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Error Tracking (Sentry)
```bash
npm install @sentry/react @sentry/tracing
```

### 3. Performance Monitoring
```bash
# Web Vitals
npm install web-vitals
```

## 🔄 Otomatik Deployment

### GitHub Actions ile CI/CD
`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /var/www/decarbonize
          git pull origin main
          npm ci
          npm run build
          sudo systemctl reload nginx
```

## 🐛 Troubleshooting

### Yaygın Sorunlar ve Çözümleri

#### 1. Build Hatası
```bash
# Node modules'ı temizleyin
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. Routing Sorunları (404 Hatası)
SPA routing için server konfigürasyonunu kontrol edin.

#### 3. Environment Variables Yüklenmiyor
- Değişken adlarının `VITE_` ile başladığından emin olun
- Build işlemini yeniden çalıştırın

#### 4. SSL Sertifikası Sorunları
```bash
# Certbot loglarını kontrol edin
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Sertifikayı yenileyin
sudo certbot renew --dry-run
```

## 📞 Destek

Deployment sırasında sorun yaşarsanız:

1. **Dokümantasyon**: Bu rehberi tekrar okuyun
2. **Loglar**: Browser console ve server loglarını kontrol edin
3. **Community**: GitHub Issues bölümünde sorun bildirin
4. **E-posta**: support@decarbonize.world

## 🎉 Deployment Sonrası

Deployment tamamlandıktan sonra:

1. ✅ Tüm sayfaların çalıştığını kontrol edin
2. ✅ Responsive tasarımı test edin
3. ✅ Form gönderimlerini test edin
4. ✅ SSL sertifikasını kontrol edin
5. ✅ Performance testleri yapın
6. ✅ SEO ayarlarını kontrol edin

**Tebrikler! 🎊 DECARBONIZE.world platformunuz artık canlıda!**