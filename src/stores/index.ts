import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import thunk from "redux-thunk";
import notificationsReducer from "./reducers/notificationReducer";
import generalReducer from "./reducers/generalReducer";
const rootReducer = combineReducers({
  
  notifications: notificationsReducer,
  general: generalReducer,
});
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  // middleware: [],
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


