# Separate NowStack SaaS and Mobile Discord roles

## Scope

Separate the NowStack SaaS and Mobile Discord roles without changing webhook behavior. The low-hierarchy `NowStack SaaS` role (`1526164074126119093`) and `NowStack Mobile` role (`1526155118226051153`) exist, their channels use the correct dedicated roles, and the linked members present in the guild have been backfilled.

## Plan

1. Add a focused Vitest test for the affected product and bundle mappings, then run it against the current implementation to record the expected RED result.
2. Add `NOWSTACK_MOBILE_ROLE_ID` and `NOWSTACK_SAAS_ROLE_ID` to the environment schema with production IDs `1526155118226051153` and `1526164074126119093` as their defaults, and document the same values in `sample.env`. Keep `NOWSTACK_ROLE_ID` as a legacy environment variable for compatibility only.
3. Add a distinct `nowstackMobile` role mapping, move the logical `nowstack` mapping to `NOWSTACK_SAAS_ROLE_ID`, and update only the specified product and bundle IDs:
   - Keep `prd_H7vVxAv4xH` on the logical NowStack SaaS mapping.
   - Move `prd_0R4nrZuDqZ`, `bdl_FBDTkzMfwp`, and `bdl_La5lxKUR4t` to NowStack Mobile.
   - Give `bdl_SM0868YaZY` and `bdl_67ux9gZ9Fp` both NowStack and NowStack Mobile.
4. Confirm that no product or bundle mapping references the legacy `NOWSTACK_ROLE_ID`, preventing new purchases or verifications from recreating old SaaS access while the operational backfill completes.
5. Run the focused test to GREEN, followed by `pnpm typecheck` and `pnpm lint`, all with `ulimit -v unlimited`.
6. Inspect the final diff and leave the changes uncommitted and unpushed for the controller's final review.

## Non-goals

- Do not add the product channel ID because the bot does not reference product channels.
- Do not change any other role assignment or Discord logic.
- Do not interact with Discord directly.
