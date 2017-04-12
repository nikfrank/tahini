// when the first network "poll" action comes in
// we make the ListStream and right away call its handleRequest


class ListStream {
  constructor(next, done, err, {Poller, Fetcher}){
    // change this to doneAction ( for unsub )
    this.next = next;
    this.done = done;
    
    this.poller = new Poller(
      response=> next( {payload:{list: response.map(i=> i.title) }} ),
      done,
      err,
      { Fetcher } // change this to the auth-n-fetch
    );
  }

  handleRequest(action){
    // here can intercept unsub actions and call the function returned from the poller
    if(action.network.type === 'unsubscribe'){
      if(this.unsub) return this.unsub();
      else return this.done();
    }


    // otherwise, we may want to change the query on a stream
    
    action.network.url = 'http://jsonplaceholder.typicode.com/posts';

    action.network.interval = action.network.interval|| 2000;
    
    // ie start polling
    this.unsub = this.poller.handleRequest(action);

    // then the return value can be the unsubscribe
  }
}

export default ListStream;
