const options = ['NaN', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const rotor1 = document.querySelector(".rotor1");
const rotor2 = document.querySelector(".rotor2");
const rotor3 = document.querySelector(".rotor3");

const rotors = document.querySelectorAll(".rotor");

const max = 26;
const min = 1;

addEventListener('DOMContentLoaded', (event) => {


    // Generate plugs in rows, 5 plugs per row
    for (let i = 0; i < 10; i += 5) {  // Loop in increments of 5 to create rows
        const row = createRow(i);
        document.getElementById('plug-container').appendChild(row);
    }
})

rotors.forEach(input => {
    input.addEventListener("keydown", (event) => {
        const key = event.key;

        if (key === "ArrowUp" || key === "ArrowDown") {
            let value = parseInt(input.value);

            if (key === "ArrowUp") {
                handleArrowUp(input, value);
            } else {
                handleArrowDown(input, value);
            }
        }
        event.preventDefault();
    });
});

function handleArrowUp(input, value) {
    if (value < max) {
        input.value = value + 1;
    } else if (allRotorsAtMax()) {
        resetAllRotors();
    } else {
        input.value = min;
        rotateNextRotor(input);
    }
}

function handleArrowDown(input, value) {
    input.value = value > min ? value - 1 : max;
}

function allRotorsAtMax() {
    return rotor1.value === max && rotor2.value === max && rotor3.value === max;
}

function resetAllRotors() {
    rotor1.value = min;
    rotor2.value = min;
    rotor3.value = min;
}

function rotateNextRotor(currentRotor) {
    if (currentRotor.classList.contains("rotor1")) {
        rotorCheck(rotor2);
    } else if (currentRotor.classList.contains("rotor2")) {
        rotorCheck(rotor3);
    }
}

function rotorCheck(rotorName) {
    if (rotorName) {
        const arrowUpEvent = new KeyboardEvent("keydown", {
            key: "ArrowUp",
            code: "ArrowUp",
            keyCode: 38,
            bubbles: true
        });
        rotorName.dispatchEvent(arrowUpEvent);
    } else {
        console.error(`${rotorName} is no longer available`);
    }
}


const text = document.getElementById("textInput");

text.addEventListener("keydown", (event) => {

    let key = event.key.toUpperCase();

    // // Apply the plugboard substitution
    key = keyForward(key);
    key = rotorOutput(key);

    // Find the button with the matching data-key
    const button = document.querySelector(`button[data-key="${key}"]`);
    if (button) {
        // Add a highlight class for visual feedback
        button.classList.add("highlight");
        button.click();

        text.value += `${key}`;
        if (rotor1) {
            const arrowUpEvent = new KeyboardEvent("keydown", {
                key: "ArrowUp",
                code: "ArrowUp",
                keyCode: 38,
                bubbles: true
            });
            rotor1.dispatchEvent(arrowUpEvent);
        } else {
            console.error('rotor2 is no longer available');
        }

        // Remove the highlight class after a short delay
        setTimeout(() => button.classList.remove("highlight"), 200);
    }
});

function reset() {
    text.value = "";
}

// --------------------------------------------------------------------------------------------------------------------------------
// this code is for plugboard creation

// Function to create a plug
function createPlug(index) {
    const plug = document.createElement('div');
    plug.classList.add('plug', `plug${index + 1}`, 'col-2', 'ps-2');  // Add classes for layout (Bootstrap grid col-2 for small screens)
    const column = document.createElement('div');
    column.classList.add('column');

    // Create first select (port1)
    const select1 = document.createElement('select');
    select1.classList.add('form-control', 'border-dark', 'port1');
    select1.setAttribute('onchange', `plugboardUsageCheck('.plug${index + 1} .port1')`);

    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select1.appendChild(opt);
    });

    // Create a separator (:) between the ports
    const separator = document.createElement('h3');
    separator.textContent = ":";

    // Create second select (port2)
    const select2 = document.createElement('select');
    select2.classList.add('form-control', 'border-dark', 'port2');
    select2.setAttribute('onchange', `plugboardUsageCheck('.plug${index + 1} .port2')`);
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select2.appendChild(opt);
    });

    // Append everything to the plug
    column.appendChild(select1);
    column.appendChild(separator);
    column.appendChild(select2);
    plug.appendChild(column);

    return plug;
}

// Function to group plugs into rows of 5
function createRow(startIndex) {
    const row = document.createElement('div');
    row.classList.add('row', 'mb-3');  // Create a new row for each group of 5 plugs

    // Add 5 plugs to this row
    for (let i = startIndex; i < startIndex + 5; i++) {
        const plug = createPlug(i);
        row.appendChild(plug);
    }

    return row;
}

