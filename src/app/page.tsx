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
      <Navbar onJobCreated={handleJobCreated} />

      <Box pt={120} bg="gray.0" mih="100vh">
        <Container size="xl" py="xl">
          <SearchFilters onFiltersChange={setFilters} />

          <JobGrid ref={jobGridRef} filters={filters} />
        </Container>
      </Box>

      <CreateJobModal opened={modalOpened} onClose={() => setModalOpened(false)} onJobCreated={handleJobCreated} />
    </>
  )
}
