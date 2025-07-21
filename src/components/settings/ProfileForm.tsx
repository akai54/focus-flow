import { useNavigate } from 'react-router-dom'
import { countries } from '../../utils/countries'

interface ProfileFormProps {
  formData: {
    firstName: string
    lastName: string
    dateOfBirth: string
    country: string
  }
  loading: boolean
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  handleSubmit: (e: React.FormEvent) => void
}

const ProfileForm = ({
  formData,
  loading,
  handleChange,
  handleSubmit
}: ProfileFormProps) => {
  const navigate = useNavigate()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="mb-1 block text-sm font-medium text-white"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full rounded-md border border-dark-border bg-dark px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="mb-1 block text-sm font-medium text-white"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full rounded-md border border-dark-border bg-dark px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="dateOfBirth"
          className="mb-1 block text-sm font-medium text-white"
        >
          Date of Birth
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full rounded-md border border-dark-border bg-dark px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="country"
          className="mb-1 block text-sm font-medium text-white"
        >
          Country of Residence
        </label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full rounded-md border border-dark-border bg-dark px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {countries.map((country, index) => (
            <option key={index} value={index === 0 ? '' : country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/app')}
          className="rounded-md bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back to App
        </button>
      </div>
    </form>
  )
}

export default ProfileForm
