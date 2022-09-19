// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import React from 'react';

import { withStyles } from '@ellucian/react-design-system/core/styles';

import { useCardInfo, useData } from '@ellucian/experience-extension/extension-utilities';

import { withIntl } from '../common/components/ReactIntlProviderWrapper';
import InstructorClasses from '../common/components/InstructorClasses';
import { InstructorClassesProvider } from '../common/context/instructor-classes';
import { fetchInstructorClasses } from '../lambda/data/instructor-classes';

import { initializeLogging } from '../util/log-level';
initializeLogging('Instructor Classes');

const styles = () => ({
    loading: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const InstructorClassesCard = () => {
    const { getExtensionJwt } = useData();
    const { configuration: {lambdaUrl: url} = {} } = useCardInfo();
    const getInstructorsClasses = () => fetchInstructorClasses({getExtensionJwt, url});

    return (
        <InstructorClassesProvider type={'lambda'} getInstructorsClasses={getInstructorsClasses}>
            <InstructorClasses/>
        </InstructorClassesProvider>
    );
};

export default withIntl(withStyles(styles)(InstructorClassesCard));
