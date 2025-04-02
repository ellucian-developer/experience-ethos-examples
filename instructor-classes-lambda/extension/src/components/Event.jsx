// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
    ListItem,
    Typography
} from '@ellucian/react-design-system/core'

import { withStyles } from '@ellucian/react-design-system/core/styles';
import {
    fontWeightBold,
    purple400,
    spacing30
} from '@ellucian/react-design-system/core/styles/tokens';

import { useUserInfo } from '@ellucian/experience-extension-utils';

import { randomPathColor } from '../util/path';

const styles = () => ({
    item: {
        paddingLeft: '0px',
        paddingRight: '0px',
        display: 'flex'
    },
    timeBox: {
        flex: '0 1 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    startTime: {
        fontWeight: fontWeightBold,
        minWidth: '3.5625rem'
    },
    endTime: {
        minWidth: '3.5625rem'
    },
    classBox: {
        flex: '1 1 auto',
        minWidth: '0px',
        paddingTop: spacing30,
        paddingBottom: spacing30,
        paddingLeft: spacing30,
        borderLeftStyle: 'solid',
        borderLeftColor: purple400
    }
});

const Event = ({ classes, colorContext, event }) => {
    const { locale } = useUserInfo();
    const intl = useIntl();
    const timeFormat = useMemo(() => (locale ? new Intl.DateTimeFormat(locale, { timeStyle: 'short'}) : undefined), [locale]);

    const {
        course: { abbreviation: courseAbbreviation, number: courseNumber, title: courseTitle },
        id,
        locations,
        startOn,
        endOn
    } = event;
    const color = randomPathColor(colorContext);

    return (
        <ListItem key={id} className={classes.item}>
            <div className={classes.timeBox}>
                <Typography className={classes.startTime} variant={'body3'} component={'div'}>
                    {timeFormat.format(new Date(startOn))}
                </Typography>
                <Typography className={classes.endTime} variant={'body3'} component={'div'}>
                    {timeFormat.format(new Date(endOn))}
                </Typography>
             </div>
             <div className={classes.classBox} style={{borderLeftColor: color}}>
                <Typography variant={'body2'} className={classes.title} component={'div'} noWrap={true}>
                    {intl.formatMessage({id: 'Classes.courseAbbrNumberTitle'}, {courseAbbreviation, courseNumber, courseTitle})}
                </Typography>
                    {locations.map(location => {
                        const { buildingTitle, roomNumber } = location;
                        const locationValue = `${buildingTitle} ${roomNumber}`

                        return (
                            <Typography key={locationValue} variant={'body3'} component={'div'}>{locationValue}</Typography>
                        )
                    })}
            </div>
        </ListItem>
    )
}

Event.propTypes = {
    classes: PropTypes.object.isRequired,
    colorContext: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired
};

export default withStyles(styles)(Event);
