import type { Access } from 'payload'

// Anonymous visitors only see published docs; logged-in users see drafts too.
export const publishedOrLoggedIn: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }
