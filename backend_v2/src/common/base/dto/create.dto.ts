export abstract class BaseCreateDto<T> {
  abstract getEntity(): T;
}
