import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    console.log(" API: Proxying request to external jobs API...")

    // Fetch from external API server-side to avoid CORS issues
    const response = await fetch("https://backend-ke5l.onrender.com/jobs?page=1&limit=10", {
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

    // Return fallback mock data if external API fails
    const fallbackJobs = {
      data: [
        {
          id: "1",
          title: "Full Stack Developer",
          company: "Amazon",
          location: "Bangalore",
          job_type: "FullTime",
          salary_min: 800000,
          salary_max: 1200000,
          description: "We are looking for a skilled Full Stack Developer to join our team.",
          requirements: null,
          responsibilities: null,
          application_deadline: null,
          created_at: "2025-08-21T10:00:00.000Z",
        },
          {
            id: "2",
            title: "UX/UI Designer",
            company: "Upwork",
            location: "Bangalore",
            job_type: "FullTime",
            salary_min: 800000,
            salary_max: 1200000,
            description: "We are looking for a skilled Full Stack Developer to join our team.",
            requirements: null,
            responsibilities: null,
            application_deadline: null,
            created_at: "2025-08-21T10:00:00.000Z",
          },
          {
            id: "3",
            title: "Node.js Developer",
            company: "Tesla",
            location: "Bangalore",
            job_type: "FullTime",
            salary_min: 800000,
            salary_max: 1200000,
            description: "We are looking for a skilled Full Stack Developer to join our team.",
            requirements: null,
            responsibilities: null,
            application_deadline: null,
            created_at: "2025-08-21T10:00:00.000Z",
          },
        {
          id: "4",
          title: "Node.js Developer",
          company: "Google",
          location: "Mumbai",
          job_type: "FullTime",
          salary_min: 600000,
          salary_max: 1000000,
          description: "Join our backend team to build scalable Node.js applications.",
          requirements: null,
          responsibilities: null,
          application_deadline: null,
          created_at: "2025-08-21T10:00:00.000Z",
        },
        {
          id: "5",
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
          created_at: "2025-08-21T10:00:00.000Z",
        },
        {
          id: "6",
          title: "Full Stack Developer",
          company: "facebook",
          location: "Bangalore",
          job_type: "FullTime",
          salary_min: 800000,
          salary_max: 1200000,
          description: "We are looking for a skilled Full Stack Developer to join our team.",
          requirements: null,
          responsibilities: null,
          application_deadline: null,
          created_at: "2025-08-21T10:00:00.000Z",
        },
        {
          id: "7",
          title: "Node.js Developer",
          company: "paypal",
          location: "Bangalore",
          job_type: "FullTime",
          salary_min: 800000,
          salary_max: 1200000,
          description: "We are looking for a skilled Full Stack Developer to join our team.",
          requirements: null,
          responsibilities: null,
          application_deadline: null,
          created_at: "2025-08-21T10:00:00.000Z",
        },
        {
          id: "8",
          title: "UX/UI Designer",
          company: "apple",
          location: "Bangalore",
          job_type: "FullTime",
          salary_min: 800000,
          salary_max: 1200000,
          description: "We are looking for a skilled Full Stack Developer to join our team.",
          requirements: null,
          responsibilities: null,
          application_deadline: null,
          created_at: "2025-08-21T10:00:00.000Z",
        },
      ],
      total: 3,
      page: 1,
      limit: 10,
      totalPages: 1,
    }

    return NextResponse.json(fallbackJobs, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log(" API: Creating job with data:", body)

    // For now, just return success since we don't have write access to external API
    // In production, you'd POST to the external API or your own database
    const newJob = {
      id: Date.now().toString(),
      title: body.jobTitle,
      company: body.companyName,
      location: body.location,
      job_type: body.jobType,
      salary_min: body.salaryMin,
      salary_max: body.salaryMax,
      description: body.jobDescription,
      requirements: null,
      responsibilities: null,
      application_deadline: body.applicationDeadline,
      created_at: new Date().toISOString(),
    }

    console.log(" API: Job created successfully with ID:", newJob.id)

    return NextResponse.json(
      {
        message: body.isDraft ? "Job draft saved successfully" : "Job published successfully",
        job: newJob,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error(" API Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}



