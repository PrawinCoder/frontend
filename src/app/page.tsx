// app/page.tsx
"use client";

import { SearchFilters } from "@/components/filters/searchFilters";
import JobGrid from "@/components/jobs/jobGrid";
import { Navbar } from "@/components/navbar/navbar";
export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "white" }}>
      { /* Navbar component for navigation */}

      <header style={{ paddingTop: 120, paddingLeft: 20, paddingRight: 20, width: "100%", boxShadow: "0px 0px 14px 0px #C6BFBF60" }}>
        <Navbar />
        <SearchFilters />
        <div style={{ height: 20 }} />
      </header>
      <main style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20, maxWidth: 1400, margin: "0 auto" }}>
        <JobGrid />
      </main>
    </div>
  );
}

