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

## Профили окружения

`TEST_PROFILE` выбирает профиль `local`, `ci` или `mobile`. Без значения
используется `ci`, если `CI=true`, иначе `local`. `local` запускается в headed
режиме, `ci` и `mobile` — headless; явный `HEADLESS=true` или `HEADLESS=false`
имеет приоритет в любом профиле. `BASE_URL` задаёт адрес сайта (по умолчанию
`https://automationexercise.com`) и может включать путь, например
`https://test.example/shop/`. API, навигация и ожидания URL используют этот адрес.

| Профиль | Браузер | Эмуляция | Запуск |
| --- | --- | --- | --- |
| `local` | Chromium | Окно 1200×900 | `npm run test:headed` |
| `ci` | Chromium | Нет | `npm test` |
| `mobile` | Chromium | Playwright Pixel 7, touch | `npm run test:mobile` |

`npm run test:mobile:headed` открывает эмуляцию Pixel 7 в headed режиме.
Устройство можно переопределить через `MOBILE_DEVICE`, указав имя известного
Playwright устройства с Chromium и мобильной touch-эмуляцией. Это эмуляция
Chromium, а не запуск Safari. `npm run list:mobile` показывает выбранные тесты
без обращения к сайту. Проверки парсера и конфигурации также офлайн:
`npm run test:config`.

Мобильный smoke также запускается в CI заданием `mobile` после успешного
полного desktop-прогона. Диагностические артефакты имеют отдельное имя
`playwright-output-mobile`; глобальный Allure-отчёт остаётся desktop-отчётом.

## CI

Auth-тесты блокируют только рекламные и опросные домены из CI HAR
через `src/helpers/NetworkIsolation.ts` до открытия страниц. Это исключает
Google-опросы и рекламные оверлеи из проверки авторизации; запросы сайта,
API и загрузка шрифтов остаются настоящими. Проверка фильтра и его работы
в браузере: `npm run test:network`.

Навигация ожидает получения документа (`commit`), затем тест проверяет нужный URL
и элементы формы. Клики с переходом используют `noWaitAfter`: загрузка сторонних
ресурсов не задерживает проверку результата действия. API-запросы имеют таймаут
30 секунд (`API_TIMEOUT_MS` для переопределения); очистка допускает ответ
`Account not found`, если аккаунт уже удалён.

CI устанавливает только Chromium, используемый набором тестов.
Открытие страницы авторизации повторяет только GET с HTTP 503: максимум
3 попытки с паузами 1 и 2 секунды. Постоянная недоступность и другие HTTP-ошибки
приводят к падению; отправка форм не повторяется. Тестовые email используют
UUID, независимый от seed Faker, чтобы параллельные запуски не делили аккаунты.
Проверка этих случаев: `npm run test:reliability`.

Workflow [`.github/workflows/ci.yml`](./.github/workflows/ci.yml):

- запускается при `push` и `pull_request` в `master`
- запускается по расписанию каждый день в 12:00 по Москве
- на `pull_request` гоняет быстрый `smoke`-профиль
- на `pull_request`, `push` в `master` и по расписанию гоняет полный `regression`-профиль
- сохраняет артефакты при падениях
- для полного прогона генерирует и публикует Allure-отчет на GitHub Pages

Последний опубликованный отчет: [borbkin.github.io/e2e-codecept](https://borbkin.github.io/e2e-codecept/)
