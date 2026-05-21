# One-Pager: AI Observability for Local Agents

## Problem

Security admins today can only see **cloud-hosted** AI agents (Copilot Studio, Azure Foundry, SharePoint). A growing category of AI tools — **local agents** installed on user devices (GitHub Copilot CLI, NemoClaw, OpenClaw) and **SaaS AI apps** (ChatGPT Enterprise, Gemini) — operate completely outside their visibility. Admins have no way to discover, assess risk, or apply policy to these shadow AI tools.

> *"I can see the agents we built. But I can't see the ones my developers downloaded yesterday. That's where the real risk is."* — Customer interview

## Target User

**Security administrators** responsible for data protection and AI governance in enterprises using Microsoft Purview DSPM.

## Hypothesis

If we extend AI Observability with a **three-surface model** (Cloud Agents / Local Agents / AI Apps), each with tailored inventory, risk assessment, and drill-down capabilities, then security admins will be able to discover and triage shadow AI risk **without leaving Purview** — reducing investigation time and increasing policy coverage for non-cloud AI.

## Success Metrics

| Metric | Baseline | Target |
|--------|----------|--------|
| % of AI surfaces visible to admin | ~33% (cloud only) | 100% (cloud + local + apps) |
| Time to identify risky local agent usage | Manual (Azure portal pivot, ~15 min) | In-product drill-down (< 2 min) |
| DLP policy coverage for local AI | 0% | ≥ 50% of high-risk instances covered within 30 days |
| Admin confidence ("I know what AI is running in my org") | Low (per BwC interview) | High (validated via follow-up interview) |

## Prototype

**Live demo:** https://minz327.github.io/P4localagents/  
**Repo:** https://github.com/minz327/P4localagents  
**Full spec:** [functional-spec-local-agents.md](https://github.com/minz327/P4localagents/blob/main/PM%20Spec/functional-spec-local-agents.md)

## Key Features (P0)

1. **Three-surface tab navigation** — Cloud Agents / Local Agents / AI Apps
2. **Local agents inventory table** — rows = User × Device × Agent type
3. **Local-specific filters** — filter/group by user, device, platform
4. **Adapted metrics cards** — "14 local agents across 5 types, 8 users, 10 devices"

## Evidence

- BwC customer interview confirmed: *"It is hard to go backwards from this information"* and *"I had to actually use the little sensitivity trend to identify it"*
- Customer explicitly needs device-level and user-level pivoting
- Customer cannot hand off investigation to analysts today due to missing context
