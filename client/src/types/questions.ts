import { deepCopyObject } from "../utils/methods";
import type { T_GAME_SETTINGS } from "./game";

export type T_OPERATIONS = {
  add: boolean;
  sub: boolean;
  mult: boolean;
  div: boolean;
};
export enum E_OPERATIONS {
  NULL = -1,
  ADD,
  SUB,
  MULT,
  DIV,
}

export type T_QUESTION = {
  operands: number[];
  operator: E_OPERATIONS;
  result: number;
};
const INIT_QUESTION: T_QUESTION = {
  operands: [0, 0],
  operator: E_OPERATIONS.NULL,
  result: 0,
};

export function generateQuestions(
  settings: T_GAME_SETTINGS,
  count: number,
): T_QUESTION[] {
  const questions: T_QUESTION[] = [];
  const initQuestion = deepCopyObject(INIT_QUESTION);

  for (let i = 0; i < count; i++) {
    questions.push(
      // if first question, pass initQuestion as prev
      generateQuestion(i === 0 ? initQuestion : questions[i - 1], settings),
    );
  }

  return questions;
}

export function generateQuestion(
  prev: T_QUESTION,
  settings: T_GAME_SETTINGS,
): T_QUESTION {
  const question = deepCopyObject(INIT_QUESTION);

  while (true) {
    const operands = [0, 0]
      .map((_) => randomInRange(settings.range.min, settings.range.max))
      .sort();
    const operations = convertOperationsObjectToArray(settings.ops);
    const operator = operations[randomInRange(0, operations.length - 1)];

    question.operands = operands;
    question.operator = operator;
    question.result = calculateQuestionResult(operands, operator);

    if (
      question.operands.join("") === prev.operands.join("") &&
      question.operator === prev.operator
    ) {
      continue;
    } else break;
  }

  return question;
}

function convertOperationsObjectToArray(ops: T_OPERATIONS): E_OPERATIONS[] {
  const arr: E_OPERATIONS[] = [];

  Object.entries(ops).forEach(([_, value], i) => {
    value && arr.push(i);
  });

  return arr.sort();
}

function calculateQuestionResult(
  operands: number[],
  operator: E_OPERATIONS,
): number {
  const [a, b] = operands;
  switch (operator) {
    case E_OPERATIONS.ADD:
      return a + b;
    case E_OPERATIONS.SUB:
      return a - b;
    case E_OPERATIONS.MULT:
      return a * b;
    case E_OPERATIONS.DIV:
      return a / b;
  }

  return 0;
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
