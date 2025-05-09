export function logger(message, level = "log") {
  const date = new Date().toLocaleString()
  const log = `[${date}] ${message}`
  console[level](log)
}
