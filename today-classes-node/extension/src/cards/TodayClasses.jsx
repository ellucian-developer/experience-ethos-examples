// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { Fragment, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Divider, Illustration, IMAGES, List, Typography } from '@ellucian/react-design-system/core'
import { colorFillAlertError, spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { withStyles } from '@ellucian/react-design-system/core/styles';

import { useExtensionControl } from '@ellucian/experience-extension/extension-utilities';

import { withIntl } from '../i18n/ReactIntlProviderWrapper';
import Event from '../components/Event';
import { TodayClassesProvider, useTodayData } from '../context/today-classes';

// initialize logging for this card
import { initializeLogging } from '../util/log-level';
initializeLogging('default');

const styles = () => ({
    root: {
        height: '100%',
        marginTop: 0,
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40,
        display: 'flex',
        flexDirection: 'column'
    },
    list: {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    divider: {
        marginTop: '0px',
        marginBottom: '0px'
    },
    time: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    noClasses: {
        height: '100%',
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

function TodayClasses({classes}) {
    const intl = useIntl();

    // Experience SDK hooks
    const { setErrorMessage, setLoadingStatus } = useExtensionControl();

    const { events, isError, isLoading } = useTodayData();
    const [ colorContext ] = useState({});

    useEffect(() => {
        setLoadingStatus(isLoading && !events);
    }, [events, isLoading])

    useEffect(() => {
        if (isError) {
            setErrorMessage({
                headerMessage: intl.formatMessage({id: 'Classes.contact.administrator'}),
                textMessage: intl.formatMessage({id: 'Classes.data.error'}),
                iconName: 'warning',
                iconColor: colorFillAlertError
            });
        }
    }, [isError, setErrorMessage])

    const lastEventIndex = Array.isArray(events) ? events.length - 1 : 0;

    if (isLoading && !events) {
        return null;
    }

    if (!events || !Array.isArray(events) || events.length === 0) {
        return (
            <div className={classes.noClasses}>
                <Illustration name={IMAGES.NEWS} />
                <Typography color="textSecondary">
                    {intl.formatMessage({id: 'Classes.no.classes'})}
                </Typography>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <List className={classes.list}>
                {events.map( (event, index) => (
                    <Fragment key={event.id}>
                        <Event event={event} colorContext={colorContext}/>
                        {index !== lastEventIndex && (
                            <Divider className={classes.divider} variant={'middle'} />
                        )}
                    </Fragment>
                ))}
            </List>
        </div>
    );
}

TodayClasses.propTypes = {
    classes: PropTypes.object.isRequired
};

const TodayClassesWithStyle = withStyles(styles)(TodayClasses);

function TodayClassesWithProviders() {
    return (
        <TodayClassesProvider>
            <TodayClassesWithStyle/>
        </TodayClassesProvider>
    )
}

export default withIntl(TodayClassesWithProviders);