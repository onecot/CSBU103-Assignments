// ========================================
// DOM ELEMENTS
// ========================================
const topDisplay = document.getElementById("display-top")
const bottomDisplay = document.getElementById("display-bottom")
const topDisplayWrapper = document.getElementById("display-wrapper-top")
const displayWrapper = document.getElementById("display-wrapper-bottom")

// Initialize displays to "0"
topDisplay.innerText = "0"
bottomDisplay.innerText = "0"

// Number button configurations - maps digits 0-9 to their button elements
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => ({
    value,
    element: document.getElementById(`button-${["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][value]}`)
}))

// Operator buttons with their display symbols
const operators = {
    multiply: { element: document.getElementById("button-multiply"), symbol: "×" },
    divide: { element: document.getElementById("button-divide"), symbol: "÷" },
    plus: { element: document.getElementById("button-plus"), symbol: "+" },
    minus: { element: document.getElementById("button-minus"), symbol: "-" }
}

// Utility buttons
const buttonAllClear = document.getElementById("button-allClear")
const buttonClear = document.getElementById("button-clear")
const buttonBack = document.getElementById("button-back")
const buttonPercent = document.getElementById("button-percent")
const buttonDot = document.getElementById("button-dot")
const buttonCalculate = document.getElementById("button-calculate")

// ========================================
// HELPER FUNCTIONS
// ========================================

// Check if a character is a digit (0-9)
const isDigit = char => /^\d$/.test(char)

// Check if a character is an operator
const isOperator = char => ['×', '÷', '+', '-', '%'].includes(char)

// Scroll bottom display to show the rightmost content
const scrollToEnd = () => {
    displayWrapper.scrollLeft = displayWrapper.scrollWidth - displayWrapper.clientWidth
}

// Scroll top display to show the rightmost content
const scrollTopToEnd = () => {
    topDisplayWrapper.scrollLeft = topDisplayWrapper.scrollWidth - topDisplayWrapper.clientWidth
}

// Update bottom display and auto-scroll
const updateDisplay = text => {
    bottomDisplay.innerText = text
    scrollToEnd()
}

// Add text to display with smart "0" replacement logic
const addToDisplay = text => {
    const current = bottomDisplay.innerText
    
    // Replace initial "0" with the new digit
    if (current === "0") {
        updateDisplay(text)
        return
    }
    
    const lastChar = current[current.length - 1]
    const prevChar = current.length >= 2 ? current[current.length - 2] : null
    
    // Replace trailing "0" after an operator (e.g., "+0" becomes "+5")
    if (current.length > 1 && lastChar === "0" && prevChar && !isDigit(prevChar)) {
        updateDisplay(current.slice(0, -1) + text)
    } else {
        updateDisplay(current + text)
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

// Number buttons (0-9)
numbers.forEach(({ value, element }) => {
    element.addEventListener("click", () => addToDisplay(String(value)))
})

// Operator buttons (×, ÷, +, -)
Object.values(operators).forEach(({ element, symbol }) => {
    element.addEventListener("click", () => {
        const current = bottomDisplay.innerText
        const lastChar = current[current.length - 1]
        
        // Prevent consecutive operators - replace last operator if adding another
        if (isOperator(lastChar)) {
            updateDisplay(current.slice(0, -1) + symbol)
        } else {
            updateDisplay(current + symbol)
        }
    })
})

// Percent button
buttonPercent.addEventListener("click", () => {
    const current = bottomDisplay.innerText
    const lastChar = current[current.length - 1]
    
    // Prevent consecutive operators
    if (isOperator(lastChar)) {
        updateDisplay(current.slice(0, -1) + "%")
    } else {
        updateDisplay(current + "%")
    }
})

// Decimal point button
buttonDot.addEventListener("click", () => {
    const current = bottomDisplay.innerText
    const parts = current.split(/[×÷+\-%]/)
    const lastNumber = parts[parts.length - 1]
    
    // Prevent multiple decimal points in the same number
    if (!lastNumber.includes(".")) {
        updateDisplay(current + ".")
    }
})

// All Clear button - resets both displays
buttonAllClear.addEventListener("click", () => {
    topDisplay.innerText = "0"
    bottomDisplay.innerText = "0"
})

// Clear button - resets only bottom display
buttonClear.addEventListener("click", () => {
    bottomDisplay.innerText = "0"
})

// Backspace button - removes last character
buttonBack.addEventListener("click", () => {
    const current = bottomDisplay.innerText
    
    // Reset error messages to "0"
    if (current === "Error" || current === "Infinity" || current === "-Infinity") {
        updateDisplay("0")
        return
    }
    
    // If only one character, reset to "0"
    if (current.length <= 1) {
        updateDisplay("0")
    } else {
        updateDisplay(current.slice(0, -1))
    }
})

// Calculate button - evaluates the expression
buttonCalculate.addEventListener("click", () => {
    const input = bottomDisplay.innerText
    const lastChar = input[input.length - 1]
    
    // Validate expression doesn't end with an operator
    if (isOperator(lastChar)) {
        alert("Expression cannot end with an operator!")
        return
    }
    
    // Do nothing if expression is just "0"
    if (input === "0") {
        return
    }
    
    // Convert display symbols to JavaScript operators
    let expression = input
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/%/g, "/100*") // Convert percent to division
    
    // Validate expression contains only valid characters
    if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
        alert("Invalid characters in expression!")
        return
    }
    
    let result
    try {
        result = eval(expression)
        
        // Handle division by zero
        if (result === Infinity || result === -Infinity) {
            topDisplay.innerText = input
            scrollTopToEnd()
            updateDisplay("Infinity")
            return
        }
        
        // Handle invalid mathematical operations
        if (isNaN(result)) {
            topDisplay.innerText = input
            scrollTopToEnd()
            updateDisplay("Error")
            return
        }
        
        // Round to 10 decimal places to fix floating-point precision errors
        result = Math.round(result * 1e10) / 1e10
        
    } catch(e) {
        alert("Invalid expression!")
        return
    }
    
    // Display the result
    topDisplay.innerText = input
    scrollTopToEnd()
    updateDisplay(String(result))
})