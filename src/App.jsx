import React from 'react'
import Game from './components/Game'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <header className="mb-4 text-center">
          <h1 className="text-3xl font-bold">Snake</h1>
          <p className="text-sm text-gray-400">Use arrows or WASD to move. Eat food to grow.</p>
        </header>
        <Game />
      </div>
    </div>
  )
}
