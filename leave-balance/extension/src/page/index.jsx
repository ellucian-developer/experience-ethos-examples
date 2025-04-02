// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withIntl } from '../i18n/ReactIntlProviderWrapper';

import { usePageInfo } from '@ellucian/experience-extension-utils';

import LeaveBalance from './LeaveBalance';

// initialize logging for this card
import { initializeLogging } from '../util/log-level';
initializeLogging('default');

const Page = () => {
    const { basePath } = usePageInfo();

    return (
            <Router basename={basePath}>
                <Switch>
                    <Route path="/" render={() => (
                        <LeaveBalance/>
                    )}/>
                </Switch>
            </Router>
    );
};

export default withIntl(Page);
