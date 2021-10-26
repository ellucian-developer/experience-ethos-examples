import React from 'react';
import { injectIntl, IntlProvider, addLocaleData } from 'react-intl';
import PropTypes from 'prop-types';
import { getMessages } from '../i18n/intlUtility';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import ar from 'react-intl/locale-data/ar';
import fr from 'react-intl/locale-data/fr';

addLocaleData([ ...en, ...es, ...fr, ...ar ]);

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
