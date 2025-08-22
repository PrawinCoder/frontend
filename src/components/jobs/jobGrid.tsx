"use client"

import { useState, useEffect } from "react"
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

function transformApiJobToCardProps(apiJob: ExternalApiJob): JobCardProps {
  // Calculate time ago from created_at
  const timeAgo = calculateTimeAgo(apiJob.created_at)

  // Format salary range
  const salary = `${(apiJob.salary_max / 100000).toFixed(1)}LPA`

  // Split job description into bullet points (assuming it's a string)
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
    companyLogo: undefined, // API doesn't provide logo, will use first letter
    experience: "1-3 yr Exp", // Default as API doesn't provide this
    workType: apiJob.job_type || "Onsite",
    salary: salary,
    description: description,
    timeAgo: timeAgo,
    onApply: () => {
      console.log(`Applied to ${apiJob.title} at ${apiJob.company}`)
      // TODO: Implement apply functionality
    },
  }
}

// Helper function to calculate time ago
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



export default function JobGrid() {
  // State management for API data
  const [jobs, setJobs] = useState<JobCardProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError(null)
        setUsingFallback(false)

        console.log(" Fetching jobs from local API proxy...")

        const response = await fetch("/api/jobs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })

        console.log(" Response status:", response.status)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiResponse: ExternalApiResponse = await response.json()
        console.log(" API Response:", apiResponse)

        if (!apiResponse || !apiResponse.data || !Array.isArray(apiResponse.data)) {
          throw new Error("Invalid response format from API")
        }

        // Transform API data to JobCard props
        const transformedJobs = apiResponse.data.map(transformApiJobToCardProps)
        setJobs(transformedJobs)

        console.log(" Successfully loaded", transformedJobs.length, "jobs from API")
        console.log(" Total jobs available:", apiResponse.total)
      } catch (err) {
        console.error(" Error fetching jobs:", err)

        console.log(" Using fallback mock data due to API error")

        setUsingFallback(true)
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Loading state
  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Center>
          <Loader size="lg" />
        </Center>
      </Container>
    )
  }

  // Error state
  if (error && jobs.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    )
  }

  // Empty state
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

  // Render job grid
  return (
    <Container size="xl" py="xl">
      {usingFallback && (
        <Alert icon={<IconAlertCircle size="1rem" />} title="Notice" color="yellow" mb="lg">
          Using demo data - API temporarily unavailable
        </Alert>
      )}
      <Grid gutter="lg">
        {jobs.map((job, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <JobCard {...job} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  )
}
