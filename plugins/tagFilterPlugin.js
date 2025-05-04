module.exports = function (config) {
    const { tagFilter } = config;
  
    return {
      name: 'tagFilterPlugin',
      hooks: [],
      _filter(test) {
        const tagsInComments = test.fn.toString().match(/@(\w+)/g) || [];
        const tags = tagsInComments.map(tag => tag.replace('@', ''));
  
        // Если указаны фильтрующие теги
        if (tagFilter && Array.isArray(tagFilter)) {
          const hasMatchingTag = tagFilter.some(tag => tags.includes(tag));
          return hasMatchingTag;
        }
  
        return true;
      },
    };
  };