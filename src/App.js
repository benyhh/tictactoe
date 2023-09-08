import React from "react"
import {useState} from "react"

function Square( {value, onSquareClick}) {
    return (
    <button className="square" onClick={onSquareClick}>
        {value}
    </button>
    );
};


export default function Game() {

    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [moveOrder, setMoveOrder] = useState(true);

    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
      }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moveOrderButton = (
        <button
            onClick={() => setMoveOrder(!moveOrder)}> {moveOrder ? "Ascending" : "Descending"}
        </button>
    )

    const moves = history.map((squares, move) => {
        let description;
        
        if (move > 0) {
          description = move === history.length - 1 ? "You are at move #" + move : 'Go to move #' + move;
        } else {
          description = 'Go to game start';
        }
        return (
          <li key={move}>
            <button onClick={() => jumpTo(move)}>{description}</button>
          </li>
        );
    })
    ;


    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <div>
                    {moveOrderButton} 
                    <ul> {moveOrder ? moves : moves.reverse()} </ul>
                </div>
            </div>
        </div>
    )
}

function Board( {xIsNext, squares, onPlay}) {

    const winner = calculateWinner(squares)
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    function calculateWinner (squares) {
        const lines = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,5],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a,b,c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
                return squares[a];
            }
        }
        
        return null;

    }
    
    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        };

        onPlay(nextSquares);
    }

    

    // return (
    //     <div>
    //         <div className="status"> {status} </div>
    //         {
    //         [0,1,2].map((row, _) =>
            
    //         <div className="board-row" key={row}>
    //         {
    //             [0,1,2].map( (col, _) => 
    //                 <Square key={3*row+col} value={squares[3*row + col]} onSquareClick={() => handleClick(3*row + col)}/>
    //             )
    //         }
    //         </div>
    //         )}
    //     </div>
    // );

    let boardSquares = [];
    for (let row=0; row < 3; row++) {
        let boardRow = [];
        for (let col = 0; col < 3; col++) {
            boardRow.push(
            <Square 
                key={3*row+col}
                value={squares[3*row + col]}
                onSquareClick={() => handleClick(3*row + col)}
            />);
        }
        boardSquares.push(<div className="board-row" key={row}> {boardRow} </div>);
    }
    
    return (
        <div>
            <div className="status"> {status} </div>
            {boardSquares}
        </div>
    );

  }