// all exports from main will now be available as main.X
import * as main from './main';

// Fix for jest not recognizing scrollTo
Element.prototype.scrollTo = () => {};

// Setup! This runs /before every test function/
beforeEach(() => {
  // Clears history
  main.replHistory.innerHTML = "";
  main.replInputBox.value = "";
});

// Tests that check_string() throws an error when there are more than 2 inputs.
test("check_string throws error for more than 2 innputs", () => {
  expect(() => {main.check_string("get abc def")}).toThrowError("Too many inputs.");
  expect(() => {main.check_string("get numbers And Strings")}).toThrowError("Too many inputs.");
});

// Tests that check_string() throws an error when get has no filepath.
test("check_string throws error when get has no filepath", () => {
  expect(() => {main.check_string("get")}).toThrowError("\"get\" command requires a filepath.");
  expect(() => {main.check_string("get  ")}).toThrowError("\"get\" command requires a filepath.");
});

// Tests that check_string() throws an error when get has and invalid filepath.
test("check_string throws error when get has invalid filepath", () => {
  expect(() => {main.check_string("get pqowiepqowe")}).toThrowError("File \"pqowiepqowe\" not found.");
  expect(() => {main.check_string("get nums")}).toThrowError("File \"nums\" not found.");
});

// Tests that check_string() throws an error when stats is called before a file is loaded.
test("check_string throws error when stats is called before get", () => {
  expect(() => {main.check_string("stats")}).toThrowError("You haven't loaded a file with \"get\" yet.");
});

// Tests that check_string() throws an error when stats is called with an argument.
test("check_string throws error when stats is called before get", () => {
  expect(() => {main.check_string("stats bro")}).toThrowError("Too many inputs.");
});

// Tests that check_string() throws an error when the user provides an undefined command.
test("check_string throws error for undefined command", () => {
  expect(() => {main.check_string("abc")}).toThrowError("Unrecognized command: \"abc\".");
  expect(() => {main.check_string("gett")}).toThrowError("Unrecognized command: \"gett\".");
  expect(() => {main.check_string("stat")}).toThrowError("Unrecognized command: \"stat\".");
});

// Tests that getJson() throws an error for invalid filepath.
test("getJson throws error for invalid filepath", () => {
  expect(() => {main.getJson("apfodspjaf")}).toThrowError("File \"apfodspjaf\" not found.");
  expect(() => {main.getJson("number")}).toThrowError("File \"number\" not found.");
});

// Tests that getJson() correctly parses for empty Json.
test("getJson returns correct Json for empty", () => {
  expect(main.getJson("empty")).toBe("[]");
});

// Tests that getJson() correctly parses for numbers.
test("getJson returns correct Json for numbers", () => {
  expect(main.getJson("numbers")).toBe("[[1,2,3,4,5],[6,7,8,9,10]]");
});

// Tests that getJson() correctly parses for strings.
test("getJson returns correct Json for strings", () => {
  expect(main.getJson("strings")).toBe(
    "[[\"the\",\"quick\",\"brown\"],[\"fox\",\"jumps\",\"over\"],[\"the\",\"lazy\",\"dog\"]]");
});

// Tests that getJson() correctly parses for combinations of strings and numbers.
test("getJson returns correct Json", () => {
  expect(main.getJson("numbersAndStrings")).toBe(
    "[[1,2,3,4],[\"one\",\"two\",\"three\",\"four\"],[5,6,7,8]]");

  expect(main.getJson("numbersAndStrings2")).toBe(
    "[[1,\"two\",3,\"four\"],[\"one\",2,\"three\",4]]");
});

// Tests that statsJson() returns correct file name, and number of rows and columns.
test("statsJson returns correct dictionary", () => {
  main.getJson("numbers");
  expect(main.statsJson()).toStrictEqual({"file": "numbers", "rows": 2, "cols": 5});

  main.getJson("strings");
  expect(main.statsJson()).toStrictEqual({"file": "strings", "rows": 3, "cols": 3});

  main.getJson("numbersAndStrings");
  expect(main.statsJson()).toStrictEqual({"file": "numbersAndStrings", "rows": 3, "cols": 4});

  main.getJson("numbersAndStrings2");
  expect(main.statsJson()).toStrictEqual({"file": "numbersAndStrings2", "rows": 2, "cols": 4});
});

