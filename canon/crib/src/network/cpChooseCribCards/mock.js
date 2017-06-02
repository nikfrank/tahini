class cpChooseCribCardsMock {
  constructor(next){
    this.next = next;
  }

  handleRequest( action ){
    const { hand, isCpCrib, target } = action.network.payload;
    
    let options = [];

    for( let i = hand.size; i-->1;)
      for( let j = i; j-->0;)
        options.push({
          hand: hand.filter((c, ci) => ((ci !== i) && (ci !== j)) ),
          crib: hand.filter((c, ci) => ((ci === i) || (ci === j)) ),
        });

    this.next({ payload: options[0] });
  }
}

export default cpChooseCribCardsMock;
