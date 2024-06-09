import { WebSocket, WebSocketServer } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME } from "./message";

export class Game {

    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    // private moves: string[];÷
    private startTime: Date
    private movesCount = 0


    constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        console.log("3")

        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload: {
                color:'white'
            }
        }))

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color:'black'
            }
        }))
    }

    makeMove(socket:WebSocket, move:{from:string; to:string} ){
        // validation the type of move using ZOD 
        // if the move valid
        if(this.movesCount % 2 === 0 && socket !== this.player1){
            return
        }
        if(this.movesCount % 2 === 1 && socket !== this.player2){
            return
        }

        try {
            this.board.move(move)
        } catch(e){
            console.log("error --->",e)
            return;
        }

        if(this.board.isGameOver()){
            // send the game over method to both player
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload:{
                    winner: this.board.turn() === 'w' ? "black" : 'white'
                }
            }))
            return
        }

        if(this.movesCount % 2 === 0){
            this.player2.send(JSON.stringify({
                type:'move',
                payload: move
            }))
        } else {
            this.player1.send(JSON.stringify({
                type:'move',
                payload:move
            }))
        }
        this.movesCount++

        // check is the game is over
        // send the updates board to both the player
    }
}