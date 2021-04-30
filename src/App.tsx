import './App.css';

import * as React from 'react';
import { AzureAD } from 'react-aad-msal';
import { authProvider } from './authProvider';
import Router from './components/Router';
import SessionStore from './stores/sessionStore';
import SignalRAspNetCoreHelper from './lib/signalRAspNetCoreHelper';
import Stores from './stores/storeIdentifier';
import { inject } from 'mobx-react';

export interface IAppProps {
  sessionStore?: SessionStore;
}

@inject(Stores.SessionStore)
class App extends React.Component<IAppProps> {
  async componentDidMount() {
    await this.props.sessionStore!.getCurrentLoginInformations();

    if (!!this.props.sessionStore!.currentLogin.user && this.props.sessionStore!.currentLogin.application.features['SignalR']) {
      if (this.props.sessionStore!.currentLogin.application.features['SignalR.AspNetCore']) {
        SignalRAspNetCoreHelper.initSignalR();
      }
    }
  }

  public render() {
    return (
      <React.Fragment>
        <Router />
        <AzureAD provider={authProvider}></AzureAD>
      </React.Fragment>
    );
  }
}

export default App;
