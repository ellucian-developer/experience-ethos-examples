// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { Divider, Illustration, IMAGES, List, makeStyles, Typography } from '@ellucian/react-design-system/core'
import { colorFillAlertError, spacing40, spacing80 } from '@ellucian/react-design-system/core/styles/tokens';

import { useCardInfo, useExtensionControl } from '@ellucian/experience-extension-utils';
import { DataQueryProvider, experienceTokenQuery, useDataQuery } from '@ellucian/experience-extension-extras';

import { withIntl } from '../i18n/ReactIntlProviderWrapper';
import Event from '../components/Event';
import { useDashboard } from '../hooks/dashboard';
import { useTodayClasses } from '../hooks/today-classes';

// initialize logging for this card
import { initializeLogging } from '../util/log-level';
initializeLogging('default');

const resource = 'today-classes';

const useStyles = makeStyles(() => ({
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
    messageBox: {
        height: '100%',
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    message: {
        marginLeft: spacing80,
        marginRight: spacing80,
        textAlign: 'center'
    }
}), { index: 2});

function TodayClasses() {
    const intl = useIntl();
    const classes = useStyles();

    // Experience SDK hooks
    const { setErrorMessage, setLoadingStatus } = useExtensionControl();

    const { dataError, inPreviewMode, isError, isLoading, isRefreshing } = useDataQuery(resource);
    const events = useTodayClasses();
    useDashboard(resource);

    const [ colorContext ] = useState({});

    useEffect(() => {
        setLoadingStatus((isLoading && !events) || isRefreshing);
    }, [events, isLoading, isRefreshing])

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

    if (!events  && inPreviewMode && dataError?.statusCode === 404) {
        return (
            <div className={classes.messageBox}>
                <Typography className={classes.message} color="textSecondary">
                    {intl.formatMessage({id: 'Classes.not.configured'})}
                </Typography>
            </div>
        );
    } else if (events && Array.isArray(events) && events.length > 0) {
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
    } else {
        return (
            <div className={classes.messageBox}>
                <Illustration name={IMAGES.NEWS} />
                <Typography color="textSecondary">
                    {intl.formatMessage({id: 'Classes.no.classes'})}
                </Typography>
            </div>
        );
    }
}

function TodayClassesWithProviders() {
    const {
        configuration: {
            serviceUrl
        } = {}
     } = useCardInfo();

    const options = useMemo(() => ({
        queryKeys: {
            searchParameters: {
                date: new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
            }
        },
        queryFunction: experienceTokenQuery,
        queryParameters: { serviceUrl },
        resource: resource
    }));

    return (
        <DataQueryProvider options={options}>
            <TodayClasses/>
        </DataQueryProvider>
    )
}

export default withIntl(TodayClassesWithProviders);
