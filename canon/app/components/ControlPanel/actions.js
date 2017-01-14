const actions = {
  getItemsFromAPI:()=>({
    network:{
      handler:'ListWala',
      nextAction:{
        type:'setList'
      }
    }
  }),

  subscribeItemStream:()=>({
    network:{
      handler:'ListStream',
      nextAction:{
        type:'setList'
      },
      doneAction:{
        type:'notifyUnsubscribe'
      }
    }
  }),

  unsubscribeItemStream:()=>({
    network:{
      handler:'ListStream',
      type:'unsubscribe'
    }
  })

};

export { actions };
