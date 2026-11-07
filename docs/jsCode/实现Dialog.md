## 实现一个 Dialog 对话框组件

### 功能要求

- 支持 `title`、`content`、`onConfirm`、`onCancel` 配置
- 点击遮罩层或取消按钮关闭
- 支持命令式调用：`Dialog.show({ ... })`
- 关闭时销毁 DOM

### HTML + CSS

```html
<style>
  .dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .dialog {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    min-width: 320px;
    max-width: 90vw;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  }
  .dialog-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 12px;
  }
  .dialog-content {
    color: #555;
    margin-bottom: 24px;
    line-height: 1.6;
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  .dialog-btn {
    padding: 6px 16px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    cursor: pointer;
    font-size: 14px;
    background: #fff;
  }
  .dialog-btn.primary {
    background: #1677ff;
    color: #fff;
    border-color: #1677ff;
  }
</style>
```

### JavaScript 实现

```js
class Dialog {
  constructor(options = {}) {
    this.options = {
      title: 'Prompt',
      content: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      onConfirm: null,
      onCancel: null,
      ...options,
    };
    this._overlay = null;
    this._render();
  }

  _render() {
    const { title, content, confirmText, cancelText } = this.options;

    this._overlay = document.createElement('div');
    this._overlay.className = 'dialog-overlay';
    this._overlay.innerHTML = `
      <div class="dialog">
        <h3 class="dialog-title">${title}</h3>
        <div class="dialog-content">${content}</div>
        <div class="dialog-footer">
          <button class="dialog-btn cancel">${cancelText}</button>
          <button class="dialog-btn primary confirm">${confirmText}</button>
        </div>
      </div>
    `;

    this._overlay.querySelector('.confirm').addEventListener('click', () => {
      this.options.onConfirm?.();
      this.close();
    });

    this._overlay.querySelector('.cancel').addEventListener('click', () => {
      this.options.onCancel?.();
      this.close();
    });

    // 点击遮罩层关闭
    this._overlay.addEventListener('click', (e) => {
      if (e.target === this._overlay) {
        this.options.onCancel?.();
        this.close();
      }
    });

    document.body.appendChild(this._overlay);
  }

  close() {
    this._overlay?.remove();
    this._overlay = null;
  }

  // 命令式调用
  static show(options) {
    return new Dialog(options);
  }
}
```

### Usage

```js
// 命令式调用
Dialog.show({
  title: '删除确认',
  content: '确定要删除这条记录吗？此操作不可撤销。',
  confirmText: '删除',
  cancelText: '取消',
  onConfirm: () => console.log('confirmed'),
  onCancel: () => console.log('cancelled'),
});

// 也可以实例化
const dialog = new Dialog({
  title: '提示',
  content: '操作成功！',
  onConfirm: () => dialog.close(),
});
```
