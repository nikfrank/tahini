class GetDeal {
  constructor(next){
    this.next = next;
  }

  handleRequest( action ){
    // action can define number of cards, list of cards already used

    const { size, burned } = action.network.payload;
    
    // make up random cards
    const card = { rank: 1, suit: 0 };

    let cards = [];
    while( cards.length < size ){
      const rank = Math.floor(Math.random()*13);
      const suit = Math.floor(Math.random()*4);

      if ( !burned.filter( c => ((c.rank === rank) && (c.suit === suit)) ).length )
        cards.push({ rank, suit });
    }
    
    this.next({ payload: cards });
  }
}

export default GetDeal;
