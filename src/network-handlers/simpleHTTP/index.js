import Fetcher from '../http/';

export default {
  'get': (url)=>
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

        if(typeof action.network.payload === 'object'){
          action.network.url +=
            Object.keys(action.network.payload).reduce((p, c)=>
              p+''+c+'='+encodeURIComponent(action.network.payload[c])+'&', '?')
                  .slice(0,-1);
        }
        
        this.fetcher.handleRequest(action);
      }
    },
}
