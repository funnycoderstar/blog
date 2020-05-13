## 实现一个 usePrevious 
```js
import { useState, useEffect, useRef } from 'react';

// Usage
function App() {
  // State value and setter for our example
  const [count, setCount] = useState(0);
  
  // Get the previous value (was passed into hook on last render)
  const prevCount = usePrevious(count);
  
  // Display both current and previous count value
  return (
    <div>
      <h1>Now: {count}, before: {prevCount}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
   );
}

// Hook
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
```



## 强烈推荐阅读
- [react-use](https://github.com/streamich/react-use): 常见的自定义hooks基本都有了，每个hooks代码都是单独的文件，很容易理解