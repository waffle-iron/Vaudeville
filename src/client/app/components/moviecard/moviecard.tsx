import * as React from 'react';

import { classes, style } from 'typestyle';

import { Card } from '../../components';
import { Rating } from './rating-old';
import { Siema } from '../siema';

export interface IMovieCardProps {
  className?: string;
  genres: string[];
  height?: number;
  movieId: number;
  poster?: string;
  defaultQuality: string;
  qualities: string[];
  rating: number;
  ratingMax?: number;
  title: string;
  width?: number;
  year: string;
};

namespace MovieCardStyle {
  export const borderRadius = style({ backgroundColor: 'transparent', borderRadius: 3 });

  export const button = style({
    color: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    userSelect: 'none',
    cursor: 'pointer',
  });

  export const buttonHover = style({
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'color .2s',
    $nest: {
      '&:hover': {
        color: 'white',
      },
    },
  });

  export const overlayButton = classes(button, style({
    backgroundColor: 'rgba(0, 0, 0, .45)',
    border: '2px solid rgba(255, 255, 255, 0.7)',
  }));

  export const overlay = style({
    opacity: 0,
    transition: 'all .2s',
  });

  export const cover = style({
    bottom: 0,
    height: '100%',
    left: 0,
    opacity: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  });

  export const darkenOverlay = style({
    background: 'radial-gradient(farthest-corner at 50% 50%,rgba(50,50,50,.5) 50%,#323232 100%) !important',
  });

  export const borderOverlay = style({
    borderWidth: '2px',
    borderColor: '#10fda1',
    borderStyle: 'solid',
  });

  export const downloadButton = classes(overlayButton, buttonHover, style({
    borderRadius: '50%',
    fontSize: 12,
    height: 42,
    textAlign: 'center',
    transition: 'all .2s !important',
    transform: 'scale(0.8)',
    width: 42,
    $nest: {
      '&:hover': {
        backgroundColor: '#10fda1',
        borderColor: '#10fda1',
        transform: 'scale(1)',
      },
    },
  }));

  export const contentOverlay = style({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    opacity: 0,
    position: 'absolute',
    transition: 'opacity .2s',
    width: '100%',
  });

  export const main = style({
    display: 'flex',
    flexDirection: 'column',
  });

  export const poster = (props: IMovieCardProps) => style({ height: props.height, width: props.width });

  export const card = (props: IMovieCardProps) => style({
    boxShadow: `0 6px 10px 0 rgba(0, 0, 0, 0.14),
                0 1px 18px 0 rgba(0, 0, 0, 0.12),
                0 3px 5px -1px rgba(0, 0, 0, 0.2)`,
    display: 'flex',
    flexDirection: 'column',
    height: props.height,
    overflow: 'hidden',
    position: 'relative',
    width: props.width,
    $nest: {
      [`&:hover .cardHover.${MovieCardStyle.overlay}`]: {
        opacity: 1,
      },
      [`&:hover .cardHover.${MovieCardStyle.borderOverlay}`]: {
        opacity: 1,
      },
      [`&:hover .cardHover.${MovieCardStyle.contentOverlay}`]: {
        opacity: 1,
      },
      [`&:hover .cardHover.${MovieCardStyle.downloadButton}`]: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
  });

  export const title = (props: IMovieCardProps) => style({
    color: '#e7e7e7',
    display: 'block',
    fontFamily: `'Open Sans', sans-serif`,
    fontSize: 14,
    fontWeight: 600,
    marginTop: 12,
    textAlign: 'left',
    textShadow: 'black -1px 1px 5px',
    width: props.width,
  });

  export const year = (props: IMovieCardProps) => style({
    color: '#555',
    display: 'block',
    fontFamily: `'Open Sans', sans-serif`,
    fontSize: 13,
    fontWeight: 600,
    marginTop: 3,
    textAlign: 'left',
    textShadow: 'black -1px 1px 5px',
    width: props.width,
  });

  export const qualityPicker = style({
    display: 'flex',
    justifyContent: 'space-around',
    left: '50%',
    marginTop: 5,
    position: 'absolute',
    transform: 'translate(-50%, 0%)',
  });

  export const qualityCarousel = style({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: 48,
  });

  export const qualityWrapper = style({
    display: 'flex',
    justifyContent: 'center',
  });

  export const quality = classes(overlayButton, style({
    borderRadius: 25,
    display: 'inline-block !important',
    fontFamily: `'Open Sans', sans-serif`,
    fontSize: 10,
    fontWeight: 600,
    padding: '1px 5px',
    textAlign: 'center',
  }));


  export const ellipsesOverflow = style({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  });
}

interface ISiema {
  next: () => void;
  prev: () => void;
  goTo: (idx: number) => void;
  currentSlide: number;
}

export class MovieCard extends React.Component<IMovieCardProps, {}> {
  public static defaultProps = {
    height: 201,
    width: 134,
  };

