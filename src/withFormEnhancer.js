import {compose, setDisplayName} from 'recompose';
import withActionsButtons from './withActionsButtons';
import withFormTitle from './withFormTitle';
import withGetFieldProps from './withGetFieldProps';
import withReduxForm from './withReduxForm';
import withSubmitAndCancelButtons from './withSubmitAndCancelButtons';

const shouldRemoveHOC = (hocName, hocsToRemove = []) => !!hocsToRemove.filter(hoc => hoc === hocName).length;
const emptyHOC = (WrappedComponent) => WrappedComponent;

/**
 *
 * @param formName
 * @param {function} onSubmit
 * @param {object} options
 * @param options.reduxFormOptions
 * @param {object} options.reduxFormOptions.reduxFormOptions
 * @param {string} options.reduxFormOptions.reducerPath
 * @param options.formTitleOptions
 * @param {string} options.formTitleOptions.title
 * @param {*} options.formTitleOptions.customFormTitle
 * @param options.submitAndCancelButtonsOptions
 * @param {object} options.submitAndCancelButtonsOptions.onSubmitOptions
 * @param {object} options.submitAndCancelButtonsOptions.onCancelOptions
 * @param options.getFieldPropsOptions
 * @param {object} options.getFieldPropsOptions.fieldProps
 * @param {*} options.getFieldPropsOptions.customGetFieldProps
 * @param options.actionsButtonsOptions
 * @param {string} options.actionsButtonsOptions.editRoute
 * @param {string} options.actionsButtonsOptions.viewRoute
 * @param {object} options.actionsButtonsOptions.options
 * @param {Array} options.without
 */
export default (formName, onSubmit = () => {console.error('Submit function not provided')}, options = {}) => {
    if (!formName) {
        throw new Error('formName required parameter missing. Check your whitFormEnhancer configuration.');
    }

    const {
        without,
    } = options;
    const reduxFormOptions = options.reduxFormOptions || {};
    const formTitleOptions = options.formTitleOptions || {};
    const formTitle = formTitleOptions.title || formName;
    const submitAndCancelOptions = options.submitAndCancelButtonsOptions || {};
    const getFieldPropsOptions = options.getFieldPropsOptions || {};
    const actionsButtonsOptions = options.actionsButtonsOptions || {};

    return compose(
        (shouldRemoveHOC('reduxForm', without)) ? emptyHOC : withReduxForm(formName, reduxFormOptions),
        (shouldRemoveHOC('title', without)) ? emptyHOC : withFormTitle(formTitle, formTitleOptions.customFormTitle),
        (shouldRemoveHOC('submitAndCancelButtons', without)) ? emptyHOC : withSubmitAndCancelButtons(onSubmit, submitAndCancelOptions.onSubmitOptions, submitAndCancelOptions.onCancelOptions),
        (shouldRemoveHOC('getFieldProps', without)) ? emptyHOC : withGetFieldProps(getFieldPropsOptions.fieldProps, getFieldPropsOptions.customGetFieldProps),
        (shouldRemoveHOC('actionsButtons', without)) ? emptyHOC : withActionsButtons(actionsButtonsOptions.editRoute, actionsButtonsOptions.viewRoute, actionsButtonsOptions.options),
        setDisplayName(`${formName}-withFormEnhancer`),
    )
}