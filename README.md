# tahini

[![Dependency Status](https://www.versioneye.com/user/projects/587bf9e120bf410033543c0d/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/587bf9e120bf410033543c0d)
[![Coverage Status](https://coveralls.io/repos/nikfrank/tahini/badge.svg?branch=master)](https://coveralls.io/r/nikfrank/tahini?branch=master)
[![Build Status](https://travis-ci.org/nikfrank/tahini.svg?branch=master)](https://travis-ci.org/nikfrank/tahini)

tahini is a framework for react redux immutable applications

it solves problems of
- state modularity
- component reusability
- normalization of actions
- app wide metaprogramming

it is opinionated and yet tries to not impose / cramp your style.


future development will be geared toward:
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

((react native integration & isomorphism))

((reified management concept, using it to resolve action triggers))

((performance characterization, investigate propriety of lifecycle use))

((unsubscribe from partial substate))

((JSON serial routing))

- test legibility and brevity
- network modules for sockets / RTC
- middleware for redo/ undo, remote control, bug reproducer


---
===

(ko cli tooling)

(use w create-react-app, or whatever else is cool)

(use w webpack css tooling)