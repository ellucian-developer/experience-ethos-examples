// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Button, Table, TableBody, TableCell, TableRow, TableHead, Typography } from '@ellucian/react-design-system/core'
import { colorFillAlertError, colorTextAlertSuccess, spacing30, spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { withStyles } from '@ellucian/react-design-system/core/styles';

import { withIntl } from '../i18n/ReactIntlProviderWrapper';

import { useCardControl, useCardInfo, useExtensionControl, useUserInfo } from '@ellucian/experience-extension/extension-utilities';

import { LeaveBalanceProvider, useLeaveBalance } from '../context/leave-balance';

// initialize logging for this card
import { initializeLogging } from '../util/log-level';
initializeLogging('default');

const featurePayNow = process.env.FEATURE_PAY_NOW === 'true';

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
    recentTransactions: {
        marginBottom: spacing30
    },
    transactionsTableBox: {
    },
    transactionsTableRow: {
        height: 'auto'
    },
    transactionAmountPayment: {
        color: colorTextAlertSuccess
    },
    amountBoxRow: {
        marginTop: spacing40,
        marginBottom: spacing40,
        display: 'flex',
        justifyContent: 'center'
    },
    amountBoxRowPayNow: {
        justifyContent: 'space-between'
    },
    amountBox: {
        display: 'flex',
        flexDirection: 'column'
    },
    amountRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    amount: {
        marginLeft: spacing30
    }
    // payNowButton: {
    //     marginLeft: spacing30
    // }
});

function LeaveBalance({classes}) {
    const intl = useIntl();

    // Experience SDK hooks
    const { navigateToPage } = useCardControl();
    const { configuration: { payNowUrl } = {} } = useCardInfo();
    const { setErrorMessage, setLoadingStatus } = useExtensionControl();
    const { locale } = useUserInfo();

    const { data, isError, isLoading } = useLeaveBalance();

    const [ leaves, setLeaves ] = useState();
    const [ summary, setSummary ] = useState();
    const [ dateFormater, setDateFormater ] = useState();
    const [ currencyFormater, setCurrencyFormater ] = useState();

    // set up formaters with user's locale
    useEffect(() => {
        if (locale) {
            setDateFormater(new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit'}));
            setCurrencyFormater(new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }))
        }
    }, [locale])

    useEffect(() => {
        setLoadingStatus(isLoading);
    }, [isLoading])

    useEffect(() => {
        if (data) {
            const leaves = data;
            // let summarys = [{
            //     accountBalance: 0,
            //     amountDue: 0
            // }];

            if (leaves) {
                leaves.sort((left, right) => (right.dateAvail?.localeCompare(left.dateAvail)));
            }

            setLeaves(leaves);
            // setSummary(() => summarys[0]);
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

    function onPayNow() {
        if (payNowUrl) {
            window.open(payNowUrl, '_blank');
        }
    }

    const showPayNow = featurePayNow && payNowUrl && summary?.accountBalance > 0;

    return (
        <div className={classes.root}>
        <div className={classes.content}>
            <>
                {Array.isArray(leaves) && leaves.length > 0 && (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <div>
                        <Typography variant={'h4'} component={'div'} className={classes.recentTransactions}>
                            {intl.formatMessage({id: 'LeaveBalance.leaveBalance'})}
                        </Typography>
                        <div className={classes.transactionsTableBox}>
                            <Table className={classes.transactionsTable}>
                                <TableHead>
                                    <TableRow className={classes.transactionsTableRow}>
                                        <TableCell align="left" padding={'none'}> Type </TableCell>
                                        <TableCell align="left" padding={'none'}> Taken </TableCell>
                                        <TableCell align="left" padding={'none'}> Accrued </TableCell>
                                        <TableCell align="right" padding={'none'} style={{"text-align": "right"}}> Balance </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {leaves.map((leave, index) => {
                                        const { leavDesc, taken, accrued, totalBalance } = leave;
                                        // const amount = currencyFormater.format(chargeAmount ? chargeAmount : paymentAmount * -1);
                                        // const availDate = dateAvail ? dateFormater.format(new Date(dateAvail)) : '';
                                        return (
                                            <TableRow key={index} className={classes.transactionsTableRow}>
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
                {/* {summary && (
                    <div className={classnames(classes.amountBoxRow, { [classes.amountBoxRowPayNow]: showPayNow })}>
                        <div className={classes.amountBox}>
                            <div className={classes.amountRow}>
                                <Typography variant={'h4'} component={'div'}>
                                    {intl.formatMessage({id: 'LeaveBalance.accountBalance'})}
                                </Typography>
                                <Typography variant={'body2'} component={'div'} className={classes.amount}>
                                    {currencyFormater.format(summary.accountBalance)}
                                </Typography>
                            </div>
                            <div className={classes.amountRow}>
                            <Typography variant={'h4'} component={'div'}>
                                {intl.formatMessage({id: 'LeaveBalance.amountDue'})}
                            </Typography>
                            <Typography variant={'body2'} component={'div'} className={classes.amount}>
                                {currencyFormater.format(summary.amountDue)}
                            </Typography>
                            </div>
                        </div>
                        {showPayNow && (
                            <Button className={classes.payNowButton} color='secondary' onClick={onPayNow}>
                                {intl.formatMessage({id: 'LeaveBalance.payNow'})}
                            </Button>
                        )}
                    </div>
                )} */}
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