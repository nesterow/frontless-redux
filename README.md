# frontless-redux
Simple redux plugin for [Frontless](https://github.com/nesterow/frontless) and [Riot.JS](https://riot.js.org)

```bash
npm i @frontless/redux --save
```

## Component settings
`observe` - an array of property names.
A component re-renders only when specified properties are changed.
```javascript
export default {
  observe: ['number']
}
```

## Properties
The plugin extends component's scope with following properties:
1. `this.$store` - Redux store instance
2. `this.$state` - The state


## Hooks
`onAction(data)` - fires whenever a redux action is dispatched

## Usage

```javascript
 // store.js
 
 import store from '@frontles/redux'
 import riot from 'riot'
 
 const state = {
  number: 0
 }
 
 const actions = {
  INCREMENT: function(state, {value = 1}){
    state.number += value
  },
  DECREMENT: function(state, {value = 1}){
    state.number -= value
  }
 }
 
 riot.install(store({
  state,
  actions,
 }))
 
```

```javascript
// component.riot
export default {
  observe: ['number'],
  plus(){
    this.$store.dispatch({
      type: 'INCREMENT',
      value: 10
    })
  }
}
```

