import { useRef } from 'react'
import Avatar from '../Avatar'
import useAuthStore from '../../store/authStore'

interface AvatarSelectionProps {
  formData: {
    avatar: string
  }
  handleAvatarChange: (avatar: string) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const AvatarSelection = ({
  formData,
  handleAvatarChange,
  handleFileChange
}: AvatarSelectionProps) => {
  const { user } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatars = [
    '/avatars/avatar1.svg',
    '/avatars/avatar2.svg',
    '/avatars/avatar3.svg',
    '/avatars/avatar4.svg'
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar
          src={
            user?.avatar
              ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${
                  user.avatar
                }`
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
                avatar ? `${import.meta.env.VITE_API_URL}${avatar}` : undefined
              }
              size="large"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default AvatarSelection
