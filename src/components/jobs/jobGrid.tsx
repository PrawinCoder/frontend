"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { Grid, Container, Text, Loader, Center, Alert } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"
import JobCard, { JobCardProps } from "./jobCard"


interface ExternalApiResponse {
  data: ExternalApiJob[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface ExternalApiJob {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  salary_min: number
  salary_max: number
  description: string | null
  requirements: string | null
  responsibilities: string | null
  application_deadline: string | null
  created_at: string
}

interface SearchFilters {
  search?: string
  location?: string
  jobType?: string
  salaryRange?: [number, number]
}

export interface JobGridRef {
  refreshJobs: () => void
}

interface JobGridProps {
  filters?: SearchFilters
}

const JobGrid = forwardRef<JobGridRef, JobGridProps>(({ filters }, ref) => {
  const [jobs, setJobs] = useState<JobCardProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      setUsingFallback(false)

      console.log("[v0] Fetching jobs from local API proxy...")

      const queryParams = new URLSearchParams()
      if (filters?.search) queryParams.append("search", filters.search)
      if (filters?.location) queryParams.append("location", filters.location)
      if (filters?.jobType) queryParams.append("jobType", filters.jobType)
      if (filters?.salaryRange) {
        queryParams.append("salaryMin", (filters.salaryRange[0] * 100000).toString()) // Convert to actual salary
        queryParams.append("salaryMax", (filters.salaryRange[1] * 100000).toString())
      }

      const url = `/api/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
      console.log("[v0] Fetching with URL:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const apiResponse: ExternalApiResponse = await response.json()
      console.log("[v0] API Response:", apiResponse)

      if (!apiResponse || !apiResponse.data || !Array.isArray(apiResponse.data)) {
        throw new Error("Invalid response format from API")
      }

      const transformedJobs = apiResponse.data.map(transformApiJobToCardProps)
      setJobs(transformedJobs)

      console.log("[v0] Successfully loaded", transformedJobs.length, "jobs from API")
      console.log("[v0] Total jobs available:", apiResponse.total)
    } catch (err) {
      console.error("[v0] Error fetching jobs:", err)

      console.log("[v0] Using fallback mock data due to API error")
      setJobs(mockJobs)
      setUsingFallback(true)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    refreshJobs: fetchJobs,
  }))

  useEffect(() => {
    console.log("[v0] Filters changed, refetching jobs:", filters)
    fetchJobs()
  }, [filters])

  function transformApiJobToCardProps(apiJob: ExternalApiJob): JobCardProps {
    const timeAgo = calculateTimeAgo(apiJob.created_at)
    const salary = `${(apiJob.salary_max / 100000).toFixed(1)}LPA`
    const description = apiJob.description
      ? apiJob.description
          .split(".")
          .filter((item) => item.trim().length > 0)
          .slice(0, 2)
      : [
          "A user-friendly interface lets you browse stunning photos and videos",
          "Filter destinations based on interests and travel style, and create personalized",
        ]

    return {
      jobTitle: apiJob.title,
      companyName: apiJob.company,
      companyLogo: undefined,
      experience: "1-3 yr Exp",
      workType: apiJob.job_type || "Onsite",
      salary: salary,
      description: description,
      timeAgo: timeAgo,
      onApply: () => {
        console.log(`[v0] Applied to ${apiJob.title} at ${apiJob.company}`)
      },
    }
  }

  function calculateTimeAgo(dateString: string): string {
    const now = new Date()
    const jobDate = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h Ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d Ago`
    }
  }

  const mockJobs: JobCardProps[] = [
    {
      jobTitle: "Full Stack Developer",
      companyName: "Amazon",
      companyLogo: undefined,
      experience: "1-3 yr Exp",
      workType: "Onsite",
      salary: "12LPA",
      description: [
        "A user-friendly interface lets you browse stunning photos and videos",
        "Filter destinations based on interests and travel style, and create personalized",
      ],
      timeAgo: "24h Ago",
      onApply: () => console.log("[v0] Applied to Full Stack Developer at Amazon"),
    },
    {
      jobTitle: "Node Js Developer",
      companyName: "Tesla",
      companyLogo: undefined,
      experience: "1-3 yr Exp",
      workType: "Onsite",
      salary: "12LPA",
      description: [
        "A user-friendly interface lets you browse stunning photos and videos",
        "Filter destinations based on interests and travel style, and create personalized",
      ],
      timeAgo: "24h Ago",
      onApply: () => console.log("[v0] Applied to Node Js Developer at Tesla"),
    },
    {
      jobTitle: "UX/UI Designer",
      companyName: "Upwork",
      companyLogo: undefined,
      experience: "1-3 yr Exp",
      workType: "Onsite",
      salary: "12LPA",
      description: [
        "A user-friendly interface lets you browse stunning photos and videos",
        "Filter destinations based on interests and travel style, and create personalized",
      ],
      timeAgo: "24h Ago",
      onApply: () => console.log("[v0] Applied to UX/UI Designer at Upwork"),
    },
    {
      jobTitle: "Full Stack Developer",
      companyName: "Amazon",
      companyLogo: undefined,
      experience: "1-3 yr Exp",
      workType: "Onsite",
      salary: "12LPA",
      description: [
        "A user-friendly interface lets you browse stunning photos and videos",
        "Filter destinations based on interests and travel style, and create personalized",
      ],
      timeAgo: "24h Ago",
      onApply: () => console.log("[v0] Applied to Full Stack Developer at Amazon"),
    },
    {
      jobTitle: "Node Js Developer",
      companyName: "Tesla",
      companyLogo: undefined,
      experience: "1-3 yr Exp",
      workType: "Onsite",
      salary: "12LPA",
      description: [
        "A user-friendly interface lets you browse stunning photos and videos",
        "Filter destinations based on interests and travel style, and create personalized",
      ],
      timeAgo: "24h Ago",
      onApply: () => console.log("[v0] Applied to Node Js Developer at Tesla"),
    },
    {
      jobTitle: "UX/UI Designer",
      companyName: "Upwork",
      companyLogo: undefined,
      experience: "1-3 yr Exp",
      workType: "Onsite",
      salary: "12LPA",
      description: [
        "A user-friendly interface lets you browse stunning photos and videos",
        "Filter destinations based on interests and travel style, and create personalized",
      ],
      timeAgo: "24h Ago",
      onApply: () => console.log("[v0] Applied to UX/UI Designer at Upwork"),
    },
    {
      jobTitle: "Full Stack Developer",
      companyName: "Amazon",
      companyLogo: undefined,
      experience: "1-3 yr Exp",
      workType: "Onsite",
      salary: "12LPA",
      description: [
        "A user-friendly interface lets you browse stunning photos and videos",
        "Filter destinations based on interests and travel style, and create personalized",
      ],
      timeAgo: "24h Ago",
      onApply: () => console.log("[v0] Applied to Full Stack Developer at Amazon"),
    },
    {
      jobTitle: "Node Js Developer",
      companyName: "Tesla",
      companyLogo: undefined,
      experience: "1-3 yr Exp",
      workType: "Onsite",
      salary: "12LPA",
      description: [
        "A user-friendly interface lets you browse stunning photos and videos",
        "Filter destinations based on interests and travel style, and create personalized",
      ],
      timeAgo: "24h Ago",
      onApply: () => console.log("[v0] Applied to Node Js Developer at Tesla"),
    },
  ]

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Center>
          <Loader size="lg" />
        </Center>
      </Container>
    )
  }

  if (error && jobs.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    )
  }

  if (jobs.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Center>
          <Text size="lg" c="dimmed">
            No jobs available at the moment.
          </Text>
        </Center>
      </Container>
    )
  }

  return (
    <Container size="xl" py="xl">
      {usingFallback && (
        <Alert icon={<IconAlertCircle size="1rem" />} title="Notice" color="yellow" mb="lg">
          Using demo data - API temporarily unavailable
        </Alert>
      )}
      <Grid gutter="lg">
        {jobs.map((job, index) => (
          <Grid.Col key={`${job.companyName}-${job.jobTitle}-${index}`} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <JobCard {...job} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  )
})

JobGrid.displayName = "JobGrid"

export default JobGrid
