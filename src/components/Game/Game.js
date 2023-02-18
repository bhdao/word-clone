import React from 'react';

import { sample } from '../../utils';
import { WORDS } from '../../data';
import { checkGuess } from '../../game-helpers';
import { NUM_OF_GUESSES_ALLOWED } from '../../../src/constants.js';

// Pick a random word on every pageload.
const answer = sample(WORDS);
// To make debugging easier, we'll log the solution in the console.
console.info({ answer });

const randKey = () => { return Math.random() + Math.random() };

function Game() {

  const StatusBanner = (inputRecord) => {
    let status = "";
    let count = inputRecord.inputs.indexOf('     ');
    if (count == -1) {
      count = 6;
    }
    if (inputRecord.inputs.includes(answer)) {
      setInputDisable(true);
      return (
        <div className={`happy banner`}>
          <b>Congratulations!</b> Got it in <b>{`${count} ${count < 2 ? 'guess' : 'guesses'}`}.</b>
        </div>
      )
    } else if (inputRecord.inputs.indexOf('     ') == -1) {
      setInputDisable(true);
      return (
        <div className={`sad banner`}>
          Sorry, the correct answer is <b>{answer}</b>.
        </div>
      )
    };
  }

  const submitGuess = (e) => {
    e.preventDefault();
    let guess = e.target["guess-input"].value;
    if (guess == "") {
      return
    }
    console.log({ "guess": guess.toUpperCase() });
    const nextInputRecord = [...inputRecord];
    const nearestEmptySpace = nextInputRecord.indexOf('     ');
    nextInputRecord.splice(nearestEmptySpace, 1, guess.toUpperCase())
    setUserInputRecord(nextInputRecord);
    setUserInput('');
  }
  const [inputDisable, setInputDisable] = React.useState(false);
  const [userInput, setUserInput] = React.useState('');
  // Outputs 
  const emptyX = Array(NUM_OF_GUESSES_ALLOWED).fill('     ');
  const [inputRecord, setUserInputRecord] = React.useState(emptyX);
  console.log(checkGuess('WHALE', answer));
  return (
    <>
      <div className="guess-results">
        {inputRecord.map((value) => {
          return (<p className="guess" key={randKey()}>{[...checkGuess(value, answer)].map((letter) => {
            return (
              <span className={`cell ${letter.status}`} key={randKey()}>{letter.letter}</span>
            )
          })}</p>)
        })}
      </div>
      <form className="guess-input-wrapper" onSubmit={(e) => {
        submitGuess(e);
      }}>
        <label htmlFor="guess-input">
          Enter guess:
        </label>
        <input disabled={inputDisable} id="guess-input" name="guess-input" minLength={5} maxLength={5} type="text" value={userInput} placeholder="Write your guess here!"
          onChange={(e) => {
            setUserInput(e.target.value)
          }}
        ></input>
      </form>
      <StatusBanner inputs={inputRecord} />
    </>
  );
}

export default Game;
