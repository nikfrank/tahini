import React from 'react';

export default (cards) => (
  <p>{JSON.stringify(cards.toJS())}</p>
);
