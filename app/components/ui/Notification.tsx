'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Notification() {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState<'success' | 'error' | 'info'>('info')
  const searchParams = useSearchParams()

  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setMessage(message)
      setShow(true)
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShow(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <XCircle className="h-5 w-5 text-red-400" />,
    info: <AlertCircle className="h-5 w-5 text-blue-400" />
  }

  return (
    <AnimatePresence>
      {show && message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
            {icons[type]}
            <p className="text-sm text-gray-700 dark:text-gray-200">{message}</p>
            <button
              onClick={() => setShow(false)}
              className="ml-4 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Fechar notificação"
            >
              <XCircle className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
