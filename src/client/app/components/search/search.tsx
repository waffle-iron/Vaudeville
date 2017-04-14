import * as React from 'react';

export interface ISearchProps {
  debounceThrottle?: number;
  onChange?: (searchTerm: string) => void;
  className?: string;
}

export interface ISearchState {
  searchTerm?: string;
}

export class Search extends React.Component<ISearchProps, ISearchState> {
  public static defaultProps: ISearchProps = {
    debounceThrottle: 500,
    onChange: null,
  };

  private throttleTimeout?: number;

  private elements: {
    input?: HTMLInputElement;
  } = {};

  private refHandlers = {
    input: (ref) => this.elements.input = ref,
  };

  constructor(props: ISearchProps) {
    super(props);

    this.refHandlers.input = this.refHandlers.input.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  private handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const searchTerm = event.target.value;
    this.setState({ searchTerm }, () => {
      if (this.props.onChange) {
        if (this.throttleTimeout) {
          window.clearTimeout(this.throttleTimeout);
        }
        this.throttleTimeout = window.setTimeout(() => this.props.onChange(searchTerm), this.props.debounceThrottle);
      }
    });
  }

  private handleBlur(): void {
    this.elements.input.blur();
  }

  private handleFocus(): void {
    this.elements.input.focus();
  }

  public render(): JSX.Element {
    return (
      <input
        type="search"
        className={this.props.className}
        ref={this.refHandlers.input}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur} />
    );
  }
};
