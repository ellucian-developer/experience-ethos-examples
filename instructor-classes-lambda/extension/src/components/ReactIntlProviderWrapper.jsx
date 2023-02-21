// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React from 'react';
import { injectIntl, IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import { getMessages } from '../i18n/intlUtility';

export function withIntl(WrappedComponent) {
    let InjectedComponent;

    class WithIntl extends React.Component {
        constructor(props) {
            super(props);
            InjectedComponent = injectIntl(WrappedComponent);
        }
        render() {
            const { userInfo: { locale } } = this.props;

            return (
                <IntlProvider locale={locale} messages={getMessages(locale)}>
                    <InjectedComponent {...this.props} />
                </IntlProvider>
            );
        }
    }
    WithIntl.propTypes = {
        userInfo: PropTypes.object
    };
    WithIntl.displayName = `WithIntl(${WrappedComponent.displayName})`;
    return WithIntl;
}
