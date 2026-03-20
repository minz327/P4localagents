type MetricsData = {
  totalApps: number
  active: number
  inactive: number
  highRisk: number
  mediumRisk: number
  lowRisk: number
  sensitive: { oversharing: number; exfiltration: number; unethical: number }
}

export function getMetrics(): Promise<MetricsData> {
  const data: MetricsData = {
    totalApps: 3843,
    active: 1800,
    inactive: 1100,
    highRisk: 1,
    mediumRisk: 2,
    lowRisk: 11,
    sensitive: { oversharing: 40, exfiltration: 49, unethical: 32 },
  }

  return new Promise((resolve) => setTimeout(() => resolve(data), 300))
}

export function getAgents(): Promise<Array<{ id: string; name: string; risk: string }>> {
  const list = [
    { id: 'a1', name: 'Agent Alpha', risk: 'low' },
    { id: 'a2', name: 'Agent Beta', risk: 'medium' },
    { id: 'a3', name: 'Agent Gamma', risk: 'high' },
  ]
  return new Promise((resolve) => setTimeout(() => resolve(list), 250))
}
