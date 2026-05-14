/**
 * NetAlertX GraphQL transport per <https://github.com/netalertx/NetAlertX/blob/main/docs/API_GRAPHQL.md>:
 * POST `{baseUrl}/graphql`, JSON body `{ query, variables?, operationName? }`,
 * `Authorization: Bearer API_TOKEN` when a token is configured.
 */
export type GraphQLRequestBody = {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
};

type GraphQLHttpResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function postGraphQL<T>(baseUrl: string, token: string, body: GraphQLRequestBody): Promise<T> {
  const root = baseUrl.replace(/\/$/, '');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${root}/graphql`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `NetAlertX GraphQL HTTP ${res.status}${text ? `: ${text.slice(0, 240)}` : ''}`,
    );
  }
  const json = (await res.json()) as GraphQLHttpResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  if (json.data === undefined || json.data === null) {
    throw new Error('NetAlertX GraphQL returned no data');
  }
  return json.data;
}
