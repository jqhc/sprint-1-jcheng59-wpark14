import {numbers, numbersAndStrings, strings, numbersAndStrings2, empty} from "./mockedJson.js";

// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = () => {    
    prepareReplInput();
    replInputBox.blur();
}

/**
 * Sets up the inner HTML of the body to its default values.
 * Needed for testing purposes - otherwise, main.test.ts treats the document as empty in this file,
 * and can't call getElementById(). 
 */
document.body.innerHTML = 
    `<div id="repl">
      <div id="repl-history">           
      </div>
      <hr id="history-separator">
      <form name="repl-form" id="repl-form" onsubmit="return false">
          <input type="text" id="repl-input-box" placeholder="Type something here!" name="repl-input-box" class="blurred">
      </form>
    </div>`;

/**
 * Creates a response box in the HTML page, or an error box if the userInput
 * is invalid.
 * @param userInput 
 */
function addResponseBox(userInput: string) {
    //HTML elements created for the response box, command, and output
    const responseBox: HTMLElement = document.createElement("div");
    const command: HTMLElement = document.createElement("p");
    const output: HTMLElement = document.createElement("p");
    command.textContent = "Command: " + userInput;
    //check if user input is valid, if not call error message 
    try {
        //output to user 
        output.textContent = "Output: " + check_string(userInput);
        //initiate htmlelements to response classes
        responseBox.setAttribute("class", "response-box");
        command.setAttribute("class", "response-text");
        output.setAttribute("class", "response-text");
        //add to repl history of inputs 
        responseBox.appendChild(command);
        responseBox.appendChild(output);
        replHistory.appendChild(responseBox);
         //scroll automatically updates once element is appended
        replHistory.scrollTo(0, replHistory.scrollHeight);

    } catch(err) {
        if (err != null && err instanceof Error) {
            let errorMessage: string = err.message;
            addErrorBox(errorMessage);  
        }  
    }  
}
/**
 * Error message that appears to user
 * @param errorMessage get error string that is caught from misinputs
 */
function addErrorBox(errorMessage: string) {
    //HTML elements created for the error box, error, and message
    const errorBox: HTMLElement = document.createElement("div");
    const error: HTMLElement = document.createElement("p");
    const usageMessage: HTMLElement = document.createElement("p");
    
    //error message
    error.textContent = "Error: " + errorMessage;
    usageMessage.textContent = "Usage: \"get <filepath>\" or \"stats\"";

    //initiate htmlelements to error classes
    errorBox.setAttribute("class", "error-box");
    error.setAttribute("class", "error-text");
    usageMessage.setAttribute("class", "error-text");

    //add to repl history of inputs 
    errorBox.appendChild(error);
    errorBox.appendChild(usageMessage);

    replHistory.appendChild(errorBox);
    //scroll automatically updates once element is appended
    replHistory.scrollTo(0, replHistory.scrollHeight);
}

/**
 * checks if string is valid and handles commands
 * @param inputString user input
 * @returns Error or user output if ran correctly
 */
function check_string(inputString: string) {
    //get string inputs from user
    const command = inputString.trim().split(/\s+/);
    //string input is configured for only get csv_file_name and stats
    if (command.length > 2) {
        throw new Error("Too many inputs.");
    }
    //get functionality if inputted
    if (command[0] === "get") {
        //if no jsonFile inputted with get, throw error
        if (command.length < 2) {
            throw new Error("\"get\" command requires a filepath.");
             //run getJson functionality
        } else {
            return getJson(command[1]);
        }
        //stats functionaity if inputted
    } else if (command[0] === "stats"){
        //if no get command was not run, throw error
        if (command.length > 1) {
            throw new Error("Too many inputs.");
        } else if (jsonFile === undefined) {
            throw new Error("You haven't loaded a file with \"get\" yet.");
            //run statsJson functionality
        } 
        if (command.length !== 1){
            throw new Error("Unrecognized command: \"" + inputString + "\".");
        } else {
            const rowsCols = statsJson();
            return "File: " + rowsCols["file"] + ".json, Rows: " + rowsCols["rows"] + ", Columns: " + rowsCols["cols"];
        }
        //if neither is inputted, then throw an error
    } else {
        throw new Error("Unrecognized command: \"" + inputString + "\".");
    }
}

