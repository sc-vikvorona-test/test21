/**
 * Event-driven UI Components
 *
 * Two implementations of a live-updating data widget:
 * - LeakyDataWidget: subscribes to events but never cleans up
 * - SafeDataWidget: properly manages listener lifecycle
 *
 * Both follow the same public API for drop-in comparison.
 */

/**
 * LeakyDataWidget
 *
 * Displays real-time data from an EventEmitter source.
 * Each mount adds listeners; unmount/destroy is never implemented.
 *
 * WARNING: This is the BUGGY version for comparison purposes.
 */
class LeakyDataWidget {
  constructor(container, dataSource) {
    this.container = container;
    this.dataSource = dataSource;
    this.renderCount = 0;
    this.isVisible = false;
  }

  mount() {
    this.isVisible = true;
    this._render();

    // Subscribe to data updates
    this.dataSource.addEventListener('update', (event) => {
      this._handleUpdate(event.detail);
    });

    // Subscribe to error events
    this.dataSource.addEventListener('error', (event) => {
      this._handleError(event.detail);
    });

    // Subscribe to connection status changes
    this.dataSource.addEventListener('connect', () => {
      this.container.classList.remove('disconnected');
      this.container.classList.add('connected');
    });

    this.dataSource.addEventListener('disconnect', () => {
      this.container.classList.remove('connected');
      this.container.classList.add('disconnected');
    });

    // Subscribe to window resize for responsive re-layout
    window.addEventListener('resize', () => {
      this._relayout();
    });

    // Subscribe to visibility changes to pause updates when hidden
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
    });
  }

  _handleUpdate(data) {
    this.renderCount++;
    this.container.querySelector('.data-value').textContent = data.value;
    this.container.querySelector('.timestamp').textContent = new Date().toLocaleTimeString();
  }

  _handleError(err) {
    this.container.querySelector('.error-msg').textContent = err.message;
    this.container.classList.add('has-error');
  }

  _relayout() {
    const width = this.container.offsetWidth;
    if (width < 300) {
      this.container.classList.add('compact');
    } else {
      this.container.classList.remove('compact');
    }
  }

  _render() {
    this.container.innerHTML = `
      <div class="data-widget">
        <span class="data-value">--</span>
        <span class="timestamp"></span>
        <span class="error-msg"></span>
      </div>
    `;
  }

  // No destroy() method — listeners accumulate on every mount()
}

/**
 * SafeDataWidget
 *
 * Same functionality as LeakyDataWidget but with proper lifecycle management.
 * Stores bound references to all listeners and removes them on destroy().
 */
class SafeDataWidget {
  constructor(container, dataSource) {
    this.container = container;
    this.dataSource = dataSource;
    this.renderCount = 0;
    this.isVisible = false;

    // Store bound handler references so we can remove them later
    this._handlers = {
      update: this._handleUpdate.bind(this),
      error: this._handleError.bind(this),
      connect: this._handleConnect.bind(this),
      disconnect: this._handleDisconnect.bind(this),
      resize: this._relayout.bind(this),
      visibilitychange: this._handleVisibilityChange.bind(this),
    };
  }

  mount() {
    this.isVisible = true;
    this._render();

    // Attach all listeners using stored bound references
    this.dataSource.addEventListener('update', this._handlers.update);
    this.dataSource.addEventListener('error', this._handlers.error);
    this.dataSource.addEventListener('connect', this._handlers.connect);
    this.dataSource.addEventListener('disconnect', this._handlers.disconnect);
    window.addEventListener('resize', this._handlers.resize);
    document.addEventListener('visibilitychange', this._handlers.visibilitychange);
  }

  _handleUpdate(event) {
    this.renderCount++;
    this.container.querySelector('.data-value').textContent = event.detail.value;
    this.container.querySelector('.timestamp').textContent = new Date().toLocaleTimeString();
  }

  _handleError(event) {
    this.container.querySelector('.error-msg').textContent = event.detail.message;
    this.container.classList.add('has-error');
  }

  _handleConnect() {
    this.container.classList.remove('disconnected');
    this.container.classList.add('connected');
  }

  _handleDisconnect() {
    this.container.classList.remove('connected');
    this.container.classList.add('disconnected');
  }

  _handleVisibilityChange() {
    this.isVisible = !document.hidden;
  }

  _relayout() {
    const width = this.container.offsetWidth;
    if (width < 300) {
      this.container.classList.add('compact');
    } else {
      this.container.classList.remove('compact');
    }
  }

  _render() {
    this.container.innerHTML = `
      <div class="data-widget">
        <span class="data-value">--</span>
        <span class="timestamp"></span>
        <span class="error-msg"></span>
      </div>
    `;
  }

  /**
   * Tear down the widget — remove all event listeners.
   * Must be called when the widget is removed from the DOM.
   */
  destroy() {
    this.dataSource.removeEventListener('update', this._handlers.update);
    this.dataSource.removeEventListener('error', this._handlers.error);
    this.dataSource.removeEventListener('connect', this._handlers.connect);
    this.dataSource.removeEventListener('disconnect', this._handlers.disconnect);
    window.removeEventListener('resize', this._handlers.resize);
    document.removeEventListener('visibilitychange', this._handlers.visibilitychange);

    // Clear container
    this.container.innerHTML = '';
    this._handlers = {};
  }
}

module.exports = { LeakyDataWidget, SafeDataWidget };
