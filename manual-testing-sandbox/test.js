class Calculator {
  constructor() {
    this.result = 0;
  }

  add(number) {
    this.result += number;
    return this;
  }

  subtract(number) {
    this.result -= number;
    return this;
  }

  multiply(number) {
    this.result *= number;
    return this;
  }

  divide(number) {
    _()
  }

  getResult() {
    return this.result;
  }

  reset() {
    this.result = 0;
    return this;
  }
}
