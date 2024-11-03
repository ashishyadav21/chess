import React, { useEffect, useState } from 'react'
import ChessBoard from '../components/ChessBoard'
import useSocket from '../hooks/useSocket'
import Button from '../components/Button';
import { Chess } from 'chess.js'
import chessBoard from '../assets/chessBoard.png'

export const INIT_GAME = 'init_game';
export const MOVE = 'move';
export const GAME_OVER = 'game_over'

type Move = { from: string, to: string };  // Example move type


const Game = () => {

    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board())
    const [started, setStarted] = useState<boolean>(false)
    const [movesRecord, setMovesRecord] = useState<Move[]>([])

    useEffect(() => {
        if (!socket) {
            return
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data)
            console.log("message -->", message)
            switch (message.type) {
                case INIT_GAME:
                    console.log("Game Initalized");
                    // setChess(new Chess())
                    setBoard(chess.board())
                    setStarted(true)
                    break
                case MOVE:
                    // eslint-disable-next-line no-case-declarations
                    const move = message.payload;
                    chess.move(move)
                    setBoard(chess.board())
                    setMovesRecord((prevMovesRecord) => [...prevMovesRecord, move]);
                    console.log("move made");
                    break
                case GAME_OVER:
                    console.log("Game over");
                    break
            }
        }
    }, [socket])

    console.log("movesRecord ---->", movesRecord)

    if (!socket) return <div>Connecting.....</div>
    return (
        <div className='flex justify-center'>
            <div className='pt-8 max-w-screen-lg w-full flex justify-evenly'>
                {started ? <div className=''>
                    <div className=''>
                        <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} />
                    </div>
                </div> :
                    <div>
                        <img className='w-auto h-96' src={chessBoard} alt="chessBoard" />
                    </div>}
                <div className=''>
                    {!started ?
                        <Button onClick={() => {
                            socket.send(JSON.stringify({
                                type: INIT_GAME
                            }))
                        }} >Play Chess</Button> :
                        <div>
                            {movesRecord.map((move, index) =>
                            (
                                <div key={index} className='flex justify-center bg-white w-auto h-96'>
                                    <p className='font-semibold text-sm text-white'></p>
                                    <span className='text-red-500'>From {move?.from}</span>  <span className='text-red-500'>to {move?.to}</span>
                                </div>
                            )
                            )}
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default Game
