# Agent orchestration

Coordinator (Codex or Antigravity) owns task assignment and final integration. The `.agent/agents` files define reusable role prompts; use only roles needed for a task.

Sequence: requirements analyst → architect/UI designer (independent after scope) → frontend engineer → QA + security reviewer (parallel on completed diff) → DevOps/release.

Handoffs must include task ID, requirement IDs, changed files, contract dependencies, tests and known blockers. Parallelize only independent tasks with disjoint files; coordinator resolves conflicts. Never run two agents editing shared architecture/config concurrently.
