/**
 * Validation inputs v1.1
 * @return Object { valid: bool, msg: string (text errors in ul/li format) }
 * */

const REQUIRED = 'required'; // Fails if the field is an empty array, empty string, null or false.
const REQUIRED_IF = 'required_if'; // The field is required when any of the other fields are not empty.
const PERMIT_EMPTY = 'permit_empty'; // Allows the field to receive an empty array, empty string, null or false.
const REQUIRED_IF_NOT = 'required_if_not'; // The field is required when any of the other fields are empty .

const EMAIL = 'email'; // Fails if field does not contain a valid email address.
const NUMERIC = 'numeric'; // Fails if field contains anything other than numeric characters.
const IN_LIST = 'in_list'; // Fails if field is not within a predetermined list.
const UNCHECKED = 'unchecked'; // Fails if the input it's checked
const LENGTH = 'length'; // Fails if field is not exactly the parameter value.
const MIN_LENGTH = 'min_length'; // Fails if field is shorter than the parameter value.
const MAX_LENGTH = 'max_length'; // Fails if field is longer than the parameter value.
const NOT_IN_LIST = 'not_in_list'; // Fails if field is within a predetermined list.
const EQUAL_THAN = 'equal_than'; // Fails if field is not equal to the parameter value or not a numeric value.
const LESS_THAN = 'less_than'; // Fails if field is greater than or equal to the parameter value or not a numeric value.
const GREATER_THAN = 'greater_than'; // Fails if field is less than or equal to the parameter value or not a numeric value.
const DATE = 'date'; // Fails if field is not a valid date.

let input;
let errorLog = "";
let finalValid = true;
let CLASS_IS_INVALID; // This class will be added when the input is invalid

/**
 * @param rules All the rules and elements to validate
 * @param invalidClass The class the input will have if it's invalid
 * */
export function validateRun(rules, invalidClass = "is-invalid") {
    finalValid = true;
    CLASS_IS_INVALID = invalidClass;
    errorLog = `<ul style="text-align: start;">`;
    removeInvalid();

    if(typeof rules !== 'object') return 'Rules must be an object';

    for (const key in rules) {
        let exist = true;
        input = document.getElementById(key);

        // Check if input exists
        if(!input){
            exist = false;
            finalValid = false;
            errorLog += `<li>${key} doesn't exist.</li>`;
        }

        if(exist) {
            // Rules validation
            const response = rulesManager(rules[key].rules);

            // If it's not valid add an error log
            if (!response.valid) {
                finalValid = false;
                errorLog += `<li>${rules[key].label} -> ${response.err}</li>`
            }
        }
    }

    // Close error list
    errorLog += `</ul>`;

    return {valid: finalValid, msg: errorLog};
}

// Initial of the rules validation
function rulesManager(rulesList) {
    const rules = rulesList.split("|"); // Separate all rules.
    const required = rules[0]; // The value that decides if the request it's required or not

    // The fist parameter must be the required
    if(!required.includes(REQUIRED_IF + '[') && required !== PERMIT_EMPTY && required !== REQUIRED && !required.includes(REQUIRED_IF_NOT + '['))  {
        return {valid: false, err: "First param of the rule must be: required, permit_empty, required_if, required_if_not."}
    }

    // If the input it's required check if it has values
    if(required === REQUIRED && baseInputEmpty()) return is_required();

    // If it's required_if check that the other input has value
    if(required.includes(REQUIRED_IF + '[')) {
        const nameInput = required.match(/\[(.*?)\]/)[1] ?? 'undefined';
        const inputParent = document.getElementById(nameInput);

        // Parent exist
        if(!inputParent) return nullInput(nameInput);

        // Parent has to have value and also base input
        if(!baseInputEmpty(inputParent)) {
            if(baseInputEmpty()) return is_required();
        }
    }

    // If it's required_if_not check that the other input doesn't have value
    if(required.includes(REQUIRED_IF_NOT + '[')) {
        const nameInput = required.match(/\[(.*?)\]/)[1] ?? 'undefined';
        const inputParent = document.getElementById(nameInput);

        // Parent exist
        if(!inputParent) return nullInput(nameInput);

        // Parent has to be empty
        if(baseInputEmpty(inputParent)) {
            if(baseInputEmpty()) return is_required();
        }
    }

    // If there are more rules than required or permit_empty check all
    const rulesCount = rules.length;

    if(rulesCount > 1) { // base 1 because the 0 it's the "require"
        for (let i = 1; i < rulesCount; i++) {
            // If the input it's permit_empty we need to check if it's value !== ""
            if(required !== PERMIT_EMPTY || !baseInputEmpty()) {
                const response = extraRules(rules[i]);
                if (!response.valid) return {valid: response.valid, err: response.msg};
            }
        }
    }

    return {valid: true};
}


