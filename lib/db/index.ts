import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { getEnv } from '@/lib/utils/env';
import type { Alert, Device, NetAlertXEvent } from '@/lib/netalertx/types';
import { isoNow } from '@/lib/utils/dates';
import { runMigrations } from './migrations';
let instance: Database.Database | undefined;
export function db() { if (!instance) { const p = getEnv().sqliteDbPath; fs.mkdirSync(path.dirname(p), { recursive: true }); instance = new Database(p); runMigrations(instance); } return instance; }
export function saveDevices(devices: Device[]) { const database=db(); const now=isoNow(); const up=database.prepare('INSERT OR REPLACE INTO devices (id,json,updated_at) VALUES (?,?,?)'); const snap=database.prepare('INSERT INTO device_snapshots (device_id,status,is_online,captured_at,json) VALUES (?,?,?,?,?)'); const tx=database.transaction((rows: Device[])=>{ for (const d of rows) { up.run(d.id, JSON.stringify(d), now); snap.run(d.id,d.status,d.isOnline?1:0,now,JSON.stringify(d)); }}); tx(devices); }
export function getDevices() { return db().prepare('SELECT json FROM devices ORDER BY json_extract(json,\'$.displayName\')').all().map((r) => JSON.parse((r as {json:string}).json) as Device); }
export function getDevice(id: string) { const r=db().prepare('SELECT json FROM devices WHERE id=?').get(id) as {json:string}|undefined; return r ? JSON.parse(r.json) as Device : undefined; }
export function saveEvents(events: NetAlertXEvent[]) { const s=db().prepare('INSERT OR IGNORE INTO events (id,type,device_id,message,at,severity,json) VALUES (?,?,?,?,?,?,?)'); const tx=db().transaction((rows: NetAlertXEvent[])=>rows.forEach(e=>s.run(e.id,e.type,e.deviceId,e.message,e.at,e.severity,JSON.stringify(e)))); tx(events); }
export function recentEvents(limit=20) { return db().prepare('SELECT json FROM events ORDER BY at DESC LIMIT ?').all(limit).map(r=>JSON.parse((r as {json:string}).json) as NetAlertXEvent); }
export function saveAlerts(alerts: Alert[]) { const s=db().prepare('INSERT OR IGNORE INTO alerts (id,type,device_id,title,message,severity,created_at,acknowledged_at,json) VALUES (?,?,?,?,?,?,?,?,?)'); const tx=db().transaction((rows: Alert[])=>rows.forEach(a=>s.run(a.id,a.type,a.deviceId,a.title,a.message,a.severity,a.createdAt,a.acknowledgedAt,JSON.stringify(a)))); tx(alerts); }
export function getAlerts(includeAck=false) { const sql = includeAck ? 'SELECT json,acknowledged_at FROM alerts ORDER BY created_at DESC LIMIT 20' : 'SELECT json,acknowledged_at FROM alerts WHERE acknowledged_at IS NULL ORDER BY created_at DESC LIMIT 20'; return db().prepare(sql).all().map(r=>({...(JSON.parse((r as {json:string}).json) as Alert), acknowledgedAt:(r as {acknowledged_at?:string}).acknowledged_at})); }
export function acknowledgeAlert(id: string) { const at=isoNow(); const info=db().prepare('UPDATE alerts SET acknowledged_at=? WHERE id=?').run(at,id); return info.changes > 0; }
export function setState(key: string, value: unknown) { db().prepare('INSERT OR REPLACE INTO app_state (key,value,updated_at) VALUES (?,?,?)').run(key, JSON.stringify(value), isoNow()); }
export function getState<T>(key: string) { const row=db().prepare('SELECT value FROM app_state WHERE key=?').get(key) as {value:string}|undefined; return row ? JSON.parse(row.value) as T : undefined; }
