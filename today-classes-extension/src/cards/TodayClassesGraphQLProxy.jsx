import React from 'react';

import {ExtensionProvider, useData } from '@ellucian/experience-extension-hooks';

import { withIntl } from '../components/ReactIntlProviderWrapper';
import { IntlProvider } from '../context/intl';
import { TodayClassesProvider } from '../context/today-classes';
import TodayClasses from '../components/TodayClasses';
import { fetchTodayClassesWithGraphQLProxy } from '../data/today-classes';

const TodayClassesCard = () => {
    const { getEthosQuery } = useData();
    const getTodaysClasses = () => fetchTodayClassesWithGraphQLProxy({getEthosQuery});

    return (
        <TodayClassesProvider type={'proxy'} getTodaysClasses={getTodaysClasses}>
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