// Function to check the extra rules
function extraRules(rule) {
    let msg = "";
    let valid = true;

    let ruleType;
    let ruleValue;
    const ruleSplit = rule.match(/(\w+)\[(.*?)\]/); // split the ruleType[ruleValue]

    // if ruleSplit exist (can be null in a user error)
    if(ruleSplit) {
        ruleValue = ruleSplit[2] ?? 'none';
        ruleType = ruleSplit[1] ?? undefined;

    }else if(rule === EMAIL) ruleType = EMAIL;
    else if(rule === NUMERIC) ruleType = NUMERIC;
    else if(rule === UNCHECKED) ruleType = UNCHECKED;
    else if(rule === DATE) ruleType = DATE;

    if(ruleType !== undefined) {
        switch (ruleType) {
            case IN_LIST:
                const list = ruleValue.split(',');
                if(!list.includes(input.value)) {
                    valid = false;
                    msg = `must contains ${ruleValue}`;
                }
                break;

            case NOT_IN_LIST:
                const notList = ruleValue.split(',');
                if(notList.includes(input.value)) {
                    valid = false;
                    msg = `can't contains ${ruleValue}`;
                }
                break;

            case LENGTH:
                if(input.value.length !== parseInt(ruleValue)) {
                    valid = false;
                    msg = `length must be exactly ${ruleValue}`;
                }
                break;

            case MAX_LENGTH:
                if(input.value.length > parseInt(ruleValue)) {
                    valid = false;
                    msg = `max length must be ${ruleValue}`;
                }
                break;
            case MIN_LENGTH:
                if(input.value.length < parseInt(ruleValue)) {
                    valid = false;
                    msg = `min length must be ${ruleValue}`;
                }
                break;

            case EQUAL_THAN:
                if(parseFloat(input.value) !== parseFloat(ruleValue)) {
                    valid = false;
                    msg = `must be equal than ${ruleValue}`;
                }
                break;

            case GREATER_THAN:
                if(parseFloat(input.value) <= parseFloat(ruleValue)) {
                    valid = false;
                    msg = `must be greater than ${ruleValue}`;
                }
                break;

            case LESS_THAN:
                if(parseFloat(input.value) >= parseFloat(ruleValue)) {
                    valid = false;
                    msg = `must be less than ${ruleValue}`;
                }
                break;

            case UNCHECKED:
                if(input.checked) {
                    valid = false;
                    msg = `must be unchecked`;
                }
                break;

            case EMAIL:
                const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                if(!regex.test(input.value)) {
                    valid = false;
                    msg = `must be a valid email`;
                }
                break;

            case NUMERIC:
                if(Number.isNaN(parseFloat(input.value))) {
                    valid = false;
                    msg = `must be a number`;
                }
                break;

            case DATE:
                const date = new Date(input.value);

                if(isNaN(date.getTime())) {
                    valid = false;
                    msg = `must be a valid date`;
                }

                break;
        }

    }else {
        valid = false;
        msg = 'No rule type';
    }

    // Mark invalid input
    if(!valid) addInvalidClass();

    return {valid: valid, msg: msg}
}


// Base input has any value type
function baseInputEmpty(alternativeInput = null) {
    const inputToCheck = alternativeInput ?? input;

    if(inputToCheck.type !== 'checkbox') return inputToCheck.value === "";
    else return !inputToCheck.checked;
}

// Add invalid class
function addInvalidClass() {
    if(CLASS_IS_INVALID && CLASS_IS_INVALID !== "") {
        input.classList.add(CLASS_IS_INVALID);
    }
}
// Remove from all elements the class CLASS_IS_INVALID
function removeInvalid() {
    if(CLASS_IS_INVALID && CLASS_IS_INVALID !== "") {
        const oldInvalids = document.querySelectorAll(`.${CLASS_IS_INVALID}`);
        const elementsCount = oldInvalids.length;

        for (let i = 0; i < elementsCount; i++) {
            oldInvalids[i].classList.remove(CLASS_IS_INVALID);
        }
    }
}


// Error msg generators
function is_required() {
    addInvalidClass();
    return {valid: false, err: "it's required."};
}

function nullInput(id) {
    return {valid: false, err: `${id} not found.`}
}