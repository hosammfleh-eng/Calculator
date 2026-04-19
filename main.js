 class SimpleCalculator {
        constructor(previousElement, currentElement) {
            this.previousElement = previousElement;
            this.currentElement = currentElement;
            this.clear();
        }

        clear() {
            this.currentOperand = '0';
            this.previousOperand = '';
            this.operation = undefined;
            this.updateDisplay();
        }

        delete() {
            if (this.currentOperand === '0') return;
            if (this.currentOperand.length === 1) {
                this.currentOperand = '0';
            } else {
                this.currentOperand = this.currentOperand.slice(0, -1);
            }
            this.updateDisplay();
        }

        appendNumber(number) {
            // منع تكرار الصفر في البداية بشكل ذكي
            if (number === '.' && this.currentOperand.includes('.')) return;
            if (this.currentOperand === '0' && number !== '.') {
                this.currentOperand = number;
            } else {
                this.currentOperand += number;
            }
            this.updateDisplay();
        }

        chooseOperation(operation) {
            if (this.currentOperand === '' && this.previousOperand === '') return;
            if (this.previousOperand !== '' && this.currentOperand !== '') {
                this.compute();
            }
            this.operation = operation;
            this.previousOperand = this.currentOperand;
            this.currentOperand = '';
            this.updateDisplay();
        }

        percent() {
            // تحويل الرقم الحالي إلى نسبة مئوية
            if (this.currentOperand === '') return;
            let value = parseFloat(this.currentOperand);
            if (isNaN(value)) return;
            value = value / 100;
            this.currentOperand = value.toString();
            this.updateDisplay();
        }

        compute() {
            let computation;
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);
            if (isNaN(prev) || isNaN(current)) return;

            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '×':
                    computation = prev * current;
                    break;
                case '÷':
                    if (current === 0) {
                        alert("لا يمكن القسمة على صفر");
                        this.clear();
                        return;
                    }
                    computation = prev / current;
                    break;
                default:
                    return;
            }
            this.currentOperand = computation.toString();
            this.operation = undefined;
            this.previousOperand = '';
            this.updateDisplay();
        }

        updateDisplay() {
            // تنسيق العرض بشكل جميل
            if (this.currentOperand !== undefined) {
                this.currentElement.innerText = this.currentOperand;
            }
            if (this.operation != null && this.previousOperand !== '') {
                this.previousElement.innerText = `${this.previousOperand} ${this.operation}`;
            } else {
                this.previousElement.innerText = '';
            }
        }
    }

    // تهيئة عناصر DOM
    const previousDisplay = document.getElementById('previousDisplay');
    const currentDisplay = document.getElementById('currentDisplay');
    const calculator = new SimpleCalculator(previousDisplay, currentDisplay);

    // أزرار الأرقام
    const numberButtons = [
        'btn0', 'btn1', 'btn2', 'btn3', 'btn4', 'btn5', 'btn6', 'btn7', 'btn8', 'btn9'
    ];
    numberButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                const number = btn.innerText;
                calculator.appendNumber(number);
            });
        }
    });

    // زر النقطة العشرية
    document.getElementById('dotBtn').addEventListener('click', () => {
        calculator.appendNumber('.');
    });

    // أزرار العمليات
    document.getElementById('addBtn').addEventListener('click', () => {
        calculator.chooseOperation('+');
    });
    document.getElementById('subtractBtn').addEventListener('click', () => {
        calculator.chooseOperation('-');
    });
    document.getElementById('multiplyBtn').addEventListener('click', () => {
        calculator.chooseOperation('×');
    });
    document.getElementById('divideBtn').addEventListener('click', () => {
        calculator.chooseOperation('÷');
    });
    
    // زر النسبة المئوية
    document.getElementById('percentBtn').addEventListener('click', () => {
        calculator.percent();
    });

    // زر المسح الكامل
    document.getElementById('clearBtn').addEventListener('click', () => {
        calculator.clear();
    });

    // زر الحذف (مسح حرف)
    document.getElementById('deleteBtn').addEventListener('click', () => {
        calculator.delete();
    });

    // زر يساوي
    document.getElementById('equalsBtn').addEventListener('click', () => {
        if (calculator.previousOperand !== '' && calculator.currentOperand !== '' && calculator.operation) {
            calculator.compute();
        }
    });

    // دعم لوحة المفاتيح (اختياري محسن)
    window.addEventListener('keydown', (e) => {
        const key = e.key;
        if (key >= '0' && key <= '9') {
            calculator.appendNumber(key);
        } else if (key === '.') {
            calculator.appendNumber('.');
        } else if (key === '+' || key === '-') {
            calculator.chooseOperation(key);
        } else if (key === '*') {
            calculator.chooseOperation('×');
        } else if (key === '/') {
            e.preventDefault();
            calculator.chooseOperation('÷');
        } else if (key === '%') {
            calculator.percent();
        } else if (key === 'Enter' || key === '=') {
            if (calculator.previousOperand !== '' && calculator.currentOperand !== '' && calculator.operation) {
                calculator.compute();
            }
        } else if (key === 'Backspace') {
            calculator.delete();
        } else if (key === 'Escape' || key === 'Delete') {
            calculator.clear();
        }
    });