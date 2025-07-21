import { useState, useEffect, useRef } from 'react'
import useAuthStore from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import Avatar from '../components/Avatar'

const SettingsView = () => {
  const { user, updateProfile, uploadAvatar, loading, error } = useAuthStore()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split('T')[0]
      : '',
    country: user?.country || '',
    avatar: user?.avatar || ''
  })
  const [successMessage, setSuccessMessage] = useState('')
  const avatars = [
    '/avatars/avatar1.svg',
    '/avatars/avatar2.svg',
    '/avatars/avatar3.svg',
    '/avatars/avatar4.svg'
  ]

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split('T')[0]
          : '',
        country: user.country || '',
        avatar: user.avatar || ''
      })
    }
  }, [user])
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (avatar: string) => {
    setFormData((prev) => ({ ...prev, avatar }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      try {
        await uploadAvatar(file)
        setSuccessMessage('Avatar updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } catch (err) {
        console.error('Failed to upload avatar:', err)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile(formData)
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Failed to update profile:', err)
    }
  }

  // List of countries for the dropdown
  const countries = [
    'Select a country',
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Korea, North',
    'Korea, South',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe'
  ]
  return (
    <div className="flex-1 bg-dark p-6 font-spline">
      <h1 className="mb-6 text-3xl font-bold text-white">Your Profile</h1>

      {error && (
        <div className="mb-4 rounded bg-red-500 p-3 text-white">{error}</div>
      )}

      {successMessage && (
        <div className="mb-4 rounded bg-green-500 p-3 text-white">
          {successMessage}
        </div>
      )}

      <div className="rounded-lg bg-dark-card p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar
              src={
                user?.avatar
                  ? `${
                      import.meta.env.VITE_API_URL || 'http://localhost:3001'
                    }${user.avatar}`
                  : undefined
              }
              size="large"
            />
            <div>
              <h3 className="text-lg font-medium text-white">
                {user?.firstName || 'User'}&apos;s Avatar
              </h3>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-400">
                  Choose your avatar from the options below or
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  upload a file.
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {avatars.map((avatar) => (
              <button
                key={avatar}
                type="button"
                className={`rounded-full p-1 ${
                  formData.avatar === avatar
                    ? 'ring-2 ring-primary'
                    : 'ring-1 ring-dark-border'
                }`}
                onClick={() => handleAvatarChange(avatar)}
              >
                <Avatar
                  src={
                    avatar
                      ? `${import.meta.env.VITE_API_URL}${avatar}`
                      : undefined
                  }
                  size="large"
                />
              </button>
            ))}
          </div>

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
      </div>
    </div>
  )
}
export default SettingsView
