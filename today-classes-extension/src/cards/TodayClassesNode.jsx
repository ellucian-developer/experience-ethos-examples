import React from 'react';

import {ExtensionProvider, useCardInfo, useData } from '@ellucian/experience-extension-hooks';

import { withIntl } from '../components/ReactIntlProviderWrapper';
import { IntlProvider } from '../context/intl';
import { TodayClassesProvider } from '../context/today-classes';
import TodayClasses from '../components/TodayClasses';
import { fetchTodayClassesFromNode } from '../data/today-classes';

const TodayClassesCard = () => {
    const { getExtensionJwt } = useData();
    const { configuration: {nodeUrl: url} = {} } = useCardInfo();
    const getTodaysClasses = () => fetchTodayClassesFromNode({getExtensionJwt, url});

    return (
        <TodayClassesProvider type={'node'} getTodaysClasses={getTodaysClasses}>
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
