export interface ComboDto<T, K extends string | number> {
  key: K;
  value: T;
  label?: string;
}
