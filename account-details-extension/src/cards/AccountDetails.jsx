// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classenames from 'classnames';

import { Button, Table, TableBody, TableCell, TableRow, Typography } from '@ellucian/react-design-system/core'
import { colorFillAlertError, colorTextAlertSuccess, spacing30, spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { withStyles } from '@ellucian/react-design-system/core/styles';

import { withIntl } from '../i18n/ReactIntlProviderWrapper';

import { useCardControl, useExtensionControl, useUserInfo } from '@ellucian/experience-extension/extension-utilities';

import { AccountDetailsProvider, useAccountDetails } from '../context/account-details';

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
        justifyContent: featurePayNow ? 'space-between' : 'center'
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
});

function AccountDetails({classes}) {
    const intl = useIntl();

    // Experience SDK hooks
    const { navigateToPage } = useCardControl();
    const { setErrorMessage, setLoadingStatus } = useExtensionControl();
    const { locale } = useUserInfo();

    const { data, isError, isLoading } = useAccountDetails();

    const [ transactions, setTransactions ] = useState();
    const [ summary, setSummary ] = useState();
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
        setLoadingStatus(isLoading);
    }, [isLoading])

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
                transactions.sort((left, right) => (right.transDate.localeCompare(left.transDate)));
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

    if (!data) {
        // nothing to show yet
        return null;
    }

    return (
        <div className={classes.root}>
        <div className={classes.content}>
            <>
                {Array.isArray(transactions) && transactions.length > 0 && (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <div className={classes.transactionsBox} onClick={onTransactionsClick}>
                        <Typography variant={'h4'} component={'div'} className={classes.recentTransactions}>
                            {intl.formatMessage({id: 'AccountDetails.recentTransactions'})}
                        </Typography>
                        <div className={classes.transactionsTableBox}>
                            <Table className={classes.transactionsTable}>
                                <TableBody>
                                    {transactions.map(transaction => {
                                        const { chargeAmount, desc, paymentAmount, transDate, tranNumber } = transaction;
                                        const amount = currentyFormater.format(chargeAmount ? chargeAmount : paymentAmount * -1);
                                        const transactionDate = dateFormater.format(new Date(transDate));
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
                                                    <Typography variant={'body3'} component={'div'} className={classenames({[classes.transactionAmountPayment]: !chargeAmount})}>
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
                )}
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
                        {featurePayNow && (
                            <Button className={classes.payNowButton} color='secondary'>
                                {intl.formatMessage({id: 'AccountDetails.payNow'})}
                            </Button>
                        )}
                    </div>
                )}
            </>
        </div>
        </div>
    );
}

AccountDetails.propTypes = {
    classes: PropTypes.object.isRequired
};

const AccountDetailsWithStyle = withStyles(styles)(AccountDetails);

function AccountDetailsWithProviders() {
    return (
        <AccountDetailsProvider>
            <AccountDetailsWithStyle/>
        </AccountDetailsProvider>
    )
}

export default withIntl(AccountDetailsWithProviders);