import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import '../app/elements/submission-wizard.ts';
import '../app/elements/submission-wizard-goal.ts';

it('simple', async () => {
  const el           = await fixture(html`<submission-wizard></submission-wizard>`);
  const {shadowRoot} = el;

  if (!shadowRoot) { throw new Error('must not happen'); }

  expect(shadowRoot.textContent).to.include('Q1. Are you submitting data from human research subjects and do the data require controlled access?');
  await clickLink(el, 'No');

  expect(shadowRoot.textContent).to.include('Q2. What type of data do you have?');
  await clickLink(el, 'Proteomics data');

  const goalEl = shadowRoot.querySelector('submission-wizard-goal');

  expect(goalEl?.shadowRoot?.textContent).to.include('Submission Instructions');
});

it('simple (ja)', async () => {
  const el           = await fixture(html`<submission-wizard locale="ja"></submission-wizard>`);
  const {shadowRoot} = el;

  if (!shadowRoot) { throw new Error('must not happen'); }

  expect(shadowRoot.textContent).to.include('Q1. Are you submitting data from human research subjects and do the data require controlled access?');
  await clickLink(el, 'いいえ');

  expect(shadowRoot.textContent).to.include('Q2. What type of data do you have?');
  await clickLink(el, 'Proteomics data');

  const goalEl = shadowRoot.querySelector('submission-wizard-goal');

  expect(goalEl?.shadowRoot?.textContent).to.include('登録の流れ');
});

async function clickLink(host: Element, label: string) {
  if (!host.shadowRoot) { throw new Error(''); }

  const links = Array.from(host.shadowRoot.querySelectorAll('a')).filter((a) => a.textContent === label);

  if (links.length !== 1) {
    throw new Error(`found ${links.length} links`);
  }

  links[0].click();

  await elementUpdated(host);
}
