# Internship Program

This folder contains all server-side logic for the PinIT Career OS internship
program. The full specification lives in
[`docs/internship-srs/PINIT_INTERNSHIP_SRS.md`](../../../docs/internship-srs/PINIT_INTERNSHIP_SRS.md).

## Tiers

| Tier | Plan | Name |
|------|------|------|
| `t1_job_sim` | 1 month | Python Job Simulation |
| `t2_virtual_team` | 3 months | Virtual Internship – Backend |
| `t3_project` | 6 months | Project Internship – AI Services |
| `t4_industry` | 9 months | Verified Industry Internship |
| `t5_fellowship` | 12 months | Verified Fellowship + Placement |

## Security rule

**Hidden tests and reference solutions never leave the server.**

- Never use `select('*')` on `internship_tasks`.
- Always return tasks to the client through `taskToClient()`, which strips
  `hidden_tests` and `reference_solution`.
- Only the server runs student code against hidden tests, decides pass/fail,
  and records results.
