class Transition {
    constructor(To, From, Input) {
      this.To = To;
      this.From = From;
      this.Input = Input;
    }

    toString() {
        return `${this.From}-${this.Input}->${this.To}`;
      }
  }
  
  export default Transition;
  