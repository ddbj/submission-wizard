import MarkdownIt from 'markdown-it';
import yaml from '@rollup/plugin-yaml';

export default (opts) => yaml({
  ...opts,

  transform(obj, path) {
    if (path.endsWith('/goals.yml')) {
      return transformSectionBody(obj);
    } else {
      return obj;
    }
  }
});

function transformSectionBody(obj, keys = []) {
  if (Array.isArray(obj)) {
    return obj.map((v) => transformSectionBody(v, keys));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [k, v]) => {
      if (isSameArray(keys.slice(1), ['sections', 'body'])) {
        return {...acc, [k]: renderMarkdown(v)};
      } else {
        return {...acc, [k]: transformSectionBody(v, [...keys, k])};
      }
    }, {});
  } else {
    return obj;
  }
}

function isSameArray(x, y) {
  return x.length === y.length && x.every((v, i) => v === y[i]);
}

const markdownIt = new MarkdownIt({
  html:   true,
  breaks: true
});

function renderMarkdown(src) {
  return src ? markdownIt.render(src) : undefined;
}
