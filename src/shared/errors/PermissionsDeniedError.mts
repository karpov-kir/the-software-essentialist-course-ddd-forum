export class PermissionsDeniedError extends Error {
  constructor(message = 'Permissions denied') {
    super(message);
  }
}
