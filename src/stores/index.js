// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import
import reducers from './reducers';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const stores = configureStore({
  reducer: reducers
});

const { dispatch } = stores;

export { stores, dispatch };
