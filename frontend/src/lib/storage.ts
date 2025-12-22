import type { HistoryItem } from '@/types/api'

const STORAGE_KEY = 'flux_ai_history'
const MAX_HISTORY = 100

export function getHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Failed to load history:', e)
    return []
  }
}

export function saveHistory(history: HistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

export function addToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>) {
  let history = getHistory()
  history.unshift({
    ...item,
    id: Date.now() + Math.random().toString(),
    timestamp: new Date().toISOString()
  })
  
  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY)
  }
  
  saveHistory(history)
  return history
}

export function deleteFromHistory(id: string) {
  const history = getHistory().filter(item => item.id !== id)
  saveHistory(history)
  return history
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
}
