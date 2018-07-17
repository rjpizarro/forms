import React from 'react';
import PropTypes from 'prop-types';
import {compose, withProps, setPropTypes, setDisplayName} from 'recompose';
import ClearIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ViewIcon from '@material-ui/icons/Visibility';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import {EDIT, VIEW} from './modeConstants'
import JssProvider from 'react-jss/lib/JssProvider';
import generateClassName from './helpers/generateClassName';

const _pushHistory = (history, route, params) => {
    let path = (params) ? `${route}/${params}` : route;

    history.push(path);
};

/**
 *
 * @param {string | function} editRoute
 * @param {string | function} viewRoute
 * @param {object} options
 * @param {function} options.shouldShowClear
 * @param {function} options.onClearCallback
 * @param {function} options.shouldShowEdit
 * @param {function} options.onEditCallback
 * @param {function} options.shouldShowView
 * @param {function} options.onViewCallback
 * @param {string} options.clearTooltip
 * @param {string} options.editTooltip
 * @param {string} options.viewTooltip
 */
export default (editRoute, viewRoute, options = {}) => compose(
    withProps(props => {
        const editPathRoute = (typeof editRoute === 'function') ? editRoute(props) : editRoute;
        const viewPathRoute = (typeof viewRoute === 'function') ? viewRoute(props) : viewRoute;

        const _navigationUnavailable = () => console.warn('history is not accessible via prop. Navigation actions will not be available. Please provide a callback for edit and view buttons instead.');
        const id = props.initialValues && props.initialValues.id || props.initialValues._id;
        const showEdit = (options.shouldShowEdit) ? options.shouldShowEdit(props) : true;
        const showView = (options.shouldShowView) ? options.shouldShowView(props) : true;
        const showClear = (options.shouldShowClear) ? options.shouldShowClear(props) : true;
        const onEdit = (options.onEditCallback) ?
            options.onEditCallback(editPathRoute, props) : (props.history) ?
                () => _pushHistory(props.history, editPathRoute, id) :
                _navigationUnavailable;
        const onView = (options.onViewCallback) ?
            options.onViewCallback(viewPathRoute, props) : (props.history) ?
                () => _pushHistory(props.history, viewPathRoute, id) :
                _navigationUnavailable;

        //tooltips
        const clearTooltip = (options.clearTooltip) ? options.clearTooltip : 'Clear';
        const editTooltip = (options.editTooltip) ? options.editTooltip : 'Edit';
        const viewTooltip = (options.viewTooltip) ? options.viewTooltip : 'View';

            return {
                renderClearButton: () => {
                    return (props.mode !== VIEW && showClear) ? (
                        <JssProvider generateClassName={generateClassName} >
                            <Tooltip title={clearTooltip}>
                                <IconButton onClick={() => {
                                    props.reset();

                                    if (options.onClearCallback) options.onClearCallback(props)
                                }}>
                                    <ClearIcon style={{width: 24, height: 24}} />
                                </IconButton>
                            </Tooltip>
                        </JssProvider>
                    ) : null;
                },
                renderEditButton: () => {
                    return (id && props.mode === VIEW && showEdit) ? (
                        <JssProvider generateClassName={generateClassName}>
                            <Tooltip title={editTooltip}>
                                <Button variant="raised" onClick={onEdit}>
                                    <EditIcon style={{width: 24, height: 24}} />
                                </Button>
                            </Tooltip>
                        </JssProvider>
                    ) : null
                },
                renderViewButton: () => {
                    return (id && props.mode === EDIT && showView) ? (
                        <JssProvider generateClassName={generateClassName}>
                            <Button variant="raised" onClick={onView}>
                                <Tooltip title={viewTooltip}>
                                    <ViewIcon style={{width: 24, height: 24}} />
                                </Tooltip>
                            </Button>
                        </JssProvider>
                    ) : null
                }
            }
        }
    ),
    setPropTypes({
        renderClearButton: PropTypes.func,
        renderEditButton: PropTypes.func,
        renderViewButton: PropTypes.func,
    }),
    setDisplayName('withActionsButtons'),
)