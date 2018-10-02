import {compose, withProps, setDisplayName} from 'recompose';
import {reduxForm, getFormSyncErrors} from 'redux-form';
import {connect} from 'react-redux';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import omitProps from './helpers/omitProps';

const _getDataByIDFromReducer = (state, path, id) => (state[path] && state[path].data) ? state[path].data[id] : {};

const _getDeepKeys = (obj) => {
    let keys = [];

    for(let key in obj) {
        keys.push(key);

        if(typeof obj[key] === "object") {
            const subkeys = _getDeepKeys(obj[key]);

            keys = keys.concat(subkeys.map((subkey) => key + "." + subkey));
        }
    }
    return keys;
};

const mapStateToProps = (state, props) => {
    const reducerPath = props.options.reducerPath || props.options.formName;
    const id = _get(props, 'match.params.id', null);
    const initialValues = (!_isEmpty(props.initialValues)) ? props.initialValues : (id) ? _getDataByIDFromReducer(state, reducerPath, id) : {}

    return {
        id: id,
        formInitialValues: initialValues,
        fieldsWithErrors: _getDeepKeys(getFormSyncErrors(props.options.formName)(state)),
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
        initialValues: props.formInitialValues,
    })),
    reduxForm({
        form: formName,
        enableReinitialize: true,
        ...options.reduxFormOptions,
    }),
    omitProps(['options']),
    setDisplayName('withReduxForm'),
)