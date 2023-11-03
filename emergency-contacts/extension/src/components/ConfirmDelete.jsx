// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@ellucian/react-design-system/core';

export default function ConfirmDelete({ onDeleteCancel, onDeleteConfirm, contact }) {
    const intl = useIntl();

    return (
        <Dialog
            open={true}
            onClose={() => onDeleteCancel()}
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
                <Button onClick={() => onDeleteCancel()} color="secondary">
                    {intl.formatMessage({id: 'EmergencyContacts.cancel'})}
                </Button>
                <Button
                    onClick={() => onDeleteConfirm()}
                    color="primary"
                >
                    {intl.formatMessage({id: 'EmergencyContacts.delete'})}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ConfirmDelete.propTypes = {
    onDeleteCancel: PropTypes.func.isRequired,
    onDeleteConfirm: PropTypes.func.isRequired,
    contact: PropTypes.object.isRequired,
};