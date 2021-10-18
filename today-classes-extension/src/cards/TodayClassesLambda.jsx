import React from 'react';

import {ExtensionProvider, useCardInfo, useData } from '@ellucian/experience-extension-hooks';

import { withIntl } from '../components/ReactIntlProviderWrapper';
import { IntlProvider } from '../context/intl';
import { TodayClassesProvider } from '../context/today-classes';
import TodayClasses from '../components/TodayClasses';
import { fetchTodayClassesFromLambda } from '../data/today-classes';

const TodayClassesCard = () => {
    const { getExtensionJwt } = useData();
    const { configuration: {lambdaUrl: url} = {} } = useCardInfo();
    const getTodaysClasses = () => fetchTodayClassesFromLambda({getExtensionJwt, url});

    return (
        <TodayClassesProvider type={'lambda'} getTodaysClasses={getTodaysClasses}>
            <TodayClasses/>
        </TodayClassesProvider>
    );
};

function CardWithProviders(props) {
    return (
        <ExtensionProvider {...props}>
            <IntlProvider {...props}>
                <TodayClassesCard/>
            </IntlProvider>
        </ExtensionProvider>
    )
}

export default withIntl(CardWithProviders);
