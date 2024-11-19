export class Error400 extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequest";
  }
}

export class Error404 extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFound";
  }
}
