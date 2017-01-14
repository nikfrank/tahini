// implied import global.fetch
// implied import global.Headers

class Fetcher {
  constructor(next, done, err){
    this.next = next;
    this.done = done;
    this.err = err;

    this.requests = [];
  }

  handleRequest(action){
    this.rereqStrategy = action.network.rereqStrategy || 'takeFirst';

    if((this.rereqStrategy === 'takeFirst') && this.requests.length)
      return this.requests[this.requests.length-1];
    
    const method = action.network.method|| 'GET';
    const headers = new Headers();

    if((method !== 'GET')&&(method !== 'DELETE')){
      action.network.headers = action.network.headers||{};
      action.network.headers['Accept'] = 'application/json';
      action.network.headers['Content-Type'] = 'application/json';
    }

    // put in also headers
    if(action.network.headers)
      for(let i in action.network.headers)
        headers.append(i, action.network.headers[i]);

    const req = { method, headers };

    if((method !== 'GET')&&(method !== 'DELETE') && action.network.payload){
      req.body = JSON.stringify(action.network.body||action.network.payload);
    }

    this.requests.push((i=> fetch(action.network.url, req)
      .then(response=> {
        this.requests.splice(i,1);
        
        if(this.rereqStrategy === 'takeLast'){
          if(this.requests.length !== i){
            return !'done';
          }
        }
            
        (response.status !== 200)?
        response.json().then(json=> this.err({status:response.status, body:json})):
        response.json().then(json=> this.next(json)).catch(e=> this.next({}))

        return 'done';
        
      }).then((isDone)=> isDone? this.done():'aborted') // do we want an abortAction?
    )(this.requests.length) );

    return this.requests[this.requests.length-1];
  }
}

export default Fetcher;
