import AllureApi from 'allure-codeceptjs';

const noop = {
  label: () => {},
  severity: () => {},
  parameter: () => {},
  step: async (_name: string, body: () => Promise<void>) => await body(),
  attachment: () => {}
};

const globalAllure = (global.allure ?? noop) as ReturnType<typeof AllureApi>;

export const allureHelper = {
    setEpic(epic: string) {
      global.allure?.label?.('epic', epic);
    },
    setFeature(feature: string) {
      global.allure?.label?.('feature', feature);
    },
    setStory(story: string) {
      global.allure?.label?.('story', story);
    },
    setSeverity(level: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial') {
      global.allure?.severity?.(level);
    },
    addParameter(name: string, value: string) {
      global.allure?.parameter?.(name, value);
    },
    async step(name: string, body: () => Promise<void>) {
      if (global.allure?.step) {
        return global.allure.step(name, body);
      }
      return body(); // fallback
    },
    attach(name: string, content: string | Buffer, type: string) {
      global.allure?.attachment?.(name, content, type);
    }
  };