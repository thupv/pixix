export class Store {
  constructor(reducer, initialState) {
    this.reducer = reducer;
    this.initialState = initialState;
    this._state = {};
    this._listeners = [];
    this.dispatch = this.dispatch.bind(this);
  }

  initialize() {
    this._state = this.initialState;
  }

  getState() {
    return this._state;
  }

  subscribe(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  };

  dispatch(action, payload) {
    this._state = this.reducer(this._state, action);
    this._listeners.forEach(listener => listener());
  }
}
