'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const getOpenAPITags = controllers => {
  const tags = [];
  Object.entries(controllers).forEach(([key, value]) => {
    if (key.indexOf('API') > -1) {
      const api = value;
      if (Array.isArray(api.tags)) {
        tags.push(...value.tags);
      }
    }
  });
  return tags
    .filter((item, index) => tags.indexOf(item) === index)
    .map(tag => ({ name: tag }))
    .sort((tag1, tag2) => tag1.name.toUpperCase().localeCompare(tag2.name.toUpperCase()));
};
exports.default = getOpenAPITags;
