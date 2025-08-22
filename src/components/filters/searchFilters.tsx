"use client"

import { TextInput, Select, RangeSlider } from "@mantine/core"
import { useState, useEffect } from "react"
import { Search, MapPin, Users, ChevronDown } from "lucide-react"

interface SearchFiltersProps {
  onFiltersChange?: (filters: {
    search?: string
    location?: string
    jobType?: string
    salaryRange?: [number, number]
  }) => void
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState<string | null>(null)
  const [jobType, setJobType] = useState<string | null>(null)
  const [salary, setSalary] = useState<[number, number]>([50, 80])

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({
        search: search || undefined,
        location: location || undefined,
        jobType: jobType || undefined,
        salaryRange: salary,
      })
    }
  }, [search, location, jobType, salary, onFiltersChange])

  return (
    <div className="w-full bg-white px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        <div className="w-full lg:flex-1">
          <TextInput
            placeholder="Search By Job Title, Role"
            variant="unstyled"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            leftSection={<Search size={18} className="text-gray-500" />}
            classNames={{
              input:
                "text-sm text-gray-700 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all",
            }}
          />
        </div>

        <div className="hidden lg:block w-px h-8 bg-gray-200"></div>

        <div className="w-full lg:flex-1">
          <Select
            placeholder="Preferred Location"
            variant="unstyled"
            value={location}
            onChange={setLocation}
            leftSection={<MapPin size={18} className="text-gray-500" />}
            rightSection={<ChevronDown size={16} className="text-gray-400" />}
            classNames={{
              input:
                "text-sm text-gray-700 pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all cursor-pointer",
            }}
            data={["Remote", "Bangalore", "Hyderabad", "Mumbai", "Delhi", "Chennai", "Pune"]}
            clearable
          />
        </div>

        <div className="hidden lg:block w-px h-8 bg-gray-200"></div>

        <div className="w-full lg:flex-1">
          <Select
            placeholder="Job type"
            variant="unstyled"
            value={jobType}
            onChange={setJobType}
            leftSection={<Users size={18} className="text-gray-500" />}
            rightSection={<ChevronDown size={16} className="text-gray-400" />}
            classNames={{
              input:
                "text-sm text-gray-700 pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all cursor-pointer",
            }}
            data={["Full-time", "Part-time", "Contract", "Internship"]}
            clearable
          />
        </div>

        <div className="hidden lg:block w-px h-8 bg-gray-200"></div>

        <div className="w-full lg:flex-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Salary Per Month</span>
              <span className="text-sm font-medium text-gray-800">
                ₹{salary[0]}k - ₹{salary[1]}k
              </span>
            </div>
            <div className="px-2">
              <RangeSlider
                value={salary}
                onChange={setSalary}
                min={10}
                max={200}
                step={10}
                size={2}
                color="black"
                thumbSize={14}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
