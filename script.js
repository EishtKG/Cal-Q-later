const display = document.getElementById("display");
const button = document.querySelectorAll("button");
let currentInput = "0";
let justCalculate = false;
const operators = ["+", "-", "*", "/"];


document.addEventListener('keydown', function (event) {
    let keyPressed = event.key;

    // map special keys to button text
    if (keyPressed == "Enter") keyPressed = "=";
    if (keyPressed == "Backspace") keyPressed = "C";
    if (keyPressed == "Escape") keyPressed = "AC";


    // now find matching button and click it
    button.forEach(function (btn) {
        if (btn.innerText == keyPressed) {
            btn.click();
        }
    });
});

button.forEach(function (btn) {
    btn.addEventListener("click", function () {
        // 🛑 stop early if decimal already exists
        const lastNum = currentInput.split(/[\+\-\*\/]/).pop();
        if (btn.innerText == "." && lastNum.includes(".")) {
            return;  // do nothing!
        }
        if (btn.innerText == "C") {
            currentInput = currentInput.slice(0, -1);
            if (currentInput == "") {
                currentInput = "0";
            }
        } else if (btn.innerText == "=") {
            const lastChar = currentInput[currentInput.length - 1];
            if (operators.includes(lastChar)) {
                // end is an operator, just remove it and don't calculate
                currentInput = currentInput.slice(0, -1);
            } else if (lastChar == ".") {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = String(eval(currentInput));
                justCalculate = true;
            }
        } else if (btn.innerText == "AC") {
            currentInput = "0";

        } else if (btn.innerText == "%") {
            currentInput = String(currentInput / 100);

        } else if (btn.innerText == "+/-") {
            currentInput = String(parseFloat(currentInput) * (-1));
        }
        else {
            if ((currentInput == "0" || justCalculate == true) && !operators.includes(btn.innerText)) {
                if (btn.innerText == ".") {
                    currentInput = "0.";  // special case!
                } else {
                    currentInput = btn.innerText;
                }
                justCalculate = false;
            } else {
                justCalculate = false; // also reset flag when operator is clicked after =

                const lastChar = currentInput[currentInput.length - 1];
                if (operators.includes(btn.innerText) && operators.includes(lastChar)) {
                    // NEW button is operator AND last char is operator → replace
                    currentInput = currentInput.slice(0, -1) + btn.innerText;
                } else {
                    // just append normally
                    currentInput += btn.innerText;
                }
            }
        }

        display.value = currentInput;
    })
});

const themes = [
    { gradient: "radial-gradient(ellipse at bottom, #000428, #004e92, #00b4db)", name: "Deep Ocean" },
    { gradient: "radial-gradient(ellipse at top, #0a0000, #2d0000, #8b0000, #cc2200)", name: "Blood Moon" },
    { gradient: "conic-gradient(from 0deg, #0a0015, #2d0050, #7700cc, #0a0015, #003366, #0a0015)", name: "Nebula" },
    { gradient: "radial-gradient(ellipse at top, #0d0221, #190d3a, #00ff88)", name: "Midnight Aurora" },
    { gradient: "radial-gradient(ellipse at bottom, #0a0000, #1a0500, #8b2500, #ff4500)", name: "Volcanic" },
    { gradient: "radial-gradient(ellipse at bottom, #2c1810, #8b5e3c, #d4a843, #f5e6c8)", name: "Venetian Gold" }
];

const dots = document.querySelectorAll(".dot");
const themeLabel = document.getElementById("themeLabel");
let labelTimeout;
function showLabel(index) {
    clearTimeout(labelTimeout);

    // first reset to hidden
    themeLabel.style.transition = "none";
    themeLabel.style.opacity = "0";
    themeLabel.style.filter = "blur(10px)";

    // then after a tiny delay, animate it in
    setTimeout(function () {
        themeLabel.style.transition = "opacity 0.5s, filter 0.5s";
        themeLabel.innerText = themes[index].name;
        themeLabel.style.opacity = "1";
        themeLabel.style.filter = "blur(0px)";
    }, 50);

    labelTimeout = setTimeout(function () {
        themeLabel.style.opacity = "0";
        themeLabel.style.filter = "blur(10px)";
    }, 2000);
}

function setTheme(index) {
    document.body.style.background = themes[index].gradient;
    dots.forEach(function (d) { d.classList.remove("active"); });
    dots[index].classList.add("active");
    showLabel(index);
}

// set default on load with small delay so CSS transition works
setTimeout(function () {
    setTheme(0);
}, 100);

dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
        const themeIndex = parseInt(dot.getAttribute("data-theme"));
        setTheme(themeIndex);
    });
});