// Tests that statsJson() returns correct dictionary for empty json.
test("statsJson returns correct Json for empty", () => {
  main.getJson("empty");
  expect(main.statsJson()).toStrictEqual({"file": "empty", "rows": 0, "cols": 0});
});

// Tests that addErrorBox() adds error boxes.
test("addErrorBox adds error box", () => {
  main.addErrorBox("");
  expect(main.replHistory.getElementsByClassName("error-box").length).toBe(1);

  main.addErrorBox("error");
  expect(main.replHistory.getElementsByClassName("error-box").length).toBe(2);
  
  main.addErrorBox("abcde");
  expect(main.replHistory.getElementsByClassName("error-box").length).toBe(3);
});

// Tests that addErrorBox() adds correct error message to repl-history, with correct class.
test("addErrorBox adds correct error message boxes", () => {
  main.addErrorBox("error 1");
  main.addErrorBox("error 2");
  main.addErrorBox("error 3");

  const errBoxes: HTMLCollectionOf<Element> = main.replHistory.getElementsByClassName("error-box");

  const err1Texts: HTMLCollectionOf<Element> = errBoxes[0].getElementsByClassName("error-text");
  const err2Texts: HTMLCollectionOf<Element> = errBoxes[1].getElementsByClassName("error-text");
  const err3Texts: HTMLCollectionOf<Element> = errBoxes[2].getElementsByClassName("error-text");

  expect(err1Texts[0].textContent).toBe("Error: error 1");
  expect(err1Texts[1].textContent).toBe("Usage: \"get <filepath>\" or \"stats\"");

  expect(err2Texts[0].textContent).toBe("Error: error 2");
  expect(err2Texts[1].textContent).toBe("Usage: \"get <filepath>\" or \"stats\"");
  
  expect(err3Texts[0].textContent).toBe("Error: error 3");
  expect(err3Texts[1].textContent).toBe("Usage: \"get <filepath>\" or \"stats\"");
});

// Tests that addResponseBox() adds error boxes when given invalid inputs.
test("addResponseBox adds error box on invalid input", () => {
  main.addResponseBox("abc");
  expect(main.replHistory.getElementsByClassName("error-box").length).toBe(1);

  main.addResponseBox("get alskdfjaklsd");
  expect(main.replHistory.getElementsByClassName("error-box").length).toBe(2);
  
  main.addResponseBox("statss");
  expect(main.replHistory.getElementsByClassName("error-box").length).toBe(3);
});

// Tests that addResponseBox() adds response boxes when given valid inputs.
test("addResponseBox adds response box on valid input", () => {
  main.addResponseBox("get numbers");
  expect(main.replHistory.getElementsByClassName("response-box").length).toBe(1);

  main.addResponseBox("get strings");
  expect(main.replHistory.getElementsByClassName("response-box").length).toBe(2);

  main.addResponseBox("get numbersAndStrings");
  expect(main.replHistory.getElementsByClassName("response-box").length).toBe(3);

  main.addResponseBox("get numbersAndStrings2");
  expect(main.replHistory.getElementsByClassName("response-box").length).toBe(4);

  main.addResponseBox("stats");
  expect(main.replHistory.getElementsByClassName("response-box").length).toBe(5);

  main.addResponseBox("stats");
  expect(main.replHistory.getElementsByClassName("response-box").length).toBe(6);
})

