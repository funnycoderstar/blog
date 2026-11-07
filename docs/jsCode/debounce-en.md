## Function Debounce

Debounce makes sure a function runs **only after it has not been called for N milliseconds**.  
If it is called again within that N ms window, the previous timer is cleared and a new one is started.

In other words: *“wait until things stop happening, then run once”*.

### Idea

1. Return a wrapper function  
2. Keep a `timer` in a closure  
3. Every time the wrapper is called, clear the previous `timer` and start a new one  
4. Optionally support an `immediate` call (run on the leading edge)

Things to be careful about:
- `this` binding
- Arguments passed to the original function
- Whether to run immediately (leading) or after the wait (trailing)

### Implementation

```js
function debounce(fn, wait, immediate) {
  let timer = null;

  // return a wrapper
  return function (...args) {
    // keep the correct `this`
    const context = this;

    // clear previous timer on every call
    clearTimeout(timer);

    // call immediately on the leading edge
    if (immediate && !timer) {
      fn.apply(context, args);
    }

    // schedule the trailing call
    timer = setTimeout(() => {
      fn.apply(context, args);
      // if you only want leading execution, set timer = null here
      timer = null;
    }, wait);
  };
}
```

Debounce uses a closure to keep the `timer`.  
Each time the debounced function is invoked, the previous `setTimeout` is cleared and a new one is created.  
So as long as calls keep happening faster than `wait`, `fn` will not run.

### Usage Examples

#### 1. Expensive scroll / resize handlers

```js
window.addEventListener('resize', debounce(handleResize, 200));
window.addEventListener('scroll', debounce(handleScroll, 200));
```

High‑frequency events like `resize`, `scroll`, `mousemove`, `keyup`, etc. do not need to run business logic on every single event.  
With debounce you run at most once after the user stops interacting for `wait` ms.

#### 2. Search input (typeahead)

```js
const onInput = debounce(fetchSearchData, 200);
input.addEventListener('input', (e) => {
  onInput(e.target.value);
});
```

As the user types, requests are delayed until they pause for 200 ms, which reduces unnecessary network calls and avoids UI jank.

