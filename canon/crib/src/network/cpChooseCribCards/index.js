import score from '../../util/score';

class cpChooseCribCards {
  constructor(next){
    this.next = next;
  }

  handleRequest( action ){
    const { hand, isCpCrib, target } = action.network.payload;
    
    let weights = [];

    for( let i = 1; i<=13; i++)
      weights.push( (4 - hand.filter( c => (c.get('rank') === i)).size)/4 );
    
    let options = [];

    for( let i = hand.size; i-->1;)
      for( let j = i; j-->0;)
        options.push({
          hand: hand.filter((c, ci) => ((ci !== i) && (ci !== j)) ),
          crib: hand.filter((c, ci) => ((ci === i) || (ci === j)) ),
        });


    let outcomes = [];

    for( let i = 0; i<options.length; i++){
      outcomes.push([]);

      for( let cut = 0; cut<13; cut++){
        outcomes[i].push({
          handPts: score(options[i].hand.toJS(), {rank:cut+1, suit:0}),
          cribPts: score(options[i].crib.toJS(), {rank:cut+1, suit:0}),
        });
      }
    }

    let reachOdds = outcomes.map( oc =>
      oc.reduce((odds, sc, ci) => (odds + ((sc.handPts >= target) ? weights[ci] : 0)), 0 )
    );

    const maxReach = Math.max(...reachOdds);
    if( maxReach ){
      this.next({ payload: options[ reachOdds.indexOf(maxReach) ] });
      
    } else {

      const cribX = isCpCrib ? 1 : -1;
      
      const xvals = outcomes.map( oc =>
        oc.reduce( (xv, v, ci) => (xv + (v.handPts + (cribX*v.cribPts)) * weights[ci]), 0)
      );

      const maxVal = Math.max(...xvals);

      this.next({ payload: options[ xvals.indexOf(maxVal) ] });
      
      // for each option, compute the score for each of the 13 possible cut ranks
      // multiply each by (4 - # of ranks in hand)/ 4
      // based on isCpCrib and target, add or subtract the score from the cards given
      // compute which option has the best odds of achieving the target
      // return the hand with the selections made.
    }
  }
}

export default cpChooseCribCards;
