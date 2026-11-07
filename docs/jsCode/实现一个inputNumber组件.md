## 实现一个 InputNumber 数字输入框组件

### 功能要求

- 支持 `min`、`max`、`step`、`value`、`onChange` 配置
- 点击 `+` / `-` 按钮增减数值
- 超出范围时禁用对应按钮
- 支持直接输入，输入非法值时恢复上一次合法值

### HTML + CSS

```html
<style>
  .input-number {
    display: inline-flex;
    align-items: center;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
    user-select: none;
  }
  .input-number__btn {
    width: 32px;
    height: 32px;
    font-size: 16px;
    border: none;
    background: #fafafa;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .input-number__btn:hover:not(:disabled) {
    background: #e6f4ff;
    color: #1677ff;
  }
  .input-number__btn:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  .input-number__input {
    width: 64px;
    height: 32px;
    text-align: center;
    border: none;
    border-left: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    outline: none;
    font-size: 14px;
  }
</style>
```

### JavaScript 实现

```js
class InputNumber {
  constructor(container, options = {}) {
    this.options = {
      min: -Infinity,
      max: Infinity,
      step: 1,
      value: 0,
      onChange: null,
      ...options,
    };
    this._value = this.options.value;
    this._container = container;
    this._render();
    this._bindEvents();
  }

  get value() {
    return this._value;
  }

  _clamp(val) {
    return Math.min(this.options.max, Math.max(this.options.min, val));
  }

  _setValue(val) {
    const clamped = this._clamp(val);
    this._value = clamped;
    this._input.value = clamped;
    this._updateButtons();
    this.options.onChange?.(clamped);
  }

  _updateButtons() {
    this._minusBtn.disabled = this._value <= this.options.min;
    this._plusBtn.disabled = this._value >= this.options.max;
  }

  _render() {
    this._container.innerHTML = `
      <div class="input-number">
        <button class="input-number__btn minus">−</button>
        <input class="input-number__input" type="number" value="${this._value}" />
        <button class="input-number__btn plus">＋</button>
      </div>
    `;
    this._minusBtn = this._container.querySelector('.minus');
    this._plusBtn = this._container.querySelector('.plus');
    this._input = this._container.querySelector('input');
    this._updateButtons();
  }

  _bindEvents() {
    this._minusBtn.addEventListener('click', () => {
      this._setValue(this._value - this.options.step);
    });

    this._plusBtn.addEventListener('click', () => {
      this._setValue(this._value + this.options.step);
    });

    this._input.addEventListener('change', () => {
      const num = Number(this._input.value);
      if (isNaN(num)) {
        // 非法输入，恢复上一次合法值
        this._input.value = this._value;
      } else {
        this._setValue(num);
      }
    });
  }
}
```

### Usage

```js
const container = document.getElementById('app');

const counter = new InputNumber(container, {
  min: 0,
  max: 10,
  step: 1,
  value: 5,
  onChange: (val) => console.log('value:', val),
});

console.log(counter.value); // 5
```
