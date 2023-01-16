// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, Table, TableBody, TableCell, TableRow, TableHead, Typography } from '@ellucian/react-design-system/core'
import { colorFillAlertError, colorTextAlertSuccess, spacing30, spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { withStyles } from '@ellucian/react-design-system/core/styles';

import { withIntl } from '../i18n/ReactIntlProviderWrapper';

import { useCardControl, useExtensionControl } from '@ellucian/experience-extension/extension-utilities';

import { LeaveBalanceProvider, useLeaveBalance } from '../context/leave-balance';

// initialize logging for this card
import { initializeLogging } from '../util/log-level';
initializeLogging('default');

const styles = () => ({
    root:{
        height: '100%',
        overflowY: 'auto'
    },
    content: {
        height: '100%',
        marginTop: 0,
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    leaveDetails: {
        float: 'right',
        marginTop: spacing40
    },
    leaveBalanceLabel: {
        marginBottom: spacing30
    },
    leaveTableBox: {
    },
    leaveTableRow: {
        height: 'auto'
    },
    transactionAmountPayment: {
        color: colorTextAlertSuccess
    }
});

function LeaveBalance({classes}) {
    const intl = useIntl();

    // Experience SDK hooks
    const { navigateToPage } = useCardControl();
    const { setErrorMessage, setLoadingStatus } = useExtensionControl();

    const { data, isError, isLoading } = useLeaveBalance();

    const [ leaves, setLeaves ] = useState();

    useEffect(() => {
        setLoadingStatus(isLoading && !data);
    }, [data, isLoading])

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setLeaves(data?.sort((left, right) => (right.dateAvail?.localeCompare(left.dateAvail))));
        }
    }, [data])

    useEffect(() => {
        if (isError) {
            setErrorMessage({
                headerMessage: intl.formatMessage({id: 'LeaveBalance.contactAdministrator'}),
                textMessage: intl.formatMessage({id: 'LeaveBalance.dataError'}),
                iconName: 'warning',
                iconColor: colorFillAlertError
            });
        }
    }, [isError, setErrorMessage])

    const onLeaveDetailsClick = useCallback(() => {
        // open the page
        navigateToPage({route: '/'});
    }, [navigateToPage])

    if (!data) {
        // nothing to show yet
        return null;
    }

    return (
        <div className={classes.root}>
        <div className={classes.content}>
            <>
                {Array.isArray(leaves) && leaves.length > 0 && (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <div>
                        <Typography variant={'h4'} component={'div'} className={classes.leaveBalanceLabel}>
                            {intl.formatMessage({id: 'LeaveBalance.leaveBalance'})}
                        </Typography>
                        <div className={classes.leaveTableBox}>
                            <Table className={classes.leaveTable}>
                                <TableHead>
                                    <TableRow className={classes.leaveTableRow}>
                                        <TableCell align="left" padding={'none'}>{intl.formatMessage({id: 'LeaveBalance.type'})}</TableCell>
                                        <TableCell align="left" padding={'none'}>{intl.formatMessage({id: 'LeaveBalance.taken'})}</TableCell>
                                        <TableCell align="left" padding={'none'}>{intl.formatMessage({id: 'LeaveBalance.accrued'})}</TableCell>
                                        <TableCell align="right" padding={'none'} style={{"text-align": "right"}}>{intl.formatMessage({id: 'LeaveBalance.balance'})}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {leaves.map((leave, index) => {
                                        const { leavDesc, taken, accrued, totalBalance } = leave;
                                        // const amount = currencyFormater.format(chargeAmount ? chargeAmount : paymentAmount * -1);
                                        // const availDate = dateAvail ? dateFormater.format(new Date(dateAvail)) : '';
                                        return (
                                            <TableRow key={index} className={classes.leaveTableRow}>
                                                <TableCell align="left" padding={'none'}>
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {leavDesc}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left" padding={'none'}>
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {taken}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left" padding={'none'}>
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {accrued}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right" padding={'none'}>
                                                    <Typography variant={'body3'} component={'div'} >
                                                        {totalBalance}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                        <Button className={classes.leaveDetails} color='secondary' onClick={onLeaveDetailsClick}>
                            {intl.formatMessage({id: 'LeaveBalance.details'})}
                        </Button>
                    </div>
                )}
            </>
        </div>
        </div>
    );
}

LeaveBalance.propTypes = {
    classes: PropTypes.object.isRequired
};

const LeaveBalanceWithStyle = withStyles(styles)(LeaveBalance);

function LeaveBalanceWithProviders() {
    return (
        <LeaveBalanceProvider>
            <LeaveBalanceWithStyle/>
        </LeaveBalanceProvider>
    )
}

export default withIntl(LeaveBalanceWithProviders);