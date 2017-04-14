import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as csx from 'csx';

import { Router, browserHistory } from 'react-router';
import { classes, style } from 'typestyle';

import { AppContainer } from 'react-hot-loader';
import { MovieListContainer } from './containers';
import { Search } from './components/';

interface IAppState {
  searchToken: string;
}

const appTransparency = .90;

namespace AppStyle {
  export const page = style({
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    flex: '1 1 auto',
    minHeight: '100%',
  });

  export const rightStyle = style({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    // minWidth: '1024px',
    width: '100%',
  });

  export const leftStyle = style({
    backgroundColor: 'transparent',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    minWidth: '250px',
  });

  export const sideMenu = style({
    backgroundColor: `rgba(36, 34, 39, ${appTransparency})`,
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
  });

  export const logoStyle = style({
    alignItems: 'center',
    backgroundColor: `rgba(16, 0253, 161, ${appTransparency})`,
    color: 'rgba(36, 34, 39, 1)',
    display: 'flex',
    fontFamily: `'Cookie', sans-serif`,
    fontSize: '42px',
    fontWeight: 'bolder',
    justifyContent: 'center',
    height: '95px',
    minWidth: '250px',
  });

  export const topBarStyle = style({
    backgroundColor: `rgba(36, 34, 39, ${appTransparency})`,
    display: 'flex',
    height: '95px',
  });

  export const searchStyle = style({
    backgroundColor: csx.transparent.toString(),
    border: 'none',
    color: '#e9e9e9',
    fontFamily: `'Open Sans', sans-serif`,
    fontSize: '24px',
    padding: '24px',
    width: '100%',
  });

  export const movieListStyle = style({
    backgroundColor: `rgba(19, 19, 19, ${appTransparency})`,
    paddingTop: '35px',
    flex: '1 1 auto',
  });

  export const backgroundImage = style({
    backgroundAttachment: 'fixed',
    backgroundImage: `url('https://image.tmdb.org/t/p/w1300_and_h730_bestv2/6vkhRvsRvWpmaRVyCXaxTkIEb7j.jpg')`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    filter: 'blur(5px)',
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: -1,
  });
}

class App extends React.Component<{}, IAppState> {
  constructor() {
    super();
    this.state = {
      searchToken: '',
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  private handleSearch(searchToken) {
    this.setState({searchToken});
  }

  public render(): JSX.Element {
    return (
      <AppContainer>
          <div className={AppStyle.page}>
          <div className={AppStyle.backgroundImage} />
            <div className={AppStyle.leftStyle}>
              <div className={AppStyle.logoStyle}><span>Vaudeville</span></div>
              <div className={AppStyle.sideMenu}/>
            </div>
            <div className={AppStyle.rightStyle}>
              <div className={AppStyle.topBarStyle}>
                <Search
                  className={AppStyle.searchStyle}
                  onChange={this.handleSearch} debounceThrottle={1000} />
              </div>
              <div className={AppStyle.movieListStyle}>
                <MovieListContainer searchToken={this.state.searchToken}/>
              </div>
            </div>
          </div>
      </AppContainer>
    );
  }
};

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}

