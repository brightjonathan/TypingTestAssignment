import {useState, useEffect, useRef} from 'react';
import randomWords from 'random-words';
import './App.css';
//import Header from './Component/Header';

//total number of words
const NUMB_OF_WORDS = 200;

// time settin
const SECONDS = 120;

const App = () => {

  
  const [words, setwords] = useState([]); //total words stored in an array
  const [currentInput, setcurrentInput] = useState('');  // tracking every input state
  const [countDown, setcountDown] = useState(SECONDS);  // SECONDS count down timer
  const [currentIndexWord, setcurrentIndexWord] = useState(0); //tracking the index of every word
  const [correct, setCorrect] = useState(0); //tracking all CORRECT state
  const [incorrect, setincorrect] = useState(0); //tracking all INCORRECT state
  const [status, setStatus] = useState("waiting"); //tracking the status 
  const textinput = useRef(null);

  //keeping track of each word in an array
  const [currCharIndex, setcurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState('');

  //rendering the data into the browser if mounted
  useEffect(()=>{
   setwords(generateWords())
  }, []);

  useEffect(()=>{
   if(status === 'started'){
     textinput.current.focus();
   }
  }, [status])

  //func. to generate a random word from the api
  const generateWords = ()=> {
    return new  Array(NUMB_OF_WORDS).fill(null).map(()=> randomWords());
  };

  //funct. for the btn 
  const Onstart = () =>{

    //if finished reset 
    if(status === 'finished'){
     setwords(generateWords());
     setcurrentIndexWord(0);
     setCorrect(0);
     setincorrect(0);
     setcurrCharIndex(-1)
     setCurrChar('')
    }

   //if status is not equal to started. it should start the counter
    if(status !== 'started'){
      setStatus('started')
     //setting the interval to one second
     let  interval = setInterval(()=>{
      setcountDown((prev)=> {
        //if the count down is equal to zero clear else minus one
        if(prev === 0){
          clearInterval(interval);
          setStatus('finished');
          setcurrentInput('');
          return SECONDS
        } else{
          return prev - 1;
        }
      });
    }, 1000)
    }

  }

  //funct. for handling keydown
  const handleKeyDown = ({keyCode, key}) => {
    // space bar 
    if(keyCode === 32){
      checkMatch();
      setcurrentInput("")
      setcurrentIndexWord(currentIndexWord + 1);
      setcurrCharIndex(-1)
    } else if(keyCode === 8){
       setcurrCharIndex(currCharIndex - 1)
       setCurrChar('')
    } else{
      setcurrCharIndex(currCharIndex + 1);
      setCurrChar(key)
    }
  }

  //funct. for checking word that matches
  const checkMatch = () =>{
      const wordCompare = words[currentIndexWord]
      const doesItMatch = wordCompare === currentInput.trim();
      if(doesItMatch){
      setCorrect(correct + 1)
      //console.log(correct + 1)
      } else{
        setincorrect(incorrect + 1);
        //console.log(incorrect + 1);
      }
  };

  //
  const getclassname = (wordId, charId, char) =>{
     if(wordId === currentIndexWord && charId === currCharIndex && currChar && status !==  'finished'){
           if(char === currChar){
            return 'has-background-success'
           } else{
            return 'has-background-danger'
           }
     } else if(wordId === currentIndexWord && currCharIndex >= words[currentIndexWord].length) {
      return 'has-background-danger'
     } else {
       return ""
     }
  }

 
  return (
    < >
      { /* <Header/> */ }
      <div className="section">
        <div  className="is-size-1 has-text-centered has-text-primary" >
         <h2 data-testid='countdown'>{countDown}</h2>
        </div>
      </div>



      <div className='control is-expanded section'>
        <input 
        type='test'
        className='input'
        value={currentInput}
        onChange={(e)=> setcurrentInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={status !== "started"}
        ref={textinput}
        />
      </div>



      <div className="section">
        <button data-testid="input" className="button is-info is-fullwidth" onClick={Onstart} > Start </button>
      </div>



      {status === 'started' && (
       
       <div className='section'>
       <div className="card">
        <div className="card-content">
          <div className="content">
            {words.map((eword, index)=>(
              <span key={index}>
                <span>
                  {eword.split(" ").map((char, idx)=>(
                    <span key={idx} className={getclassname(index, idx, char)} > {char} </span>
                  ))}
                </span>
                <span> </span>
                </span>
              ))}
          </div>
        </div>
      </div>
      </div>
      )}



      {status === 'finished' && (
         <div className="section">
         <div className="columns">
           <div className="column has-text-centered">
             <p className="is-size-5">Words speed per minute:</p>
             <p className="has-text-primary is-size-1">
               {correct}
             </p>
           </div>
           <div className="column has-text-centered">
             <p className="is-size-5">Words Accuracy:</p>
               <p className="has-text-info is-size-1"> {Math.round((correct / (correct + incorrect)) * 100)}% </p>
           </div>
         </div>
       </div>
      )}
       
    </>
  )
}

export default App


