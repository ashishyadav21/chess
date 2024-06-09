"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
class Game {
    constructor(player1, player2) {
        this.movesCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        console.log("3");
        this.player1.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: 'white'
            }
        }));
        this.player2.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: 'black'
            }
        }));
    }
    makeMove(socket, move) {
        // validation the type of move using ZOD 
        // if the move valid
        if (this.movesCount % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.movesCount % 2 === 1 && socket !== this.player2) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log("error --->", e);
            return;
        }
        if (this.board.isGameOver()) {
            // send the game over method to both player
            this.player1.send(JSON.stringify({
                type: message_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? "black" : 'white'
                }
            }));
            return;
        }
        if (this.movesCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: 'move',
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: 'move',
                payload: move
            }));
        }
        this.movesCount++;
        // check is the game is over
        // send the updates board to both the player
    }
}
exports.Game = Game;
