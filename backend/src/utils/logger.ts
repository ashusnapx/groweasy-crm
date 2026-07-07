const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function getTimestamp(): string {
  return new Date().toISOString();
}

function formatMessage(level: LogLevel, message: string, color: string): string {
  const timestamp = `${COLORS.gray}${getTimestamp()}${COLORS.reset}`;
  const levelTag = `${color}[${level.toUpperCase()}]${COLORS.reset}`;
  return `${timestamp} ${levelTag} ${message}`;
}

export const logger = {
  debug(message: string, ...args: any[]) {
    if (shouldLog("debug")) {
      console.debug(formatMessage("debug", message, COLORS.gray), ...args);
    }
  },

  info(message: string, ...args: any[]) {
    if (shouldLog("info")) {
      console.info(formatMessage("info", message, COLORS.cyan), ...args);
    }
  },

  warn(message: string, ...args: any[]) {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", message, COLORS.yellow), ...args);
    }
  },

  error(message: string, ...args: any[]) {
    if (shouldLog("error")) {
      console.error(formatMessage("error", message, COLORS.red), ...args);
    }
  },

  setLevel(level: LogLevel) {
    currentLevel = level;
  },
};
