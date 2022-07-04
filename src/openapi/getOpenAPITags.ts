import { ControllerAPI } from './types';

const getOpenAPITags = (controllers: any): Array<{ name: string }> => {
  const tags: string[] = [];

  Object.entries(controllers).forEach(([key, value]: [string, any]) => {
    if (key.indexOf('API') > -1) {
      const api = value as ControllerAPI;
      if (Array.isArray(api.tags)) {
        tags.push(...value.tags);
      }
    }
  });

  return tags
    .filter((item, index) => tags.indexOf(item) === index)
    .map((tag: string) => ({ name: tag }))
    .sort((tag1, tag2) => tag1.name.toUpperCase().localeCompare(tag2.name.toUpperCase()));
};

export default getOpenAPITags;
