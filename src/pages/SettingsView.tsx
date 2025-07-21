import { useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'
import AvatarSelection from '../components/settings/AvatarSelection'
import ProfileForm from '../components/settings/ProfileForm'

const SettingsView = () => {
  const { user, updateProfile, uploadAvatar, loading, error } = useAuthStore()
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
        <div className="space-y-6">
          <AvatarSelection
            formData={formData}
            handleAvatarChange={handleAvatarChange}
            handleFileChange={handleFileChange}
          />
          <ProfileForm
            formData={formData}
            loading={loading}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export default SettingsView
