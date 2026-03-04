// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import classnames from 'classnames';

import { Button, makeStyles, Table, TableBody, TableCell, TableRow, Typography } from '@ellucian/react-design-system/core'
import { colorFillAlertError, colorTextAlertSuccess, spacing30, spacing40, spacing80 } from '@ellucian/react-design-system/core/styles/tokens';

import { withIntl } from '../i18n/ReactIntlProviderWrapper';

import { useCardInfo, useExtensionControl, useUserInfo } from '@ellucian/experience-extension-utils';

import { DataQueryProvider, userTokenDataConnectQuery, useDataQuery } from '@ellucian/experience-extension-extras';
import { useDashboard } from '../hooks/dashboard';

// initialize logging for this card
import { initializeLogging } from '../util/log-level';
initializeLogging('default');

import log from 'loglevel';
// here for example of how to use logging in the card, but eslint is configured to not allow unused variables so the logger variable is not used in this file
// eslint-disable-next-line no-unused-vars
const logger = log.getLogger('default');

const featurePayNow = process.env.FEATURE_PAY_NOW === 'true';

const useStyles = makeStyles()({
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
});

function AccountDetails() {
    const intl = useIntl();
    const { classes } = useStyles();

    // Experience SDK hooks
    const { setErrorMessage, setLoadingStatus } = useExtensionControl();
    const { locale } = useUserInfo();
    const {
        configuration: {
            payNowUrl
        } = {}
     } = useCardInfo();

    const { data, dataError, inPreviewMode, isError, isLoading, isRefreshing } = useDataQuery(process.env.PIPELINE_GET_ACCOUNT_DETAILS);
    useDashboard();

    const [ transactions, setTransactions ] = useState();
    const [ summary, setSummary ] = useState();
    const dateFormatter = useMemo(() => (locale
        ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })
        : null), [locale]);
    const currencyFormatter = useMemo(() => (locale
        ? new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' })
        : null), [locale]);

    useEffect(() => {
        setLoadingStatus(isRefreshing || (!data && isLoading));
    }, [data, isLoading, isRefreshing, setLoadingStatus])

    useEffect(() => {
        if (data) {
            const [results] = data;
            let transactions = [];
            let summaries = [{
                accountBalance: 0,
                amountDue: 0
            }];

            if (results) {
                ({ TBRACCD: transactions, TBRACCD_CTRL: summaries } = results);
                transactions?.sort((left, right) => (right.transDate?.localeCompare(left.transDate)));
            }

            setTransactions(() => transactions?.slice(0, 5));
            setSummary(() => summaries[0]);
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
    }, [intl, isError, setErrorMessage])

    function onPayNow() {
        if (payNowUrl) {
            window.open(payNowUrl, '_blank');
        }
    }

    function formatDate(value) {
        return dateFormatter && value ? dateFormatter.format(new Date(value)) : '';
    }

    function formatCurrency(value) {
        return currencyFormatter ? currencyFormatter.format(value) : '';
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
                    <div>
                        <Typography variant={'h4'} component={'div'} className={classes.recentTransactions}>
                            {intl.formatMessage({id: 'AccountDetails.recentTransactions'})}
                        </Typography>
                        <div className={classes.transactionsTableBox}>
                            <Table className={classes.transactionsTable}>
                                <TableBody>
                                    {transactions.map(transaction => {
                                        const { chargeAmount, desc, paymentAmount, transDate, tranNumber } = transaction;
                                        const amount = formatCurrency(chargeAmount ? chargeAmount : paymentAmount * -1);
                                        const transactionDate = formatDate(transDate);
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
                                        {formatCurrency(summary.accountBalance)}
                                    </Typography>
                                </div>
                                <div className={classes.amountRow}>
                                <Typography variant={'h4'} component={'div'}>
                                    {intl.formatMessage({id: 'AccountDetails.amountDue'})}
                                </Typography>
                                <Typography variant={'body2'} component={'div'} className={classes.amount}>
                                    {formatCurrency(summary.amountDue)}
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
    const options = useMemo(() => ({
        queryFunction: userTokenDataConnectQuery,
        resource: process.env.PIPELINE_GET_ACCOUNT_DETAILS
    }), []);

    return (
        <DataQueryProvider options={options}>
            <AccountDetails/>
        </DataQueryProvider>
    )
}

export default withIntl(AccountDetailsWithProviders);