// Declaring json and filename globally so it can be accessed by both getJson and statsJson
let fileName: string;
let jsonFile: string;

/**
 * when "get" is called with a filepath, runs this which stores the specified file
 * in jsonFile. Then, parses and returns string form.
 * @param filepath file path of json file
 */
function getJson(filepath: string) {
    //need to update this const when making more json files
    const jsonFiles: {[key: string]: string} = 
        {"numbers" : numbers, "numbersAndStrings" : numbersAndStrings, 
        "strings" : strings, "numbersAndStrings2" : numbersAndStrings2,
        "empty" : empty};
    //if file is in jsonFiles, then we can parse it ; else, throw an error to user
    if (filepath in jsonFiles) {
        fileName = filepath;
        jsonFile = jsonFiles[filepath];
    } else {
        throw new Error("File \"" + filepath + "\" not found.");
    }
    //parses then stringifies json string 
    return JSON.stringify(JSON.parse(jsonFile));
}

/**
 * When "stats" is called, parses the json and returns a string containing the 
 * number of rows
 * @returns the filename, number of rows, and number of columns
 */
function statsJson() {
    const parsed = JSON.parse(jsonFile);
    let numRows: number = 0;
    let numCols: number = 0;
    // finds Number of Rows
    for (const elt of parsed) {
        numRows += 1;
    }
    if (numRows > 0) {
        //finds Number of Columns
        for (const elt of parsed[0]) {
            numCols += 1;
        }
    }
    return {"file" : fileName, "rows" : numRows, "cols" : numCols};
}

// Initializing REPL input box globally
const maybeReplInputBox: HTMLElement | null = document.getElementById("repl-input-box");
let replInputBox: HTMLInputElement;

if(maybeReplInputBox == null) {
    console.log("Couldn't find repl input box!");
} else if (!(maybeReplInputBox instanceof HTMLInputElement)) {
    console.log("Something's gone horribly wrong. The repl input box is no longer an input element.");
} else {
    replInputBox = maybeReplInputBox;
}

// Initializing REPL form element globally
const maybeReplForm: HTMLElement | null = document.getElementById("repl-form");
let replForm: HTMLFormElement;

if(maybeReplForm == null) {
    console.log("Couldn't find repl form!");
} else if (!(maybeReplForm instanceof HTMLFormElement)) {
    console.log("Something's gone horribly wrong. The form is no longer an input element.");
} else {
    replForm = maybeReplForm;
}

// Initializing REPL history section globally
const maybeReplHistory: HTMLElement | null = document.getElementById("repl-history");
let replHistory: HTMLElement;

if(maybeReplHistory == null) {
    console.log("Couldn't find repl history div!");
} else {
    replHistory = maybeReplHistory;
}

/**
 * Sets up event listeners and default state for repl-input-box
 */
 function prepareReplInput() {
    replInputBox.blur();
    replInputBox.addEventListener("focus", handleReplFocus);
    replInputBox.addEventListener("blur", handleReplBlurred);
    replForm.addEventListener("submit", handleFormSubmit);
}

/**
 * When form is submitted, takes the input
 * @param event tells when an element has received focus or not
 */
function handleFormSubmit(event: Event) {
    const userInput: string = replInputBox.value;
    // Clears input box
    replInputBox.value="";
    // Creates a response box in the repl-history
    addResponseBox(userInput);
}

/**
 * When repl-input-box is focused, turns white and selects all typed text
 * @param event tells when an element has received focus or not
 */
function handleReplFocus(event: FocusEvent) {
    replInputBox.setAttribute("class", "focused");
    replInputBox.select();
}

/**
 * When repl-input-box is blurred, turns grey
 * @param event tells when an element has received focus or not
 */
function handleReplBlurred(event: FocusEvent) {
    replInputBox.setAttribute("class", "blurred");
}


export {prepareReplInput, handleReplBlurred, handleReplFocus, handleFormSubmit, getJson, statsJson,
    addErrorBox, addResponseBox, check_string, replInputBox, replHistory};
