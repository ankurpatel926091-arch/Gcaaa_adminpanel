import { useEffect, useState } from 'react'
import { Check, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import {
  fetchAdminContactPageContent,
  updateContactPageContent,
} from '../Api/contactPageAdminApi'

const createEmptyContent = () => ({
  hero: { title: '', breadcrumbHome: '', breadcrumbContact: '' },
  headquarters: {
    badge: '',
    title: '',
    subtitle: '',
    addressLabel: '',
    address: '',
    phoneLabel: '',
    phone: '',
    emailLabel: '',
    email: '',
    officeHoursLabel: '',
    officeHours: '',
    bearersHeading: '',
    bearers: [{ role: '', name: '', phone: '' }],
  },
  form: {
    title: '',
    description: '',
    nameLabel: '',
    namePlaceholder: '',
    emailLabel: '',
    emailPlaceholder: '',
    phoneLabel: '',
    phonePlaceholder: '',
    subjectLabel: '',
    subjectOptions: [{ value: '', label: '' }],
    messageLabel: '',
    messagePlaceholder: '',
    submitLabel: '',
    successTitle: '',
    successMessage: '',
    sendAnotherLabel: '',
  },
  campus: {
    badge: '',
    title: '',
    description: '',
    transitHeading: '',
    transitStops: [{ name: '', distance: '', icon: 'train' }],
    landmarkLabel: '',
    landmark: '',
    openMapLabel: '',
    mapTitle: '',
    mapUrl: '',
    mapEmbedUrl: '',
  },
})

const normalizeContent = (data) =>
  data ? { ...createEmptyContent(), ...data } : createEmptyContent()

const sections = [
  {
    title: 'Page heading',
    description: 'Contact page title and breadcrumb.',
    fields: [
      ['hero.title', 'Page title'],
      ['hero.breadcrumbHome', 'Home breadcrumb'],
      ['hero.breadcrumbContact', 'Contact breadcrumb'],
    ],
  },
  {
    title: 'Headquarters and contact details',
    description: 'Association information and office bearer contacts.',
    fields: [
      ['headquarters.badge', 'Section badge'],
      ['headquarters.title', 'Association name'],
      ['headquarters.subtitle', 'Association subtitle'],
      ['headquarters.addressLabel', 'Address label'],
      ['headquarters.address', 'Campus address'],
      ['headquarters.phoneLabel', 'Phone label'],
      ['headquarters.phone', 'Contact phone'],
      ['headquarters.emailLabel', 'Email label'],
      ['headquarters.email', 'Official email', 'email'],
      ['headquarters.officeHoursLabel', 'Office hours label'],
      ['headquarters.officeHours', 'Office hours'],
      ['headquarters.bearersHeading', 'Office bearers heading'],
    ],
  },
  {
    title: 'Contact form text',
    description: 'Labels, placeholders, subject choices, and confirmation copy.',
    fields: [
      ['form.title', 'Form heading'],
      ['form.description', 'Form description', 'textarea'],
      ['form.nameLabel', 'Name label'],
      ['form.namePlaceholder', 'Name placeholder'],
      ['form.emailLabel', 'Email label'],
      ['form.emailPlaceholder', 'Email placeholder'],
      ['form.phoneLabel', 'Phone label'],
      ['form.phonePlaceholder', 'Phone placeholder'],
      ['form.subjectLabel', 'Subject label'],
      ['form.messageLabel', 'Message label'],
      ['form.messagePlaceholder', 'Message placeholder'],
      ['form.submitLabel', 'Submit button text'],
      ['form.successTitle', 'Success heading'],
      ['form.successMessage', 'Success message', 'textarea'],
      ['form.sendAnotherLabel', 'Send another button text'],
    ],
  },
  {
    title: 'Campus directions and map',
    description: 'Accessibility details, transit options, and map links.',
    fields: [
      ['campus.badge', 'Section badge'],
      ['campus.title', 'Campus directions heading'],
      ['campus.description', 'Campus description', 'textarea'],
      ['campus.transitHeading', 'Transit section heading'],
      ['campus.landmarkLabel', 'Landmark label'],
      ['campus.landmark', 'Campus landmark', 'textarea'],
      ['campus.openMapLabel', 'Open map link text'],
      ['campus.mapTitle', 'Map title'],
      ['campus.mapUrl', 'Map link URL', 'url'],
      ['campus.mapEmbedUrl', 'Map embed URL', 'url'],
    ],
  },
]

const getValue = (object, path) =>
  path.split('.').reduce((value, key) => value?.[key], object) ?? ''

const ContactPageSettings = () => {
  const [content, setContent] = useState(createEmptyContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const loadContent = async () => {
    try {
      const response = await fetchAdminContactPageContent()
      setContent(normalizeContent(response.data))
    } catch (loadError) {
      console.error('Failed to load contact page settings:', loadError)
      setError(loadError?.response?.data?.message || loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true
    fetchAdminContactPageContent()
      .then((response) => {
        if (isActive) setContent(normalizeContent(response.data))
      })
      .catch((loadError) => {
        if (!isActive) return
        console.error('Failed to load contact page settings:', loadError)
        setError(loadError?.response?.data?.message || loadError.message)
      })
      .finally(() => {
        if (isActive) setLoading(false)
      })
    return () => {
      isActive = false
    }
  }, [])

  const setPathValue = (path, value) => {
    setSaved(false)
    setContent((current) => {
      const updated = { ...current }
      const keys = path.split('.')
      let target = updated
      let source = current
      for (const key of keys.slice(0, -1)) {
        target[key] = { ...source[key] }
        target = target[key]
        source = source[key]
      }
      target[keys[keys.length - 1]] = value
      return updated
    })
  }

  const updateEntry = (path, index, field, value) => {
    const entries = getValue(content, path).map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, [field]: value } : entry
    )
    setPathValue(path, entries)
  }

  const addEntry = (path, entry) => setPathValue(path, [...getValue(content, path), entry])

  const removeEntry = (path, index) =>
    setPathValue(path, getValue(content, path).filter((_, entryIndex) => entryIndex !== index))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const response = await updateContactPageContent(content)
      setContent(response.data)
      setSaved(true)
    } catch (saveError) {
      console.error('Failed to save contact page settings:', saveError)
      setError(saveError?.response?.data?.message || saveError.message)
    } finally {
      setSaving(false)
    }
  }

  const renderField = ([path, label, type = 'text']) => (
    <label key={path} className="block text-xs font-semibold text-gray-700">
      {label}
      {type === 'textarea' ? (
        <textarea
          required
          rows={3}
          value={getValue(content, path)}
          onChange={(event) => setPathValue(path, event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-[#800018]"
        />
      ) : (
        <input
          required
          type={type}
          value={getValue(content, path)}
          onChange={(event) => setPathValue(path, event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-[#800018]"
        />
      )}
    </label>
  )

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading contact page settings...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#800018]">
          Website Content
        </span>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Contact Page
        </h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Manage the information, form copy, directions, and map shown on the public contact page.
        </p>
      </div>

      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={() => {
              setLoading(true)
              setError('')
              loadContent()
            }}
            className="font-semibold underline"
          >
            Reload content
          </button>
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check size={16} />
          Contact page content saved.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs sm:p-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="font-serif text-lg font-bold text-gray-900">{section.title}</h2>
              <p className="mt-1 text-xs text-gray-500">{section.description}</p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {section.fields.map(renderField)}
            </div>

            {section.title === 'Headquarters and contact details' && (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-gray-800">Office bearers</h3>
                  <button
                    type="button"
                    onClick={() => addEntry('headquarters.bearers', { role: '', name: '', phone: '' })}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Plus size={14} /> Add person
                  </button>
                </div>
                <div className="space-y-3">
                  {content.headquarters.bearers.map((bearer, index) => (
                    <div key={`bearer-${index}`} className="grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
                      {[
                        ['role', 'Role'],
                        ['name', 'Name'],
                        ['phone', 'Phone'],
                      ].map(([field, label]) => (
                        <label key={field} className="text-xs font-semibold text-gray-700">
                          {label}
                          <input
                            required
                            value={bearer[field]}
                            onChange={(event) => updateEntry('headquarters.bearers', index, field, event.target.value)}
                            className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[#800018]"
                          />
                        </label>
                      ))}
                      <button type="button" aria-label="Remove office bearer" disabled={content.headquarters.bearers.length === 1} onClick={() => removeEntry('headquarters.bearers', index)} className="self-end rounded-lg p-2 text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.title === 'Contact form text' && (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-gray-800">Subject options</h3>
                  <button
                    type="button"
                    onClick={() => addEntry('form.subjectOptions', { value: '', label: '' })}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Plus size={14} /> Add option
                  </button>
                </div>
                <div className="space-y-3">
                  {content.form.subjectOptions.map((option, index) => (
                    <div key={`subject-${index}`} className="grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-3 sm:grid-cols-[1fr_1fr_auto]">
                      {[
                        ['label', 'Option label'],
                        ['value', 'Option value'],
                      ].map(([field, label]) => (
                        <label key={field} className="text-xs font-semibold text-gray-700">
                          {label}
                          <input
                            required
                            value={option[field]}
                            onChange={(event) => updateEntry('form.subjectOptions', index, field, event.target.value)}
                            className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[#800018]"
                          />
                        </label>
                      ))}
                      <button type="button" aria-label="Remove subject option" disabled={content.form.subjectOptions.length === 1} onClick={() => removeEntry('form.subjectOptions', index)} className="self-end rounded-lg p-2 text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.title === 'Campus directions and map' && (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-gray-800">Transit stops</h3>
                  <button
                    type="button"
                    onClick={() => addEntry('campus.transitStops', { name: '', distance: '', icon: 'train' })}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Plus size={14} /> Add stop
                  </button>
                </div>
                <div className="space-y-3">
                  {content.campus.transitStops.map((stop, index) => (
                    <div key={`stop-${index}`} className="grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
                      {[
                        ['name', 'Transit location'],
                        ['distance', 'Distance / travel time'],
                      ].map(([field, label]) => (
                        <label key={field} className="text-xs font-semibold text-gray-700">
                          {label}
                          <input
                            required
                            value={stop[field]}
                            onChange={(event) => updateEntry('campus.transitStops', index, field, event.target.value)}
                            className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[#800018]"
                          />
                        </label>
                      ))}
                      <label className="text-xs font-semibold text-gray-700">
                        Icon
                        <select
                          value={stop.icon}
                          onChange={(event) => updateEntry('campus.transitStops', index, 'icon', event.target.value)}
                          className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[#800018]"
                        >
                          <option value="train">Train</option>
                          <option value="plane">Plane</option>
                          <option value="car">Car</option>
                        </select>
                      </label>
                      <button type="button" aria-label="Remove transit stop" disabled={content.campus.transitStops.length === 1} onClick={() => removeEntry('campus.transitStops', index)} className="self-end rounded-lg p-2 text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#800018] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#a00020] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Contact Page
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContactPageSettings
