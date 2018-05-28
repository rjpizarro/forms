import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import {compose, withProps, withStateHandlers, setPropTypes, setDisplayName} from 'recompose';
import Navigator from '@yuniku/navigator';
import {ADD, EDIT, DELETE} from './modeConstants';
import _upperCase from 'lodash/upperCase';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import omitProps from './helpers/omitProps';
import JssProvider from 'react-jss/lib/JssProvider';
import generateClassName from './helpers/generateClassName';

const labelByMode = {
    [ADD]: 'Create',
    [EDIT]: 'Update',
    [DELETE]: 'Delete',
};

const _getButtonLabel = (mode) => {
    return labelByMode[_upperCase(mode)] || 'Submit'
};

const ConfirmDialog = (props) => {
   return (
       <Dialog
           open={props.open}
           onClose={props.closeDialog}
           aria-labelledby="alert-dialog-title"
           aria-describedby="alert-dialog-description"
       >
           <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
           <DialogContent>
               <DialogContentText id="alert-dialog-description">
                   Confirm to save changes.
               </DialogContentText>
           </DialogContent>
           <DialogActions>
               <Button onClick={props.closeDialog} color="secondary">
                   Cancel
               </Button>
               <Button onClick={props.onSubmit} color="primary" autoFocus>
                   Confirm
               </Button>
           </DialogActions>
       </Dialog>
   )
};

/**
 *
 * @param {function} onSubmitCallback
 * @param onSubmitOptions
 * @param {string} onSubmitOptions.label
 * @param {function} onSubmitOptions.onSubmit
 * @param {boolean} onSubmitOptions.confirmAction
 * @param {function} onSubmitOptions.getButtonProps
 * @param {object} onSubmitOptions.buttonProps
 * @param {object} onCancelOptions
 * @param {string} onCancelOptions.label
 * @param {function} onCancelOptions.onCancel
 * @param {function} onCancelOptions.getButtonProps
 * @param {object} onCancelOptions.buttonProps
 */
export default (onSubmitCallback, onSubmitOptions = {}, onCancelOptions = {}) => compose(
    withStateHandlers({
        dialogIsOpen: false,
    }, {
        openDialog: () => () => ({dialogIsOpen: true}),
        closeDialog: () => () => ({dialogIsOpen: false})
    }),
    withProps(props => {
        //handle onSubmitOptions
        const confirmAction = onSubmitOptions.confirmAction || (_upperCase(props.mode) === EDIT);
        const submitLabel = onSubmitOptions.label || _getButtonLabel(props.mode);
        const onSubmit = onSubmitCallback || function(){console.warn(">> SUBMIT FUNCTION NOT PROVIDED <<")};
        const submitButtonProps = (onSubmitOptions.getButtonProps) ? onSubmitOptions.getButtonProps(props) : onSubmitOptions.buttonProps;

        //handle onCancelOptions
        const cancelLabel = onCancelOptions.label || 'Cancel';
        const onCancel = onCancelOptions.onCancel || Navigator.pop;
        const cancelButtonProps = (onCancelOptions.getButtonProps) ? onCancelOptions.getButtonProps(props) : onCancelOptions.buttonProps;

        return {
            renderSubmitButton: (style = {}) => {
                if (!props.handleSubmit) {
                    throw new Error("handleSubmit function not provided. withSubmitButton should be place after redux-form to receive form props");
                }

                return (
                    <JssProvider generateClassName={generateClassName} >
                        <span>
                            <Button
                                onClick={ (confirmAction) ? props.openDialog : props.handleSubmit(data => onSubmit(data, props))}
                                variant="raised"
                                color="primary"
                                disabled={props.pristine || props.submitting}
                                style={style}
                                {...submitButtonProps}
                            >
                                {submitLabel}
                            </Button>
                            {(confirmAction) ?
                                <ConfirmDialog
                                    onSubmit={props.handleSubmit(data => onSubmit(data, props))}
                                    open={props.dialogIsOpen}
                                    closeDialog={props.closeDialog}
                                /> :
                                null
                            }
                        </span>
                    </JssProvider>
                )
            },
            renderCancelButton: (style = {}) => {
                return (
                    <JssProvider generateClassName={generateClassName} >
                        <Button
                            onClick={onCancel}
                            variant="raised"
                            color="secondary"
                            {...cancelButtonProps}
                            style={style}
                        >
                            {cancelLabel}
                        </Button>
                    </JssProvider>
                )
            },
        }
    }),
    omitProps(['dialogIsOpen', 'openDialog', 'closeDialog']),
    setPropTypes({
        renderCancelButton: PropTypes.func,
        renderSubmitButton: PropTypes.func,
    }),
    setDisplayName('withSubmitAndCancelButtons'),
);


