import React, { useState } from 'react';

const CalculatorButton = ({
  onClick,
  children,
  className = 'bg-gray-700 hover:bg-gray-600',
  wide = false
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full h-16 text-2xl font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${className} ${wide ? 'col-span-2' : ''}`}
  >
    {children}
  </button>
);

const CalculatorContent: React.FC<{ id: string }> = ({ id }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplayValue(digit);
      setWaitingForOperand(false);
    } else {
      if (displayValue.length >= 15) return;
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearAll = () => {
    setDisplayValue('0');
    setOperator(null);
    setPrevValue(null);
    setWaitingForOperand(false);
  };
  
  const calculate = (firstOperand: number, secondOperand: number, op: string): number => {
    switch (op) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case '*': return firstOperand * secondOperand;
      case '/': return firstOperand / secondOperand;
      default: return secondOperand;
    }
  };
  
  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (prevValue == null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const result = calculate(prevValue, inputValue, operator);
      setPrevValue(result);
      setDisplayValue(String(result));
    }
    
    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(displayValue);
    if (operator && prevValue !== null) {
      const result = calculate(prevValue, inputValue, operator);
      setDisplayValue(String(result));
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const handleSpecialOperator = (op: string) => {
      const currentValue = parseFloat(displayValue);
      let newValue: number;
      if (op === '+/-') {
          newValue = currentValue * -1;
      } else if (op === '%') {
          newValue = currentValue / 100;
      } else {
          return;
      }
      setDisplayValue(String(newValue));
  };

  return (
    <div className="flex-grow flex flex-col bg-gray-800 p-4 select-none">
      <div className="flex-grow flex items-end justify-end bg-black/50 rounded-lg p-4 mb-4">
        <p className="text-white text-5xl font-mono break-all" style={{ minHeight: '3.75rem' }}>{displayValue}</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <CalculatorButton onClick={clearAll} className="bg-gray-500 hover:bg-gray-400 text-black">AC</CalculatorButton>
        <CalculatorButton onClick={() => handleSpecialOperator('+/-')} className="bg-gray-500 hover:bg-gray-400 text-black">+/-</CalculatorButton>
        <CalculatorButton onClick={() => handleSpecialOperator('%')} className="bg-gray-500 hover:bg-gray-400 text-black">%</CalculatorButton>
        <CalculatorButton onClick={() => performOperation('/')} className="bg-orange-500 hover:bg-orange-400 text-white">÷</CalculatorButton>

        <CalculatorButton onClick={() => inputDigit('7')}>7</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('8')}>8</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('9')}>9</CalculatorButton>
        <CalculatorButton onClick={() => performOperation('*')} className="bg-orange-500 hover:bg-orange-400 text-white">×</CalculatorButton>

        <CalculatorButton onClick={() => inputDigit('4')}>4</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('5')}>5</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('6')}>6</CalculatorButton>
        <CalculatorButton onClick={() => performOperation('-')} className="bg-orange-500 hover:bg-orange-400 text-white">−</CalculatorButton>

        <CalculatorButton onClick={() => inputDigit('1')}>1</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('2')}>2</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('3')}>3</CalculatorButton>
        <CalculatorButton onClick={() => performOperation('+')} className="bg-orange-500 hover:bg-orange-400 text-white">+</CalculatorButton>

        <CalculatorButton onClick={() => inputDigit('0')} wide>0</CalculatorButton>
        <CalculatorButton onClick={inputDecimal}>.</CalculatorButton>
        <CalculatorButton onClick={handleEquals} className="bg-orange-500 hover:bg-orange-400 text-white">=</CalculatorButton>
      </div>
    </div>
  );
};

export default CalculatorContent;
