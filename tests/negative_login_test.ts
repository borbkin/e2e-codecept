Feature('Login page');

Scenario('Негативный вход по email и паролю', async ({ I }) => {
  await I.amOnPage('/login');
  await I.acceptCookiesIfVisible();

  await I.say('Пробуем ввести неправильные данные и получить ошибку');
  await I.fillField('Email Address', 'wrong@example.com');
  await I.fillField('Password', 'wrongpassword');
  await I.click('button[type="submit"]');

  await I.waitForText('Your email or password is incorrect!', 5);
  await I.dontSee('Logged in as');
});