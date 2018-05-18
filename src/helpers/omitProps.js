import _omit from 'lodash/omit';
import {mapProps} from 'recompose';

const omitProps = keys => mapProps(props => _omit(props, keys));

export default omitProps;