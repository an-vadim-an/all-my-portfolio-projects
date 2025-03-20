let display = document.getElementById("display");

function appendToDisplay(value) {
    let lastChar = display.value.slice(-1);

    // Запрет на двойные операторы
    if ("+-*/%".includes(lastChar) && "+-*/%".includes(value)) {
        return;
    }

    if (value === "%") {
        handlePercentage();
        return;
    }

    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function deleteLastChar() {
    display.value = display.value.slice(0, -1);
}

function calculateResult() {
    try {
        let expression = display.value.replace(/,/g, '.');
        let result = eval(expression);

        if (!isFinite(result)) throw new Error("Ошибка деления на 0");

        display.value = result.toString().replace('.', ',');
    } catch {
        display.value = "Ошибка";
    }
}

function handlePercentage() {
    let expression = display.value;
    let lastNumberMatch = expression.match(/(\d+(\.\d+)?)$/); 

    if (!lastNumberMatch) return; 

    let lastNumber = parseFloat(lastNumberMatch[0]); 
    let newValue = lastNumber / 100; 

    display.value = expression.replace(/(\d+(\.\d+)?)$/, newValue); 
}

// Поддержка клавиатуры
document.addEventListener("keydown", function (event) {
    const key = event.key;

    if ("0123456789+-*/.".includes(key)) {
        appendToDisplay(key);
    } else if (key === "Enter") {
        calculateResult();
    } else if (key === "Backspace") {
        deleteLastChar();
    } else if (key === "Escape") {
        clearDisplay();
    } else if (key === "%") {
        handlePercentage();
    }
});
