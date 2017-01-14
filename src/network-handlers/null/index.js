class NoHandler {
  constructor(next, done, err){
    this.next = next;
    this.done = done;
    this.err = err;
  }

  handleRequest(action){
    this.next(action.stub);
    return Promise.resolve(this.done());
  }
}

export default NoHandler;
