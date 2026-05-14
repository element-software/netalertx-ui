import { Badge } from '@/components/ui/Badge';
export function StatusBadge({status}:{status:string}){const tone=status==='connected'?'green':status==='demo'?'blue':status==='stale'||status==='updating'?'amber':'red';return <Badge tone={tone}>{status.replaceAll('_',' ')}</Badge>}
