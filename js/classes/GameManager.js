import { BALL_SIZE, BALL_SPEED, BALL_SPEED_MULTIPLER, GAME_HEIGHT, GAME_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED, PADDLE_WIDTH, PADDLE_X_OFFSET, } from '../constants.js';
import { clamp } from '../Utils.js';
import { Key } from './Engine/InputManager.js';
export default class GameManager {
    engine;
    canvas;
    isPlaying;
    lastScore;
    player1Score;
    player1Pos;
    player2Score;
    player2Pos;
    ballX;
    ballY;
    ballVelX;
    ballVelY;
    constructor(engineRef) {
        this.engine = engineRef;
        this.canvas = document.querySelector('canvas');
        this.isPlaying = false;
        this.lastScore = 0;
        this.player1Score = 0;
        this.player1Pos = GAME_HEIGHT / 2;
        this.player2Score = 0;
        this.player2Pos = GAME_HEIGHT / 2;
        this.ballX = GAME_WIDTH / 2;
        this.ballY = GAME_HEIGHT / 2;
        this.ballVelX = 0;
        this.ballVelY = 0;
    }
    update(dt) {
        const input = this.engine.input;
        if (input.get(Key.W))
            this.player1Pos -= PADDLE_SPEED * dt;
        if (input.get(Key.S))
            this.player1Pos += PADDLE_SPEED * dt;
        if (input.get(Key.ArrowUp))
            this.player2Pos -= PADDLE_SPEED * dt;
        if (input.get(Key.ArrowDown))
            this.player2Pos += PADDLE_SPEED * dt;
        this.player1Pos = clamp(this.player1Pos, PADDLE_HEIGHT / 2, GAME_HEIGHT - PADDLE_HEIGHT / 2);
        this.player2Pos = clamp(this.player2Pos, PADDLE_HEIGHT / 2, GAME_HEIGHT - PADDLE_HEIGHT / 2);
        if (!this.isPlaying) {
            if (input.getDown(Key.Space))
                this.startGame();
            return; //cancles blass update logic
        }
        this.ballX += this.ballVelX * BALL_SPEED * dt;
        this.ballY += this.ballVelY * BALL_SPEED * dt;
        if (this.ballY <= 0 || this.ballY >= GAME_HEIGHT)
            this.ballVelY *= -1;
        //Player Paddle Collision
        if (this.ballY - BALL_SIZE / 2 <= this.player1Pos + PADDLE_HEIGHT / 2 &&
            this.ballY + BALL_SIZE / 2 >= this.player1Pos - PADDLE_HEIGHT / 2 &&
            this.ballX - BALL_SIZE / 2 <= PADDLE_X_OFFSET + PADDLE_WIDTH / 2 &&
            this.ballX + BALL_SIZE / 2 >= PADDLE_X_OFFSET - PADDLE_WIDTH / 2) {
            console.log('Collision with player1 paddle');
            this.ballX = PADDLE_X_OFFSET + PADDLE_WIDTH / 2 + BALL_SIZE / 2;
            this.ballVelX *= -BALL_SPEED_MULTIPLER;
        }
        //Player2 Paddle Collision
        if (this.ballY - BALL_SIZE / 2 <= this.player2Pos + PADDLE_HEIGHT / 2 &&
            this.ballY + BALL_SIZE / 2 >= this.player2Pos - PADDLE_HEIGHT / 2 &&
            this.ballX - BALL_SIZE / 2 <= GAME_WIDTH - PADDLE_X_OFFSET + PADDLE_WIDTH / 2 &&
            this.ballX + BALL_SIZE / 2 >= GAME_WIDTH - PADDLE_X_OFFSET - PADDLE_WIDTH / 2) {
            console.log('Collision with player2 paddle');
            this.ballX = GAME_WIDTH - PADDLE_X_OFFSET - PADDLE_WIDTH / 2 - BALL_SIZE / 2;
            this.ballVelX *= -BALL_SPEED_MULTIPLER;
        }
        if (this.ballX <= -BALL_SIZE / 2)
            this.score(2);
        if (this.ballX >= GAME_WIDTH + BALL_SIZE / 2)
            this.score(1);
    }
    draw() {
        const ctx = this.canvas.getContext('2d');
        const gameScale = this.engine.gameScale;
        ctx.imageSmoothingEnabled = false;
        //BACKGROUND
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        //DashedLine
        ctx.strokeStyle = '#333';
        ctx.lineWidth = gameScale;
        ctx.beginPath();
        ctx.setLineDash([gameScale * 5, gameScale * 3]);
        ctx.moveTo(this.canvas.width / 2, 0);
        ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        ctx.stroke();
        //Scores
        ctx.fillStyle = '#aaa';
        ctx.font = `${gameScale * 16}px VT323`;
        ctx.textAlign = 'right';
        ctx.fillText(String(this.player1Score), this.canvas.width / 2 - 10 * gameScale, 0 + 16 * gameScale);
        ctx.textAlign = 'left';
        ctx.fillText(String(this.player2Score), this.canvas.width / 2 + 10 * gameScale, 0 + 16 * gameScale);
        //Player
        ctx.fillStyle = '#aaa';
        ctx.fillRect(PADDLE_X_OFFSET * gameScale - (PADDLE_WIDTH / 2) * gameScale, this.player1Pos * gameScale - (PADDLE_HEIGHT / 2) * gameScale, PADDLE_WIDTH * gameScale, PADDLE_HEIGHT * gameScale);
        //Player2
        ctx.fillStyle = '#aaa';
        ctx.fillRect(GAME_WIDTH * gameScale - PADDLE_X_OFFSET * gameScale - (PADDLE_WIDTH / 2) * gameScale, this.player2Pos * gameScale - (PADDLE_HEIGHT / 2) * gameScale, PADDLE_WIDTH * gameScale, PADDLE_HEIGHT * gameScale);
        //Ball
        ctx.fillStyle = '#ddd';
        ctx.fillRect(this.ballX * gameScale - (BALL_SIZE / 2) * gameScale, this.ballY * gameScale - (BALL_SIZE / 2) * gameScale, BALL_SIZE * gameScale, BALL_SIZE * gameScale);
        if (!this.isPlaying) {
            ctx.fillStyle = '#aaa';
            ctx.font = `${gameScale * 12}px VT323`;
            const text = 'Press Space to Start Game';
            const metrics = ctx.measureText(text);
            ctx.fillText(text, ctx.canvas.width / 2 - metrics.width / 2, 1 * ctx.canvas.height - metrics.actualBoundingBoxAscent / 2);
            if (this.lastScore) {
                ctx.font = `${gameScale * 8}px VT323`;
                const text = `Player${this.lastScore} scores a point!`;
                const metrics = ctx.measureText(text);
                ctx.fillText(text, ctx.canvas.width / 2 - metrics.width / 2, 0.2 * ctx.canvas.height - metrics.actualBoundingBoxAscent / 2);
            }
        }
    }
    score(player) {
        this.player1Score += player === 1 ? 1 : 0;
        this.player2Score += player === 2 ? 1 : 0;
        this.lastScore = player;
        this.isPlaying = false;
    }
    startGame() {
        const angle = Math.random() * 2 * Math.PI;
        this.ballX = GAME_WIDTH / 2;
        this.ballY = GAME_HEIGHT / 2;
        this.ballVelX = Math.cos(angle);
        this.ballVelY = Math.sin(angle);
        this.isPlaying = true;
    }
}
//# sourceMappingURL=GameManager.js.map