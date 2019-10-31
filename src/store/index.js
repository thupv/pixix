import {Store} from "./Store";
import * as React from "react";

export const createGameStore = (reducer, initialState) => {
  const store = new Store(reducer, initialState);
  return store;
};

const combineReducers = (reducers) => {
  return ( state = {}, action) => {
    const keys = Object.keys(reducers);
    const arr = keys.reduce((accumulator, key) => {
      accumulator[key] = reducers[key](state[key],action);
      return accumulator;
    }, {});
    return arr;
  };
};
