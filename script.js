document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const display = document.getElementById('calc-display');
    const expression = document.getElementById('calc-expression');
    const historyList = document.getElementById('calc-historyList');
    const notification = document.getElementById('calc-notification');
    const clearHistoryBtn = document.getElementById('calc-clearHistory');
    const copyBtn = document.getElementById('calc-copyBtn');
    const degBtn = document.getElementById('calc-degBtn');
    const radBtn = document.getElementById('calc-radBtn');
    const gradBtn = document.getElementById('calc-gradBtn');
    const buttons = document.querySelectorAll('.calc-btn');
    const themeToggle = document.getElementById('themeToggle');
    const topNav = document.querySelector('.top-nav');

    // Calculator state
    let currentInput = '0';
    let expressionText = '';
    let shouldResetDisplay = false;
    let angleMode = 'deg';
    let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];

    // Navigation scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            topNav.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
            topNav.style.height = '60px';
        } else {
            topNav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            topNav.style.height = '70px';
        }
    });

    // Console welcome message
    console.log('%cWelcome to Scientific Calculator!', 
        'font-size: 18px; font-weight: bold; color: #2c5282;');
    console.log('%cClean design with advanced functionality', 
        'font-size: 14px; color: #4caf50;');

    // Theme management
    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('calculatorTheme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('calculatorTheme', 'light');
        }
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('calculatorTheme') || 'light';
    setTheme(savedTheme);

    // Toggle theme
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });

    // Update display
    function updateDisplay() {
        display.value = currentInput;
        expression.value = expressionText;
    }

    // Add to history
    function addToHistory(exp, result) {
        history.unshift({ exp, result });
        if (history.length > 20) history.pop();
        localStorage.setItem('calculatorHistory', JSON.stringify(history));
        renderHistory();
    }

    // Render history
    function renderHistory() {
        historyList.innerHTML = '';
        history.forEach((item) => {
            const li = document.createElement('li');
            li.className = 'calc-history-item';
            li.innerHTML = `
                <div class="calc-history-expression">${item.exp}</div>
                <div class="calc-history-result">= ${item.result}</div>
            `;
            li.addEventListener('click', () => {
                currentInput = item.result;
                expressionText = '';
                updateDisplay();
            });
            historyList.appendChild(li);
        });
    }

    // Show notification
    function showNotification(message, isError = false) {
        notification.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${message}`;
        notification.className = isError ? 'calc-notification error show' : 'calc-notification show';
        
        setTimeout(() => {
            notification.className = notification.className.replace(' show', '');
        }, 3000);
    }

    // Angle conversion
    function convertAngle(value) {
        if (angleMode === 'deg') return value * Math.PI / 180;
        if (angleMode === 'grad') return value * Math.PI / 200;
        return value; // radians
    }

    // Angle conversion back
    function convertAngleBack(value) {
        if (angleMode === 'deg') return value * 180 / Math.PI;
        if (angleMode === 'grad') return value * 200 / Math.PI;
        return value; // radians
    }

    // Calculate result
    function calculateResult() {
        try {
            let calcExpression = expressionText + currentInput;
            
            // Replace special functions
            calcExpression = calcExpression
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(')
                .replace(/asin\(/g, 'Math.asin(')
                .replace(/acos\(/g, 'Math.acos(')
                .replace(/atan\(/g, 'Math.atan(')
                .replace(/sinh\(/g, 'Math.sinh(')
                .replace(/cosh\(/g, 'Math.cosh(')
                .replace(/tanh\(/g, 'Math.tanh(')
                .replace(/asinh\(/g, 'Math.asinh(')
                .replace(/acosh\(/g, 'Math.acosh(')
                .replace(/atanh\(/g, 'Math.atanh(')
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/exp\(/g, 'Math.exp(')
                .replace(/√\(/g, 'Math.sqrt(')
                .replace(/abs\(/g, 'Math.abs(')
                .replace(/π/g, 'Math.PI')
                .replace(/e/g, 'Math.E')
                .replace(/!/g, 'factorial(')
                .replace(/\^/g, '**');
            
            // Factorial function
            function factorial(n) {
                if (n === 0 || n === 1) return 1;
                let result = 1;
                for (let i = 2; i <= n; i++) {
                    result *= i;
                }
                return result;
            }
            
            // Handle angles
            const angleFuncs = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];
            angleFuncs.forEach(func => {
                const regex = new RegExp(`Math.${func}\\((\\d+\\.?\\d*)`, 'g');
                calcExpression = calcExpression.replace(regex, (match, p1) => {
                    const num = parseFloat(p1);
                    if (func.startsWith('a')) {
                        return `Math.${func}(${num}) * ${convertAngleBack(1)}`;
                    }
                    return `Math.${func}(${convertAngle(num)})`;
                });
            });
            
            // Calculate result
            const result = eval(calcExpression);
            addToHistory(expressionText + currentInput, result);
            
            expressionText = '';
            currentInput = result.toString();
            shouldResetDisplay = true;
            
        } catch (error) {
            showNotification('Calculation error: ' + error.message, true);
        }
    }
    
    // Button click handling
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            
            if (value === 'clear') {
                // Clear all
                currentInput = '0';
                expressionText = '';
                shouldResetDisplay = false;
            } else if (value === 'backspace') {
                // Backspace
                currentInput = currentInput.length > 1 ? 
                    currentInput.slice(0, -1) : '0';
            } else if (value === '±') {
                // Toggle sign
                currentInput = currentInput.startsWith('-') ? 
                    currentInput.slice(1) : '-' + currentInput;
            } else if (value === '=') {
                // Calculate result
                if (expressionText !== '') {
                    calculateResult();
                }
            } else if (['+', '-', '*', '/', '^', '%'].includes(value)) {
                // Operators
                expressionText += currentInput + value;
                shouldResetDisplay = true;
            } else if (value === '10^(') {
                // Power of 10
                expressionText += '10**(' + currentInput + ')';
                shouldResetDisplay = true;
            } else if (['sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(', 
                       'sinh(', 'cosh(', 'tanh(', 'asinh(', 'acosh(', 'atanh(', 
                       'log(', 'ln(', 'exp(', '√(', 'abs(', '!', 'π', 'e', '(', ')', '1/('].includes(value)) {
                // Functions and constants
                expressionText += value;
                shouldResetDisplay = true;
            } else {
                // Numbers and decimal point
                if (shouldResetDisplay) {
                    currentInput = '0';
                    shouldResetDisplay = false;
                }
                
                if (value === '.') {
                    if (!currentInput.includes('.')) {
                        currentInput += '.';
                    }
                } else {
                    currentInput = currentInput === '0' ? value : currentInput + value;
                }
            }
            
            updateDisplay();
        });
    });
    
    // Copy result
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(display.value)
            .then(() => showNotification('Result copied to clipboard!'))
            .catch(() => showNotification('Copy failed', true));
    });
    
    // Clear history
    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        localStorage.setItem('calculatorHistory', JSON.stringify(history));
        renderHistory();
    });
    
    // Set angle mode
    function setAngleMode(mode) {
        angleMode = mode;
        degBtn.classList.toggle('active', mode === 'deg');
        radBtn.classList.toggle('active', mode === 'rad');
        gradBtn.classList.toggle('active', mode === 'grad');
    }
    
    degBtn.addEventListener('click', () => setAngleMode('deg'));
    radBtn.addEventListener('click', () => setAngleMode('rad'));
    gradBtn.addEventListener('click', () => setAngleMode('grad'));
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        
        if (/\d/.test(key)) {
            // Numbers
            const button = document.querySelector(`.calc-btn[data-value="${key}"]`);
            if (button) button.click();
        } else if (['+', '-', '*', '/', '.', '%', '='].includes(key)) {
            // Operators
            const button = document.querySelector(`.calc-btn[data-value="${key}"]`);
            if (button) button.click();
        } else if (key === 'Enter') {
            // Calculate
            document.querySelector('.calc-btn[data-value="="]').click();
        } else if (key === 'Escape') {
            // Clear
            document.querySelector('.calc-btn[data-value="clear"]').click();
        } else if (key === 'Backspace') {
            // Backspace
            document.querySelector('.calc-btn[data-value="backspace"]').click();
        }
    });
    
    // Initialize
    updateDisplay();
    renderHistory();
});
