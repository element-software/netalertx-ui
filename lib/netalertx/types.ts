export type DeviceStatus = 'online' | 'offline' | 'archived' | 'unknown';
export type EventType = 'device_joined'|'device_disconnected'|'device_reconnected'|'device_first_seen'|'device_status_changed'|'netalertx_unreachable'|'netalertx_recovered';
export interface RawNetAlertXDevice {
  id?: string | number;
  dev_MAC?: string;
  mac?: string;
  hwaddr?: string;
  dev_Name?: string;
  devName?: string;
  name?: string;
  hostname?: string;
  devFQDN?: string;
  dev_LastIP?: string;
  devIP?: string;
  ip?: string;
  dev_Vendor?: string;
  vendor?: string;
  dev_DeviceType?: string;
  devType?: string;
  type?: string;
  dev_PresentLastScan?: boolean | string | number;
  devPresentLastScan?: boolean | string | number;
  online?: boolean;
  status?: string;
  devStatus?: string;
  dev_FirstConnection?: string;
  firstSeen?: string;
  dev_LastConnection?: string;
  lastSeen?: string;
  dev_LastDisconnect?: string;
  lastDisconnected?: string;
  [key: string]: unknown;
}
export interface NetAlertXEvent { id: string; type: EventType; deviceId?: string; deviceName?: string; message: string; at: string; severity: 'info'|'warning'|'critical' }
export interface Device { id: string; name: string; displayName: string; ipAddress?: string; macAddress?: string; vendor?: string; deviceType?: string; status: DeviceStatus; isOnline: boolean; isKnown: boolean; isNew: boolean; isUnknown: boolean; isPrivateMac: boolean; firstSeen?: string; lastSeen?: string; lastConnected?: string; lastDisconnected?: string; connectedDurationSeconds?: number; source: 'netalertx'|'demo'; rawNetAlertXId?: string }
export interface Alert { id: string; type: 'unknown_device'; deviceId?: string; title: string; message: string; severity: 'warning'|'critical'; createdAt: string; acknowledgedAt?: string; payload?: Record<string, unknown> }
export interface DashboardSummary { appName: string; onlineCount: number; unknownCount: number; newTodayCount: number; recentlyDisconnectedCount: number; latestEvent?: NetAlertXEvent; alerts: Alert[]; status: 'connected'|'updating'|'stale'|'netalertx_unreachable'|'backend_error'|'demo'; lastUpdated?: string; lastSuccessfulUpdate?: string; isStale: boolean; demoMode: boolean }
