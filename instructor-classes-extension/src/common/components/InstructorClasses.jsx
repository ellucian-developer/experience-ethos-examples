// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import React, { Fragment, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Divider, Illustration, IMAGES, List, Typography } from '@ellucian/react-design-system/core'
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { colorFillAlertError, spacing40 } from '@ellucian/react-design-system/core/styles/tokens';

import { useExtensionControl } from '@ellucian/experience-extension/extension-utilities';

import Event from './Event';
import { useInstructorData } from '../context/instructor-classes';

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

const InstructorClasses = ({classes}) => {
    const intl = useIntl();
    const { isErrorState, events = [], loading } = useInstructorData();
    const { setErrorMessage, setLoadingStatus } = useExtensionControl();
    const [ colorContext ] = useState({});

    useEffect(() => {
        if (setLoadingStatus) {
            setLoadingStatus(loading !== undefined ? loading : true);
        }
    }, [loading, setLoadingStatus])

    useEffect(() => {
        if (isErrorState) {
            setErrorMessage({
                headerMessage: intl.formatMessage({id: 'Classes.contact.administrator'}),
                textMessage: intl.formatMessage({id: 'Classes.data.error'}),
                iconName: 'warning',
                iconColor: colorFillAlertError
            });
        }
    }, [isErrorState, setErrorMessage])

    if (loading) {
        return null;
    }

    const lastEventIndex = Array.isArray(events) ? events.length - 1 : 0;

    if (events && events.length === 0) {
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
};

InstructorClasses.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InstructorClasses);
