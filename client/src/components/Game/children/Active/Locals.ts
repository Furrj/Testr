import { E_OPERATIONS } from "../../../../types/questions";

const Locals = {
  convertOperatorToDisplay(op: E_OPERATIONS): string {
    switch (op) {
      case E_OPERATIONS.ADD:
        return String.fromCharCode(0x002b);
      case E_OPERATIONS.SUB:
        return String.fromCharCode(0x2212);
      case E_OPERATIONS.MULT:
        return String.fromCharCode(0x00d7);
      case E_OPERATIONS.DIV:
        return String.fromCharCode(0x00f7);
    }

    return "";
  },
  submitAnswer(
    answer: number,
    userAnswers: React.MutableRefObject<number[]>,
    setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  ): void {
    userAnswers.current.push(answer);
    setCurrentQuestionIndex((curr) => ++curr);
  },
  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  },
};

export default Locals;
