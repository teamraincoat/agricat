import db from '../config';

export const getEnrollDataApi = async (
  dispatch,
  actionType,
  actionFailType = ACTION_FAIL,
) => {
  db.allDocs({include_docs: true, descending: true})
    .then(results => {
      let response = results.rows.map(row => row.doc);
      dispatch({type: actionType, payload: response});
    })
    .catch(err => {
      alert('Unable to get data');
    });
};
