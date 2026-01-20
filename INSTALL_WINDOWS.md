# Інструкція по встановленню SkyView на Windows

## Вимоги

- Windows 10/11
- Node.js 20.x або новіша версія
- Git (опціонально)

## Крок 1: Встановлення Node.js

1. Завантажте Node.js з офіційного сайту: https://nodejs.org/
2. Виберіть версію **LTS** (рекомендовано)
3. Запустіть інсталятор та слідуйте інструкціям
4. Перезавантажте комп'ютер після встановлення

### Перевірка встановлення

Відкрийте **PowerShell** або **Command Prompt** та виконайте:

```powershell
node --version
npm --version
```

## Крок 2: Завантаження проекту

### Варіант A: Через Git

```powershell
# Встановіть Git з https://git-scm.com/download/win якщо ще не встановлено

# Клонування репозиторію
git clone <URL_ВАШОГО_РЕПОЗИТОРІЮ> C:\SkyView
cd C:\SkyView
```

### Варіант B: Завантаження ZIP

1. Завантажте ZIP архів з репозиторію
2. Розпакуйте в папку `C:\SkyView`
3. Відкрийте PowerShell в цій папці

## Крок 3: Встановлення залежностей

```powershell
cd C:\SkyView
npm install
```

## Крок 4: Створення конфігурації

Створіть файл `.env` в корені проекту:

```powershell
# Створення файлу .env
echo NODE_ENV=production > .env
echo PORT=5000 >> .env
```

Або створіть файл вручну з вмістом:
```
NODE_ENV=production
PORT=5000
```

## Крок 5: Збірка проекту

```powershell
npm run build
```

## Крок 6: Запуск додатку

### Для розробки (development mode)

```powershell
npm run dev
```

### Для продакшену (production mode)

```powershell
npm start
```

Додаток буде доступний за адресою: http://localhost:5000

## Автозапуск при старті Windows

### Варіант A: Через PM2

```powershell
# Встановлення PM2
npm install -g pm2
npm install -g pm2-windows-startup

# Налаштування автозапуску
pm2-startup install

# Запуск додатку
pm2 start dist/index.cjs --name skyview

# Збереження конфігурації
pm2 save
```

### Варіант B: Створення BAT файлу

Створіть файл `start-skyview.bat`:

```batch
@echo off
cd /d C:\SkyView
node dist/index.cjs
pause
```

Для автозапуску:
1. Натисніть `Win + R`
2. Введіть `shell:startup`
3. Скопіюйте ярлик на `start-skyview.bat` в цю папку

### Варіант C: Як Windows Service (через NSSM)

```powershell
# Завантажте NSSM з https://nssm.cc/download

# Встановлення як сервіс
nssm install SkyView "C:\Program Files\nodejs\node.exe" "C:\SkyView\dist\index.cjs"
nssm set SkyView AppDirectory "C:\SkyView"
nssm set SkyView Start SERVICE_AUTO_START

# Запуск сервісу
nssm start SkyView
```

## Доступ з інших пристроїв у мережі

1. Дізнайтеся IP адресу комп'ютера:
```powershell
ipconfig
```

2. Відкрийте порт 5000 у Windows Firewall:
```powershell
# Запустіть PowerShell як адміністратор
netsh advfirewall firewall add rule name="SkyView" dir=in action=allow protocol=tcp localport=5000
```

3. Відкрийте в браузері: `http://<ваш-IP>:5000`

## Вирішення проблем

### Порт 5000 зайнятий

```powershell
# Перевірка що займає порт
netstat -ano | findstr :5000

# Змініть PORT в файлі .env на інший (наприклад 3000)
```

### Помилка EACCES або доступу

Запустіть PowerShell як адміністратор.

### Помилка node не знайдено

1. Перевірте що Node.js встановлено
2. Додайте Node.js до PATH:
   - Пошук → "Змінні середовища"
   - Змінна `Path` → Додати `C:\Program Files\nodejs\`

### Помилка при npm install

```powershell
# Очистка кешу
npm cache clean --force

# Видалення node_modules та повторна інсталяція
Remove-Item -Recurse -Force node_modules
npm install
```

## Оновлення додатку

```powershell
cd C:\SkyView

# Якщо використовуєте Git
git pull

# Перевстановлення залежностей та збірка
npm install
npm run build

# Перезапуск (якщо використовуєте PM2)
pm2 restart skyview
```

---

## Швидкий старт (всі команди)

```powershell
# Встановлення (виконати один раз)
cd C:\SkyView
npm install
npm run build

# Запуск
npm start

# Відкрийте http://localhost:5000
```

## Корисні посилання

- Node.js: https://nodejs.org/
- Git для Windows: https://git-scm.com/download/win
- PM2: https://pm2.keymetrics.io/
- NSSM: https://nssm.cc/
