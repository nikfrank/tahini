const actions = {
  createDevice: (text, race)=>({
    type:'createDevice', payload:{text, race}
  }),

  destroyDevice: (key)=>({
    type:'destroyDevice', payload:{key}
  }),

  resetDevice: (key, type, initState)=>({
    type:'resetDevice', payload:{key, type, initState}
  }),

  activateDevice: (key)=>({
    type:'activateDevice', payload:{key}
  })
};

export { actions as DashboardActions};
