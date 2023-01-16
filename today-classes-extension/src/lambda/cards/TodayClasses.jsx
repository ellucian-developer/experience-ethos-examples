// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, {Suspense} from 'react';
import PropTypes from 'prop-types';

import { CircularProgress } from '@ellucian/react-design-system/core'
import { withStyles } from '@ellucian/react-design-system/core/styles';

import { useCardInfo, useData } from '@ellucian/experience-extension/extension-utilities';


import { withIntl } from '../../common/components/ReactIntlProviderWrapper';
import { TodayClassesProvider } from '../../common/context/today-classes';
import { fetchTodayClasses } from '../data/today-classes';

import { initializeLogging } from '../../util/log-level';
initializeLogging('Today');

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
    const { configuration: {lambdaUrl: url} = {} } = useCardInfo();
    const getTodaysClasses = () => fetchTodayClasses({getExtensionJwt, url});

    return (
        <TodayClassesProvider type={'lambda'} getTodaysClasses={getTodaysClasses}>
            <Suspense fallback={<div className={classes.loading}><CircularProgress/></div>}>
                <TodayClasses/>
            </Suspense>
        </TodayClassesProvider>
    );
};

TodayClassesCard.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withIntl(withStyles(styles)(TodayClassesCard));
