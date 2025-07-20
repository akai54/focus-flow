import React from 'react'

interface IconProps {
  className?: string
  fill?: string
}

export const TasksIcon: React.FC<IconProps> = ({
  className = 'w-6 h-6',
  fill = 'currentColor'
}) => (
  <svg
    className={className}
    viewBox="0 0 19 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 7.5C3 8.32843 2.32843 9 1.5 9C0.671573 9 0 8.32843 0 7.5C0 6.67157 0.671573 6 1.5 6C2.32843 6 3 6.67157 3 7.5ZM1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0ZM1.5 12C0.671573 12 0 12.6716 0 13.5C0 14.3284 0.671573 15 1.5 15C2.32843 15 3 14.3284 3 13.5C3 12.6716 2.32843 12 1.5 12ZM18 6H6C5.58579 6 5.25 6.33579 5.25 6.75V8.25C5.25 8.66421 5.58579 9 6 9H18C18.4142 9 18.75 8.66421 18.75 8.25V6.75C18.75 6.33579 18.4142 6 18 6ZM18 0H6C5.58579 0 5.25 0.335786 5.25 0.75V2.25C5.25 2.66421 5.58579 3 6 3H18C18.4142 3 18.75 2.66421 18.75 2.25V0.75C18.75 0.335786 18.4142 0 18 0ZM18 12H6C5.58579 12 5.25 12.3358 5.25 12.75V14.25C5.25 14.6642 5.58579 15 6 15H18C18.4142 15 18.75 14.6642 18.75 14.25V12.75C18.75 12.3358 18.4142 12 18 12Z"
      fill={fill}
    />
  </svg>
)

export const TaskItemIcon: React.FC<IconProps> = ({
  className = 'w-5 h-5',
  fill = 'currentColor'
}) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9942 4.47957 15.5204 0.00582964 10 0ZM10 18.4615C5.32682 18.4615 1.53846 14.6732 1.53846 10C1.53846 5.32682 5.32682 1.53846 10 1.53846C14.6732 1.53846 18.4615 5.32682 18.4615 10C18.4562 14.671 14.671 18.4562 10 18.4615Z"
      fill={fill}
    />
  </svg>
)

export const HomeIcon: React.FC<IconProps> = ({
  className = 'w-6 h-6',
  fill = 'currentColor'
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M9 22V12H15V22"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const CalendarIcon: React.FC<IconProps> = ({
  className = 'w-6 h-6',
  fill = 'currentColor'
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke={fill}
      strokeWidth="2"
      fill="none"
    />
    <line
      x1="16"
      y1="2"
      x2="16"
      y2="6"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="2"
      x2="8"
      y2="6"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="3"
      y1="10"
      x2="21"
      y2="10"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export const ReportsIcon: React.FC<IconProps> = ({
  className = 'w-6 h-6',
  fill = 'currentColor'
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V3M7 17L12 12L16 16L21 11"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M16 8H21V13"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

export const SettingsIcon: React.FC<IconProps> = ({
  className = 'w-6 h-6',
  fill = 'currentColor'
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="3" stroke={fill} strokeWidth="2" fill="none" />
    <path
      d="M19.4 15A1.65 1.65 0 0 0 20.25 13.5V10.5A1.65 1.65 0 0 0 19.4 9L18.12 8.06A1.65 1.65 0 0 1 17.6 6.5L18.5 4.94A1.65 1.65 0 0 0 17.94 3.06L15.06 1.94A1.65 1.65 0 0 0 13.5 2.75L12 3.84A1.65 1.65 0 0 1 10.5 3.84L9 2.75A1.65 1.65 0 0 0 7.44 1.94L4.56 3.06A1.65 1.65 0 0 0 4 4.94L4.9 6.5A1.65 1.65 0 0 1 4.4 8.06L3.12 9A1.65 1.65 0 0 0 2.25 10.5V13.5A1.65 1.65 0 0 0 3.12 15L4.4 15.94A1.65 1.65 0 0 1 4.9 17.5L4 19.06A1.65 1.65 0 0 0 4.56 20.94L7.44 22.06A1.65 1.65 0 0 0 9 21.25L10.5 20.16A1.65 1.65 0 0 1 12 20.16L13.5 21.25A1.65 1.65 0 0 0 15.06 22.06L17.94 20.94A1.65 1.65 0 0 0 18.5 19.06L17.6 17.5A1.65 1.65 0 0 1 18.12 15.94L19.4 15Z"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)
