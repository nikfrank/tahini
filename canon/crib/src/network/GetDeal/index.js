class GetDeal {
  constructor(next){
    this.next = next;
  }

  handleRequest( action ){
    // action can define number of cards, list of cards already used

    const { size, burned } = action.network.payload;

    let liveBurned = JSON.parse( JSON.stringify( burned ) );

    let cards = [];
    while( cards.length < size ){
      const rank = Math.floor(Math.random()*13);
      const suit = Math.floor(Math.random()*4);

      if ( !liveBurned.filter( c => ((c.rank === rank) && (c.suit === suit)) ).length ) {
        cards.push({ rank, suit });
        liveBurned.push({ rank, suit });
      }
      }
    
    this.next({ payload: cards });
  }
}

export default GetDeal;