  private readonly elements: {
    carousel?: ISiema;
  } = {};

  private readonly refHandlers = {
    carousel: (ref) => this.elements.carousel = ref,
  };

  constructor(props: IMovieCardProps) {
    super(props);

    this.refHandlers.carousel = this.refHandlers.carousel.bind(this);
    this.prevQuality = this.prevQuality.bind(this);
    this.nextQuality = this.nextQuality.bind(this);
    this.downloadTorrent = this.downloadTorrent.bind(this);
  }

  private formatPercentage(percentage: number) {
    return (percentage * this.props.ratingMax).toPrecision(2);
  }

  private async downloadTorrent() {
    const maxQuality = this.props.qualities[this.elements.carousel.currentSlide];
    await fetch(`/api/v1/torrents/download/${this.props.movieId}?maxQuality=${maxQuality}`)
      .then<any>((res) => res.json());
  };

  private prevQuality() {
    this.elements.carousel.prev();
  };

  private nextQuality() {
    this.elements.carousel.next();
  }

  public render(): JSX.Element {
    const getQualityWrapper = (label: string) => {
      return (
        <div className={MovieCardStyle.qualityWrapper} key={label}>
          <div className={MovieCardStyle.quality}>{label}</div>
        </div>
      );
    };

    const getDefaultQualityIndex = () => {
      return this.props.qualities.findIndex((q) => q === this.props.defaultQuality);
    };

    const overlayClasses = classes(
      'cardHover',
      MovieCardStyle.borderRadius,
      MovieCardStyle.darkenOverlay,
      MovieCardStyle.borderOverlay,
      MovieCardStyle.cover,
      MovieCardStyle.overlay,
    );

    return (
      <div className={this.props.className}>
        <div className={MovieCardStyle.main}>
          <div>
            <Card className={classes(MovieCardStyle.borderRadius, MovieCardStyle.card(this.props))}>
              <img
                className={classes(MovieCardStyle.borderRadius, MovieCardStyle.poster(this.props))}
                src={this.props.poster ? this.props.poster : ''} />
              <div className={overlayClasses} />
              <div className={classes('cardHover', MovieCardStyle.contentOverlay)}>
                <div style={{position: 'relative'}}>
                  <div className={classes('cardHover', MovieCardStyle.downloadButton)} onClick={this.downloadTorrent}>
                    <i className="material-icons">file_download</i>
                  </div>
                  <div className={MovieCardStyle.qualityPicker}>
                    <div className={classes(MovieCardStyle.button, MovieCardStyle.buttonHover)}
                      onClick={this.prevQuality}>
                      <i className="material-icons">chevron_left</i>
                    </div>
                    <div className={MovieCardStyle.qualityCarousel}>
                    <Siema loop={true}
                           draggable={false}
                           startIndex={getDefaultQualityIndex()}
                           ref={this.refHandlers.carousel}>
                      {this.props.qualities.map((q) => getQualityWrapper(q))}
                    </Siema>
                    </div>
                    <div className={classes(MovieCardStyle.button, MovieCardStyle.buttonHover)}
                      onClick={this.nextQuality}>
                      <i className="material-icons">chevron_right</i>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <span className={classes(MovieCardStyle.title(this.props), MovieCardStyle.ellipsesOverflow)}>
            {this.props.title}
          </span>
          <span className={classes(MovieCardStyle.year(this.props), MovieCardStyle.ellipsesOverflow)}>
            {this.props.year}
          </span>
        </div>
      </div>
    );
  }
};
