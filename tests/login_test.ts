Feature('Login page');

Scenario('Открытие страницы логина', async ({ I }) => {
  I.amOnPage('/login');
  I.see('Login to your account');
});

Scenario('Негативный вход по email и паролю', async ({ I }) => {
    await I.amOnPage('/login');
    await I.acceptCookiesIfVisible();
  
    await I.fillField('Email Address', 'wrong@example.com');
    await I.fillField('Password', 'wrongpassword');
    await I.click('button[type="submit"]');
    await I.waitForText('Your email or password is incorrect!', 5);
  });

Scenario('Позитивный вход по email и паролю', async ({ I }) => {
    const name = 'Автотест';
    const email = `test_${Date.now()}@example.com`;
    const password = '123456';
  
    // Создаём нового пользователя
    await I.registerNewUser(name, email, password);
  
    // Входим обратно
    await I.login(email, password);
  
    // Проверка
    await I.see(`Logged in as ${name}`);
});