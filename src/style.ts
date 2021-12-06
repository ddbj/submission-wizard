import { css } from 'lit';

export default css`
  :host {
    --text-color: #1c1b19;
    --link-color: #0d6efd;
    --link-hover-color: #0a58ca;

    color: var(--text-color);
  }

  * {
    margin: 0;
    padding: 0;
  }

  a {
    color: var(--link-color);
  }

  a:hover {
    color: var(--link-hover-color);
  }

  .stack > * + * {
    margin-top: 0.75rem;
  }

  .box {
    padding: 0.75rem 1rem;
  }

  .cluster {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    list-style: none;
  }

  .border {
    border: solid thin var(--text-color);
  }

  .border-top {
    border-top: solid thin var(--text-color);
  }

  .bg-light {
    background-color: hsl(53deg, 100%, 93%);
  }

  .choice-button {
    display: inline-block;
    padding: 0.5em 1.25em;
    border-radius: 0.25rem;
    background-color: hsl(27deg, 100%, 50%);
    color: white !important;
    text-decoration: none;
    transition: background-color .15s;
  }

  .choice-button:hover {
    background-color: hsl(27deg, 100%, 45%);
  }
`;
