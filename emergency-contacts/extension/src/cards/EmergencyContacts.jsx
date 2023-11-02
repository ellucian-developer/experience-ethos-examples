// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import {Icon } from '@ellucian/ds-icons/lib';
import {
    Button,
    CircularProgress,
    IconButton,
    makeStyles,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@ellucian/react-design-system/core';
import { colorFillAlertError, spacing20, spacing40, spacing80 } from '@ellucian/react-design-system/core/styles/tokens';

import { withIntl } from '../i18n/ReactIntlProviderWrapper';

import { useCardInfo, useData, useExtensionControl } from '@ellucian/experience-extension-utils';

import { DataQueryProvider, userTokenDataConnectQuery, useDataQuery } from '@ellucian/experience-extension-extras';

import { useDashboard } from '../hooks/dashboard';

import EditContact from '../components/EditContact';
import { deleteEmergencyContact, addEmergencyContact, updateEmergencyContact } from '../data/emergency-contact';
import ConfirmDelete from '../components/ConfirmDelete';

const useStyles = makeStyles(() => ({
    root:{
        height: '100%',
        // overflowY: 'auto'
    },
    content: {
        height: '100%',
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40,
        display: 'flex',
        flexDirection: 'column',
    },
    contentMessage: {
        height: '100%',
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    addContactButtonBox: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: spacing40,
        marginBottom: spacing40,
    },
    contactsBox: {
        cursor: 'pointer'
    },
    contactsTableBox: {
        overflowY: 'auto'
    },
    contactsTableRow: {
        height: 'auto'
    },
    addButton: {
        marginRight: spacing20
    },
    actionButtonsBox: {
        marginRight: spacing20
    },
    spinnerBox: {
        height: '100%',
        flex: '1 0 70%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    busyBox: {
        height: '100%',
        width: '100%',
        flex: '1 0 70%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '0'
    },
    message: {
        marginLeft: spacing80,
        marginRight: spacing80,
        textAlign: 'center'
    }
}), { index: 2});

function EmergencyContacts() {
    const intl = useIntl();
    const classes = useStyles();

    // Experience SDK hooks
    const { setErrorMessage } = useExtensionControl();
    const { authenticatedEthosFetch } = useData();
    const { serverConfigContext: { cardPrefix }, cardId } = useCardInfo();

    useDashboard();

    const { data: contacts, dataError, inPreviewMode, isError, isLoading, isRefreshing, refresh } = useDataQuery(process.env.PIPELINE_GET_EMERGENCY_CONTACTS);

    const [ editContactContext, setEditContactContext ] = useState({ show: false });
    const [ confirmDelete, setConfirmDelete ] = useState();
    const [ showSnackbar, setShowSnackbar ] = useState(false);
    const [ snackMessage, setSnackMessage ] = useState();
    const [ busy, setBusy ] = useState(false);
    const [ busyUntilRefresh, setBusyUntilRefresh ] = useState(false);

    useEffect(() => {
        if (isError) {
            setErrorMessage({
                headerMessage: intl.formatMessage({id: 'EmergencyContacts.contactAdministrator'}),
                textMessage: intl.formatMessage({id: 'EmergencyContacts.dataError'}),
                iconName: 'warning',
                iconColor: colorFillAlertError
            });
        }
    }, [intl, isError, setErrorMessage]);

    useEffect(() => {
        if (busy && !busyUntilRefresh && !isRefreshing) {
            setBusy(false);
        }
    }, [busy, busyUntilRefresh, isRefreshing]);

    const addContact = useCallback(async ({name, phone}) => {
        setBusyUntilRefresh(true);
        setBusy(true);
        const postResult = await addEmergencyContact({ authenticatedEthosFetch, cardId, cardPrefix, contact: { name, phone } });
        if (postResult.status === 'success') {
            showSnackbarMessage(`Contact ${name} was added`);
        }
        refresh();
        setBusyUntilRefresh(false);
    }, [ authenticatedEthosFetch, cardId, cardPrefix, refresh, showSnackbarMessage, setBusy, setBusyUntilRefresh ]);

    const updateContact = useCallback(async ({ contact, name, phone }) => {
        setBusyUntilRefresh(true);
        setBusy(true);
        const putResult = await updateEmergencyContact({ authenticatedEthosFetch, cardId, cardPrefix, contact, name, phone });

        if (putResult.status === 'success') {
            showSnackbarMessage(`Contact ${name} was updated`);
        }
        refresh();
        setBusyUntilRefresh(false);
    }, [ authenticatedEthosFetch, cardId, cardPrefix, refresh, showSnackbarMessage, setBusy, setBusyUntilRefresh ]);

    const deleteContact = useCallback(async ({ contact }) => {
        setBusyUntilRefresh(true);
        setBusy(true);
        const deleteResult = await deleteEmergencyContact({ authenticatedEthosFetch, cardId, cardPrefix, contact });

        if (deleteResult.status === 'success') {
            showSnackbarMessage(`Contact ${contact.contact.name.fullName} was deleted`);
        }
        refresh();
        setBusyUntilRefresh(false);
    }, [ authenticatedEthosFetch, cardId, cardPrefix, refresh, showSnackbarMessage, setBusy, setBusyUntilRefresh ]);

    const onAddContact = useCallback(() => {
        setEditContactContext({ addContact, mode: 'add', show: true });
    }, [addContact, setEditContactContext]);

    const onEditContact = useCallback((contact) => {
        setEditContactContext({ contact, mode: 'edit', show: true, updateContact });
    }, [setEditContactContext, updateContact]);

    const closeEditContactDialog = useCallback(() => {
        setEditContactContext({ show: false });
    }, [setEditContactContext]);

    const onDeleteContact = useCallback((contact) => {
        setConfirmDelete({ contact });
        // deleteContact({ contact });
    }, [/*deleteContact*/]);

    const cancelConfirmDeleteDialog = useCallback(() => {
        setConfirmDelete();
    }, [setConfirmDelete]);

    const confirmConfirmDeleteDialog = useCallback(() => {
        deleteContact(confirmDelete);
        setConfirmDelete();
    }, [confirmDelete, deleteContact, setConfirmDelete]);

    const showSnackbarMessage = useCallback(message => {
        setShowSnackbar(true);
        setSnackMessage(message);
    }, [setShowSnackbar, setSnackMessage]);

    const showSpinning = !contacts && isLoading;
    const showNotConfigured = !contacts && inPreviewMode && dataError?.statusCode === 404;
    const showNoContacts = !contacts || contacts.length === 0;

    if (showNotConfigured) {
        return (
            <div className={classes.root}>
                <div className={classes.contentMessage}>
                    <Typography className={classes.message} variant="body1" component="div">
                        {intl.formatMessage({ id: 'EmergencyContacts.notConfigured'})}
                    </Typography>
                </div>
            </div>
        );
    } else if (showSpinning) {
        return (
            <div className={classes.spinnerBox}>
                <div>
                    <CircularProgress/>
                </div>
            </div>
        );
    } else if (showNoContacts) {
        return (
            <div className={classes.root}>
                <div className={classes.contentMessage}>
                    <Typography className={classes.message} variant="body1" component="div">
                        {intl.formatMessage({ id: 'EmergencyContacts.noContacts'})}
                    </Typography>
                    <div className={classes.addContactButtonBox}>
                        <Button className={classes.addContactButton} color='secondary' onClick={onAddContact}>
                            {intl.formatMessage({id: 'EmergencyContacts.addContact'})}
                        </Button>
                    </div> 
                </div>
                {editContactContext.show && (
                    <EditContact editContactContext={editContactContext} close={closeEditContactDialog}/>
                )}
            </div>
        );
    } else if (contacts && Array.isArray(contacts) && contacts.length > 0) {
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.contactsTableBox}>
                        <Table className={classes.contactsTable} stickyHeader={true}>
                            <TableHead>
                                <TableRow className={classes.leaveTableRow}>
                                    <TableCell align="left" padding={'none'}>{intl.formatMessage({id: 'EmergencyContacts.name'})}</TableCell>
                                    <TableCell align="left" padding={'none'}>{intl.formatMessage({id: 'EmergencyContacts.phone'})}</TableCell>
                                    <TableCell align="right" padding={'none'}>
                                        <IconButton
                                            className={classes.addButton}
                                            color="gray"
                                            aria-label="Add"
                                            onClick={() => onAddContact()}
                                        >
                                            <Icon name="add" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contacts.map((contact, index) => {
                                    const { contact: { name: { fullName } = {}, phones = [] } = {} } = contact;
                                    const [ phone ] = phones;
                                    return (
                                        <TableRow key={index} className={classes.contactsTableRow}>
                                            <TableCell align="left" padding={'none'}>
                                                <Typography variant={'body3'} component={'div'}>
                                                    { fullName }
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left" padding={'none'}>
                                                <Typography variant={'body3'} component={'div'}>
                                                    { phone ? phone.number : 'unknown' }
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" padding={'none'}>
                                                <div className={classes.actionButtonsBox}>
                                                    <IconButton
                                                        color="gray"
                                                        aria-label="Edit"
                                                        className={classes.buttonSpacing}
                                                        onClick={() => onEditContact(contact)}
                                                    >
                                                        <Icon name="edit" />
                                                    </IconButton>
                                                    <IconButton
                                                        className={classes.buttonSpacing}
                                                        color="gray"
                                                        aria-label="Delete"
                                                        onClick={() => onDeleteContact(contact)}
                                                    >
                                                        <Icon name="trash" />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                {editContactContext.show && (
                    <EditContact editContactContext={editContactContext} close={closeEditContactDialog}/>
                )}
                {confirmDelete !== undefined && (
                    <ConfirmDelete contact={confirmDelete?.contact} cancelDelete={cancelConfirmDeleteDialog} confirmDelete={confirmConfirmDeleteDialog} />
                )}
                <Snackbar
                    open={showSnackbar}
                    message={snackMessage}
                    onClose={() => { setShowSnackbar(false); }}
                />
                {busy && (
                    <div
                        className={classes.busyBox}
                        onClick={(event) => {event.stopPropagation();}}
                        onKeyUp={(event) => {event.stopPropagation();}}
                        role='button'
                        tabIndex={0}
                    >
                        <CircularProgress/>
                    </div>
                )}
            </div>
        );
    }
}

function EmergencyContactsWithProviders() {
    const options = useMemo(() => ({
        queryFunction: userTokenDataConnectQuery,
        resource: process.env.PIPELINE_GET_EMERGENCY_CONTACTS
    }), []);

    return (
        <DataQueryProvider options={options}>
            <EmergencyContacts/>
        </DataQueryProvider>
    );
}

export default withIntl(EmergencyContactsWithProviders);