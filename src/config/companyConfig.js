export const companyConfig = {
  blip: {
    name: 'Blip / Flutter Entertainment',
    color: 'text-orange-500',
    bg: 'bg-orange-500',
    border: 'border-orange-500',
    ring: 'ring-orange-500',
    hex: '#f97316',
  },
  betano: {
    name: 'Kaizen Gaming / Betano',
    color: 'text-orange-400',
    bg: 'bg-orange-400',
    border: 'border-orange-400',
    ring: 'ring-orange-400',
    hex: '#fb923c',
  },
  draftkings: {
    name: 'DraftKings',
    color: 'text-green-500',
    bg: 'bg-green-500',
    border: 'border-green-500',
    ring: 'ring-green-500',
    hex: '#22c55e',
  },
  default: {
    name: 'Sports Betting Tech',
    color: 'text-blue-500',
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    ring: 'ring-blue-500',
    hex: '#3b82f6',
  },
};

export function getCompanyConfig(companyId) {
  return companyConfig[companyId] || companyConfig.default;
}
