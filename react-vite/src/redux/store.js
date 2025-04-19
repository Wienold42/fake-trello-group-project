import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import boardsReducer from "./boardsReducer";
import cardsReducer from "./cardsReducer";
import commentsReducer from "./commentsReducer";
import listsReducer from "./listsReducer";
const rootReducer = combineReducers({
  session: sessionReducer,
  boards: boardsReducer,
  lists: listsReducer,
  cards: cardsReducer,
  comments: commentsReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
