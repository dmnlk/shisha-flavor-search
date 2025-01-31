export class ShishaServiceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ShishaServiceError';
  }
}
