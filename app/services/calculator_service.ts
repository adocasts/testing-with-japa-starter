import { Exception } from '@adonisjs/core/exceptions'

export default class CalculatorService {
  add(a: number, b: number): number {
    return a + b
  }

  subtract(a: number, b: number): number {
    return a - b
  }

  multiply(a: number, b: number): number {
    return a * b
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Exception('Division by zero is not allowed.')
    }
    return a / b
  }
}
