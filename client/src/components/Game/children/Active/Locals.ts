const Locals = {
  submitAnswer(
    answer: number,
    userAnswers: React.MutableRefObject<number[]>,
    setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  ): void {
    userAnswers.current.push(answer);
    setCurrentQuestionIndex((curr) => ++curr);
  },
};

export default Locals;
