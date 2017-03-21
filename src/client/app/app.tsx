import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Router, browserHistory } from 'react-router';

import { AppContainer } from 'react-hot-loader';
import { MovieListContainer } from './containers';

const grid = require('./components/grid/grid.css');

const movieListStyle: React.CSSProperties = {
  minWidth: '1024px',
};

const App = () => (
  <AppContainer>
    <div>
      <div className={grid.row} style={movieListStyle}>
        <MovieListContainer searchToken="star trek"/>
      </div>
    </div>
  </AppContainer>
);

const render = () => {
  ReactDOM.render(<App />, document.getElementById('app'));
};

render();

if (module.hot) {
  module.hot.accept()
}

