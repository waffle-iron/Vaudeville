import * as React from 'react';
import * as classnames from 'classnames';

import { FontIcon } from '../fonticon';

const theme = require('./theme.css');

export interface IInputProps {
  icon?: string;
}

export class Input extends React.Component<IInputProps, {}> {
  private elements: {
    input?: HTMLInputElement;
  };

  private refHandlers = {
    input: (ref) => this.elements.input = ref,
  };

  constructor(props: IInputProps) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  private handleBlur(): void {
    this.elements.input.blur();
  }

  private handleFocus(): void {
    this.elements.input.focus();
  }

  public render(): JSX.Element {
    const containerClassNames = classnames({
      [theme.withIcon]: this.props.icon != null,
    }, theme.input);

    return (
      <div className={containerClassNames}>
        <input
          type="text"
          className={theme.inputInternal}
          ref={this.refHandlers.input}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur} />
        {this.props.icon ? <FontIcon className={theme} value={this.props.icon} /> : null}
        <span className={theme.bar} />
      </div>
    );
  }
};
