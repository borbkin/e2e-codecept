# 🧪 E2E Testing with CodeceptJS + Playwright

Этот проект содержит end-to-end тесты для [automationexercise.com](https://automationexercise.com) с использованием CodeceptJS, Playwright и Allure-отчётов.

📌 [Подробнее обо мне — см. ABOUT.md](./ABOUT.md)

## 📁 Структура проекта

```
├── .github/workflows/        # CI: запуск тестов, генерация отчётов, деплой на GitHub Pages
├── src/
│   ├── pages/                # Page Object'ы
│   ├── tests/                # UI-тесты
│   ├── api/                  # API-клиенты
│   └── utils/                # Генераторы данных и вспомогательные утилиты
│
├── output/                  # Скриншоты, видео и трейсы (после запуска)
├── allure-report/           # Статический отчёт Allure (деплоится на GitHub Pages)
├── allure-results/          # Результаты для генерации отчёта
├── codecept.conf.ts         # Основной конфиг CodeceptJS
├── steps_file.ts            # Кастомные шаги
└── README.md
```

## 🚀 Основной стек

* [CodeceptJS](https://codecept.io) + [Playwright helper](https://codecept.io/helpers/Playwright/)
* TypeScript
* [Allure reporter](https://docs.qameta.io/allure/)
* GitHub Actions (CI/CD)

## ✅ Что уже реализовано

* UI-тесты на регистрацию и логин
* Page Object паттерн
* Генерация тестовых данных
* API-хелперы для подготовки и очистки данных
* Запуск в CI (headless)
* Allure-отчёты: [открыть последний отчёт](https://borbkin.github.io/e2e-codecept/)
* Автоматическое удаление тестовых пользователей через API

## 🛠 Как запускать

### Установка зависимостей

```bash
npm ci
npx playwright install --with-deps
```

### Локальный запуск тестов

```bash
npx codeceptjs run --plugins allure --steps
```

### Просмотр отчёта Allure

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

### Список всех тестов

```bash
npx codeceptjs list
```

### Запуск только одного теста

```bash
npx codeceptjs run src/tests/positive_login_test.ts
```

## 🤖 CI / GitHub Actions

Автоматически запускаются:

* при пуше в `master`
* по расписанию (ежедневно в 12:00 по МСК)

CI делает следующее:

* устанавливает зависимости
* запускает браузеры
* выполняет e2e-тесты
* собирает отчёт Allure
* публикует его на GitHub Pages
* добавляет ссылку в summary билда

## 📌 Полезные команды

* Открыть Playwright Inspector:

```bash
PWDEBUG=1 npx codeceptjs run
```

* Запустить в режиме headed:

```bash
HEADLESS=false npx codeceptjs run
```

## 🔭 Планы на будущее

* [ ] Нефункциональное тестирование (нагрузка, консольные ошибки, логирование)
* [ ] Тесты мобильной версии сайта
* [ ] API-тесты на Go (в отдельной папке)
* [ ] Расширение отчётов: severity, epic, story, issue
* [ ] Визуальные регрессии и тестирование доступности
---

> 🚧 Проект живой. Новые виды тестов и CI-интеграции добавляются по мере развития.