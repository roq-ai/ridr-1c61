const mapping: Record<string, string> = {
  bids: 'bid',
  carriers: 'carrier',
  'delivery-requests': 'delivery_request',
  'delivery-statuses': 'delivery_status',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
