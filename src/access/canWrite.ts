import type { Access } from 'payload'

// Any logged-in user can create/update records, except the "tax" role.
// Tax users can only view data — see Users.ts for the full role list.
export const canWrite: Access = ({ req }) => {
  if (!req.user) return false
  return req.user.role !== 'tax'
}
