import Clipboard from 'clipboard';
import PropTypes from 'prop-types';
import React from 'react';

interface ClipboardButtonProps {
  type?: string;
  className?: string;
  style?: React.CSSProperties;
  component?: any;
  children?: React.ReactChild;
  onClick?: any;
  onSuccess?: (e: ClipboardJS.Event) => void;
  onError?: (e: ClipboardJS.Event) => void;
  options?: ClipboardJS.Options;
}

class ClipboardButton extends React.Component<ClipboardButtonProps> {
  static propTypes = {
    options(
      props: ClipboardButtonProps,
      propName: string,
      componentName: string
    ) {
      const options = props[propName];
      if ((options && typeof options !== 'object') || Array.isArray(options)) {
        return new Error(
          `Invalid props '${propName}' supplied to '${componentName}'. ` +
            `'${propName}' is not an object.`
        );
      }

      if (props['option-text'] !== undefined) {
        const optionText = props['option-text'];
        if (typeof optionText !== 'function') {
          return new Error(
            `Invalid props 'option-text' supplied to '${componentName}'. ` +
              `'option-text' is not a function.`
          );
        }
      }
    },
    type: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
    ]),
  };

  static defaultProps = {
    onClick() {
      //
    },
  };
  element: HTMLElement;
  clipboard: Clipboard;
  /* Returns a object with all props that fulfill a certain naming pattern
   *
   * @param {RegExp} regexp - Regular expression representing which pattern
   *                          you'll be searching for.
   * @param {Boolean} remove - Determines if the regular expression should be
   *                           removed when transmitting the key from the props
   *                           to the new object.
   *
   * e.g:
   *
   * // Considering:
   * // this.props = {option-foo: 1, onBar: 2, data-foobar: 3 data-baz: 4};
   *
   * // *RegExps not using // so that this comment doesn't break up
   * this.propsWith(option-*, true); // returns {foo: 1}
   * this.propsWith(on*, true); // returns {Bar: 2}
   * this.propsWith(data-*); // returns {data-foobar: 1, data-baz: 4}
   */
  propsWith(regexp: RegExp, remove: boolean = false) {
    const object = {};

    Object.keys(this.props).forEach(key => {
      if (key.search(regexp) !== -1) {
        const objectKey = remove ? key.replace(regexp, '') : key;
        object[objectKey] = this.props[key];
      }
    });

    return object;
  }

  componentWillUnmount() {
    // tslint:disable-next-line:no-unused-expression
    this.clipboard && this.clipboard.destroy();
  }

  componentDidMount() {
    // Support old API by trying to assign this.props.options first;
    const options = this.props.options || this.propsWith(/^option-/, true);
    // const element = React.version.match(/0\.13(.*)/)
    //   ? this.refs.element.getDOMNode()
    //   : this.element;
    const element = this.element;
    this.clipboard = new Clipboard(element, options);

    const callbacks = this.propsWith(/^on/, true);
    Object.keys(callbacks).forEach(callback => {
      this.clipboard.on(callback.toLowerCase(), this.props[`on${callback}`]);
    });
  }

  render() {
    const attributes = {
      type: this.getType(),
      className: this.props.className || '',
      style: this.props.style || {},
      ref: element => {
        this.element = element;
      },
      onClick: this.props.onClick,
      ...this.propsWith(/^data-/),
      ...this.propsWith(/^button-/, true),
    };

    return React.createElement(
      this.getComponent(),
      attributes,
      this.props.children
    );
  }

  getType() {
    if (this.getComponent() === 'button' || this.getComponent() === 'input') {
      return this.props.type || 'button';
    } else {
      return undefined;
    }
  }

  getComponent() {
    return this.props.component || 'button';
  }
}

export default ClipboardButton;
