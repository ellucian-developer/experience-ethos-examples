// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@ellucian/react-design-system/core'
import { colorFillAlertError, colorTextAlertSuccess, spacing30, spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { withStyles } from '@ellucian/react-design-system/core/styles';

import { useExtensionControl, useUserInfo } from '@ellucian/experience-extension-utils';

import { DataQueryProvider, userTokenDataConnectQuery, useDataQuery } from '@ellucian/experience-extension-extras';

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
        flexDirection: 'column'
    },
    leaveTableBox: {
        marginBottom: spacing30,
        overflowX: 'auto'
    },
    leaveBalanceLabel: {
        marginBottom: spacing30
    },
    leaveTable: {
        minWidth: 500
    },
    transactionAmountPayment: {
        color: colorTextAlertSuccess
    }
});

function LeaveBalance({classes}) {
    const intl = useIntl();

    // Experience SDK hooks
    const { setErrorMessage, setLoadingStatus } = useExtensionControl();
    const { locale } = useUserInfo();

    const { data, isError, isLoading} = useDataQuery('ethos-example-leave-balance');

    const [ leaves, setLeaves ] = useState([]);

    const [ dateFormater, setDateFormater ] = useState();

    // set up formaters with user's locale
    useEffect(() => {
        if (locale) {
            setDateFormater(new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit'}));
        }
    }, [locale])

    useEffect(() => {
        setLoadingStatus(isLoading && !data);
    }, [data, isLoading])

    useEffect(() => {
        if (data) {
            const leaves = data;
            if (leaves) {
                leaves.sort((left, right) => (right.dateAvail?.localeCompare(left.dateAvail)));
            }
            setLeaves(leaves);
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

    if (!data) {
        // nothing to show yet
        return null;
    }

    return (
        <div className={classes.root}>
        <div className={classes.content}>
            <>
                {Array.isArray(leaves) && leaves.length > 0 && (
                    <div className={classes.transactionsBox}>
                        <Typography variant={'h4'} component={'div'} className={classes.leaveBalanceLabel}>
                            {intl.formatMessage({id: 'LeaveBalance.leaveBalance'})}
                        </Typography>
                        <div className={classes.leaveTableBox}>
                            <Table className={classes.leaveTable}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{intl.formatMessage({id: 'LeaveBalance.type'})}</TableCell>
                                    <TableCell>{intl.formatMessage({id: 'LeaveBalance.beginBalance'})}</TableCell>
                                    <TableCell>{intl.formatMessage({id: 'LeaveBalance.taken'})}</TableCell>
                                    <TableCell>{intl.formatMessage({id: 'LeaveBalance.dateAvail'})}</TableCell>
                                    <TableCell>{intl.formatMessage({id: 'LeaveBalance.accrued'})}</TableCell>
                                    <TableCell align="right">{intl.formatMessage({id: 'LeaveBalance.balance'})}</TableCell>
                                </TableRow>
                            </TableHead>
                                <TableBody>
                                    {leaves.map((leave, index) => {
                                        const { leavDesc, beginBalance, taken, dateAvail, accrued, totalBalance } = leave;
                                        const availDate = dateAvail ? dateFormater.format(new Date(dateAvail)) : '';
                                        return (
                                            <TableRow key={index} className={classes.leaveTableRow}>
                                                <TableCell align="left">
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {leavDesc}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {beginBalance}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {taken}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {availDate}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {accrued}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {totalBalance}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
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
    const options = {
        queryFunction: userTokenDataConnectQuery,
        resource: 'ethos-example-leave-balance'
    }

    return (
        <DataQueryProvider options={options}>
            <LeaveBalanceWithStyle/>
        </DataQueryProvider>
    )
}

export default LeaveBalanceWithProviders;