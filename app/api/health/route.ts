import { safeConfig } from '@/lib/utils/env'; import { getState } from '@/lib/db';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function GET(){ return Response.json({ok:true, status:getState<boolean>('netalertx_unreachable')?'netalertx_unreachable':'connected', lastSuccessfulUpdate:getState<string>('last_successful_update'), config:safeConfig()},{headers:{'Cache-Control':'no-store'}});}
