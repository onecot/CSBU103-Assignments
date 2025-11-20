// DOM Elements
const topDisplay = document.getElementById("display-top")
const bottomDisplay = document.getElementById("display-bottom")
const topDisplayWrapper = document.getElementById("display-wrapper-top")
const displayWrapper = document.getElementById("display-wrapper-bottom")

topDisplay.innerText = "0"
bottomDisplay.innerText = "0"

let justCalculated = false

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => ({
    value,
    element: document.getElementById(`button-${["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][value]}`)
}))

const operators = {
    multiply: { element: document.getElementById("button-multiply"), symbol: "×" },
    divide: { element: document.getElementById("button-divide"), symbol: "÷" },
    plus: { element: document.getElementById("button-plus"), symbol: "+" },
    minus: { element: document.getElementById("button-minus"), symbol: "-" }
}

const buttonAllClear = document.getElementById("button-allClear")
const buttonClear = document.getElementById("button-clear")
const buttonBack = document.getElementById("button-back")
const buttonPercent = document.getElementById("button-percent")
const buttonDot = document.getElementById("button-dot")
const buttonCalculate = document.getElementById("button-calculate")

// Helper Functions
const isDigit = char => /^\d$/.test(char)
const isOperator = char => ['×', '÷', '+', '-', '%'].includes(char)

const scrollToEnd = () => {
    displayWrapper.scrollLeft = displayWrapper.scrollWidth - displayWrapper.clientWidth
}

const scrollTopToEnd = () => {
    topDisplayWrapper.scrollLeft = topDisplayWrapper.scrollWidth - topDisplayWrapper.clientWidth
}

const updateDisplay = text => {
    bottomDisplay.innerText = text
    scrollToEnd()
}

const addToDisplay = text => {
    const current = bottomDisplay.innerText
    
    if (current === "0") {
        updateDisplay(text)
        return
    }
    
    const lastChar = current[current.length - 1]
    const prevChar = current.length >= 2 ? current[current.length - 2] : null
    
    // Replace trailing "0" after operator, but not after decimal
    if (current.length > 1 && lastChar === "0" && prevChar && !isDigit(prevChar) && prevChar !== ".") {
        updateDisplay(current.slice(0, -1) + text)
    } else {
        updateDisplay(current + text)
    }
}

// Event Listeners - Numbers
numbers.forEach(({ value, element }) => {
    element.addEventListener("click", () => {
        const current = bottomDisplay.innerText
        
        if (current === "Undefined" || current === "Error") {
            updateDisplay(String(value))
            justCalculated = false
            return
        }
        
        if (justCalculated) {
            updateDisplay(String(value))
            justCalculated = false
        } else {
            addToDisplay(String(value))
        }
    })
})

// Event Listeners - Operators
Object.values(operators).forEach(({ element, symbol }) => {
    element.addEventListener("click", () => {
        const current = bottomDisplay.innerText
        const lastChar = current[current.length - 1]
        
        if (current === "Undefined" || current === "Error") return
        
        if (justCalculated) justCalculated = false
        
        if (current === "0" && (symbol === "×" || symbol === "÷" || symbol === "%")) return
        
        if (current === "0" && symbol === "-") {
            updateDisplay("-")
            return
        }
        
        if (isOperator(lastChar)) {
            updateDisplay(current.slice(0, -1) + symbol)
        } else {
            updateDisplay(current + symbol)
        }
    })
})

// Event Listeners - Percent
buttonPercent.addEventListener("click", () => {
    const current = bottomDisplay.innerText
    const lastChar = current[current.length - 1]
    
    if (current === "Undefined" || current === "Error" || current === "0") return
    
    if (justCalculated) justCalculated = false
    
    if (isOperator(lastChar)) {
        updateDisplay(current.slice(0, -1) + "%")
    } else {
        updateDisplay(current + "%")
    }
})

// Event Listeners - Decimal
buttonDot.addEventListener("click", () => {
    const current = bottomDisplay.innerText
    const lastChar = current[current.length - 1]
    
    if (current === "Undefined" || current === "Error") return
    
    if (justCalculated) {
        updateDisplay("0.")
        justCalculated = false
        return
    }
    
    if (current === "0") {
        updateDisplay("0.")
        return
    }
    
    if (isOperator(lastChar)) {
        updateDisplay(current + "0.")
        return
    }
    
    const parts = current.split(/[×÷+\-%]/)
    const lastNumber = parts[parts.length - 1]
    
    if (!lastNumber.includes(".")) {
        updateDisplay(current + ".")
    }
})

