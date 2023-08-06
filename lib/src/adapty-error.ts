export interface AdaptyErrorInput {
  adaptyCode: number;
  message: string;
}

export class AdaptyError extends Error {
  public adaptyCode: number;

  constructor(input: AdaptyErrorInput) {
    super(input.message);
    this.adaptyCode = input.adaptyCode;
    this.message = input.message;
  }
}
