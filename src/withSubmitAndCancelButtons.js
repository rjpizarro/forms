import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import {compose, withProps, withStateHandlers, setPropTypes, setDisplayName} from 'recompose';
import Navigator from '@yuniku/navigator';
import {ADD, EDIT, DELETE, VIEW} from './modeConstants';
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
    return labelByMode[mode] || 'Submit'
};

const ConfirmDialog = ({open, closeDialog, onSubmit}) => {
   return (
       <Dialog
           open={open}
           onClose={closeDialog}
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
               <Button onClick={closeDialog} color="secondary">
                   Cancel
               </Button>
               <Button onClick={onSubmit} color="primary" autoFocus>
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
 * @param {*} onSubmitOptions.label
 * @param {function} onSubmitOptions.onSubmit
 * @param {boolean} onSubmitOptions.confirmAction
 * @param {function} onSubmitOptions.confirmActionComponent
 * @param {function} onSubmitOptions.getButtonProps
 * @param {object} onSubmitOptions.buttonProps
 * @param {object} onCancelOptions
 * @param {*} onCancelOptions.label
 * @param {function} onCancelOptions.onCancel
 * @param {function} onCancelOptions.getButtonProps
 * @param {object} onCancelOptions.buttonProps
 */
export default (onSubmitCallback, onSubmitOptions = {}, onCancelOptions = {}) => compose(
    withStateHandlers({
        dialogIsOpen: false,
    }, {
        openDialog: (state, props) => () => ({dialogIsOpen: !props.invalid}),
        closeDialog: () => () => ({dialogIsOpen: false})
    }),
    withProps(props => {
        const formMode = _upperCase(props.mode);
        const _submitLabel = (typeof onSubmitOptions.label === 'function') ? onSubmitOptions.label(props.mode, props) : onSubmitOptions.label;
        const _cancelLabel = (typeof onCancelOptions.label === 'function') ? onCancelOptions.label(props.mode, props) : onCancelOptions.label;

        //handle onSubmitOptions
        const confirmAction = onSubmitOptions.confirmAction || (formMode === EDIT);
        const submitLabel = _submitLabel || _getButtonLabel(formMode);
        const onSubmit = onSubmitCallback || function(){console.warn(">> SUBMIT FUNCTION NOT PROVIDED <<")};
        const submitButtonProps = (onSubmitOptions.getButtonProps) ? onSubmitOptions.getButtonProps(props) : onSubmitOptions.buttonProps;
        const confirmActionComponent = (onSubmitOptions.confirmActionComponent) ? onSubmitOptions.confirmActionComponent : ConfirmDialog;
        const submitForm = props.handleSubmit(data => onSubmit(data, props));
        const submitAction = () => {
            //touch fields with errors to show error message
            if (props.fieldsWithErrors.length) {
                props.fieldsWithErrors.map(field => props.touch(field))
            } else {
                if (confirmAction) {
                    props.openDialog()
                } else {
                    submitForm();
                }
            }
        };

        //handle onCancelOptions
        const cancelLabel = _cancelLabel || 'Cancel';
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
                                onClick={submitAction}
                                variant="raised"
                                color="primary"
                                disabled={(formMode === EDIT && props.pristine) || formMode === VIEW || props.submitting}
                                style={style}
                                {...submitButtonProps}
                            >
                                {submitLabel}
                            </Button>
                            {(confirmAction) ?
                                confirmActionComponent({
                                    onSubmit: props.handleSubmit(data => {
                                        onSubmit(data, props);
                                        props.closeDialog();
                                    }),
                                    open: props.dialogIsOpen,
                                    close: props.closeDialog,
                                    ...props,
                                }) :
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


