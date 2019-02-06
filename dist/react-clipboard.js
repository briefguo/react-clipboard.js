"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clipboard_1 = require("clipboard");
const prop_types_1 = require("prop-types");
const react_1 = require("react");
class ClipboardButton extends react_1.default.Component {
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
    propsWith(regexp, remove = false) {
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
        this.clipboard = new clipboard_1.default(element, options);
        const callbacks = this.propsWith(/^on/, true);
        Object.keys(callbacks).forEach(callback => {
            this.clipboard.on(callback.toLowerCase(), this.props[`on${callback}`]);
        });
    }
    render() {
        const attributes = Object.assign({ type: this.getType(), className: this.props.className || '', style: this.props.style || {}, ref: element => {
                this.element = element;
            }, onClick: this.props.onClick }, this.propsWith(/^data-/), this.propsWith(/^button-/, true));
        return react_1.default.createElement(this.getComponent(), attributes, this.props.children);
    }
    getType() {
        if (this.getComponent() === 'button' || this.getComponent() === 'input') {
            return this.props.type || 'button';
        }
        else {
            return undefined;
        }
    }
    getComponent() {
        return this.props.component || 'button';
    }
}
ClipboardButton.propTypes = {
    options(props, propName, componentName) {
        const options = props[propName];
        if ((options && typeof options !== 'object') || Array.isArray(options)) {
            return new Error(`Invalid props '${propName}' supplied to '${componentName}'. ` +
                `'${propName}' is not an object.`);
        }
        if (props['option-text'] !== undefined) {
            const optionText = props['option-text'];
            if (typeof optionText !== 'function') {
                return new Error(`Invalid props 'option-text' supplied to '${componentName}'. ` +
                    `'option-text' is not a function.`);
            }
        }
    },
    type: prop_types_1.default.string,
    className: prop_types_1.default.string,
    style: prop_types_1.default.object,
    component: prop_types_1.default.oneOfType([prop_types_1.default.string, prop_types_1.default.object]),
    children: prop_types_1.default.oneOfType([
        prop_types_1.default.element,
        prop_types_1.default.arrayOf(prop_types_1.default.element),
        prop_types_1.default.string,
        prop_types_1.default.number,
        prop_types_1.default.object,
    ]),
};
ClipboardButton.defaultProps = {
    onClick() {
        //
    },
};
exports.default = ClipboardButton;
//# sourceMappingURL=react-clipboard.js.map