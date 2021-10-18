import React, { createContext, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const Context = createContext()

export function IntlProvider({children, intl}) {
    const contextValue = useMemo(() => {
        return {
            intl
        }
    }, [ intl ]);


    if (process.env.NODE_ENV === 'development') {
        useEffect(() => {
            console.log('IntlProvider mounted');

            return () => {
                console.log('IntlProvider unmounted');
            }
        }, []);
    }

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

IntlProvider.propTypes = {
    children: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
}

export function useIntl() {
    const context = useContext(Context);

    return {
        intl: context.intl
    };
}
