import {compose, withProps, setDisplayName} from 'recompose';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import _get from 'lodash/get';
import omitProps from './helpers/omitProps';

const _getDataByIDFromReducer = (state, path, id) => (state[path].data) ? state[path].data[id] : {};

const mapStateToProps = (state, props) => {
    const reducerPath = props.options.reducerPath || props.options.formName;
    const id = _get(props, 'match.params.id', null);

    return {
        id: id,
        formInitialValues: (id) ? _getDataByIDFromReducer(state, reducerPath, id) : null,
    }
};

/**
 *
 * @param formName
 * @param options
 * @param options.reduxFormOptions
 * @param options.reducerPath
 */
export default (formName, options = {}) => compose(
    withProps({ options: {
        formName: formName,
        ...options.reduxFormOptions
    }}),
    connect(mapStateToProps),
    withProps(props => ({
        initialValues: props.initialValues || props.formInitialValues || {},
    })),
    reduxForm({
        form: formName,
        enableReinitialize: true,
        ...options.reduxFormOptions,
    }),
    omitProps(['options']),
    setDisplayName('withReduxForm'),
)