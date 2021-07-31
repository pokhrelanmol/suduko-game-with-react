import React, { useState, useEffect } from "react";
import sudoku from "sudoku";
import InputField from "./InputField";

window.sudoku = sudoku;
// function to convert the suduko into its original data structure to compare it will answers
const getFlatArray = (puzzle,readOnly = false) => {
  if (readOnly){
    return puzzle
      .map((row) =>
        row.cols.map((col) => (col.readOnly ? col.value - 1:null))
      )
      .flat();
}
return puzzle
      .map((row) =>
        row.cols.map((col) => (col.value? col.value - 1:null))
      )
      .flat();
};

const structurePuzzle = (puzzle) => {
  // data structure => rows=[{cols:[col:{}}]
  let rows = [];

  for (let i = 0; i < 9; i++) {
    let row = { cols: [], index: i };
    for (let j = 0; j < 9; j++) {
      const value = puzzle[i * 9 + j];
      const col = {
        i: i,
        j: j,
        value,
        readOnly: value ? true : false,
      };
      row.cols.push(col);
    }
    rows.push(row);
  }
  return rows;
};

const getFormattedPuzzle = () => {
  const formattedPuzzle = sudoku
    .makepuzzle()
    .map((p) => (p === null ? null : p + 1));
  structurePuzzle(formattedPuzzle);
};
const Sudoku = () => {
  const [puzzle, setPuzzle] = useState(null);
  const [ResultInfo,setResultInfo] = useState('')
  useEffect(() => {
    let _puzzle = localStorage.getItem("suduko_puzzle");
    if (_puzzle) {
      setPuzzle(JSON.parse(_puzzle));
    } else {
      _puzzle = getFormattedPuzzle();
      setPuzzle(_puzzle);
      localStorage.setItem("suduko_puzzle", JSON.stringify(_puzzle));
    }
  }, []);

const handleSubmit = (userSolvedPuzzle)=>{
  console.log(userSolvedPuzzle)
 let rawPuzzle = getFlatArray(puzzle);
    let solved = sudoku.solvepuzzle(rawPuzzle);
    let userSolved = getFlatArray(userSolvedPuzzle)
   if(JSON.stringify(solved) === JSON.stringify(userSolved)){
     setResultInfo(  <h1 style = {{color:"green"}}>  Congrats :-) You Win </h1>) 

 }else(
     setResultInfo(  <h1 style = {{color:"red"}}>  0pps! Your Solution is InCorrect </h1>) 
 )


   
}
  const solveMagically = () => {
    const rawPuzzle = getFlatArray(puzzle,true);
    let solved = sudoku.solvepuzzle(rawPuzzle);
    if (solved) {
      solved = solved.map((elem) => (elem === null ? null : elem + 1));
      solved = structurePuzzle(solved);
      setPuzzle(solved);
    }
  };
  const changeValue = ({ i, j, value, readOnly }) => {
      const cols = puzzle[i].cols;
      setPuzzle([
        ...puzzle.slice(0, i),
        {
          index: i,
          cols: [
            ...cols.slice(0, j),
            { i, j, value, readOnly },
            ...cols.slice(j + 1),
          ],
        },
        ...puzzle.slice(i + 1, puzzle.length),
      ]);
    }
  return (
    <div>
      <h1> Suduko Game</h1>
      <div className="wrapper" style={{ width: 40 * 9 }}>
        {puzzle &&
          puzzle.map((row) => {
            return row.cols.map((col) => {
              const index = col.i * 9 + col.j;

              return (
                <InputField data={col} key={index} changeValue={changeValue} />
              );
            });
          })}
      </div>
      <button className="solve_magically" onClick={() => solveMagically()}>
        Solve Magically
      </button>
      <button className="submit" onClick = {()=>handleSubmit(puzzle)}> Submit</button>
      <button className="restart" onClick = {()=>{setPuzzle(JSON.parse (localStorage.getItem("suduko_puzzle"))) 
        setResultInfo(null) 
      
      }}> Restart</button>
      <div> {ResultInfo}</div>

    </div>
  );
  
};

export default Sudoku;
