import {initiateDB} from '../../config';

export const initDBAction = () => {
  return dispatch => {
    initiateDB(dispatch);
  };
};
