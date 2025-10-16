j# TODO: Add Role-Based Access Control for Escalate and Resolve Actions

## Backend Updates
- [x] Update `Backend/routes/caseRoutes.js` to add `authorizeRoles` middleware:
  - Escalate route: Allow 'supervisor' and 'citizen' roles.
  - Resolve route: Allow 'agent' role.

## Frontend Updates
- [x] Update `Frontend/src/app/features/cases/case-list/case-list.ts`:
  - Add `currentUser` property and subscribe to `auth.getCurrentUser()` in `ngOnInit`.
  - Add `canEscalate()` method: returns true if role is 'supervisor' or 'citizen'.
  - Add `canResolve()` method: returns true if role is 'agent'.
  - Update template: Add `&& canEscalate()` to escalate button's `*ngIf`, and `&& canResolve()` to resolve button's `*ngIf`.

## Testing
- [x] Test button visibility and API access with different user roles (e.g., login as agent, citizen, supervisor).
- [x] Verify 403 errors for unauthorized API calls.
