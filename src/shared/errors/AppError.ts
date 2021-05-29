class AppError {
  public readonly message: string;

  public readonly statusCode: number;
  // código http do erro: ex. 400, 401, 404 etc

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
