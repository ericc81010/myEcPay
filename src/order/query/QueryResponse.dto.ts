export class QueryResponseDto {
  success: boolean;
  code: number;
  msg: string;
  ecPayResponsData?: any;

  constructor(
    success: boolean,
    code: number,
    msg: string,
    ecPayResponsData?: any,
  ) {
    this.success = success;
    this.msg = msg;
    this.ecPayResponsData = ecPayResponsData;
  }
}
