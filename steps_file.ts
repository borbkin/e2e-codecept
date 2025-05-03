// in this file you can append custom step methods to 'I' object

export = function() {
  return actor({
    async acceptCookiesIfVisible(this: CodeceptJS.I) {
      this.say('Ждём появления баннера cookies...');
      try {
        await this.waitForElement('.fc-cta-consent', 5); // подождём максимум 5 секунд
        this.say('Баннер найден, кликаем');
        await this.click('.fc-cta-consent');
      } catch (e) {
        this.say('Баннер не появился — пропускаем');
      }
    },
    async registerNewUser(this: CodeceptJS.I, name: string, email: string, password: string) {
      await this.amOnPage('/login');
      await this.acceptCookiesIfVisible();
    
      await this.fillField('[data-qa="signup-name"]', name);
      await this.fillField('[data-qa="signup-email"]', email);
      await this.click('[data-qa="signup-button"]');
    
      await this.waitForElement('#password', 5);
      await this.fillField('#password', password);
      await this.selectOption('#days', '3');
      await this.selectOption('#months', 'April');
      await this.selectOption('#years', '1994');
    
      await this.fillField('#first_name', 'Test');
      await this.fillField('#last_name', 'User');
      await this.fillField('#address1', '123 Test Street');
      await this.selectOption('#country', 'Canada');
      await this.fillField('#state', 'Ontario');
      await this.fillField('#city', 'Toronto');
      await this.fillField('#zipcode', 'M1M1M1');
      await this.fillField('#mobile_number', '+1234567890');
    
      await this.click('[data-qa="create-account"]');
      await this.waitForText('Account Created!', 10);
      await this.click('[data-qa="continue-button"]');
    
      await this.see(`Logged in as ${name}`);
    }
  });
};