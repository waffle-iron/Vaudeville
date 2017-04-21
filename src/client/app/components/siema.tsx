import * as React from 'react';
import * as SiemaJs from 'siema';

interface ISiema {
  currentIndex: number;
  prev(howManySlides?: number): void;
  next(howManySlides?: number): void;
  goTo(index: number): void;
  remove(index: number): void;
  insert(item: JSX.Element, index: number): void;
  prepend(item: JSX.Element): void;
  append(item: JSX.Element): void;
  destroy(restoreMarkup?: boolean): void;
}

interface ISiemaOptions {
  duration?: number;
  easing?: string;
  perPage?: number;
  startIndex?: number;
  draggable?: boolean;
  threshold?: number;
  loop?: boolean;
  onInit?: () => void;
  onChange?: () => void;
}

export class Siema extends React.Component<ISiemaOptions, {}> implements ISiema {
  private siema: ISiema;
  private carouselDom: HTMLDivElement;
  private childrenCount: number;
  public currentIndex: number;

  constructor(props: ISiemaOptions) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);

    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.goTo = this.goTo.bind(this);
    this.remove = this.remove.bind(this);
    this.insert = this.insert.bind(this);
    this.prepend = this.prepend.bind(this);
    this.append = this.append.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  public componentDidMount() {
    this.childrenCount = React.Children.count(this.props.children);
    this.initSiema(this.props);
  }

  public componentDidUpdate() {
    this.initSiema(this.props);
  }

  public componentWillUnmount() {
    this.siema.destroy();
  }

  public render() {
    return (
      <div>
        <div ref={(e) => this.carouselDom = e}>
          {this.props.children}
        </div>
      </div>
    );
  }

  private initSiema(props: Readonly<ISiemaOptions>) {
    if (this.siema) {
      this.siema.destroy();
    }
    this.siema = new SiemaJs({...props, selector: this.carouselDom});
    this.currentIndex = props.startIndex;
  }

  public prev(howManySlides?: number) {
    this.siema.prev(howManySlides);
    this.currentIndex = (this.currentIndex - 1 + this.childrenCount) % this.childrenCount;
  }

  public next(howManySlides?: number) {
    this.siema.next(howManySlides);
    this.currentIndex = (this.currentIndex + 1) % this.childrenCount;
  }

  public goTo(index: number) {
    this.siema.goTo(index);
    this.currentIndex = Math.min(this.childrenCount - 1, index);
  }

  public remove(index: number) {
    this.siema.remove(index);
    if (index < this.currentIndex) {
      this.currentIndex -= 1;
    }
  }

  public insert(item: JSX.Element, index: number) {
    this.siema.insert(item, index);
    if (index < this.currentIndex) {
      this.currentIndex += 1;
    }
  }

  public prepend(item: JSX.Element) {
    this.siema.prepend(item);
    this.currentIndex += 1;
  }

  public append(item: JSX.Element) {
    this.siema.append(item);
  }

  public destroy(restoreMarkup?: boolean) {
    this.siema.destroy(restoreMarkup);
  }
}
