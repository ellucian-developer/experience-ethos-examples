import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { CircularProgress } from '@ellucian/react-design-system/core'
import { withStyles } from '@ellucian/react-design-system/core/styles';

import {ExtensionProvider, useData } from '@ellucian/experience-extension-hooks';

import { withIntl } from '../../common/components/ReactIntlProviderWrapper';
import { IntlProvider } from '../../common/context/intl';
import { TodayClassesProvider } from '../../common/context/today-classes';
import { fetchTodayClasses } from '../data/today-classes';

// load TodayClasses lazily to trim overal size
const TodayClasses = React.lazy(() => import('../../common/components/TodayClasses'));

const styles = () => ({
    loading: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const TodayClassesCard = ({classes}) => {
    const { getEthosQuery } = useData();
    const getTodaysClasses = () => fetchTodayClasses({getEthosQuery});

    return (
        <TodayClassesProvider type={'proxy'} getTodaysClasses={getTodaysClasses}>
            <Suspense fallback={<div className={classes.loading}><CircularProgress/></div>}>
                <TodayClasses/>
            </Suspense>
        </TodayClassesProvider>
    );
};

TodayClassesCard.propTypes = {
    classes: PropTypes.object.isRequired
};

const TodayClasseCardWithStyles = withStyles(styles)(TodayClassesCard);

function CardWithProviders(props) {
    return (
        <ExtensionProvider {...props}>
            <IntlProvider {...props}>
                <TodayClasseCardWithStyles/>
            </IntlProvider>
        </ExtensionProvider>
    )
}

export default withIntl(CardWithProviders);