// plugboard forwarding
function plugboardUsageCheck(port) {

    const portKey = document.querySelector(port); // The port being modified
    const plugboard = document.querySelectorAll('.plug'); // All plug elements

    for (let i = 1; i <= plugboard.length; i++) {

        const port1 = document.querySelector(`.plug${i} .port1`).value;
        const port2 = document.querySelector(`.plug${i} .port2`).value;

        // Skip checking the same port that triggered the function
        if (port === `.plug${i} .port1`) {

            // Check port2 of the current plug to make sure not same with port1
            if (port2 === portKey.value) {
                portKey.value = 'NaN';
                return; // Exit early if a duplicate is found
            }
            continue;
        }

        if (port === `.plug${i} .port2`) {
            // Check port1 of the current plug to make sure not same with port2
            if (port1 === portKey.value) {
                portKey.value = 'NaN';
                return; // Exit early if a duplicate is found
            }
            continue;
        }

        // Check port1 or port2 of the current plug
        if (port1 === portKey.value || port2 === portKey.value) {
            portKey.value = 'NaN';
            return; // Exit early if a duplicate is found
        }
    }
}


function keyForward(key) {
    const plugboard = document.querySelectorAll('.plug'); // All plug elements

    for (let i = 1; i <= plugboard.length; i++) {
        // Check port1 of the current plug
        const port1 = document.querySelector(`.plug${i} .port1`).value;
        const port2 = document.querySelector(`.plug${i} .port2`).value;
        if (port1 === key) {

            return port2; // Exit early if a duplicate is found
        }

        // Check port2 of the current plug
        else if (port2 === key) {
            return port1; // Exit early if a duplicate is found
        }

    }
    return key;
}

function rotorOutput(key) {


    const alphabet = Object.keys(rotor1Mapping);
    let finalKey = key;
    for (let i = 1; i <= 3; i++) {
        let rotorMapping = eval(`rotor${i}Mapping`);
        const rotorValue = document.querySelector(`.rotor${i}`).value

        // Normalize the input to uppercase
        finalKey = finalKey.toUpperCase();

        // Find the index of the input letter in the alphabet
        let inputIndex = alphabet.indexOf(finalKey);

        // Shift the alphabet by the given position (rotor's position)
        inputIndex = (inputIndex + parseInt(rotorValue) - 1) % alphabet.length;

        // Find the letter at the shifted position
        const shiftedLetter = alphabet[inputIndex];

        // Return the corresponding mapped letter from the rotor
        finalKey = rotorMapping[shiftedLetter]
        console.log(finalKey)
    }
    finalKey = reflectorMapping[finalKey];
    console.log(finalKey)

    for (let i = 3; i >= 1; i--) {
        let rotorMapping = eval(`rotor${i}Mapping`);
        finalKey = Object.keys(rotorMapping).find(k => rotorMapping[k] === finalKey)
        console.log(finalKey)
    }


    return finalKey;

}

const rotor1Mapping = {
    A: "E",
    B: "K",
    C: "M",
    D: "F",
    E: "L",
    F: "G",
    G: "D",
    H: "Q",
    I: "V",
    J: "Z",
    K: "N",
    L: "T",
    M: "O",
    N: "W",
    O: "Y",
    P: "H",
    Q: "X",
    R: "U",
    S: "S",
    T: "P",
    U: "A",
    V: "I",
    W: "B",
    X: "R",
    Y: "C",
    Z: "J",
}

const rotor2Mapping = {
    A: "A",
    B: "J",
    C: "D",
    D: "K",
    E: "S",
    F: "I",
    G: "R",
    H: "U",
    I: "X",
    J: "B",
    K: "L",
    L: "H",
    M: "W",
    N: "T",
    O: "M",
    P: "C",
    Q: "Q",
    R: "G",
    S: "Z",
    T: "N",
    U: "P",
    V: "Y",
    W: "F",
    X: "V",
    Y: "O",
    Z: "E",
}

const rotor3Mapping = {
    A: "B",
    B: "D",
    C: "F",
    D: "H",
    E: "J",
    F: "L",
    G: "C",
    H: "P",
    I: "R",
    J: "T",
    K: "X",
    L: "V",
    M: "Z",
    N: "N",
    O: "Y",
    P: "E",
    Q: "I",
    R: "W",
    S: "G",
    T: "A",
    U: "K",
    V: "M",
    W: "U",
    X: "S",
    Y: "Q",
    Z: "O",
}

const reflectorMapping = {
    A: "Y",
    B: "R",
    C: "U",
    D: "H",
    E: "Q",
    F: "S",
    G: "L",
    H: "D",
    I: "P",
    J: "X",
    K: "N",
    L: "G",
    M: "O",
    N: "K",
    O: "M",
    P: "I",
    Q: "E",
    R: "B",
    S: "F",
    T: "Z",
    U: "C",
    V: "W",
    W: "V",
    X: "J",
    Y: "A",
    Z: "T",
};


