import React, { useEffect, useState } from 'react'
import ChessBoard from '../components/ChessBoard'
import useSocket from '../hooks/useSocket'
import Button from '../components/Button';
import { Chess } from 'chess.js'

export const INIT_GAME = 'init_game';
export const MOVE = 'move';
export const GAME_OVER = 'game_over'

const Game = () => {

    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board())
    const [started, setStarted] = useState<boolean>(false)

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
                    console.log("move made");
                    break
                case GAME_OVER:
                    console.log("Game over");
                    break
            }
        }
    }, [socket])

    if (!socket) return <div>Connecting.....</div>
    return (
        <div className='flex justify-center'>
            <div className='pt-8 max-w-screen-lg w-full flex justify-evenly'>
                <div className=''>
                    <div className=''>
                        <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} />
                    </div>
                </div>
                <div className=''>
                    {!started &&
                        <Button onClick={() => {
                            socket.send(JSON.stringify({
                                type: INIT_GAME
                            }))
                        }} >Play Chess</Button>}
                </div>
            </div>
        </div>
    )
}

export default Game
