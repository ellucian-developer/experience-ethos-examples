// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withIntl } from '../i18n/ReactIntlProviderWrapper';

import { usePageInfo } from '@ellucian/experience-extension-utils';

import AccountDetails from './AccountDetails';

// initialize logging for this card
import { initializeLogging } from '../util/log-level';
initializeLogging('default');

const Page = (props) => {
    console.log('props', props);
    const { basePath } = usePageInfo();

    return (
        <Router basename={basePath}>
            <Switch>
                <Route path="/" render={() => (
                    <AccountDetails/>
                )}/>
            </Switch>
        </Router>
    );
};

export default withIntl(Page);
