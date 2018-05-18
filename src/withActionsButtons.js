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

const _pushHistory = (history, route, params) => {
    let path = (params) ? `${route}/${params}` : route;

    history.push(path);
};

/**
 *
 * @param {string} editRoute
 * @param {string} viewRoute
 * @param {object} options
 * @param {function} options.onClearCallback
 * @param {function} options.shouldShowEdit
 * @param {function} options.onEditCallback
 * @param {function} options.shouldShowView
 * @param {function} options.onViewCallback
 */
export default (editRoute, viewRoute, options = {}) => compose(
    withProps(props => {
        const _navigationUnavailable = () => console.warn('history is not accessible via prop. Navigation actions will not be available. Please provide a callback for edit and view buttons instead.');
        const id = props.initialValues && props.initialValues.id || props.initialValues._id;
        const showEdit = (options.shouldShowEdit) ? options.shouldShowEdit(props) : true;
        const showView = (options.shouldShowView) ? options.shouldShowView(props) : true;
        const onEdit = (options.onEditCallback) ?
            options.onEditCallback(editRoute, props) : (props.history) ?
                () => _pushHistory(props.history, editRoute, id) :
                _navigationUnavailable;
        const onView = (options.onViewCallback) ?
            options.onViewCallback(viewRoute, props) : (props.history) ?
                () => _pushHistory(props.history, viewRoute, id) :
                _navigationUnavailable;

            return {
                renderClearButton: () => (
                    <Tooltip title="Clear">
                        <IconButton onClick={() => {
                            props.reset();

                            if (options.onClearCallback) options.onClearCallback(props)
                        }}>
                            <ClearIcon style={{width: 24, height: 24}} />
                        </IconButton>
                    </Tooltip>
                ),
                renderEditButton: () => {
                    return (id && props.mode === VIEW && showEdit) ? (
                        <Tooltip title="Edit">
                            <Button variant="raised" onClick={onEdit}>
                                <EditIcon style={{width: 24, height: 24}} />
                            </Button>
                        </Tooltip>
                    ) : null
                },
                renderViewButton: () => {
                    return (id && props.mode === EDIT && showView) ? (
                        <Button variant="raised" onClick={onView}>
                            <Tooltip title="View">
                                <ViewIcon style={{width: 24, height: 24}} />
                            </Tooltip>
                        </Button>
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