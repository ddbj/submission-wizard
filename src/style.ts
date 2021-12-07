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

  ul {
    padding-left: inherit;
  }

  a {
    color: var(--link-color);
  }

  a:hover {
    color: var(--link-hover-color);
  }

  .stack {
    position: relative; // TODO
  }

  .stack > * + * {
    margin-top: 1rem;
    position: relative;
  }

  .stack > * + *:before {
    content: '';
    display: block;
    position: absolute;
    height: calc(1rem + 1px);
    inset: calc((1rem + 1px) * -1) 0 0 0;
    background: linear-gradient(var(--text-color), var(--text-color)) no-repeat center / 1px 100%;
  }

  .box {
    padding: 1rem;
  }

  .cluster {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    list-style: none;
  }

  .border {
    border: solid thin var(--text-color);
    border-radius: 0.25rem;
  }

  .border-top {
    border-top: solid thin var(--text-color);
  }

  .preview {
    position: absolute;
    width: 100%;
    filter: grayscale(100%);
    background-color: white;
  }

  .question-text {
    background-color: hsl(53deg, 100%, 93%);
    padding: 0.75rem 1rem;
    border-radius: 0.25rem 0.25rem 0 0;
  }

  .choice-button {
    display: inline-block;
    padding: 0.375em 0.75em;
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
