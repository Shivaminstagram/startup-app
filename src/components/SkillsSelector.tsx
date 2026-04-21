import React from 'react'
import { X } from 'lucide-react'

interface SkillsSelectorProps {
  skills: string[]
  onChange: (skills: string[]) => void
  placeholder?: string
}

const PREDEFINED_SKILLS = [
  'AI/ML',
  'Web Development',
  'Mobile App',
  'Blockchain',
  'SaaS',
  'E-Commerce',
  'FinTech',
  'HealthTech',
  'EdTech',
  'UI/UX Design',
  'Data Science',
  'Cloud Infrastructure',
  'DevOps',
  'Product Management',
  'Growth Marketing',
  'Sales',
  'Business Development',
]

export const SkillsSelector: React.FC<SkillsSelectorProps> = ({
  skills,
  onChange,
  placeholder = 'Select skills or interests...',
}) => {
  const [inputValue, setInputValue] = React.useState('')
  const [showDropdown, setShowDropdown] = React.useState(false)

  const handleAddSkill = (skill: string) => {
    if (!skills.includes(skill) && skills.length < 8) {
      onChange([...skills, skill])
      setInputValue('')
      setShowDropdown(false)
    }
  }

  const handleRemoveSkill = (skill: string) => {
    onChange(skills.filter(s => s !== skill))
  }

  const filteredSkills = PREDEFINED_SKILLS.filter(
    skill =>
      skill.toLowerCase().includes(inputValue.toLowerCase()) &&
      !skills.includes(skill)
  )

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {showDropdown && filteredSkills.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {filteredSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => handleAddSkill(skill)}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 transition flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Skills */}
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <div
            key={skill}
            className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="hover:bg-blue-200 rounded-full p-0.5 transition"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {skills.length > 0 && (
        <p className="text-xs text-gray-500">
          {skills.length} of 8 skills selected
        </p>
      )}
    </div>
  )
}
