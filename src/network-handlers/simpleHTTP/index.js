import Fetcher from '../http/';


const factory = ({ url, method, headers })=>  
  class simpleFetcher {
    constructor(next, done, err){
      this.fetcher = new Fetcher(
        response=> next({ payload: response }),
        done,
        err
      );
    }

    handleRequest(action){
      action.network.url = url;

      if( (typeof action.network.payload === 'object') &&
          ( method === 'GET' )) {
        action.network.url +=
          Object.keys(action.network.payload).reduce((p, c)=>
            p+''+c+'='+encodeURIComponent(action.network.payload[c])+'&', '?')
                .slice(0,-1);
      }

      action.network.method = method;
      
      this.fetcher.handleRequest(action);
    }
  };


export default {
  'get': (url)=> factory({ url, method: 'GET' }),
  'post': (url)=> factory({ url, method: 'POST' }),
  'put': (url)=> factory({ url, method: 'PUT' }),

  
  mock: (response)=>
    class simpleMock {
      constructor(next, done, err){
        this.next = next;
        this.done = done;
      }

      handleRequest(){
        this.next({ payload: response });
        this.done();
      }
    },
};
