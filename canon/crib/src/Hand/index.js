import React, { Component } from 'react';

export default (props) => (
  <svg width="600" height="400">
    <use xlinkHref="svg-cards.svg#back" x="0" y="10" fill="blue"/>
    <use xlinkHref="svg-cards.svg#1_club" x="170" y="10"/>
    <use xlinkHref="svg-cards.svg#king_heart" x="340" y="10"/>
  </svg>
);
