import React, { useEffect, useState, useRef } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 18
const START_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 }
]

function randomFood(exclude) {
  while (true) {
    const x = Math.floor(Math.random() * GRID_SIZE)
    const y = Math.floor(Math.random() * GRID_SIZE)
    if (!exclude.some(p => p.x === x && p.y === y)) return { x, y }
  }
}

export default function Game() {
  const [snake, setSnake] = useState(START_SNAKE)
  const [dir, setDir] = useState({ x: 1, y: 0 })
  const [food, setFood] = useState(() => randomFood(START_SNAKE))
  const [running, setRunning] = useState(true)
  const [speed, setSpeed] = useState(140)
  const [score, setScore] = useState(0)
  const dirRef = useRef(dir)
  const runningRef = useRef(running)

  useEffect(() => { dirRef.current = dir }, [dir])
  useEffect(() => { runningRef.current = running }, [running])

  useEffect(() => {
    function handleKey(e) {
      const k = e.key
      const d = dirRef.current
      if (k === 'ArrowUp' || k === 'w') if (d.y !== 1) setDir({ x: 0, y: -1 })
      if (k === 'ArrowDown' || k === 's') if (d.y !== -1) setDir({ x: 0, y: 1 })
      if (k === 'ArrowLeft' || k === 'a') if (d.x !== 1) setDir({ x: -1, y: 0 })
      if (k === 'ArrowRight' || k === 'd') if (d.x !== -1) setDir({ x: 1, y: 0 })
      if (k === ' '){ setRunning(r => !r) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      if (!runningRef.current) return
      setSnake(prev => {
        const head = prev[0]
        const d = dirRef.current
        const newHead = { x: head.x + d.x, y: head.y + d.y }

        // wrap around walls (passable edges)
        if (newHead.x < 0) newHead.x = GRID_SIZE - 1
        if (newHead.x >= GRID_SIZE) newHead.x = 0
        if (newHead.y < 0) newHead.y = GRID_SIZE - 1
        if (newHead.y >= GRID_SIZE) newHead.y = 0

        // self collision
        if (prev.some(p => p.x === newHead.x && p.y === newHead.y)) {
          setRunning(false)
          return prev
        }

        const ate = (newHead.x === food.x && newHead.y === food.y)
        const next = [newHead, ...prev]
        if (!ate) next.pop()
        else {
          setScore(s => s + 5)
          setFood(randomFood(next))
        }
        return next
      })
    }, speed)
    return () => clearInterval(id)
  }, [speed, food])

  function restart() {
    setSnake(START_SNAKE)
    setDir({ x: 1, y: 0 })
    setFood(randomFood(START_SNAKE))
    setScore(0)
    setRunning(true)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-300">Score: <strong className="text-white">{score}</strong></div>
        <div className="space-x-2">
          <button onClick={() => setRunning(r => !r)} className="px-3 py-1 bg-indigo-600 rounded">{running ? 'Pause' : 'Resume'}</button>
          <button onClick={restart} className="px-3 py-1 bg-green-600 rounded">Restart</button>
        </div>
      </div>

      <div className="flex gap-4">
        <div style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }} className="bg-gray-900 border border-gray-700 relative">
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE
              const y = Math.floor(i / GRID_SIZE)
              const isSnake = snake.some(p => p.x === x && p.y === y)
              const isHead = snake.length && snake[0].x === x && snake[0].y === y
              const isFood = food.x === x && food.y === y
              const bg = isHead ? 'bg-yellow-400' : isSnake ? 'bg-green-500' : isFood ? 'bg-red-500' : 'bg-transparent'
              return (
                <div key={i} className={`${bg} border border-gray-800`} style={{ width: CELL_SIZE, height: CELL_SIZE }} />
              )
            })}
          </div>
        </div>

        <div className="w-48 text-sm text-gray-300">
          <div className="mb-2">Controls:</div>
          <ul className="list-disc pl-5">
            <li>Arrows or WASD to move</li>
            <li>Space to pause/resume</li>
            <li>Restart to start over</li>
          </ul>
          <div className="mt-3">Speed:</div>
          <input className="w-full" type="range" min="60" max="300" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        </div>
      </div>
    </div>
  )
}
