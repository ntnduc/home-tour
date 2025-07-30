export interface ComboOption<K, T> {
  key: K;
  value: T;
  label?: string;
}

export interface ComboOptionWithExtra<K, T, E> {
  key: K;
  value: T;
  label?: string;
  extra?: E;
}
