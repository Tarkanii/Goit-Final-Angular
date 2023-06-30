export interface IValidationRules {
  password: IPasswordRules,
  email: string
}

export interface IPasswordRules {
  min_length: number,
  contain_numbers: boolean,
  contain_capitals: boolean,
  contain_special_symbols: boolean
}