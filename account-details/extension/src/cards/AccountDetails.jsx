// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import classnames from 'classnames';

import { Button, makeStyles, Table, TableBody, TableCell, TableRow, Typography } from '@ellucian/react-design-system/core'
import { colorFillAlertError, colorTextAlertSuccess, spacing30, spacing40, spacing80 } from '@ellucian/react-design-system/core/styles/tokens';

import { withIntl } from '../i18n/ReactIntlProviderWrapper';

import { useCardControl, useCardInfo, useExtensionControl, useUserInfo,  } from '@ellucian/experience-extension-utils';
import { DataQueryProvider, experienceTokenQuery, useDataQuery } from '@ellucian/experience-extension-extras';

import { useDashboard } from '../hooks/dashboard';

// initialize logging for this card
import { initializeLogging } from '../util/log-level';
initializeLogging('default');

const featurePayNow = process.env.FEATURE_PAY_NOW === 'true';

const useStyles = makeStyles(() => ({
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
    transactionsBox: {
        cursor: 'pointer'
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
    },
    payNowButton: {
        marginLeft: spacing30
    },
    message: {
        marginLeft: spacing80,
        marginRight: spacing80,
        textAlign: 'center'
    }
}), { index: 2});

const resource = 'account-detail-reviews';

function AccountDetails() {
    const intl = useIntl();
    const classes = useStyles();

    // Experience SDK hooks
    const { navigateToPage } = useCardControl();
    const { configuration: { payNowUrl } = {} } = useCardInfo();
    const { setErrorMessage, setLoadingStatus } = useExtensionControl();
    const { locale } = useUserInfo();

    useDashboard(resource);

    const { data, dataError, inPreviewMode, isError, isLoading, isRefreshing } = useDataQuery(resource);

    const [ transactions, setTransactions ] = useState();
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
        setLoadingStatus(isRefreshing || (!data && isLoading));
    }, [data, isLoading, isRefreshing])

    useEffect(() => {
        if (data) {
            const [results] = data;
            let transactions = [];
            let summarys = [{
                accountBalance: 0,
                amountDue: 0
            }];

            if (results) {
                ({ TBRACCD: transactions, TBRACCD_CTRL: summarys } = results);
                transactions.sort((left, right) => (right.transDate?.localeCompare(left.transDate)));
            }

            setTransactions(() => transactions.slice(0, 5));
            setSummary(() => summarys[0]);
        }
    }, [data])

    useEffect(() => {
        if (isError) {
            setErrorMessage({
                headerMessage: intl.formatMessage({id: 'AccountDetails.contactAdministrator'}),
                textMessage: intl.formatMessage({id: 'AccountDetails.dataError'}),
                iconName: 'warning',
                iconColor: colorFillAlertError
            });
        }
    }, [isError, setErrorMessage])

    const onTransactionsClick = useCallback(() => {
        // open the page
        navigateToPage({route: '/'});
    }, [navigateToPage])

    function onPayNow() {
        if (payNowUrl) {
            window.open(payNowUrl, '_blank');
        }
    }

    const showPayNow = featurePayNow && payNowUrl && summary?.accountBalance > 0;

    if (!data && inPreviewMode && dataError?.statusCode === 404) {
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <Typography className={classes.message} variant="body1" component="div">
                        {intl.formatMessage({ id: 'AccountDetails.notConfigured'})}
                    </Typography>
                </div>
            </div>
        );
    } else if (data && transactions && Array.isArray(transactions) && transactions.length > 0) {
        return (
            <div className={classes.root}>
            <div className={classes.content}>
                <>
                    <div className={classes.transactionsBox} onClick={onTransactionsClick} onKeyUp={onTransactionsClick} role='button' tabIndex={0}>
                        <Typography variant={'h4'} component={'div'} className={classes.recentTransactions}>
                            {intl.formatMessage({id: 'AccountDetails.recentTransactions'})}
                        </Typography>
                        <div className={classes.transactionsTableBox}>
                            <Table className={classes.transactionsTable}>
                                <TableBody>
                                    {transactions.map(transaction => {
                                        const { chargeAmount, desc, paymentAmount, transDate, tranNumber } = transaction;
                                        const amount = currencyFormater.format(chargeAmount ? chargeAmount : paymentAmount * -1);
                                        const transactionDate = transDate ? dateFormater.format(new Date(transDate)) : '';
                                        return (
                                            <TableRow key={tranNumber} className={classes.transactionsTableRow}>
                                                <TableCell align="left" padding={'none'}>
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {transactionDate}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left" padding={'none'}>
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {desc}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right" padding={'none'}>
                                                    <Typography variant={'body3'} component={'div'} className={classnames({[classes.transactionAmountPayment]: !chargeAmount})}>
                                                        {amount}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    {summary && (
                        <div className={classnames(classes.amountBoxRow, { [classes.amountBoxRowPayNow]: showPayNow })}>
                            <div className={classes.amountBox}>
                                <div className={classes.amountRow}>
                                    <Typography variant={'h4'} component={'div'}>
                                        {intl.formatMessage({id: 'AccountDetails.accountBalance'})}
                                    </Typography>
                                    <Typography variant={'body2'} component={'div'} className={classes.amount}>
                                        {currencyFormater.format(summary.accountBalance)}
                                    </Typography>
                                </div>
                                <div className={classes.amountRow}>
                                <Typography variant={'h4'} component={'div'}>
                                    {intl.formatMessage({id: 'AccountDetails.amountDue'})}
                                </Typography>
                                <Typography variant={'body2'} component={'div'} className={classes.amount}>
                                    {currencyFormater.format(summary.amountDue)}
                                </Typography>
                                </div>
                            </div>
                            {showPayNow && (
                                <Button className={classes.payNowButton} color='secondary' onClick={onPayNow}>
                                    {intl.formatMessage({id: 'AccountDetails.payNow'})}
                                </Button>
                            )}
                        </div>
                    )}
                </>
            </div>
            </div>
        );
    } else {
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <Typography className={classes.message} variant="body1" component="div">
                        {intl.formatMessage({ id: 'AccountDetails.noTransactions'})}
                    </Typography>
                </div>
            </div>
        );
    }
}

function AccountDetailsWithProviders() {
    const {
        configuration: {
            serviceUrl
        } = {}
     } = useCardInfo();

    const options = useMemo(() => ({
        queryFunction: experienceTokenQuery,
        queryParameters: { serviceUrl },
        resource: resource
    }));

    return (
        <DataQueryProvider options={options}>
            <AccountDetails/>
        </DataQueryProvider>
    )
}

export default withIntl(AccountDetailsWithProviders);