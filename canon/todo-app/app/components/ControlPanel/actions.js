const actions = {
  getItemsFromAPI:()=>({
    network:{
      handler:'ListWala',
      nextAction:{
        type:'setList'
      }
    }
  }),

  getItemsFromSimpleAPI:()=>({
    network:{
      handler:'ListWalaSimple',
      nextAction:{
        type:'setListSimple'
      }
    }
  }),

  getItemsFromMockAPI:()=>({
    network:{
      handler:'ListWalaMock',
      nextAction:{
        type:'setListMock'
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
