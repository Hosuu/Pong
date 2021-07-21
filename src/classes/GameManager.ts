import {
	BALL_SIZE,
	BALL_SPEED,
	BALL_SPEED_MULTIPLER,
	GAME_HEIGHT,
	GAME_WIDTH,
	PADDLE_HEIGHT,
	PADDLE_SPEED,
	PADDLE_WIDTH,
	PADDLE_X_OFFSET,
} from '../constants.js'
import { clamp } from '../Utils.js'
import { Key } from './Engine/InputManager.js'
import PongEngine from './PongEngine.js'

export default class GameManager {
	public readonly engine: PongEngine

	private canvas: HTMLCanvasElement

	private isPlaying: boolean
	private lastScore: 0 | 1 | 2

	private player1Score: number
	private player1Pos: number

	private player2Score: number
	private player2Pos: number

	private ballX: number
	private ballY: number
	private ballVelX: number
	private ballVelY: number

	constructor(engineRef: PongEngine) {
		this.engine = engineRef
		this.canvas = document.querySelector('canvas')!

		this.isPlaying = false
		this.lastScore = 0

		this.player1Score = 0
		this.player1Pos = GAME_HEIGHT / 2

		this.player2Score = 0
		this.player2Pos = GAME_HEIGHT / 2

		this.ballX = GAME_WIDTH / 2
		this.ballY = GAME_HEIGHT / 2
		this.ballVelX = 0
		this.ballVelY = 0
	}

	public update(dt: number): void {
		const input = this.engine.input

		if (input.get(Key.W)) this.player1Pos -= PADDLE_SPEED * dt
		if (input.get(Key.S)) this.player1Pos += PADDLE_SPEED * dt
		if (input.get(Key.ArrowUp)) this.player2Pos -= PADDLE_SPEED * dt
		if (input.get(Key.ArrowDown)) this.player2Pos += PADDLE_SPEED * dt

		this.player1Pos = clamp(this.player1Pos, PADDLE_HEIGHT / 2, GAME_HEIGHT - PADDLE_HEIGHT / 2)
		this.player2Pos = clamp(this.player2Pos, PADDLE_HEIGHT / 2, GAME_HEIGHT - PADDLE_HEIGHT / 2)

		if (!this.isPlaying) {
			if (input.getDown(Key.Space)) this.startGame()
			return //cancles blass update logic
		}

		this.ballX += this.ballVelX * BALL_SPEED * dt
		this.ballY += this.ballVelY * BALL_SPEED * dt

		if (this.ballY <= 0 || this.ballY >= GAME_HEIGHT) this.ballVelY *= -1

		//Player Paddle Collision
		if (
			this.ballY - BALL_SIZE / 2 <= this.player1Pos + PADDLE_HEIGHT / 2 &&
			this.ballY + BALL_SIZE / 2 >= this.player1Pos - PADDLE_HEIGHT / 2 &&
			this.ballX - BALL_SIZE / 2 <= PADDLE_X_OFFSET + PADDLE_WIDTH / 2 &&
			this.ballX + BALL_SIZE / 2 >= PADDLE_X_OFFSET - PADDLE_WIDTH / 2
		) {
			console.log('Collision with player1 paddle')
			this.ballX = PADDLE_X_OFFSET + PADDLE_WIDTH / 2 + BALL_SIZE / 2
			this.ballVelX *= -BALL_SPEED_MULTIPLER
		}

		//Player2 Paddle Collision
		if (
			this.ballY - BALL_SIZE / 2 <= this.player2Pos + PADDLE_HEIGHT / 2 &&
			this.ballY + BALL_SIZE / 2 >= this.player2Pos - PADDLE_HEIGHT / 2 &&
			this.ballX - BALL_SIZE / 2 <= GAME_WIDTH - PADDLE_X_OFFSET + PADDLE_WIDTH / 2 &&
			this.ballX + BALL_SIZE / 2 >= GAME_WIDTH - PADDLE_X_OFFSET - PADDLE_WIDTH / 2
		) {
			console.log('Collision with player2 paddle')
			this.ballX = GAME_WIDTH - PADDLE_X_OFFSET - PADDLE_WIDTH / 2 - BALL_SIZE / 2
			this.ballVelX *= -BALL_SPEED_MULTIPLER
		}

		if (this.ballX <= -BALL_SIZE / 2) this.score(2)
		if (this.ballX >= GAME_WIDTH + BALL_SIZE / 2) this.score(1)
	}

