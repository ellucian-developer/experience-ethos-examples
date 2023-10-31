// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles } from '@ellucian/react-design-system/core';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';

const useStyles = makeStyles(() => ({
    textFieldPhone: {
        marginTop: spacing40,
    },
}), { index: 2});

export default function ConfirmDelete({ cancelDelete, confirmDelete, contact }) {
    const intl = useIntl();
    const classes = useStyles();

    return (
        <Dialog
            classes={{ paper: classes.jobChangeDialog}}
            open={true}
            onClose={() => cancelDelete()}
            fullWidth
        >
            <DialogTitle>
                {intl.formatMessage({id: 'EmergencyContacts.confirmDeleteContact.title'})}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {intl.formatMessage({id: 'EmergencyContacts.confirmDeleteContact.instructions'}, { name: contact.contact.name.fullName })}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => cancelDelete()} color="secondary">
                    {intl.formatMessage({id: 'EmergencyContacts.cancel'})}
                </Button>
                <Button
                    onClick={() => confirmDelete()}
                    color="primary"
                >
                    {intl.formatMessage({id: 'EmergencyContacts.delete'})}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ConfirmDelete.propTypes = {
    cancelDelete: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    contact: PropTypes.object.isRequired,
};