const {isBrowser} = require('@frontless/core')
const {createStore} = require('redux')

module.exports = function factory({state, actions}, contextResolver = () => document.__GLOBAL) {

  const getStore = (context) => {
    function reducer(s = state, action) {
      const fire = actions[action.type]
      if (fire) fire(s, action)
      return s
    }
    context._$redux = context._$redux || createStore(reducer);
    return context._$redux
  }

  //riot.js plugin
  return function(e) {
    const onMounted = e.onMounted || function() {};
    let unsubsribe = null;
    
    const ctx = contextResolver;
  
    Object.defineProperty(e, '$state', {
      get(){
        return getStore(ctx()).getState()
      }
    });
  
    Object.defineProperty(e, '$store', {
      get(){
        return getStore(ctx())
      }
    });
  
    e.onMounted = function() {
      let lastState = e.$store.getState()
      unsubsribe = e.$store.subscribe(() => {
        if (typeof document !== 'undefined') {
          document.__GLOBAL_SHARED_STATE = document.__GLOBAL_SHARED_STATE || e.$store.getState();
          document.__GLOBAL_SHARED_STATE = e.$store.getState();
        }
        (e.observe || []).map((name) => {
          if (e && e.$store.getState()[name] != lastState[name]){
            e.update();
          }
          if (e.onAction) {
            e.onAction({[name]: e.$store.getState()[name]})
          }
        })
        lastState = JSON.parse(
          JSON.stringify(e.$store.getState())
        )
      })
      onMounted.bind(this)()
    }.bind(e)
  
    const onUnmounted = e.onUnmounted || function() {};
    e.onUnmounted = function() {
      unsubsribe()
      onUnmounted.bind(this)()
    }.bind(e)
  }
}