	public draw(): void {
		const ctx = this.canvas.getContext('2d')!
		const gameScale = this.engine.gameScale

		ctx.imageSmoothingEnabled = false

		//BACKGROUND
		ctx.fillStyle = '#050505'
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		//DashedLine
		ctx.strokeStyle = '#333'
		ctx.lineWidth = gameScale
		ctx.beginPath()
		ctx.setLineDash([gameScale * 5, gameScale * 3])
		ctx.moveTo(this.canvas.width / 2, 0)
		ctx.lineTo(this.canvas.width / 2, this.canvas.height)
		ctx.stroke()

		//Scores
		ctx.fillStyle = '#aaa'
		ctx.font = `${gameScale * 16}px VT323`
		ctx.textAlign = 'right'
		ctx.fillText(
			String(this.player1Score),
			this.canvas.width / 2 - 10 * gameScale,
			0 + 16 * gameScale
		)
		ctx.textAlign = 'left'
		ctx.fillText(
			String(this.player2Score),
			this.canvas.width / 2 + 10 * gameScale,
			0 + 16 * gameScale
		)

		//Player
		ctx.fillStyle = '#aaa'
		ctx.fillRect(
			PADDLE_X_OFFSET * gameScale - (PADDLE_WIDTH / 2) * gameScale,
			this.player1Pos * gameScale - (PADDLE_HEIGHT / 2) * gameScale,
			PADDLE_WIDTH * gameScale,
			PADDLE_HEIGHT * gameScale
		)

		//Player2
		ctx.fillStyle = '#aaa'
		ctx.fillRect(
			GAME_WIDTH * gameScale - PADDLE_X_OFFSET * gameScale - (PADDLE_WIDTH / 2) * gameScale,
			this.player2Pos * gameScale - (PADDLE_HEIGHT / 2) * gameScale,
			PADDLE_WIDTH * gameScale,
			PADDLE_HEIGHT * gameScale
		)

		//Ball
		ctx.fillStyle = '#ddd'
		ctx.fillRect(
			this.ballX * gameScale - (BALL_SIZE / 2) * gameScale,
			this.ballY * gameScale - (BALL_SIZE / 2) * gameScale,
			BALL_SIZE * gameScale,
			BALL_SIZE * gameScale
		)

		if (!this.isPlaying) {
			ctx.fillStyle = '#aaa'
			ctx.font = `${gameScale * 12}px VT323`
			const text = 'Press Space to Start Game'
			const metrics = ctx.measureText(text)
			ctx.fillText(
				text,
				ctx.canvas.width / 2 - metrics.width / 2,
				1 * ctx.canvas.height - metrics.actualBoundingBoxAscent / 2
			)

			if (this.lastScore) {
				ctx.font = `${gameScale * 8}px VT323`

				const text = `Player${this.lastScore} scores a point!`
				const metrics = ctx.measureText(text)
				ctx.fillText(
					text,
					ctx.canvas.width / 2 - metrics.width / 2,
					0.2 * ctx.canvas.height - metrics.actualBoundingBoxAscent / 2
				)
			}
		}
	}

	public score(player: 1 | 2) {
		this.player1Score += player === 1 ? 1 : 0
		this.player2Score += player === 2 ? 1 : 0
		this.lastScore = player

		this.isPlaying = false
	}

	public startGame(): void {
		const angle = Math.random() * 2 * Math.PI
		this.ballX = GAME_WIDTH / 2
		this.ballY = GAME_HEIGHT / 2
		this.ballVelX = Math.cos(angle)
		this.ballVelY = Math.sin(angle)

		this.isPlaying = true
	}
}
