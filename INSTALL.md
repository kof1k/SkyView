# Інструкція по встановленню WeatherMap на Ubuntu Server

## Вимоги

- Ubuntu Server 20.04 LTS або новіша версія
- Node.js 20.x або новіша версія
- npm або yarn
- Git

## Крок 1: Оновлення системи

```bash
sudo apt update && sudo apt upgrade -y
```

## Крок 2: Встановлення Node.js 20.x

```bash
# Встановлення curl якщо ще не встановлено
sudo apt install -y curl

# Додавання репозиторію NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Встановлення Node.js
sudo apt install -y nodejs

# Перевірка версії
node --version
npm --version
```

## Крок 3: Встановлення Git

```bash
sudo apt install -y git
```

## Крок 4: Клонування репозиторію

```bash
# Створення директорії для додатку
sudo mkdir -p /var/www/weathermap
sudo chown $USER:$USER /var/www/weathermap

# Клонування репозиторію (замініть URL на ваш)
cd /var/www/weathermap
git clone <URL_ВАШОГО_РЕПОЗИТОРІЮ> .

# Або скопіюйте файли вручну
```

## Крок 5: Встановлення залежностей

```bash
cd /var/www/weathermap
npm install
```

## Крок 6: Збірка проекту

```bash
npm run build
```

## Крок 7: Налаштування змінних середовища

```bash
# Створення файлу .env
nano .env
```

Додайте наступне:
```
NODE_ENV=production
PORT=5000
```

## Крок 8: Запуск додатку

### Варіант A: Запуск напряму

```bash
npm start
```

### Варіант B: Запуск через PM2 (рекомендовано)

```bash
# Встановлення PM2 глобально
sudo npm install -g pm2

# Запуск додатку
pm2 start dist/index.cjs --name weathermap

# Автозапуск при перезавантаженні сервера
pm2 startup
pm2 save

# Корисні команди PM2
pm2 status          # Статус додатків
pm2 logs weathermap # Логи
pm2 restart weathermap # Перезапуск
pm2 stop weathermap    # Зупинка
```

## Крок 9: Налаштування Nginx (опціонально)

```bash
# Встановлення Nginx
sudo apt install -y nginx

# Створення конфігурації
sudo nano /etc/nginx/sites-available/weathermap
```

Вміст конфігурації:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Замініть на ваш домен або IP

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активація конфігурації:
```bash
# Створення символічного посилання
sudo ln -s /etc/nginx/sites-available/weathermap /etc/nginx/sites-enabled/

# Перевірка конфігурації
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Крок 10: Налаштування SSL (опціонально)

```bash
# Встановлення Certbot
sudo apt install -y certbot python3-certbot-nginx

# Отримання SSL сертифікату
sudo certbot --nginx -d your-domain.com

# Автоматичне оновлення сертифікату
sudo systemctl enable certbot.timer
```

## Крок 11: Налаштування файрволу

```bash
# Дозвіл HTTP та HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Перевірка роботи

Відкрийте у браузері:
- `http://your-server-ip:5000` (без Nginx)
- `http://your-domain.com` (з Nginx)
- `https://your-domain.com` (з SSL)

## Оновлення додатку

```bash
cd /var/www/weathermap
git pull
npm install
npm run build
pm2 restart weathermap
```

## Вирішення проблем

### Порт 5000 зайнятий
```bash
# Перевірка що займає порт
sudo lsof -i :5000

# Зміна порту в .env файлі
PORT=3000
```

### Помилки дозволів
```bash
sudo chown -R $USER:$USER /var/www/weathermap
```

### Перевірка логів
```bash
pm2 logs weathermap --lines 100
```

---

## Швидкий старт (всі команди разом)

```bash
# Оновлення та встановлення залежностей
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx
sudo npm install -g pm2

# Клонування та збірка
sudo mkdir -p /var/www/weathermap
sudo chown $USER:$USER /var/www/weathermap
cd /var/www/weathermap
git clone <URL_РЕПОЗИТОРІЮ> .
npm install
npm run build

# Запуск
pm2 start dist/index.cjs --name weathermap
pm2 startup
pm2 save

echo "WeatherMap успішно встановлено!"
echo "Відкрийте http://$(hostname -I | awk '{print $1}'):5000"
```
