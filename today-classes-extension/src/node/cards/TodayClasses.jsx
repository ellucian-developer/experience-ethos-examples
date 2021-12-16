import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { CircularProgress } from '@ellucian/react-design-system/core'
import { withStyles } from '@ellucian/react-design-system/core/styles';

import {ExtensionProvider, useCardInfo, useData } from '@ellucian/experience-extension-hooks';

import { withIntl } from '../../common/components/ReactIntlProviderWrapper';
import { TodayClassesProvider } from '../../common/context/today-classes';
import { fetchTodayClasses } from '../data/today-classes';

import { initializeLogging } from '../../util/log-level';
initializeLogging('Node');

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
    const { getExtensionJwt } = useData();
    const { configuration: {nodeUrl: url} = {} } = useCardInfo();
    const getTodaysClasses = () => fetchTodayClasses({getExtensionJwt, url});

    return (
        <TodayClassesProvider type={'node'} getTodaysClasses={getTodaysClasses}>
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
            <TodayClasseCardWithStyles/>
        </ExtensionProvider>
    )
}

export default withIntl(CardWithProviders);
