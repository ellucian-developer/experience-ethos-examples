// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import classenames from 'classnames';

import {
    Button,
    makeStyles,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    Typography
} from '@ellucian/react-design-system/core'
import { colorFillAlertError, colorTextAlertSuccess, spacing30, spacing40, widthFluid } from '@ellucian/react-design-system/core/styles/tokens';

import { useCardInfo, useData, useExtensionControl, useUserInfo } from '@ellucian/experience-extension-utils';

import { DataQueryProvider, experienceTokenQuery, useDataQuery } from '@ellucian/experience-extension-extras';

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
        flexDirection: 'column'
    },
    transactionPaper: {
        width: widthFluid
    },
    transactionsTableBox: {
        marginBottom: spacing30,
        overflowX: 'auto'
    },
    transactionsBox: {
    },
    recentTransactions: {
        marginBottom: spacing30
    },
    transactionsTable: {
        minWidth: 500
    },
    transactionAmountPayment: {
        color: colorTextAlertSuccess
    },
    amountBoxRow: {
        marginTop: spacing40,
        marginBottom: spacing40,
        display: 'flex',
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
    }
}), { index: 2});

function AccountDetails() {
    const intl = useIntl();
    const classes = useStyles();

    // Experience SDK hooks
    const { configuration, cardConfiguration } = useCardInfo();
    const { setErrorMessage, setLoadingStatus } = useExtensionControl();
    const { locale } = useUserInfo();

    const { payNowUrl } = configuration || cardConfiguration || {};

    const { data, isError, isLoading, isRefreshing } = useDataQuery('account-detail-reviews');

    const [ transactions, setTransactions ] = useState([]);
    const [ summary, setSummary ] = useState();

    const [ page, setPage ] = useState(0);
    const [ rowsPerPage, setRowsPerPage ] = useState(10);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, transactions.length - page * rowsPerPage);

    const [ dateFormater, setDateFormater ] = useState();
    const [ currentyFormater, setCurrentyFormater ] = useState();

    // set up formaters with user's locale
    useEffect(() => {
        if (locale) {
            setDateFormater(new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit'}));
            setCurrentyFormater(new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }))
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

            setTransactions(transactions);
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

    if (!data) {
        // nothing to show yet
        return null;
    }

    function handleChangePage(event, page) {
        setPage(page);
    }

    function handleChangeRowsPerPage(event) {
        setRowsPerPage(event.target.value)
    }

    function onPayNow() {
        if (payNowUrl) {
            window.open(payNowUrl, '_blank');
        }
    }

    const showPayNow = featurePayNow && payNowUrl && summary?.accountBalance > 0;
    const firstDate = Array.isArray(transactions) && transactions.length > 0 && transactions[0].transDate ? dateFormater.format((new Date(transactions[0]?.transDate) || Date.now)) : '';
    const lastDate = Array.isArray(transactions) && transactions.length > 0 && transactions[transactions.length - 1].transDate ? dateFormater.format(new Date(transactions[transactions.length - 1].transDate)) : '';
    return (
        <div className={classes.root}>
        <div className={classes.content}>
            <>
                {summary && (
                    <div className={classes.amountBoxRow}>
                        <div className={classes.amountBox}>
                            <div className={classes.amountRow}>
                                <Typography variant={'h4'} component={'div'}>
                                    {intl.formatMessage({id: 'AccountDetails.accountBalance'})}
                                </Typography>
                                <Typography variant={'body2'} component={'div'} className={classes.amount}>
                                    {currentyFormater.format(summary.accountBalance)}
                                </Typography>
                            </div>
                            <div className={classes.amountRow}>
                            <Typography variant={'h4'} component={'div'}>
                                {intl.formatMessage({id: 'AccountDetails.amountDue'})}
                            </Typography>
                            <Typography variant={'body2'} component={'div'} className={classes.amount}>
                                {currentyFormater.format(summary.amountDue)}
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
                {Array.isArray(transactions) && transactions.length > 0 && (
                    <div className={classes.transactionsBox}>
                        <Typography variant={'h4'} component={'div'} className={classes.recentTransactions}>
                            {intl.formatMessage({id: 'AccountDetails.transactionHistory'})} {firstDate} - {lastDate}
                        </Typography>
                        <Paper className={classes.transactionPaper}>
                        <div className={classes.transactionsTableBox}>
                            <Table className={classes.transactionsTable}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{intl.formatMessage({id: 'AccountDetails.transactionDate'})}</TableCell>
                                    <TableCell>{intl.formatMessage({id: 'AccountDetails.description'})}</TableCell>
                                    <TableCell>{intl.formatMessage({id: 'AccountDetails.type'})}</TableCell>
                                    <TableCell align="right">{intl.formatMessage({id: 'AccountDetails.amount'})}</TableCell>
                                </TableRow>
                            </TableHead>
                                <TableBody>
                                    {transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(transaction => {
                                        const { chargeAmount, desc, paymentAmount, transDate, tranNumber } = transaction;
                                        const transactionDate = transDate ? dateFormater.format(new Date(transDate)) : '';
                                        const type = chargeAmount ? intl.formatMessage({id: 'AccountDetails.charge'}) : intl.formatMessage({id: 'AccountDetails.payment'});
                                        const amount = currentyFormater.format(chargeAmount ? chargeAmount : paymentAmount * -1);
                                        return (
                                            <TableRow key={tranNumber} className={classes.transactionsTableRow}>
                                                <TableCell align="left">
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {transactionDate}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {desc}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography variant={'body3'} component={'div'}>
                                                        {type}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant={'body3'} component={'div'} className={classenames({[classes.transactionAmountPayment]: !chargeAmount})}>
                                                        {amount}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && [...Array(emptyRows)].map((value, index) => {
                                        return (
                                            <TableRow key={index} className={classes.transactionsTableRow}>
                                                <TableCell/>
                                                <TableCell/>
                                                <TableCell/>
                                                <TableCell/>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <Pagination
                                            component="td"
                                            count={transactions.length}
                                            rowsPerPage={rowsPerPage}
                                            rowsPerPageOptions={[10, 20, 50, 100]}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                        </Paper>
                    </div>
                )}
            </>
        </div>
        </div>
    );
}

function AccountDetailsWithProviders() {
    const { getExtensionJwt } = useData();
    const {
        cardConfiguration: {
            serviceUrl
        } = {}
     } = useCardInfo();

    const options = {
        queryFunction: experienceTokenQuery,
        queryParameters: { getExtensionJwt, serviceUrl },
        resource: 'account-detail-reviews'
    }

    return (
        <DataQueryProvider options={options}>
            <AccountDetails/>
        </DataQueryProvider>
    )
}

export default AccountDetailsWithProviders;