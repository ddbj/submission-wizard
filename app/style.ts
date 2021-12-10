import { css } from 'lit';

export default css`
  :host {
    --text-color: #1c1b19;
    --link-color: #0d6efd;
    --link-hover-color: #0a58ca;
    --border-radius: 0.25rem;

    color: var(--text-color);
  }

  a {
    color: var(--link-color);
  }

  a:hover {
    color: var(--link-hover-color);
  }

  [class^='stack'] {
    margin-top: 0;
    margin-bottom: 0;
  }

  .stack-large > * + * {
    margin-top: 1rem;
  }

  .stack-small > * + * {
    margin-top: 0.25rem;
  }

  .box {
    padding: 0.75rem 1rem;
  }

  .box > *:first-child {
    margin-top: 0;
    padding-top: 0;
  }

  .box > *:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .cluster {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .border {
    border: solid thin var(--text-color);
  }

  .border.rounded {
    border-radius: var(--border-radius);
  }

  .my-0 {
    margin-top: 0;
    margin-bottom: 0;
  }

  .border.rounded > *:first-child {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  .border.rounded > *:last-child {
    border-bottom-right-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
  }

  .list-unstyled {
    list-style: none;
  }

  .question-text {
    background-color: hsl(53deg, 100%, 93%);
  }
`;
