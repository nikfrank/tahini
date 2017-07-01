# tahini

[![Dependency Status](https://www.versioneye.com/user/projects/587bf9e120bf410033543c0d/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/587bf9e120bf410033543c0d)
[![Coverage Status](https://coveralls.io/repos/nikfrank/tahini/badge.svg?branch=master)](https://coveralls.io/r/nikfrank/tahini?branch=master)
[![Build Status](https://travis-ci.org/nikfrank/tahini.svg?branch=master)](https://travis-ci.org/nikfrank/tahini)

tahini is a framework for react redux immutable applications

it is also a tasty and protein rich sesame sauce which I like to buy in the shuk.

[click here to read about tahini on wikipedia](https://en.wikipedia.org/wiki/Tahini)

it solves problems of
- state modularity / localization
- component reusability (ie DRYness)
- normalization / serializability of actions
- app wide metaprogramming

Anyone with more saucy puns for this list is encouraged to open a PR.

Tahini is opinionated and yet tries to not impose / cramp your style.

For example, it takes only one line of code to put tahini on your existing component sandwich!

```jsx
import React, { Component } from 'react';
import {render} from 'react-dom';

import './index.css';

import { bootApp } from 'tahini';

class Sandwich extends Component {
  render(){
    return (
      <div>
        this Sandwich will have tahini on it!
      </div>
    );
  }
}

render(
  bootApp().getDevice( Sandwich ),
  document.getElementById('root')
);

```

great - you may say - that was easy and definitely made my sandwich tastier and more nutritious!

Or - more likely you will say - that does nothing! And it was sortof more than one line of code.

Very well, so now you can read about what we can do now that there's tahini on our Sandwich Component.

## Scoped Actions and Reducers

```jsx
import React, { Component } from 'react';
import {render} from 'react-dom';

import { fromJS } from 'immutable';

import './index.css';

import { bootApp } from 'tahini';

class Sandwich extends Component {
  get actions(){
    return {
      addHummus: amountOfHummus=> ({
        type: 'addHummus',
        payload: amountOfHummus,
      }),
    };
  }
  
  get reducer(){
    return {
      addHummus: (state, { payload })=>
        state.update('amountOfHummus', prev=> prev + payload),
    };
  }

  get initState(){
    return fromJS({ amountOfHummus: 0 });
  }

  render(){
    return (
      <div>
        <p>
          this Sandwich will have tahini on it!
        </p>
        <p>
          and { this.props.subState.get('amountOfHummus') } knifeful(s) of hummus
        </p>
        <button onClick={()=> this.props.addHummus(1)}>
          More hummus nu
        </button>
      </div>
    );
  }
}

render(
  bootApp().getDevice( Sandwich, [], Sandwich.initState ),
  document.getElementById('root')
);
```

Now we can add hummus to our sandwich (yay!)

so let's go over how that works, and why it looks like that.

The first thing you'll notice is that we're now booting out component with an initState -
we've declared such in a static getter on our Sandwich class, and passed it to tahini's
getDevice method. We've declared there to be no hummus initially (oh no!)

(( Also, there's a naked empty array there - that's the keypath we're mounting
the Sandwich to - [] means it'll be the entire app, you'll get a full explanation in the section
on dataPaths. (the signature for getDevice may change in future to make this example suck less) ))

So how are we going to get hummus on our Sandwich? (ie, how to we trigger the redux flow?)

##### Step 1: declare an actionCreator function on our actions hash

like the initState, the actions are declared by a static getter on the Component Class. Tahini expects the actions to be in a lookup hash (dictionary) pattern. Here we have a very standard looking action.

If you look ahead to the render function, you'll see we use this action as this.props.addHummus to add 1 hummus to our sandwich, which I imagine to be measured in knifefuls


##### Step 2: declare a reducer function for the action type from Step 1

like the actions, the reducers will be in a lookup hash. The name of the reducer resolved will be the type value from the action triggered. (look ma, no switch statement!). Tahini is opiononated in favour of using immutable for state (I have no tests for non-immutable states... it should work though)

Here, our addHummus reducer will update the amount of hummus by adding the payload amount... which will trigger:


##### Step 3: render JSX from this.props.subState

Tahini was first conceived as a tool for localizing state in large redux applications, so the prop you receive with your Component's state is called "subState", which will make sense when we have more than one component (subStates are like lexical scopes in javascript).

Here, pretty easy, we render the amountOfHummus to the DOM.

Also, you'll see our actionCreator function was also mapped onto props (magically, ie by tahini)


(( setting a mapStateToProps function on a Component was intentionally left out so far in tahini. However, it may very well have some performance advantages and may be added later. For now the subState is where it's at ))



## subStates and dataPaths

What happens when we strike it rich and want two Sandwiches?

(let's imagine we've moved our Sandwich Component into its own file)

```jsx
import React, { Component } from 'react';
import {render} from 'react-dom';

import { fromJS } from 'immutable';

import './index.css';

import { bootApp } from 'tahini';

import Sandwich from './Sandwich';

const app = bootApp();

const FirstSandwich = app.getDevice( Sandwich, ['first'], Sandwich.initState );
const SecondSandwich = app.getDevice( Sandwich, ['second'], Sandwich.initState );

render(
  (<div>
    <FirstSandwich/>
    <SecondSandwich/>
  </div>),
  document.getElementById('root')
);
```

That's all we have to do! 



## network layer

infrastructure, vocabulary

here's how to boot tahini withe network middleware

```jsx
import React, { Component } from 'react';
import {render} from 'react-dom';

import './index.css';

import { bootApp, networkMiddleware } from 'tahini';

class Sandwich extends Component {
  render(){
    return (
      <div>
        this Sandwich will have tahini on it!
      </div>
    );
  }
}

import networkHandlers from './network/';

const app = bootApp( [ networkMiddleware(networkHandlers) ] );
const rootDevice = app.getDevice( Sandwich )

render(
  rootDevice,
  document.getElementById('root')
);

```


### network handlers

- demo consuming a CRUD API
- demo connecting to a socket
- demo RTC chat application ((!))



## under the hood - Devices

- connecting Actions, Reducers, and subStates to Components
- sensible default behaviour
- explanation of this.props.getDevice and how to use it
- explanation of WHY to use it


## reflection

- this.props.reflectors
- inspiration
- use cases

---
---
---
---

##### future development will be geared toward:
- test legibility and brevity
- network modules for sockets / RTC
- middleware for redo/ undo, remote control, bug reproducer
- serialized JSON routing
- react native, isomorphism



(topics list)


## Devices (because I don't want to call them components)

(file structure)

(explanation of all the moving parts)

(using ko to make one)

(example & tests bullshit device)

(example & tests two devices side by side sandboxed)

(example & tests for pure components, actionCreator prop)

(example & tests for network layer)

---

(example standalone network middleware usage)

(example for reflection)

===
===

## Philosophical crap you can read if you're bored

### State Management

React made good on SOCg state logic out of view ctrls, but it caused us the issue of global scope for that state.

Currently popular are state management abstract components, which are largely unreusable and quite frankly an unelegant solution. 

Tahini allows you to localize components to subStates recursively (similar to using functions to enclose lexical scopes recursively), which has some added benefits (super modularization, reusability, minimize cognitive overhead) for really not much extra work to you.


### Serializable Actions

I think serializable actions are kodesh. There are untold possibilities to keep actions that way, where any benefit of replacing them with thunks or promises or observables can be made modularly and unopinionatedly.

Network or other async behaviours have a simple interface that can handle any of these libraries while maintaining the serializability of the actions!

This is the homoiconic powerhouse of your app. Don't fuck it up!


### Reflection

Metaprogramming is super useful, but difficult to explain why to people who have never learned a LISP or done psychedelics.

The point is to maintain flexibility as project size increases. ie, you never have to say "shit I wish we had known we were going to have to make that feature a month ago, we would've made totally different architecture decisions!"

When you can reason more abstractly about your app from within itself, you'll be able to overcome your own legacy stupidity :)


===

## future dev

(( react native integration & isomorphism ))

(( reified management concept, using it to resolve action triggers ))

(( triggering actions from actions ))

(( lijsp action.handlers ))

(( performance characterization, investigate propriety of lifecycle use ))

(( unsubscribe from partial substate ))

(( JSON serial routing ))

(( boring stuff like good error messages ))

(( examples with animations / react-dnd ))

- test legibility and brevity (spring 2017 some work done)
- network modules for sockets / RTC
- middleware for redo/ undo, remote control
- bug reproducer / redux dev tool integration

network layer CACHE (with its own redux store?)
could be used for "get at least # of something" queries
or offline mode
would sit in front of the standard network http fetcher

---
===

(ko cli tooling)

(use w create-react-app, or whatever else is cool)

(use w webpack css tooling)

===
===

besides for "owning" part of the total app state, are there any other more useful selection strategies?


README written using

github.com/nikfrank/readme-live