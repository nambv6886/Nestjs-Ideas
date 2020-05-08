export class CommonUtils {
  public static isNullorUndefined(value: any) {
    return typeof value === 'undefined' || value === null;
  }
}