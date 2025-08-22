"use client"

import { Container, Box } from "@mantine/core"
import { useState, useRef } from "react"
import { SearchFilters } from "@/components/filters/searchFilters"
import { Navbar } from "@/components/navbar/navbar"
import CreateJobModal from "@/components/create/CreateJobModal"
import JobGrid, { JobGridRef } from "@/components/jobs/jobGrid"


export default function JobBoard() {
  const [modalOpened, setModalOpened] = useState(false)
  const [filters, setFilters] = useState<{
    search?: string
    location?: string
    jobType?: string
    salaryRange?: [number, number]
  }>({})

  const jobGridRef = useRef<JobGridRef>(null)

  const handleJobCreated = () => {
    console.log(" Job created, refreshing job list...")
    if (jobGridRef.current) {
      jobGridRef.current.refreshJobs()
    }
  }

  return (
    <>
      <header style={{ paddingTop: 120, paddingLeft: 20, paddingRight: 20, width: "100%", boxShadow: "0px 0px 14px 0px #C6BFBF60" }}>
        <Navbar onJobCreated={handleJobCreated} />
        <SearchFilters onFiltersChange={setFilters} />
      </header>

      <main style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20, maxWidth: 1400, margin: "0 auto" }}>


        <JobGrid ref={jobGridRef} filters={filters} />
      </main>

      <CreateJobModal opened={modalOpened} onClose={() => setModalOpened(false)} onJobCreated={handleJobCreated} />
    </>
  )
}
