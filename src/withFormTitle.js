import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import setPropTypes from 'recompose/setPropTypes';
import setDisplayName from 'recompose/setDisplayName';
import _capitalize from 'lodash/capitalize';
import Navigator from '@yuniku/navigator';
import BackIcon from '@material-ui/icons/ArrowBack';
import IconButton from 'material-ui/IconButton';
import JssProvider from 'react-jss/lib/JssProvider';
import generateClassName from './helpers/generateClassName';

const _getFormTitle = (title = '', mode) => `${_capitalize(mode)} ${title}`;

/**
 *
 * @param {string} title
 * @param {function} customFormTitle
 * @param {object} backButtonOptions
 * @param {function} backButtonOptions.onBackButtonClick
 */
export default (title, customFormTitle, backButtonOptions) => compose(
    withProps(props => {
            const { onBackButtonClick } = backButtonOptions;
            const formTitleFunc = props.customFormTitle || customFormTitle || null;
            const formTitle = (formTitleFunc) ? formTitleFunc(props) : _getFormTitle(title, props.mode);

            return {
                formTitle: formTitle,
                renderFormTitleWithBackButton: () => (
                    <JssProvider generateClassName={generateClassName} >
                        <span>
                            {/* Navigator.push no tiene el contexto (history) para navegar */}
                            <IconButton onClick={() => (onBackButtonClick) ? onBackButtonClick(props) : Navigator.pop()}>
                                <BackIcon style={{width: 24, height: 24}} />
                            </IconButton>
                            {formTitle}
                        </span>
                    </JssProvider>
                ),
            }
        }
    ),
    setPropTypes({
        formTitle: PropTypes.string,
        renderFormTitleWithBackButton: PropTypes.func,
    }),
    setDisplayName('withFormTitle'),
)