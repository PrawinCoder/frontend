import { Box, Container, Group, Text, Anchor, Stack, Divider } from "@mantine/core"

export function Footer() {
  return (
    <Box bg="gray.1" py="xl" mt="auto">
      <Container size="xl">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            {/* Left: Company Info */}
            <Stack gap="xs">
              <Text size="lg" fw={600} c="dark">
                JobBoard
              </Text>
              <Text size="sm" c="dimmed">
                Find your dream job with ease
              </Text>
            </Stack>

            {/* Right: Links */}
            <Group gap="xl">
              <Stack gap="xs">
                <Text size="sm" fw={500} c="dark">
                  Company
                </Text>
                <Stack gap={4}>
                  <Anchor href="#" size="sm" c="dimmed">
                    About Us
                  </Anchor>
                  <Anchor href="#" size="sm" c="dimmed">
                    Careers
                  </Anchor>
                  <Anchor href="#" size="sm" c="dimmed">
                    Contact
                  </Anchor>
                </Stack>
              </Stack>

              <Stack gap="xs">
                <Text size="sm" fw={500} c="dark">
                  Support
                </Text>
                <Stack gap={4}>
                  <Anchor href="#" size="sm" c="dimmed">
                    Help Center
                  </Anchor>
                  <Anchor href="#" size="sm" c="dimmed">
                    Privacy Policy
                  </Anchor>
                  <Anchor href="#" size="sm" c="dimmed">
                    Terms of Service
                  </Anchor>
                </Stack>
              </Stack>

              <Stack gap="xs">
                <Text size="sm" fw={500} c="dark">
                  For Employers
                </Text>
                <Stack gap={4}>
                  <Anchor href="#" size="sm" c="dimmed">
                    Post a Job
                  </Anchor>
                  <Anchor href="#" size="sm" c="dimmed">
                    Pricing
                  </Anchor>
                  <Anchor href="#" size="sm" c="dimmed">
                    Resources
                  </Anchor>
                </Stack>
              </Stack>
            </Group>
          </Group>

          <Divider />

          <Group justify="space-between" align="center">
            <Text size="sm" c="dimmed">
              © 2025 JobBoard. All rights reserved.
            </Text>
            <Group gap="md">
              <Anchor href="#" size="sm" c="dimmed">
                Privacy
              </Anchor>
              <Anchor href="#" size="sm" c="dimmed">
                Terms
              </Anchor>
              <Anchor href="#" size="sm" c="dimmed">
                Cookies
              </Anchor>
            </Group>
          </Group>
        </Stack>
      </Container>
    </Box>
  )
}
