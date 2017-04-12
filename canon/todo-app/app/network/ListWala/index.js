class ListWala {
  constructor(next, done, err, {Fetcher}){
    this.fetcher = new Fetcher(
      response=> next( {payload:{list: response.map(i=> i.title) }} ),
      done,
      err
    );
  }

  handleRequest(action){
    action.network.url = 'http://jsonplaceholder.typicode.com/posts';
    this.fetcher.handleRequest(action);
  }
}

export default ListWala;
