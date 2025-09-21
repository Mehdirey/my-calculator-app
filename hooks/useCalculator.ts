import { useState, useMemo } from 'react';

const evaluate = (expr: string): string => {
    if (!expr) return '';
    
    let tempExpr = expr;

    // Do not evaluate if it ends with an operator, but do evaluate what's before it.
    if (['+', '-', '×', '÷', '.'].includes(tempExpr.slice(-1))) {
        tempExpr = tempExpr.slice(0, -1);
    }

    if (!tempExpr) return '';

    try {
        const sanitized = tempExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/--/g, '+');
        
        // Prevent eval on invalid expressions.
        if (/[^0-9+\-*/.() ]/.test(sanitized)) {
            return '';
        }

        if (/\/0(?!\.)/.test(sanitized)) {
            return 'Error';
        }
        
        // Using new Function is safer than direct eval()
        // eslint-disable-next-line no-new-func
        const result = new Function(`return ${sanitized}`)();
        
        if (isNaN(result) || !isFinite(result)) {
            return 'Error';
        }

        const integerDigits = Math.floor(Math.abs(result)).toString().length;

        // For numbers with a large integer part, handle them specially to avoid precision loss.
        if (integerDigits > 12) {
            // If the number is excessively large, switch to exponential notation.
            if (integerDigits > 16) {
                 return result.toExponential(9);
            }
            // Otherwise, return the number rounded to the nearest integer.
            return String(Math.round(result));
        }
        
        // For other numbers, use toPrecision to handle floating-point inaccuracies,
        // then convert back to Number to remove trailing zeros and handle scientific notation.
        return String(Number(result.toPrecision(12)));
    } catch (e) {
        return ''; // Return empty for syntax errors during typing
    }
};

const formatNumber = (numStr: string): string => {
  if (!numStr || isNaN(parseFloat(numStr))) return numStr;
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const formatExpression = (expr: string): string => {
  if (expr === '') return '0';
  // Don't format numbers in scientific notation
  if (expr.includes('e')) return expr;
  // Split by operators while keeping them in the array
  const parts = expr.split(/([+\-×÷])/);
  const formattedParts = parts.map(part => formatNumber(part));
  return formattedParts.join('');
};


export const useCalculator = () => {
    const [expression, setExpression] = useState('');
    const [isResult, setIsResult] = useState(false); 

    const liveResult = useMemo(() => {
        if (isResult || !expression) return '';
        const result = evaluate(expression);
        // Don't show the live result if it's the same as what's typed
        if (result === expression || result === '' || result === 'Error') return '';
        
        // Don't format numbers in scientific notation
        if (result.includes('e')) return result;
        return formatNumber(result);
    }, [expression, isResult]);

    const handleButtonClick = (value: string) => {
        const operators = ['+', '-', '×', '÷'];
        const lastChar = expression.slice(-1);

        if (expression === 'Error') {
            if (value === 'AC' || value === '⌫') { // Backspace or AC clears the error
                setExpression('');
                setIsResult(false);
            } else if (!operators.includes(value) && value !== '=' && value !== '%' && value !== '.') { // A digit is pressed
                setExpression(value);
                setIsResult(false);
            }
            return; // Ignore other presses like operators or equals when in error state
        }
        
        switch (value) {
            case 'AC':
                setExpression('');
                setIsResult(false);
                break;
            
            case '⌫':
                setExpression(prev => prev.slice(0, -1));
                if (isResult) {
                    setIsResult(false);
                }
                break;

            case '=':
                const finalResult = evaluate(expression);
                if (finalResult && finalResult !== 'Error') {
                    setExpression(finalResult);
                    setIsResult(true);
                } else if (expression) { // Only show error if there was an expression to evaluate
                    setExpression('Error');
                    setIsResult(true);
                }
                break;

            case '.':
                if (isResult) {
                    setExpression('0.');
                    setIsResult(false);
                    return;
                }
                const currentNumber = expression.split(/[+\-×÷]/).pop() || '';
                if (!currentNumber.includes('.')) {
                    setExpression(prev => prev + '.');
                }
                break;
            
            case '%':
                const resultForPercent = evaluate(expression);
                if (resultForPercent && resultForPercent !== 'Error') {
                    setExpression(String(parseFloat(resultForPercent) / 100));
                    setIsResult(true);
                }
                break;

            default: // Digits and operators
                if (operators.includes(value)) {
                    if (expression === '' && value !== '-') return; // Can't start with most operators
                    if (operators.includes(lastChar)) {
                        setExpression(prev => prev.slice(0, -1) + value);
                    } else {
                        setExpression(prev => prev + value);
                    }
                    setIsResult(false);
                } else { // Digits
                    if (isResult) {
                        setExpression(value);
                        setIsResult(false);
                    } else {
                        setExpression(prev => prev + value);
                    }
                }
                break;
        }
    };
    
    const displayValue = formatExpression(expression);
    const rawDisplayValue = expression || '0';

    return { displayValue, rawDisplayValue, liveResult, handleButtonClick };
};