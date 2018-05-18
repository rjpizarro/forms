import React from 'react';
import PropTypes from 'prop-types';
import {Flex} from './layout-components';
import {defaultProps, componentFromProp} from 'recompose';

const enhance = defaultProps({ component: 'h1' });
const TitleWrapper = enhance(componentFromProp('component'));

const FormHeader = ({
    actions,
    title,
    renderFormTitleWithBackButton,
    renderClearButton,
    renderEditButton,
    renderViewButton,
    flexProps,
    backButton,
    titleComponent,
}) => {
    return (
        <Flex justify="space-between" {...flexProps}>
            <TitleWrapper component={titleComponent}>{(backButton) ? renderFormTitleWithBackButton() : title}</TitleWrapper>
            <Flex justify="flex-end">
                {(actions) ?
                    actions :
                    [
                        renderClearButton(),
                        renderEditButton(),
                        renderViewButton(),
                    ]
                }
            </Flex>
        </Flex>
    )
};

FormHeader.defaultProps = {
    backButton: true,
};

FormHeader.propTypes = {
    flexProps: PropTypes.object,
    title: PropTypes.node,
    renderFormTitleWithBackButton: PropTypes.func,
    actions: PropTypes.node,
    renderClearButton: PropTypes.func,
    titleComponent: PropTypes.func,
    renderEditButton: PropTypes.func,
    renderViewButton: PropTypes.func,
    backButton: PropTypes.bool,
};

export default FormHeader;