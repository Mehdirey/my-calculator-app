import React from 'react';
import CalculatorButton from './components/CalculatorButton';
import { useCalculator } from './hooks/useCalculator';

const App: React.FC = () => {
  const { displayValue, rawDisplayValue, liveResult, handleButtonClick } = useCalculator();

  return (
    <div className="bg-white flex flex-col h-screen w-screen select-none">
      <div className="flex-1 flex flex-col justify-end items-start p-6 sm:p-8 overflow-hidden">
        <h1 
          className="text-black font-light text-6xl sm:text-8xl md:text-9xl break-all text-left w-full transition-transform duration-100"
          style={{ transform: `scale(${Math.min(1, 40 / rawDisplayValue.length)})`, transformOrigin: 'left center' }}
          aria-live="polite"
        >
          {displayValue}
        </h1>
        <h2 
          className="text-zinc-500 font-light text-3xl sm:text-4xl md:text-5xl break-all text-left w-full h-16 sm:h-20 flex items-center justify-start"
          aria-live="polite"
        >
          {liveResult ? `= ${liveResult}` : ''}
        </h2>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-4 p-4">
        {/* Row 1 */}
        <CalculatorButton onClick={() => handleButtonClick('AC')} variant="special">AC</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('⌫')} variant="special">⌫</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('%')} variant="special">%</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('÷')} variant="operator">÷</CalculatorButton>

        {/* Row 2 */}
        <CalculatorButton onClick={() => handleButtonClick('7')}>7</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('8')}>8</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('9')}>9</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('×')} variant="operator">×</CalculatorButton>

        {/* Row 3 */}
        <CalculatorButton onClick={() => handleButtonClick('4')}>4</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('5')}>5</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('6')}>6</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('-')} variant="operator">-</CalculatorButton>

        {/* Row 4 */}
        <CalculatorButton onClick={() => handleButtonClick('1')}>1</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('2')}>2</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('3')}>3</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('+')} variant="operator">+</CalculatorButton>

        {/* Row 5 */}
        <CalculatorButton onClick={() => handleButtonClick('0')} className="col-span-2 !justify-start pl-10">0</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('.')}>.</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('=')} variant="operator">=</CalculatorButton>
      </div>
    </div>
  );
};

export default App;