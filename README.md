# e2e-codecept

Проект e2e-тестов с использованием [CodeceptJS](https://codecept.io/) и [Playwright](https://playwright.dev/) на TypeScript.

---

## ✅ Что реализовано

### 🔹 1. CodeceptJS на TypeScript
- Полная настройка `codecept.conf.ts`, `tsconfig.json`
- Используется Playwright (Chromium) как браузерный движок
- Поддержка `async/await` и строгой типизации

### 🔹 2. Тесты логина
- ✅ Открытие страницы логина
- ❌ Негативный вход с неправильными данными
- ✅ Позитивный вход после регистрации

### 🔹 3. Кастомные шаги `I`
```ts
I.acceptCookiesIfVisible()               // закрывает баннер cookies
I.registerNewUser(name, email, password) // регистрирует и выходит
I.login(email, password)                 // входит
I.logout()                               // безопасно выходит
```

### 🔹 4. CI на GitHub Actions
- Прогоны при `push` и `pull_request` в ветку `master`
- Автоматический запуск ежедневно в 06:00 UTC
- Установка Playwright-браузеров и запуск `npx codeceptjs run`

---

## 📁 Структура проекта

```
e2e-codecept/
├── tests/
│   ├── login_test.ts            # логин-тесты
│   └── register_test.ts         # регистрация (опционально)
├── steps_file.ts                # кастомные шаги I
├── codecept.conf.ts             # конфиг CodeceptJS
├── tsconfig.json                # TypeScript конфиг
├── package.json
└── .github/
    └── workflows/
        └── ci.yml               # GitHub Actions CI
```

---

## 🔄 Что можно сделать дальше

| Задача                         | Результат                                |
|-------------------------------|-------------------------------------------|
| 🛒 Тест оформления заказа      | Полный e2e-проход от регистрации до покупки |
| 📦 Очистка тестовых данных     | Удаление пользователей после теста         |
| 🪄 DataFactory/fixtures        | Централизованное создание данных           |
| 🧪 Параллельный запуск         | Ускорение прогонов                         |
| 🧼 HTML/Viz-репорты            | Красивый отчёт в CI                        |

---

Разработка и сопровождение: ❤️ @borbkin
