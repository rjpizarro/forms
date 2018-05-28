import React from 'react';
import PropTypes from 'prop-types';
import {compose, withProps, setPropTypes, setDisplayName} from 'recompose';
import _capitalize from 'lodash/capitalize';
import Navigator from '@yuniku/navigator';
import BackIcon from '@material-ui/icons/ArrowBack';
import IconButton from 'material-ui/IconButton';
import JssProvider from 'react-jss/lib/JssProvider';
import generateClassName from './helpers/generateClassName';

const _getFormTitle = (title = '', mode) => `${_capitalize(mode)} ${title}`;

export default (title, customFormTitle) => compose(
    withProps(props => {
            const formTitleFunc = props.customFormTitle || customFormTitle || null;
            const formTitle = (formTitleFunc) ? formTitleFunc(props) : _getFormTitle(title, props.mode);

            return {
                formTitle: formTitle,
                renderFormTitleWithBackButton: () => (
                    <JssProvider generateClassName={generateClassName} >
                        <span>
                            <IconButton onClick={Navigator.pop}>
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