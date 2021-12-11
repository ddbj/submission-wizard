import { Directive, ElementPart, directive } from 'lit/directive.js';

class ResetScrollDirective extends Directive {
  render() {
    return undefined;
  }

  update(part: ElementPart) {
    part.element.scrollTo({
      top:      0,
      left:     0,
      // @ts-ignore https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
      behavior: 'instant'
    });
  }
}

export default directive(ResetScrollDirective);
