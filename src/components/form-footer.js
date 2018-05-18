import React from 'react';
import PropTypes from 'prop-types';
import {Flex} from './layout-components';

const FormFooter = ({
    actions,
    flexProps,
    renderSubmitButton,
    renderCancelButton,
}) => {
    return (
        <Flex justify="flex-end" {...flexProps}>
            {(actions) ?
                actions :
                [
                    renderCancelButton({marginRight: 10}),
                    renderSubmitButton(),
                ]
            }
        </Flex>
    )
};

FormFooter.propTypes = {
    flexProps: PropTypes.object,
    actions: PropTypes.node,
};

export default FormFooter;