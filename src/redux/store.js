import {combineReducers} from 'redux';
import CommonReducer from './reducer/CommonReducer';
import EnrollReducers from './reducer/EnrollReducers';

const appReducer = combineReducers({
  EnrollReducers: EnrollReducers,
  CommonReducer: CommonReducer,
});

export default appReducer;
