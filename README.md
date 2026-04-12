# E2E Testing with CodeceptJS + Playwright

Репозиторий содержит UI e2e-тесты для [automationexercise.com](https://automationexercise.com) на базе CodeceptJS, Playwright, TypeScript и Allure.

[Подробнее обо мне — в ABOUT.md](./ABOUT.md)

## Что есть в проекте

- UI-сценарии на логин и регистрацию
- Page Object слой
- Генерация тестовых данных для пользователей, адресов, товаров и заказов
- API-хелперы для подготовки и очистки пользователей
- Allure-отчеты и артефакты Playwright
- GitHub Actions для запуска тестов и публикации отчета

## Структура

```text
├── .github/workflows/ci.yml
├── src/
│   ├── api/
│   ├── fragments/
│   ├── helpers/
│   ├── pages/
│   ├── tests/
│   └── utils/
├── codecept.conf.ts
├── steps.d.ts
├── steps_file.ts
├── package.json
└── tsconfig.json
```

`output/`, `allure-results/` и `allure-report/` создаются после запусков и не должны коммититься.

В [src/utils/testData.ts](/Users/boris/repos/e2e-codecept/src/utils/testData.ts:1) лежат генераторы для `address`, `product` и `order`, а [src/utils/testUser.ts](/Users/boris/repos/e2e-codecept/src/utils/testUser.ts:1) использует адресный builder повторно.

## Установка

```bash
npm ci
npx playwright install --with-deps
```

## Команды

```bash
npm test
npm run test:headed
npm run test:smoke
npm run test:smoke:headed
npm run test:auth
npm run test:regression
npm run test:allure
npm run lint
npm run typecheck
npm run list
```

## Теги и профили запуска

- `@smoke` — быстрый критичный набор для PR и локальной проверки
- `@regression` — полный текущий UI-набор
- `@auth` — все сценарии, связанные с логином, регистрацией, logout и удалением аккаунта

Примеры:

```bash
npm run test:smoke
npm run test:auth
npm run test:regression
```

## Локальная отладка

Headed-режим:

```bash
npm run test:headed
```

Playwright Inspector:

```bash
PWDEBUG=1 npx codeceptjs run --plugins allure --steps
```

Запуск одного файла:

```bash
npx codeceptjs run src/tests/positive_login_test.ts
```

## CI

Workflow [`.github/workflows/ci.yml`](./.github/workflows/ci.yml):

- запускается при `push` и `pull_request` в `master`
- запускается по расписанию каждый день в 12:00 по Москве
- на `pull_request` гоняет быстрый `smoke`-профиль
- на `pull_request`, `push` в `master` и по расписанию гоняет полный `regression`-профиль
- сохраняет артефакты при падениях
- для полного прогона генерирует и публикует Allure-отчет на GitHub Pages

Последний опубликованный отчет: [borbkin.github.io/e2e-codecept](https://borbkin.github.io/e2e-codecept/)
