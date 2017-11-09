import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';

const reactAppContainer = 
  document.getElementById('question-react');

if (reactAppContainer) {
  const render = function render(Component) {
    ReactDOM.render(
      <AppContainer>
        <Component {...reactAppContainer.dataset}/>
      </AppContainer>,
      reactAppContainer,
    );
  };

  render(App);

  // Webpack Hot Module Replacement API
  if (module.hot) {
    module.hot.accept('./components/App', () => { render(App); });
  }
}