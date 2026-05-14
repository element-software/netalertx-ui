export const schema = `
CREATE TABLE IF NOT EXISTS devices (id TEXT PRIMARY KEY, json TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS device_snapshots (id INTEGER PRIMARY KEY AUTOINCREMENT, device_id TEXT NOT NULL, status TEXT NOT NULL, is_online INTEGER NOT NULL, captured_at TEXT NOT NULL, json TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, type TEXT NOT NULL, device_id TEXT, message TEXT NOT NULL, at TEXT NOT NULL, severity TEXT NOT NULL, json TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS alerts (id TEXT PRIMARY KEY, type TEXT NOT NULL, device_id TEXT, title TEXT NOT NULL, message TEXT NOT NULL, severity TEXT NOT NULL, created_at TEXT NOT NULL, acknowledged_at TEXT, json TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_events_at ON events(at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
`;
