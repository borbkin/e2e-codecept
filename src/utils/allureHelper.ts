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
    globalAllure.label('epic', epic);
  },
  setFeature(feature: string) {
    globalAllure.label('feature', feature);
  },
  setStory(story: string) {
    globalAllure.label('story', story);
  },
  setSeverity(level: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial') {
    globalAllure.severity(level);
  },
  addParameter(name: string, value: string) {
    globalAllure.parameter(name, value);
  },
  async step(name: string, body: () => Promise<void>) {
    return globalAllure.step(name, body);
  },
  attach(name: string, content: string | Buffer, type: string) {
    globalAllure.attachment(name, content, type);
  }
};