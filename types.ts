
export interface QuadraticProblem {
  general: {
    a: number;
    b: number;
    c: number;
  };
  standard: {
    a: number;
    p: number;
    q: number;
  };
}

export interface UserInputs {
  step1_factor: string;
  step2_complete: string;
  step3_p: string;
  step3_q: string;
}

export interface ValidationResults {
  step1_factor: boolean | null;
  step2_complete: boolean | null;
  step3_p: boolean | null;
  step3_q: boolean | null;
}
