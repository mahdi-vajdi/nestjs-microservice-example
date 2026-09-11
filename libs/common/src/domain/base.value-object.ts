import * as util from 'node:util';

export abstract class ValueObject<T extends object> {
  public readonly props: T;

  protected constructor(props: T) {
    this.validate(props);
    this.props = Object.freeze(props);
  }

  protected abstract validate(props: T): void;

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return util.isDeepStrictEqual(this.props, vo.props);
  }
}
