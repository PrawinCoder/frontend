"use client"

import { Modal, TextInput, Textarea, Select, Button, Group, Stack, Text } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { useForm, type SubmitHandler, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronsDown, ChevronsRight } from "lucide-react"
import * as z from "zod"

const jobSchema = z
  .object({
    title: z.string().min(1, "Job Title is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().min(1, "Location is required"),
    job_type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
    salary_min: z.number().min(0, "Minimum salary must be positive").optional(),
    salary_max: z.number().min(0, "Maximum salary must be positive").optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    requirements: z.string().min(1, "Requirements are required"),
    responsibilities: z.string().min(1, "Responsibilities are required"),
    application_deadline: z.union([z.date(), z.string()]).optional(),
  })
  .refine(
    (data) => {
      if (data.salary_min && data.salary_max) {
        return data.salary_max >= data.salary_min
      }
      return true
    },
    {
      message: "Maximum salary must be greater than minimum salary",
      path: ["salary_max"],
    },
  )

type FormValues = z.infer<typeof jobSchema>

export default function CreateJobModal({
  opened,
  onClose,
  onJobCreated,
}: {
  opened: boolean
  onClose: () => void
  onJobCreated?: () => void
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      job_type: "Full-time",
      salary_min: undefined,
      salary_max: undefined,
      description: "",
      requirements: "",
      responsibilities: "",
      application_deadline: undefined,
    },
  })

  const submitJob = async (data: FormValues, isDraft = false) => {
    const payload = {
      title: data.title,
      company: data.company,
      location: data.location,
      job_type: data.job_type,
      salary_min: data.salary_min,
      salary_max: data.salary_max,
      description: data.description,
      requirements: data.requirements,
      responsibilities: data.responsibilities,
      application_deadline: data.application_deadline
        ? data.application_deadline instanceof Date
          ? data.application_deadline.toISOString().split("T")[0]
          : data.application_deadline
        : null,
      isDraft: isDraft,
    }

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to create job")

      const result = await res.json()
      console.log("Job created successfully:", result.message)
      reset()
      onClose()
      if (onJobCreated) {
        onJobCreated()
      }
    } catch (err) {
      console.error("Error creating job:", err)
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await submitJob(data, false)
  }

  const handleSaveDraft = async () => {
    const isValid = await handleSubmit(async (data) => {
      await submitJob(data, true)
    })()
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="xl" fw={600} ta="center" w="100%">
          Create Job Opening
        </Text>
      }
      size="lg"
      centered
      styles={{
        title: { width: "100%", textAlign: "center" },
        header: { justifyContent: "center", paddingBottom: "1rem" },
        body: {
          padding: "0 1.5rem 1.5rem 1.5rem",
          maxHeight: "70vh",
          overflowY: "auto",
        },
        content: {
          borderRadius: "20px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="lg">
          <Group grow>
            <Stack gap="xs">
              <Text size="sm" fw={500} c="gray.7">
                Job Title
              </Text>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextInput {...field} placeholder="Full Stack Developer" error={errors.title?.message} size="md" radius={"md"}/>
                )}
              />
            </Stack>
            <Stack gap="xs">
              <Text size="sm" fw={500} c="gray.7">
                Company Name
              </Text>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    placeholder="Amazon, Microsoft, Swiggy"
                    error={errors.company?.message}
                    size="md"
                    radius={"md"}
                  />
                )}
              />
            </Stack>
          </Group>

          <Group grow>
            <Stack gap="xs">
              <Text size="sm" fw={500} c="gray.7">
                Location
              </Text>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Choose Preferred Location"
                    data={[
                      { value: "Remote", label: "Remote" },
                      { value: "Bangalore", label: "Bangalore" },
                      { value: "Mumbai", label: "Mumbai" },
                      { value: "Delhi", label: "Delhi" },
                      { value: "Chennai", label: "Chennai" },
                      { value: "Hyderabad", label: "Hyderabad" },
                    ]}
                    error={errors.location?.message}
                    size="md"
                    radius={"md"}
                  />
                )}
              />
            </Stack>
            <Stack gap="xs">
              <Text size="sm" fw={500} c="gray.7">
                Job Type
              </Text>
              <Controller
                name="job_type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="FullTime"
                    data={[
                      { value: "Full-time", label: "Full-time" },
                      { value: "Part-time", label: "Part-time" },
                      { value: "Contract", label: "Contract" },
                      { value: "Internship", label: "Internship" },
                    ]}
                    error={errors.job_type?.message}
                    size="md"
                    radius={"md"}
                  />
                )}
              />
            </Stack>
          </Group>

          <Group grow>
            <Stack gap="xs">
              <Text size="sm" fw={500} c="gray.7">
                Salary Range
              </Text>
              <Group gap="sm" grow>
                <Controller
                  name="salary_min"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      value={field.value?.toString() || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "")
                        field.onChange(value ? Number.parseInt(value) : undefined)
                      }}
                      placeholder="0"
                      leftSection="₹"
                      error={errors.salary_min?.message}
                      size="md"
                      radius={"md"}
                    />
                  )}
                />
                <Controller
                  name="salary_max"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      value={field.value?.toString() || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "")
                        field.onChange(value ? Number.parseInt(value) : undefined)
                      }}
                      placeholder="12,00,000"
                      leftSection="₹"
                      error={errors.salary_max?.message}
                      size="md"
                      radius={"md"}
                    />
                  )}
                />
              </Group>
            </Stack>
            <Stack gap="xs">
              <Text size="sm" fw={500} c="gray.7">
                Application Deadline
              </Text>
              <Controller
                name="application_deadline"
                control={control}
                render={({ field }) => (
                  <DateInput
                    {...field}
                    placeholder="Pick date"
                    valueFormat="YYYY-MM-DD"
                    error={errors.application_deadline?.message}
                    size="md"
                    radius={"md"}
                  />
                )}
              />
            </Stack>
          </Group>

          <Stack gap="xs">
            <Text size="sm" fw={500} c="gray.7">
              Job Description
            </Text>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Please share a description to let the candidate know more about the job role"
                  minRows={4}
                  error={errors.description?.message}
                  size="md"
                  radius={"md"}
                />
              )}
            />
          </Stack>

          <Stack gap="xs">
            <Text size="sm" fw={500} c="gray.7">
              Requirements
            </Text>
            <Controller
              name="requirements"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="html, css, javascript, react"
                  minRows={3}
                  error={errors.requirements?.message}
                  size="md"
                  radius={"md"}
                />
              )}
            />
          </Stack>

          <Stack gap="xs">
            <Text size="sm" fw={500} c="gray.7">
              Responsibilities
            </Text>
            <Controller
              name="responsibilities"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="team leader, code review, mentoring"
                  minRows={3}
                  error={errors.responsibilities?.message}
                  size="md"
                  radius={"md"}
                />
              )}
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Button
              variant="outline"
              color="black"
              size="md"
              px="xl"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              styles={{
                root: {
                  borderRadius: "12px",
                },
              }}
              rightSection={<ChevronsDown size={16} />}
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              size="md"
              px="xl"
              disabled={isSubmitting}
              styles={{
                root: {
                  backgroundColor: "#00AAFF",
                  borderRadius: "12px",
                },
              }}
              rightSection={<ChevronsRight size={16} />}
            >
              Publish
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
