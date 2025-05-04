import { getTags } from './tagUtils';

interface TagFilterPluginConfig {
  tagFilter?: string[];
}

const tagFilterPlugin = (config: TagFilterPluginConfig) => {
  const { tagFilter } = config;

  return {
    name: 'tagFilterPlugin',
    hooks: [],

    _filter(test: any) {
      const tags = getTags();

      if (tagFilter && Array.isArray(tagFilter)) {
        const hasMatchingTag = tagFilter.some(tag => tags.includes(tag));
        return hasMatchingTag;
      }

      return true;
    }
  };
};

export = tagFilterPlugin;