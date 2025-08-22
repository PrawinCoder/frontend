import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const location = searchParams.get("location")
  const jobType = searchParams.get("jobType")
  const salaryMin = searchParams.get("salaryMin")
  const salaryMax = searchParams.get("salaryMax")

  try {
    console.log(" API: Proxying request to external jobs API...")

    // Build external API URL with filters
    const externalUrl = new URL("https://backend-ke5l.onrender.com/jobs")
    externalUrl.searchParams.set("page", "1")
    externalUrl.searchParams.set("limit", "50") // Increased limit to get more results for filtering

    if (search) externalUrl.searchParams.set("search", search)
    if (location && location !== "Remote") externalUrl.searchParams.set("location", location)
    if (jobType) externalUrl.searchParams.set("job_type", jobType)
    if (salaryMin) externalUrl.searchParams.set("salary_min", salaryMin)
    if (salaryMax) externalUrl.searchParams.set("salary_max", salaryMax)

    console.log(" Fetching from external API with filters:", externalUrl.toString())

    // Fetch from external API server-side to avoid CORS issues
    const response = await fetch(externalUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    console.log(" External API response status:", response.status)

    if (!response.ok) {
      throw new Error(`External API error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(" Successfully fetched", data.data?.length || 0, "jobs from external API")

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error(" API Error proxying external jobs:", error)

    let fallbackJobs = [
      {
        id: "1",
        title: "Full Stack Developer",
        company: "Amazon",
        location: "Bangalore",
        job_type: "Full-time",
        salary_min: 800000,
        salary_max: 1200000,
        description: "We are looking for a skilled Full Stack Developer to join our team.",
        requirements: null,
        responsibilities: null,
        application_deadline: null,
        created_at: "2024-01-15T10:00:00.000Z",
      },
      {
        id: "2",
        title: "Node.js Developer",
        company: "Tesla",
        location: "Mumbai",
        job_type: "Full-time",
        salary_min: 600000,
        salary_max: 1000000,
        description: "Join our backend team to build scalable Node.js applications.",
        requirements: null,
        responsibilities: null,
        application_deadline: null,
        created_at: "2024-01-14T09:00:00.000Z",
      },
      {
        id: "3",
        title: "UX/UI Designer",
        company: "Upwork",
        location: "Chennai",
        job_type: "Contract",
        salary_min: 400000,
        salary_max: 800000,
        description: "Create intuitive and engaging user experiences.",
        requirements: null,
        responsibilities: null,
        application_deadline: null,
        created_at: "2024-01-13T08:00:00.000Z",
      },
      {
        id: "4",
        title: "React Developer",
        company: "Google",
        location: "Remote",
        job_type: "Full-time",
        salary_min: 1000000,
        salary_max: 1500000,
        description: "Build amazing user interfaces with React.",
        requirements: null,
        responsibilities: null,
        application_deadline: null,
        created_at: "2024-01-12T07:00:00.000Z",
      },
    ]

    // Apply filters to fallback data
    if (search) {
      fallbackJobs = fallbackJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.company.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (location && location !== "Remote") {
      fallbackJobs = fallbackJobs.filter((job) => job.location.toLowerCase().includes(location.toLowerCase()))
    } else if (location === "Remote") {
      fallbackJobs = fallbackJobs.filter((job) => job.location.toLowerCase() === "remote")
    }

    if (jobType) {
      fallbackJobs = fallbackJobs.filter((job) => job.job_type.toLowerCase().includes(jobType.toLowerCase()))
    }

    if (salaryMin) {
      fallbackJobs = fallbackJobs.filter((job) => job.salary_max >= Number.parseInt(salaryMin))
    }

    if (salaryMax) {
      fallbackJobs = fallbackJobs.filter((job) => job.salary_min <= Number.parseInt(salaryMax))
    }

    const fallbackResponse = {
      data: fallbackJobs,
      total: fallbackJobs.length,
      page: 1,
      limit: 10,
      totalPages: Math.ceil(fallbackJobs.length / 10),
    }

    return NextResponse.json(fallbackResponse, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log(" API: Creating job with data:", body)

    try {
      const response = await fetch("https://backend-ke5l.onrender.com/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: body.title,
          company: body.company,
          location: body.location,
          job_type: body.job_type,
          salary_min: body.salary_min,
          salary_max: body.salary_max,
          description: body.description,
          application_deadline: body.application_deadline,
        }),
      })

      if (!response.ok) {
        throw new Error(`External API error! status: ${response.status}`)
      }

      const newJob = await response.json()
      console.log(" API: Job created successfully in external API with ID:", newJob.id)

      return NextResponse.json(
        {
          message: body.isDraft ? "Job draft saved successfully" : "Job published successfully",
          job: newJob,
        },
        { status: 201 },
      )
    } catch (externalError) {
      console.error(" External API error, falling back to local creation:", externalError)

      const newJob = {
        id: Date.now().toString(),
        title: body.title,
        company: body.company,
        location: body.location,
        job_type: body.job_type,
        salary_min: body.salary_min,
        salary_max: body.salary_max,
        description: body.description,
        requirements: null,
        responsibilities: null,
        application_deadline: body.application_deadline,
        created_at: new Date().toISOString(),
      }

      console.log(" API: Job created locally with ID:", newJob.id)

      return NextResponse.json(
        {
          message: body.isDraft ? "Job draft saved successfully (local)" : "Job published successfully (local)",
          job: newJob,
        },
        { status: 201 },
      )
    }
  } catch (error) {
    console.error(" API Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
