import * as Clipboard from 'clipboard';
import * as PropTypes from 'prop-types';
import * as React from 'react';
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
declare class ClipboardButton extends React.Component<ClipboardButtonProps> {
    static propTypes: {
        options(props: ClipboardButtonProps, propName: string, componentName: string): Error;
        type: PropTypes.Requireable<string>;
        className: PropTypes.Requireable<string>;
        style: PropTypes.Requireable<object>;
        component: PropTypes.Requireable<string | object>;
        children: PropTypes.Requireable<string | number | object>;
    };
    static defaultProps: {
        onClick(): void;
    };
    element: HTMLElement;
    clipboard: Clipboard;
    propsWith(regexp: RegExp, remove?: boolean): {};
    componentWillUnmount(): void;
    componentDidMount(): void;
    render(): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    getType(): string;
    getComponent(): any;
}
export default ClipboardButton;
