import {ENROLL_DATA_SUCCESS, ENROLL_DATA_ERROR} from '../types';
import {getEnrollDataApi} from '../../utils/ServiceManager';

export const setEnrollDataInStore = () => {
  return async dispatch => {
    getEnrollDataApi(dispatch, ENROLL_DATA_SUCCESS, ENROLL_DATA_ERROR);
  };
};
