import {INIT_DB} from '../types';

const initialState = {
  isDBInitiate: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_DB:
      return {
        ...state,
        isDBInitiate: true,
      };
    default:
      return state;
  }
};
