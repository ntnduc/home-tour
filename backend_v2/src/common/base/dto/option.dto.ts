/**
 * DTO cho combo option
 * @example
 * const comboOption = new ComboOption<string, string>('label', 'value');
 * @example
 * const comboOption = new ComboOption<string, number>(1, 1);
 */
export class ComboOption<TLabel, TValue> {
  label: TLabel;
  value: TValue;
}

/**
 * DTO cho combo option
 * @example
 * const comboOption = new ComboOption<string, string, any>('label', 'value', {});
 * @example
 * const comboOption = new ComboOption<string, number>(1, 1, {title: '123'});
 */
export class ComboOptionWithExtra<TLabel, TValue, TExtra> {
  label: TLabel;
  value: TValue;
  extra: TExtra;
}
