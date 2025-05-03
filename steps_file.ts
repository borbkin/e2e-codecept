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
    }
  });
};