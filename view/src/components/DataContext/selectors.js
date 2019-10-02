import { all, filter, toLower } from 'ramda';

export default (list, tags) => (
  list.filter(item => all(tag => item.tags.includes(tag))(tags))
);

const tagLikeText = (text, ignoreCase = true) => (tag) => {
  const { name } = tag;
  if (ignoreCase) return toLower(name).includes(toLower(text));
  return name.includes(text);
};

const filterTags = (tags, filterText) => {
  if (!filterText) return tags;
  tagLikeText(filterText);
  return filter(tagLikeText(filterText), tags);
};

export {
  filterTags,
};
