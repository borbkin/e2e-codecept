Feature('Login page');

let userName: string;
let email: string;
let password: string;

Before(({ I }) => {
    userName = 'Автотест';
    email = `test_${Date.now()}@example.com`;
    password = '123456';
    // Создаём нового пользователя
    await I.registerNewUser(userName, email, password);
});

Scenario('Открытие страницы логина', async ({ I }) => {
  I.amOnPage('/login');
  I.see('Login to your account');
});

Scenario('Позитивный вход по email и паролю', async ({ I }) => {
    // Входим
    await I.login(email, password);
  
    // Проверка
    await I.see(`Logged in as ${userName}`);
});