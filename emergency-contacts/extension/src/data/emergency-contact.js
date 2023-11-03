// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import log from 'loglevel';
const logger = log.getLogger('default');

export async function addEmergencyContact({ authenticatedEthosFetch, cardId, cardPrefix, contact }) {
    const resource = process.env.PIPELINE_POST_EMERGENCY_CONTACTS;
    try {
        const start = new Date();

        const urlSearchParameters = new URLSearchParams({
            cardId,
            cardPrefix
        }).toString();

        const resourcePath = `${resource}?${urlSearchParameters}`;

        const response = await authenticatedEthosFetch(resourcePath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(contact)
        });

        const end = new Date();
        logger.debug(`post ${resource} time: ${end.getTime() - start.getTime()}`);

        let result;
        if (response) {
            switch (response.status) {
                case 200:
                    try {
                        const data = await response.json();

                        result = {
                            data,
                            status: 'success'
                        };
                    } catch (error) {
                        result = {
                            error: {
                                message: 'unable to parse response',
                                statusCode: 500
                            }
                        };
                    }
                    break;
                default:
                    result = {
                        error: {
                            message: 'server error',
                            statusCode: response.status
                        }
                    };
            }
        }

        return result;
    } catch (error) {
        logger.error('unable to search for persons: ', error);
        throw error;
    }
}

export async function updateEmergencyContact({ authenticatedEthosFetch, cardId, cardPrefix, contact, name, phone }) {
    const resource = process.env.PIPELINE_PUT_EMERGENCY_CONTACTS;
    try {
        const start = new Date();

        const names = name.split(/\s+/);
        const firstName = names[0];
        const lastName = names[names.length - 1];

        // deep clone contact
        const contactToSend = JSON.parse(JSON.stringify(contact));
        delete contactToSend.contact.name.fullName;

        contactToSend.contact.name.firstName = firstName;
        contactToSend.contact.name.lastName = lastName;
        contactToSend.contact.phones[0].number = phone;

        const urlSearchParameters = new URLSearchParams({
            cardId,
            cardPrefix
        }).toString();

        const resourcePath = `${resource}?${urlSearchParameters}`;

        const response = await authenticatedEthosFetch(resourcePath, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(contactToSend)
        });

        const end = new Date();
        logger.debug(`post ${resource} time: ${end.getTime() - start.getTime()}`);

        let result;
        if (response) {
            switch (response.status) {
                case 200:
                    try {
                        const data = await response.json();

                        result = {
                            data,
                            status: 'success'
                        };
                    } catch (error) {
                        result = {
                            error: {
                                message: 'unable to parse response',
                                statusCode: 500
                            }
                        };
                    }
                    break;
                default:
                    result = {
                        error: {
                            message: 'server error',
                            statusCode: response.status
                        }
                    };
            }
        }

        return result;
    } catch (error) {
        logger.error('unable to search for persons: ', error);
        throw error;
    }
}

export async function deleteEmergencyContact({ authenticatedEthosFetch, cardId, cardPrefix, contact }) {
    const resource = process.env.PIPELINE_DELETE_EMERGENCY_CONTACTS;
    try {
        const start = new Date();

        const urlSearchParameters = new URLSearchParams({
            cardId,
            cardPrefix
        }).toString();

        const resourcePath = `${resource}?${urlSearchParameters}`;

        const response = await authenticatedEthosFetch(resourcePath, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json'
            },
            body: JSON.stringify({
                id: contact.id,
                firstName: contact.contact.name.firstName,
                lastName: contact.contact.name.lastName,
            })
        });

        const end = new Date();
        logger.debug(`delete ${resource} time: ${end.getTime() - start.getTime()}`);

        let result;
        if (response) {
            switch (response.status) {
                case 200:
                    try {
                        const data = await response.json();

                        result = {
                            data,
                            status: 'success'
                        };
                    } catch (error) {
                        result = {
                            error: {
                                message: 'unable to parse response',
                                statusCode: 500
                            }
                        };
                    }
                    break;
                default:
                    result = {
                        error: {
                            message: 'server error',
                            statusCode: response.status
                        }
                    };
            }
        }

        return result;
    } catch (error) {
        logger.error('unable to search for persons: ', error);
        throw error;
    }
}
