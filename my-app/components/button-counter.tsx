'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

const STORAGE_KEY = 'buttonCounterState'

// ローカルストレージ操作のユーティリティ関数
const storage = {
  saveState: (counts: number[], lastUpdated: number | null) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ counts, lastUpdated }))
    }
  },
  loadState: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return null
  }
}

export function ButtonCounterComponent() {
  const [counts, setCounts] = useState<number[]>(() => {
    const savedState = storage.loadState()
    return savedState ? savedState.counts : new Array(60).fill(0)
  })
  const [lastUpdated, setLastUpdated] = useState<number | null>(() => {
    const savedState = storage.loadState()
    return savedState ? savedState.lastUpdated : null
  })

  useEffect(() => {
    storage.saveState(counts, lastUpdated)
  }, [counts, lastUpdated])

  const handleIncrement = (index: number) => {
    setCounts(prevCounts => {
      const newCounts = [...prevCounts]
      newCounts[index]++
      return newCounts
    })
    setLastUpdated(index)
  }

  const handleDecrement = (index: number) => {
    setCounts(prevCounts => {
      const newCounts = [...prevCounts]
      if (newCounts[index] > 0) {
        newCounts[index]--
        setLastUpdated(index)
      }
      return newCounts
    })
  }

  return (
    <div className="flex flex-col md:flex-row h-screen p-4 gap-4">
      <div className="flex-1 border rounded-lg p-4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">ボタン</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2">
          {counts.map((_, index) => (
            <Button
              key={index}
              onClick={() => handleIncrement(index)}
              variant="outline"
              className="w-full h-12"
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1 border rounded-lg p-4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">カウント</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {counts.map((count, index) => (
            <Button
              key={index}
              onClick={() => handleDecrement(index)}
              variant="outline"
              className={`flex justify-between items-center p-2 h-auto ${
                lastUpdated === index ? 'bg-green-100 hover:bg-green-200' : ''
              }`}
            >
              <span className="font-medium">作品 {index + 1}:</span>
              <span className={`text-lg ${lastUpdated === index ? 'text-green-600' : ''}`}>
                {count}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}