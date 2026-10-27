import { useEffect, useState } from 'react'
import { Loader2, Mail, Phone, RefreshCw } from 'lucide-react'
import { fetchContactMessages } from '../Api/contactPageAdminApi'

const ContactMessages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadMessages = async () => {
    try {
      setLoading(true)
      const response = await fetchContactMessages()
      setMessages(response.data)
      setError('')
    } catch (loadError) {
      console.error('Failed to load contact messages:', loadError)
      setError(loadError?.response?.data?.message || loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true
    fetchContactMessages()
      .then((response) => {
        if (isActive) {
          setMessages(response.data)
          setError('')
        }
      })
      .catch((loadError) => {
        if (!isActive) return
        console.error('Failed to load contact messages:', loadError)
        setError(loadError?.response?.data?.message || loadError.message)
      })
      .finally(() => {
        if (isActive) setLoading(false)
      })
    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
            Website Inbox
          </span>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-red-600 sm:text-3xl">
            Contact Messages
          </h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Messages sent through the public contact form, newest first.
          </p>
        </div>
        <button
          type="button"
          onClick={loadMessages}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading messages...
        </div>
      ) : !error && messages.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          No contact messages have been received yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              
              {/* YAHAN HEADER KO RED AUR LIGHT RED BACKGROUND DIYA GAYA HAI */}
              <thead className="bg-red-50 text-xs uppercase tracking-wide text-red-600 border-b border-red-100">
                <tr>
                  <th scope="col" className="px-5 py-4 font-bold">#</th>
                  <th scope="col" className="px-5 py-4 font-bold">Name</th>
                  <th scope="col" className="px-5 py-4 font-bold">Email</th>
                  <th scope="col" className="px-5 py-4 font-bold">Phone</th>
                  <th scope="col" className="px-5 py-4 font-bold">Subject</th>
                  <th scope="col" className="px-5 py-4 font-bold">Message</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100">
                {messages.map((message, index) => (
                  <tr
                    key={message.id}
                    className="align-top transition-colors hover:bg-red-50/30"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {message.name}
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`mailto:${message.email}`}
                        className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-600"
                      >
                        <Mail size={14} className="shrink-0" /> {message.email}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`tel:${message.phone.replace(/[^\d+]/g, '')}`}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-gray-600 hover:text-red-600"
                      >
                        <Phone size={14} className="shrink-0" /> {message.phone}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-700">
                      {message.subject}
                    </td>
                    <td className="max-w-sm whitespace-pre-wrap break-words px-5 py-4 text-xs leading-relaxed text-gray-700">
                      {message.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactMessages