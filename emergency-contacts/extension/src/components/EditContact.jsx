// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles, TextField } from '@ellucian/react-design-system/core';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';

const useStyles = makeStyles(() => ({
    textFieldPhone: {
        marginTop: spacing40,
    },
}), { index: 2});

export default function EditContact({
    close = () => {},
    editContactContext = { show: false },
}) {
    const intl = useIntl();
    const classes = useStyles();

    const { addContact, contact = { contact: { name: { fullName: '' }, phones: [ { number: '' } ] } }, mode, show, updateContact } = editContactContext;

    const [ name, setName ] = useState(contact.contact.name.fullName);
    const [ phone, setPhone ] = useState(contact.contact.phones[0].number);

    const onClose = useCallback(() => {
        close();
    }, [close]);

    const onSave = useCallback(() => {
        if (mode === 'add') {
            addContact({ name, phone });
            close();
        } else if (mode === 'edit') {
            updateContact({ contact, name, phone });
            close();
        }
    }, [ addContact, close, contact, mode, name, phone, updateContact ]);

    const title = useMemo(() => {
        if (mode === 'add') {
            return intl.formatMessage({id: 'EmergencyContacts.editContact.addTitle'});
        } else {
            return intl.formatMessage({id: 'EmergencyContacts.editContact.editTitle'});
        }
    }, [intl, mode]);

    return (
        <Dialog
            classes={{ paper: classes.jobChangeDialog}}
            open={show}
            onClose={onClose}
            fullWidth
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {intl.formatMessage({id: 'EmergencyContacts.editContact.instructions'})}
                </DialogContentText>
                <TextField
                    label="Name"
                    placeholder={intl.formatMessage({id: 'EmergencyContacts.editContact.name.placeholder'})}
                    value={name}
                    onChange={event => {
                        setName(event.target.value);
                    }}
                    required={true}
                />
                <TextField
                    className={classes.textFieldPhone}
                    label="Phone"
                    placeholder={intl.formatMessage({id: 'EmergencyContacts.editContact.phone.placeholder'})}
                    value={phone}
                    maxCharacters={{ max: 12 }}
                    onChange={event => {
                        setPhone(event.target.value);
                    }}
                    required={true}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    {intl.formatMessage({id: 'EmergencyContacts.cancel'})}
                </Button>
                <Button
                    onClick={onSave}
                    color="primary"
                >
                    {intl.formatMessage({id: 'EmergencyContacts.save'})}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

EditContact.propTypes = {
    close: PropTypes.func,
    editContactContext: PropTypes.object,
};