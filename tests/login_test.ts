Feature('Login page');

// Scenario('Открытие страницы логина', async ({ I }) => {
//   I.amOnPage('/login');
//   I.see('Login to your account');
// });

Scenario('...', async ({ I }) => {
    await I.amOnPage('/login');
    await I.acceptCookiesIfVisible();
  
    await I.fillField('Email Address', 'wrong@example.com');
    await I.fillField('Password', 'wrongpassword');
    await I.click('button[type="submit"]');
    await I.waitForText('Your email or password is incorrect!', 5);
  });