// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classenames from 'classnames';

import {
    Button,
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
import { withStyles } from '@ellucian/react-design-system/core/styles';

import { useCardInfo, useExtensionControl, useUserInfo } from '@ellucian/experience-extension/extension-utilities';

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
});

function LeaveBalance({classes}) {
    const intl = useIntl();

    // Experience SDK hooks
    const { configuration, cardConfiguration } = useCardInfo();
    const { setErrorMessage, setLoadingStatus } = useExtensionControl();
    const { locale } = useUserInfo();

    const { payNowUrl } = configuration || cardConfiguration || {};

    const { data, isError, isLoading } = useLeaveBalance();

    const [ leaves, setLeaves ] = useState([]);
    const [ summary, setSummary ] = useState();

    const [ page, setPage ] = useState(0);
    const [ rowsPerPage, setRowsPerPage ] = useState(10);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, leaves.length - page * rowsPerPage);

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

    const showPayNow = featurePayNow && payNowUrl && summary?.leaveBalance > 0;
    const firstDate = Array.isArray(leaves) && leaves.length > 0 && leaves[0].transDate ? dateFormater.format((new Date(leaves[0]?.transDate) || Date.now)) : '';
    const lastDate = Array.isArray(leaves) && leaves.length > 0 && leaves[leaves.length - 1].transDate ? dateFormater.format(new Date(leaves[leaves.length - 1].transDate)) : '';
    return (
        <div className={classes.root}>
        <div className={classes.content}>
            <>
                {/* {summary && (
                    <div className={classes.amountBoxRow}>
                        <div className={classes.amountBox}>
                            <div className={classes.amountRow}>
                                <Typography variant={'h4'} component={'div'}>
                                    {intl.formatMessage({id: 'LeaveBalance.leaveBalance'})}
                                </Typography>
                                <Typography variant={'body2'} component={'div'} className={classes.amount}>
                                    {currentyFormater.format(summary.leaveBalance)}
                                </Typography>
                            </div>
                            <div className={classes.amountRow}>
                            <Typography variant={'h4'} component={'div'}>
                                {intl.formatMessage({id: 'LeaveBalance.amountDue'})}
                            </Typography>
                            <Typography variant={'body2'} component={'div'} className={classes.amount}>
                                {currentyFormater.format(summary.amountDue)}
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
                {Array.isArray(leaves) && leaves.length > 0 && (
                    <div className={classes.transactionsBox}>
                        <Typography variant={'h4'} component={'div'} className={classes.recentTransactions}>
                            {intl.formatMessage({id: 'LeaveBalance.leaveBalance'})}
                        </Typography>
                        {/* <Paper className={classes.transactionPaper}> */}
                        <div className={classes.transactionsTableBox}>
                            <Table className={classes.transactionsTable}>
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
                                            <TableRow key={index} className={classes.transactionsTableRow}>
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
                                    {/* {emptyRows > 0 && [...Array(emptyRows)].map((value, index) => {
                                        return (
                                            <TableRow key={index} className={classes.transactionsTableRow}>
                                                <TableCell/>
                                                <TableCell/>
                                                <TableCell/>
                                                <TableCell/>
                                            </TableRow>
                                        )
                                    })} */}
                                </TableBody>
                                {/* <TableFooter>
                                    <TableRow>
                                        <Pagination
                                            component="td"
                                            count={leaves.length}
                                            rowsPerPage={rowsPerPage}
                                            rowsPerPageOptions={[10, 20, 50, 100]}
                                            page={page}
                                            onChangePage={handleChangePage}
                                            onChangeRowsPerPage={handleChangeRowsPerPage}
                                        />
                                    </TableRow>
                                </TableFooter> */}
                            </Table>
                        </div>
                        {/* </Paper> */}
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

export default LeaveBalanceWithProviders;