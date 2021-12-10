import { expect, fixture, html } from '@open-wc/testing';
import '../app/submission-wizard.ts';

it('initial render', async () => {
  const el = await fixture(html`<submission-wizard></submission-wizard>`);

  expect(el).shadowDom.to.equalSnapshot();
});

it('initial render (locale: ja)', async () => {
  const el = await fixture(html`<submission-wizard locale="ja"></submission-wizard>`);

  expect(el).shadowDom.to.equalSnapshot();
});
