/**
 * Wrapper for enzyme's mount that will wrap the test element with Path design system and react-intl
 */
import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { mount as m } from 'enzyme';
import { getMessages } from '../i18n/intlUtility';
import { EDSApplication } from '@ellucian/react-design-system/core';

const locale = 'en';
const mockSetErrorMessage = jest.fn();

/**
 * Wrapper around enzyme's mount to add necessary parents and to add additional needed props
 * @param {JSXElement} component - The JSX element to wrap with needed parents and pass extension props
 * @return {WrappedComponent} wrapped component
 */
export function mount(component) {
    return m(component, {
        wrappingComponent: CardWrappingComponent
    });
}

/**
 * Wrapper around enzyme's mount to add necessary parents
 * @param {JSXElement} component - The JSX element to wrap with needed parents
 * @return {WrappedComponent} wrapped component
 */
export function mountWithExtensionProps(component) {
    return m(withProps(component), {
        wrappingComponent: CardWrappingComponent
    });
}

function withProps(element) {
    const oldProps = element.props;
    const tempElement= React.cloneElement(
        element,
        {
            userInfo: { locale },
            cardControl: { setErrorMessage: mockSetErrorMessage }
        }
    );
    return React.cloneElement(tempElement, oldProps);
}

function CardWrappingComponent(props) {
    const { children } = props;
    return (
        <EDSApplication>
            <IntlProvider locale={locale} messages={getMessages(locale)}>
                {children}
            </IntlProvider>
        </EDSApplication>
    );
}

CardWrappingComponent.propTypes = {
    children: PropTypes.node
};

CardWrappingComponent.defaultProps = {
    children: null
};
