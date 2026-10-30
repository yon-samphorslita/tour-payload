// Hides a collection/global from the Payload admin panel for anyone who isn't
// an admin, so staff/tax only see the "Website content" group there.
// UI only — the REST API (used by mrl-admin) still follows each `access` block.
// (`any` because collections and globals type `user` differently.)
export const hideFromNonAdmins = ({ user }: { user: any }) => user?.role !== 'admin'
