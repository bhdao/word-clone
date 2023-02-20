import React from 'react';

import { sample } from '../../utils';
import { WORDS } from '../../data';
import { checkGuess } from '../../game-helpers';
import { NUM_OF_GUESSES_ALLOWED } from '../../../src/constants.js';

// Pick a random word on every pageload.
const getAnAnswer = () => {
  let answer = sample(WORDS);
  console.log(answer);
  return answer
};

const randKey = () => { return Math.random() + Math.random() };

let keysInit = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').forEach((letter) => {
  keysInit[letter] = "";
});

function Game() {

  const KeyBoard = ({ allInputs, keys }) => {
    const inputsMerged = allInputs.join('');
    const rows = [
      "QWERTYUIOP".split(''),
      "ASDFGHJKL".split(''),
      "ZXCVBNM".split('')
    ];

    return (
      <div className="keyboard">
        <div className="row">
          {rows[0].map((letter, idx) => {
            return (
              <span key={randKey()} className={`key ${keys[letter]}`}>
                {letter}
              </span>)
          })}
        </div>
        <div className="row">
          {rows[1].map((letter, idx) => {
            return (
              <span key={randKey()} className={`key ${keys[letter]}`}>
                {letter}
              </span>)
          })}
        </div>
        <div className="row">
          {rows[2].map((letter, idx) => {
            return (
              <span key={randKey()} className={`key ${keys[letter]}`}>
                {letter}
              </span>)
          })}
        </div>
      </div>
    )
  }

  const StatusBanner = () => {
    let status = "";
    let count = inputRecord.inputs.indexOf('     ');
    const restart =
      <button onClick={() => { restartGame() }}>
        [<b>RESTART?</b>]
      </button>
      ;
    if (count == -1) {
      count = 6;
    }
    if (inputRecord.inputs.includes(answer)) {
      return (
        <>
          <div className={`happy banner`}>
            <b>Congratulations!</b> Got it in <b>{`${count} ${count < 2 ? 'guess' : 'guesses'}`}.</b> {restart}
          </div>
        </>
      )
    } else if (inputRecord.inputs.indexOf('     ') == -1) {
      return (
        <>
          <div className={`sad banner`}>
            Sorry, the correct answer is <b>{answer}</b>. {restart}
          </div>
        </>
      )
    };
  }

  const submitGuess = (e) => {
    e.preventDefault();
    let guess = e.target["guess-input"].value;
    if (guess == "") {
      return
    }
    const nextInputRecord = [...inputRecord.inputs];
    const nearestEmptySpace = nextInputRecord.indexOf('     ');
    nextInputRecord.splice(nearestEmptySpace, 1, guess.toUpperCase());

    const nextKeyStates = Object.create(inputRecord.keyStates);
    nextInputRecord.forEach(recordedGuess => {
      [...checkGuess(recordedGuess, answer)].forEach(({ letter, status }) => {
        if (nextKeyStates[letter] == "correct") {
          return
        } else if (status == "correct") {
          nextKeyStates[letter] = "correct"
        } else if (nextKeyStates[letter] == "misplaced") {
          return
        } else if (status == "misplaced") {
          nextKeyStates[letter] = "misplaced"
        } else if (nextKeyStates[letter] == "incorrect") {
          return
        } else if (status == "incorrect") {
          nextKeyStates[letter] = "incorrect"
        }
      })
    })
    if (nextInputRecord.indexOf('     ') == -1 || nextInputRecord.includes(answer)) {
      setInputDisable(true);
    }
    setUserInputRecord({ inputs: nextInputRecord, keyStates: nextKeyStates });
    setUserInput('');
  }

  const restartGame = () => {
    setInputDisable(false);
    setUserInput('');
    setUserInputRecord({ inputs: emptyX, keyStates: keysInit });
    let nextAnswer = getAnAnswer();
    setAnswer(nextAnswer);
  }

  const [inputDisable, setInputDisable] = React.useState(false);
  const [userInput, setUserInput] = React.useState('');
  const [answer, setAnswer] = React.useState(getAnAnswer);
  // Outputs 
  const emptyX = Array(NUM_OF_GUESSES_ALLOWED).fill('     ');
  const [inputRecord, setUserInputRecord] = React.useState({ inputs: emptyX, keyStates: keysInit });
  // console.log(inputRecord);

  return (
    <>
      <div className="guess-results">
        {inputRecord.inputs.map((value) => {
          return (<p className="guess" key={randKey()}>{[...checkGuess(value, answer)].map((letter) => {
            const letterTarget = letter.letter;
            const letterStatus = letter.status;
            return (
              <span className={`cell ${letterTarget == " " ? " " : letterStatus}`} key={randKey()}>{letter.letter}</span>
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
      <KeyBoard allInputs={inputRecord.inputs} keys={inputRecord.keyStates} />
      <StatusBanner />
    </>
  );
}

export default Game;
