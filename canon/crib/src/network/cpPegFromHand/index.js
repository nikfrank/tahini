import pegScore, { runPtsPerStack } from '../../scoring/pegScore';

const noRun = (stack)=>{
  for( let i=1; i<14; i++ )
    if( runPtsPerStack( stack.concat({ card: {rank: i} }) ) )
      return false;

  return true;
};

class cpPegFromHand {
  constructor(next, done){
    this.next = next;
    this.done = done;
  }

  handleRequest( action ){
    const { hand=[], played=[] } = action.network.payload;
    const { stack, count: rawCount } = pegScore( played );

    const onPass = ( stack.reduce( (p, c) => (c.card.rank? 0 : p+1) , 0) >= 2 );
    const count = onPass ? 0 : rawCount;

    if ( !hand.length ) {
      if ( !onPass ) this.next({ payload: [0, null]});
      return this.done();
    }
    
    // check if each card would create points if played
    //  if any, choose the highest

    const poss = hand.map(c =>
      pegScore( played.concat({card: c, player: 0}) )
    ).map( p => (p.count < count ? {...p, score: -1} : p) );

    const possibleScores = poss.map( p => p.score );
    
    const maxScore = Math.max(...possibleScores);
    if (maxScore > 0) {
      this.next({ payload: [0, possibleScores.indexOf(maxScore) ] });
      return this.done();
      
    } else if(maxScore < 0){
      if( !onPass ) {
        this.next({ payload: [0, null] });
        return this.done();
      }
    }
    
    // > 21 no run possible (highest)
    const highSafe = poss.map( p => ( (p.count > 21) && noRun(p.stack) ) );
    if ( highSafe.filter(h => h).length ) {
      this.next({ payload: [0, highSafe.indexOf(true) ] });
      return this.done();
    }
    
    // 1-4 nrh
    const lowSafe = poss.map( p => ( (p.count < 5) && (p.count > 0) && noRun(p.stack) ) );
    if ( lowSafe.filter(h => h).length ) {
      this.next({ payload: [0, lowSafe.indexOf(true) ] });
      return this.done();
    }

    // 16-20 nrl
    const midSafe = poss.map( p => ( (p.count < 21) && (p.count > 15) && noRun(p.stack)));
    if ( midSafe.filter(h => h).length ) {
      this.next({ payload: [0, midSafe.indexOf(true) ] });
      return this.done();
    }

    // > 21 mrh
    const highRisk = poss.map( p => ( p.count > 21) );
    if ( highRisk.filter(h => h).length ) {
      this.next({ payload: [0, highRisk.indexOf(true) ] });
      return this.done();
    }
    
    // 16-20 mrl
    const midRisk = poss.map( p => ( (p.count > 15) && (p.count < 21) ) );
    if ( midRisk.filter(h => h).length ) {
      this.next({ payload: [0, midRisk.indexOf(true) ] });
      return this.done();
    }

    // 6-14 nrh    
    const ishSafe = poss.map( p => ( (p.count < 15) && (p.count > 5) && noRun(p.stack)));
    if ( ishSafe.filter(h => h).length ) {
      this.next({ payload: [0, ishSafe.indexOf(true) ] });
      return this.done();
    }
    
    // 1-4 mrh
    const lowRisk = poss.map( p => ( (p.count > 0) && (p.count < 5) ) );
    if ( lowRisk.filter(h => h).length ) {
      this.next({ payload: [0, lowRisk.indexOf(true) ] });
      return this.done();
    }
      
    // 6-14 mrh
    const ishRisk = poss.map( p => ( (p.count < 15) && (p.count > 5) ));
    if ( ishRisk.filter(h => h).length ) {
      this.next({ payload: [0, ishRisk.indexOf(true) ] });
      return this.done();
    }

    // 5 or 21... whatever works
    this.next({ payload: [0, 0] });
    return this.done();
  }
}

export default cpPegFromHand;
