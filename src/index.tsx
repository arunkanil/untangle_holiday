import './index.css';
import './web.config';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';
import "moment-timezone";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import App from './App';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import Utils from './utils/utils';
import abpUserConfigurationService from './services/abpUserConfigurationService';
import initializeStores from './stores/storeInitializer';
import registerServiceWorker from './registerServiceWorker';

declare var abp: any;

Utils.setLocalization();

abpUserConfigurationService.getAll().then(data => {
  Utils.extend(true, abp, data.data.result);
  abp.clock.provider = Utils.getCurrentClockProvider(data.data.result.clock.provider);

  moment.locale(abp.localization.currentLanguage.name);

  if (abp.clock.provider.supportsMultipleTimezone) {
    moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
  }

  const stores = initializeStores();
  registerServiceWorker();
  console.log("Index Page : abp session value after login", abp.session);

  ReactDOM.render(
    
    <Provider {...stores}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>,
    document.getElementById('root') as HTMLElement
  );

  
});
