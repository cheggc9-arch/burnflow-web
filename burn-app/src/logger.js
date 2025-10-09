class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
  }

  info(message, ...args) {
    console.log(`[INFO] ${message}`, ...args);
  }

  warn(message, ...args) {
    console.warn(`[WARN] ${message}`, ...args);
  }

  error(message, ...args) {
    console.error(`[ERROR] ${message}`, ...args);
  }

  debug(message, ...args) {
    if (this.logLevel === 'debug') {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
}

module.exports = new Logger();