// Event Listeners - Clear buttons
buttonAllClear.addEventListener("click", () => {
    topDisplay.innerText = "0"
    bottomDisplay.innerText = "0"
    justCalculated = false
})

buttonClear.addEventListener("click", () => {
    bottomDisplay.innerText = "0"
    justCalculated = false
})

buttonBack.addEventListener("click", () => {
    const current = bottomDisplay.innerText
    
    if (current === "Error" || current === "Infinity" || current === "-Infinity" || current === "Undefined") {
        updateDisplay("0")
        justCalculated = false
        return
    }
    
    if (current.length <= 1) {
        updateDisplay("0")
    } else {
        updateDisplay(current.slice(0, -1))
    }
    justCalculated = false
})

// Event Listeners - Calculate
buttonCalculate.addEventListener("click", () => {
    const input = bottomDisplay.innerText
    const lastChar = input[input.length - 1]
    
    if (input === "Undefined" || input === "Error") return
    
    if (isOperator(lastChar)) {
        alert("Expression cannot end with an operator!")
        return
    }
    
    if (lastChar === ".") {
        alert("Expression cannot end with a decimal point!")
        return
    }
    
    if (input === "0" || input === "-") return
    
    if (/[×÷+\-%]{2,}/.test(input)) {
        alert("Invalid operator sequence!")
        return
    }
    
    let expression = input
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/%/g, "%")
    
    if (!/^[0-9+\-*/.()% ]+$/.test(expression)) {
        alert("Invalid characters in expression!")
        return
    }
    
    if (/\.[×÷+\-%]/.test(input)) {
        alert("Incomplete decimal number!")
        return
    }
    
    let result
    try {
        if (/\/0(?![0-9.])/.test(expression) || /%0(?![0-9.])/.test(expression)) {
            topDisplay.innerText = input
            scrollTopToEnd()
            updateDisplay("Undefined")
            justCalculated = true
            return
        }
        
        if (/^[*/%÷×]/.test(expression)) {
            alert("Expression cannot start with this operator!")
            return
        }
        
        result = eval(expression)
        
        if (result === Infinity || result === -Infinity) {
            topDisplay.innerText = input
            scrollTopToEnd()
            updateDisplay("Undefined")
            justCalculated = true
            return
        }
        
        if (isNaN(result)) {
            topDisplay.innerText = input
            scrollTopToEnd()
            updateDisplay("Undefined")
            justCalculated = true
            return
        }
        
        result = Math.round(result * 1e10) / 1e10
        
        if (Math.abs(result) > 1e15) {
            result = result.toExponential(10)
        }
        
        if (Math.abs(result) < 1e-10 && result !== 0) {
            result = result.toExponential(10)
        }
        
    } catch(e) {
        alert("Invalid expression!")
        return
    }
    
    topDisplay.innerText = input
    scrollTopToEnd()
    updateDisplay(String(result))
    justCalculated = true
})

// Keyboard Support
document.addEventListener("keydown", (event) => {
    const key = event.key
    
    if (/^[0-9]$/.test(key)) {
        event.preventDefault()
        const button = numbers.find(n => n.value === parseInt(key))
        if (button) button.element.click()
    }
    else if (key === "+") {
        event.preventDefault()
        operators.plus.element.click()
    }
    else if (key === "-") {
        event.preventDefault()
        operators.minus.element.click()
    }
    else if (key === "*") {
        event.preventDefault()
        operators.multiply.element.click()
    }
    else if (key === "/") {
        event.preventDefault()
        operators.divide.element.click()
    }
    else if (key === "%") {
        event.preventDefault()
        buttonPercent.click()
    }
    else if (key === "Enter" || key === "=") {
        event.preventDefault()
        buttonCalculate.click()
    }
    else if (key === ".") {
        event.preventDefault()
        buttonDot.click()
    }
    else if (key === "Backspace") {
        event.preventDefault()
        buttonBack.click()
    }
    else if (key === "Escape") {
        event.preventDefault()
        buttonAllClear.click()
    }
})

// Help Modal
const helpBtn = document.getElementById("help-btn")
const helpModal = document.getElementById("help-modal")
const helpClose = document.getElementById("help-close")

helpBtn.addEventListener("click", () => {
    helpModal.classList.add("active")
})

helpClose.addEventListener("click", () => {
    helpModal.classList.remove("active")
})

helpModal.addEventListener("click", (event) => {
    if (event.target === helpModal) {
        helpModal.classList.remove("active")
    }
})
