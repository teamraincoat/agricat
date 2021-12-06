import {ENROLL_DATA_ERROR, ENROLL_DATA_SUCCESS} from '../types';

const initialState = {
  enrollData: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ENROLL_DATA_SUCCESS: {
      let res = action.payload;
      return {
        ...state,
        enrollData: res,
      };
    }

    default:
      return state;
  }
};
