import { combineReducers } from 'redux';

import user from './user';
import pool from './pool';
import messages from './messages';
import bonds from './bonds';

const rootReducer = combineReducers({ user, pool, messages, bonds });

export default rootReducer;
