# Project details

## Project Name 
Sprint 1 : Echo 
## Contibutors and contributions: 
Justin Cheng | CS Login : jcheng59

William Park | CS Login : wpark14

Both worked on project in person together. Justin worked on style, documentation,testing, design, and functionality. William mainly worked on style, documentation, and helping Jusin with design and functionality. 
## Time taken to complete Project:
~20 hours

# Design Choices
## Code Elements Design
`Index.html` utilizes the `main.css` to implement user interface and experience while `main.ts` initalizes functionality. We decided to initialize our REPL elements (REPL input box, form element, and history section) globally because it is easier to conduct testing on them and so that functions can call upon them instead of a new initialization everytime we run function, which is a possible space optimization. We decided to use a try, catch for incorrect inputs in order to provide the user with inputs. We separated different functions in correspondence to different usages as well as used given JSON functions to help in our code. We didn't use many types of elements except for HTMLElement, strings, and arrays. 

## User Interface Design
We decided to utilize an input box that would grab the users input and check if it was `stats` or `get csv-filename`. The command `get csv-filename` and `stats` will make an HTMLElement that appears to the user which will show the provided command and the output, which would be the csv file and the number of rows and columns respectively. We decided to show the history of inputs through response and error boxes, which are type HTMLElement. These HTMLElements will be stored in an HTML div called `replHistory` which will be shown to the user. The inputs will be inputted beneath the other and once `replHistory` overflows, there will be a scroll that stays at the bottom of the `replHistory` space until you scroll up to see user input history. We decided to include error boxes that tell of incorrect inputs which are caught through `addResponseBox`, which will call on `addErrorBox` to make an HTMLElement of an errorbox that will appear to the user. For visual design, we decided to make the error boxes red and the response boxes gray to notify the user of correctness easier. Along with this, the input box will be grayed out if not selected and if selected, the input box will turn white, implemented through `handleReplFocus` and `handleReplBlurred`. 

# Errors/Bugs
One bug that we experienced was that when testing we would have to set up the inner html of the body to default values for testing or else the document is treated as empty and getElementById() cannot work. 

We implemented `document.body.innerHTML` to fix the problem which can be found in `main.ts`

There are no other known bugs/errors. 
# Tests
For each of the tests that we have written, it will check the functionality of the program. 
- Input string (`check_string`)
    - Checked for Errors 
    - Based on:
        - having more than 2 inputs
        - no filepaths
        - invalid filepath
        - being before `get`
        - being an invalid command
- Getting Json File (`getJson`)
    - Checked for Correct Returns of: 
        - strings
        - numbers
        - Json
- Getting Stats (`getStats`)
    - Checked for Correct Returns of: 
        - number of columns
        - number of rows
        - error if `get` not ran 
        - error if `stats` with another input
- ErrorBox (`addErrorBox`)
    - Checked for adding error boxes by:
        - incorrect inputs
    - Checked through:
        - replHistory 
        - HandleFormSubmit 
          - checks if it adds a error box
    - Checked for correct error output
- ResponseBox (`addResponseBox`)
    - Checked for adding response boxes by:
        - correct inputs for both `get` and `stats`
    - Checked through:
        - replHistory 
        - HandleFormSubmit 
            - checks if it adds a response box
    - Checked for correct response output
- Repl Indox (`handleReplFocus` and `handleReplBlurred`)
    - Checked for change of class of `repl-input-box`
        - change from "focused" to "blurred



# How to
## Run Tests
To run test, we will run `npm test`. 

## Build/Run Program
To build and run the program, you would have to make json files which can be done through `mockedJson.ts`. There is already provided Json Files. If you were to add a Json file, you would need to add the new Json to `export {}` in `mockedJson.ts` as well as in `function getJson(filepath: string)` which is in `main.ts`. To run, run `tsc` in terminal and open through index.html. As the user, you can input text into the input box and it will submit through the enter key. There are two viable input texts available which are `get csv-filename` where csv-filename is the name of the Json files exported in `mockedJson.ts` and `stats` which provides the number of rows and columns of the csv file; otherwise, an error box will be shown to the user. `stats` will throw an error if `get csv-filename` is not ran prior. 

