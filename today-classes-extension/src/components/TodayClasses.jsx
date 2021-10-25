import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Divider, List } from '@ellucian/react-design-system/core'
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';

import { useExtensionControl } from '@ellucian/experience-extension-hooks';

import Event from './Event';
import { useTodayData } from '../context/today-classes';

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
    }
});

const TodayClasses = ({classes}) => {
    const { events = [], loading } = useTodayData();
    const { setLoadingStatus } = useExtensionControl();
    const [ colorContext ] = useState({});

    useEffect(() => {
        if (setLoadingStatus) {
            setLoadingStatus(loading !== undefined ? loading : true);
        }
    }, [loading, setLoadingStatus])

    if (loading) {
        return null;
    }

    const lastEventIndex = Array.isArray(events) ? events.length - 1 : 0;

    return (
        <div className={classes.root}>
            <List className={classes.list}>
                {events.map( (event, index) => (
                    <Fragment key={event.id}>
                        {/* <Course key={section.id} section={section}/> */}
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

TodayClasses.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TodayClasses);
