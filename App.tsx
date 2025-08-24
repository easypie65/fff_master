import React, { useState, useEffect, useCallback } from 'react';
import type { QuadraticProblem, UserInputs, ValidationResults } from './types';
import { CheckCircleIcon, XCircleIcon } from './components/Icons';

// Helper function to generate a random integer within a range
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper to format numbers with signs for display in equations
const formatSign = (num: number, leading: boolean = false): string => {
  if (num === 0) return '';
  const sign = num > 0 ? '+ ' : '- ';
  const absNum = Math.abs(num);
  if (leading) {
      return num > 0 ? `${absNum}` : `- ${absNum}`;
  }
  return `${sign}${absNum}`;
};

const initialInputs: UserInputs = {
  step1_factor: '',
  step2_complete: '',
  step3_p: '',
  step3_q: '',
};

const initialValidation: ValidationResults = {
  step1_factor: null,
  step2_complete: null,
  step3_p: null,
  step3_q: null,
};

const App: React.FC = () => {
  const [problem, setProblem] = useState<QuadraticProblem | null>(null);
  const [userInputs, setUserInputs] = useState<UserInputs>(initialInputs);
  const [validation, setValidation] = useState<ValidationResults>(initialValidation);
  const [isAllCorrect, setIsAllCorrect] = useState<boolean>(false);

  const generateProblem = useCallback(() => {
    let a = 0;
    while (a === 0) {
      a = getRandomInt(-3, 3);
    }
    const p = getRandomInt(-5, 5);
    const q = getRandomInt(-10, 10);

    const b = -2 * a * p;
    const c = a * p * p + q;

    setProblem({
      general: { a, b, c },
      standard: { a, p, q },
    });
    
    // Reset state
    setUserInputs(initialInputs);
    setValidation(initialValidation);
    setIsAllCorrect(false);
  }, []);

  useEffect(() => {
    generateProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputs(prev => ({ ...prev, [name]: value }));
  };

  const checkStep1 = () => {
    if (!problem) return;
    const { general } = problem;
    const correct_step1_factor = general.b / general.a;
    // The UI shows the sign, so the user should input the absolute value.
    const isCorrect = parseFloat(userInputs.step1_factor) === Math.abs(correct_step1_factor);
    setValidation(prev => ({ ...prev, step1_factor: isCorrect }));
  };

  const checkStep2 = () => {
    if (!problem) return;
    const { general } = problem;
    const correct_step2_complete = Math.pow(general.b / (2 * general.a), 2);
    const isCorrect = parseFloat(userInputs.step2_complete) === correct_step2_complete;
    setValidation(prev => ({ ...prev, step2_complete: isCorrect }));
  };

  const checkStep3 = () => {
    if (!problem) return;
    const { standard } = problem;
    const correct_step3_p = -standard.p;
    const correct_step3_q = standard.q;

    const isPCorrect = parseFloat(userInputs.step3_p) === correct_step3_p;
    const isQCorrect = parseFloat(userInputs.step3_q) === correct_step3_q;

    setValidation(prev => ({
      ...prev,
      step3_p: isPCorrect,
      step3_q: isQCorrect,
    }));

    if (isPCorrect && isQCorrect) {
      setIsAllCorrect(true);
    }
  };


  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-xl text-slate-600">Loading problem...</p>
      </div>
    );
  }

  const { general } = problem;

  const getInputClass = (isValid: boolean | null) => {
    if (isValid === true) return 'border-green-500 ring-green-500';
    if (isValid === false) return 'border-red-500 ring-red-500';
    return 'border-slate-300 focus:border-blue-500 focus:ring-blue-500';
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <main className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">이차함수 표준형 변환 연습</h1>
          <p className="text-slate-500 text-center mt-2">
            일반형 이차함수를 단계별로 표준형으로 바꾸어 보세요.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-slate-600 text-sm mb-1">문제 (일반형)</p>
          <p className="text-2xl font-mono tracking-wider text-slate-800">
            y = {formatSign(general.a, true)}x² {formatSign(general.b)}x {formatSign(general.c)}
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="space-y-3 p-4 rounded-lg border border-slate-200">
            <p className="font-semibold text-slate-700">1단계: x²의 계수로 묶기</p>
            <div className="flex items-center justify-center bg-slate-50 p-3 rounded-md text-lg font-mono flex-wrap gap-2">
              <span>y = {general.a}(x²</span>
              <span className="font-bold">{general.b / general.a >= 0 ? '+' : '-'}</span>
              <input
                type="number"
                name="step1_factor"
                value={userInputs.step1_factor}
                onChange={handleInputChange}
                className={`w-16 text-center bg-white rounded border-2 p-1 focus:outline-none focus:ring-2 ${getInputClass(validation.step1_factor)}`}
                aria-label="Factored x coefficient"
                disabled={validation.step1_factor === true || isAllCorrect}
              />
              <span>x) {formatSign(general.c)}</span>
            </div>
            <div className="text-right">
                <button
                    onClick={checkStep1}
                    disabled={validation.step1_factor === true || isAllCorrect}
                    className="bg-sky-600 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                1단계 확인
                </button>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="space-y-3 p-4 rounded-lg border border-slate-200">
            <p className="font-semibold text-slate-700">2단계: 완전제곱식 만들기</p>
            <div className="flex items-center justify-center bg-slate-50 p-3 rounded-md text-lg font-mono flex-wrap gap-2">
                <span>y = {general.a}(x² {formatSign(general.b / general.a)}x</span>
                <span className="font-bold">+</span>
                <input
                    type="number"
                    name="step2_complete"
                    value={userInputs.step2_complete}
                    onChange={handleInputChange}
                    className={`w-16 text-center bg-white rounded border-2 p-1 focus:outline-none focus:ring-2 ${getInputClass(validation.step2_complete)}`}
                    aria-label="Completing the square term"
                    disabled={validation.step1_factor !== true || validation.step2_complete === true || isAllCorrect}
                />
                <span>) {formatSign(general.c)}</span>
                <span className="font-bold">-</span>
                <span>{general.a} &times;</span>
                <span className="w-16 text-center bg-slate-200 rounded border-2 border-slate-200 p-1">
                    {userInputs.step2_complete || '?'}
                </span>
            </div>
             <div className="text-right">
                <button
                    onClick={checkStep2}
                    disabled={validation.step1_factor !== true || validation.step2_complete === true || isAllCorrect}
                    className="bg-sky-600 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                2단계 확인
                </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3 p-4 rounded-lg border border-slate-200">
            <p className="font-semibold text-slate-700">3단계: 표준형으로 정리하기</p>
             <div className="flex items-center justify-center bg-slate-50 p-3 rounded-md text-lg font-mono flex-wrap gap-2">
                <span>y = {general.a}(x</span>
                 <span className="font-bold">{parseFloat(userInputs.step3_p) >= 0 ? '+' : ''}</span>
                <input
                    type="number"
                    name="step3_p"
                    value={userInputs.step3_p}
                    onChange={handleInputChange}
                    className={`w-16 text-center bg-white rounded border-2 p-1 focus:outline-none focus:ring-2 ${getInputClass(validation.step3_p)}`}
                    aria-label="p-value of vertex"
                    disabled={validation.step2_complete !== true || isAllCorrect}
                />
                <span>)²</span>
                 <span className="font-bold">{parseFloat(userInputs.step3_q) >= 0 ? '+' : ''}</span>
                <input
                    type="number"
                    name="step3_q"
                    value={userInputs.step3_q}
                    onChange={handleInputChange}
                    className={`w-16 text-center bg-white rounded border-2 p-1 focus:outline-none focus:ring-2 ${getInputClass(validation.step3_q)}`}
                    aria-label="q-value of vertex"
                    disabled={validation.step2_complete !== true || isAllCorrect}
                />
             </div>
             <div className="text-right">
                <button
                    onClick={checkStep3}
                    disabled={validation.step2_complete !== true || isAllCorrect}
                    className="bg-sky-600 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                3단계 확인
                </button>
            </div>
          </div>
        </div>

        {isAllCorrect && (
            <div className="space-y-4">
              <div className="flex items-center justify-center p-3 rounded-lg bg-green-100 text-green-800">
                <CheckCircleIcon className="w-6 h-6 mr-2" />
                <span className="font-semibold">정답입니다! 모든 단계를 완벽하게 해결했어요.</span>
              </div>
              <div className="p-4 border-l-4 border-indigo-400 bg-indigo-50 text-indigo-800 rounded-r-lg">
                <h3 className="font-bold text-lg">🎉 과제 제출 안내</h3>
                <p className="mt-2 text-sm">
                  정답 화면을 캡처하여 아래 링크의 패들렛에 올려주세요.
                </p>
                <div className="mt-3 text-sm p-3 bg-indigo-100 rounded-md">
                  <p className="font-semibold">💻 크롬북 캡처 방법:</p>
                  <p className="mt-1">
                    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Shift</kbd> + <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Ctrl</kbd> + <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">창 표시</kbd> 키를 누른 후, 영역을 지정하여 캡처하세요.
                  </p>
                </div>
                <a 
                  href="https://padlet.com/easypie65/Yeojums33" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  패들렛에 제출하기
                </a>
              </div>
            </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={generateProblem}
              className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              새 문제
            </button>
        </div>
      </main>
    </div>
  );
};

export default App;