import defFetcher from '../http/';

class Poller {
  constructor(next, done, err, {Fetcher = defFetcher} = {}){
    this.next = next;
    this.done = done;
    this.err = err;

    this.Fetcher = Fetcher;
  }

  handleRequest(action){

    this.action = action;
    // start polling if first request
    
    const poll = ()=>{
      const fetcher = new this.Fetcher(this.next, ()=>'fetch done', this.err);
      fetcher.handleRequest(this.action);
    };


    // do the interval if none existed
    this.pollingInterval = this.pollingInterval || setInterval(poll.bind(this), this.action.network.interval);
    poll();
    
    // return an unsub function which clears the interval and dones
    return ()=>{
      clearInterval(this.pollingInterval);
      this.done();
    };
  }
}

export default Poller;
