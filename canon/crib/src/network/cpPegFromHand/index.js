import pegScore from '../../util/pegScore';

class cpPegFromHand {
  constructor(next){
    this.next = next;
  }

  handleRequest( action ){
    const { hand, played } = action.network.payload;
console.log(hand, played);
    // check if each card would create points if played
    //  if any, choose the highest

    // > 21 no run possible (highest)
    // 1-4 nrh

    // 16-20 nrl

    // > 21 mrh
    // 16-20 mrl

    // 6-14 nrh
    // 1-4 mrh

    // 6-14 mrh
    // 21
    // 5
  }
}

export default cpPegFromHand;