// Tests that addResponseBox() adds correct response message to repl-history, with correct class.
test("addResponseBox adds correct response message boxes", () => {
  main.addResponseBox("get numbers");
  main.addResponseBox("stats");
  main.addResponseBox("get strings");
  main.addResponseBox("stats");

  const respBoxes: HTMLCollectionOf<Element> = main.replHistory.getElementsByClassName("response-box");

  const resp1Texts: HTMLCollectionOf<Element> = respBoxes[0].getElementsByClassName("response-text");
  const resp2Texts: HTMLCollectionOf<Element> = respBoxes[1].getElementsByClassName("response-text");
  const resp3Texts: HTMLCollectionOf<Element> = respBoxes[2].getElementsByClassName("response-text");
  const resp4Texts: HTMLCollectionOf<Element> = respBoxes[3].getElementsByClassName("response-text");

  expect(resp1Texts[0].textContent).toBe("Command: get numbers");
  expect(resp1Texts[1].textContent).toBe("Output: [[1,2,3,4,5],[6,7,8,9,10]]");

  expect(resp2Texts[0].textContent).toBe("Command: stats");
  expect(resp2Texts[1].textContent).toBe("Output: File: numbers.json, Rows: 2, Columns: 5");
  
  expect(resp3Texts[0].textContent).toBe("Command: get strings");
  expect(resp3Texts[1].textContent).toBe(
    'Output: [["the","quick","brown"],["fox","jumps","over"],["the","lazy","dog"]]');

  expect(resp4Texts[0].textContent).toBe("Command: stats");
  expect(resp4Texts[1].textContent).toBe("Output: File: strings.json, Rows: 3, Columns: 3");
});

// Tests that addResponseBox() adds correct error message to repl-history, with correct class.
test("addResponseBox adds correct error message boxes", () => {
  main.addResponseBox("bla");
  main.addResponseBox("get alsdkjfalsd");
  main.addResponseBox("get");
  main.addResponseBox("stats bla");

  const errBoxes: HTMLCollectionOf<Element> = main.replHistory.getElementsByClassName("error-box");

  const err1Texts: HTMLCollectionOf<Element> = errBoxes[0].getElementsByClassName("error-text");
  const err2Texts: HTMLCollectionOf<Element> = errBoxes[1].getElementsByClassName("error-text");
  const err3Texts: HTMLCollectionOf<Element> = errBoxes[2].getElementsByClassName("error-text");
  const err4Texts: HTMLCollectionOf<Element> = errBoxes[3].getElementsByClassName("error-text");

  expect(err1Texts[0].textContent).toBe("Error: Unrecognized command: \"bla\".");
  expect(err1Texts[1].textContent).toBe("Usage: \"get <filepath>\" or \"stats\"");

  expect(err2Texts[0].textContent).toBe("Error: File \"alsdkjfalsd\" not found.");
  expect(err2Texts[1].textContent).toBe("Usage: \"get <filepath>\" or \"stats\"");
  
  expect(err3Texts[0].textContent).toBe("Error: \"get\" command requires a filepath.");
  expect(err3Texts[1].textContent).toBe("Usage: \"get <filepath>\" or \"stats\"");

  expect(err4Texts[0].textContent).toBe("Error: Too many inputs.");
  expect(err4Texts[1].textContent).toBe("Usage: \"get <filepath>\" or \"stats\"");
});

// Tests that handleFormSubmit() adds an error box on invalid inputs.
test("handleFormSubmit adds error box", () => {
  main.handleFormSubmit(new Event(""));
  expect(main.replHistory.getElementsByClassName("error-box").length).toBe(1);
  main.replInputBox.value = "";

  main.replInputBox.value = "stat";
  main.handleFormSubmit(new Event(""));
  expect(main.replHistory.getElementsByClassName("error-box").length).toBe(2);

  main.replInputBox.value = "get nums";
  main.handleFormSubmit(new Event(""));
  expect(main.replHistory.getElementsByClassName("error-box").length).toBe(3);
});

// Tests that handlFormSubmit() adds a response box on valid inputs.
test("handleFormSubmit adds response box", () => {
  main.replInputBox.value = "get numbers";
  main.handleFormSubmit(new Event(""));
  expect(main.replHistory.getElementsByClassName("response-box").length).toBe(1);

  main.replInputBox.value = "stats";
  main.handleFormSubmit(new Event(""));
  expect(main.replHistory.getElementsByClassName("response-box").length).toBe(2);

  main.replInputBox.value = "get strings";
  main.handleFormSubmit(new Event(""));
  expect(main.replHistory.getElementsByClassName("response-box").length).toBe(3);
});


// Tests that handlReplFocus() changes the class of the repl-input-box when focused.
test("handleReplFocus changes class", () => {
  main.handleReplFocus(new FocusEvent("focus"));
  expect(main.replInputBox.getAttribute("class")).toBe("focused");
});

test("handleReplBlurred changes class", () => {
  main.handleReplBlurred(new FocusEvent("blur"));
  expect(main.replInputBox.getAttribute("class")).toBe("blurred");
});

