import React from 'react';
import PropTypes from 'prop-types';
import {compose, withProps, setPropTypes, setDisplayName} from 'recompose';
import {TextField} from 'redux-form-material-ui';
import {VIEW} from './modeConstants';

const _getFieldProps = (field, fieldProps, props) => {
    return {
        name: field,
        component: TextField,
        fullWidth: true,
        disabled: props.mode === VIEW,
        margin: 'dense',
        ...fieldProps[field],
    }
};

/**
 *
 * @param {Object} fieldProps
 * @param {Function} customGetFieldProps
 */
export default (fieldProps = {}, customGetFieldProps) => compose(
    withProps(props => {
            return {
                getFieldProps: (customGetFieldProps) ?
                    (fieldName) => customGetFieldProps(fieldName, fieldProps, props) :
                    (fieldName) => _getFieldProps(fieldName, fieldProps, props),
            }
        }
    ),
    setPropTypes({
        getFieldProps: PropTypes.func,
    }),
    setDisplayName('withGetFieldProps'),
)