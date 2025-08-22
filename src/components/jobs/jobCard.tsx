"use client";

import { Card, Text, Button, Badge, Stack, Avatar, Box } from "@mantine/core";
import { User, Building2, Layers, } from "lucide-react";

export interface JobCardProps {
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  experience: string;
  workType: string;
  salary: string;
  description: string[];
  timeAgo: string;
  onApply: () => void;
}

export default function JobCard({
  jobTitle,
  companyName,
  companyLogo,
  experience,
  workType,
  salary,
  description,
  timeAgo,
  onApply,
}: JobCardProps) {
  const generateLogoUrl = (companyName: string) => {
    const domain =
      companyName
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "") + ".com";
    return `https://logo.clearbit.com/${domain}`;
  };

  const logoUrl = companyLogo || generateLogoUrl(companyName);

  return (
    <Card
      shadow="sm"
      radius="lg"
      withBorder
      style={{ backgroundColor: "#FFFFFF" , border: "1px solid ##D3D3D326" }}
      className=" border-y-1 border-gray-100 shadow rounded-xl w-full h-[360px] relative"
    >

      {/* Logo */}
      <Box className="absolute top-5 left-5">
        <Box className="w-18 h-18 bg-white border-y-1 border-gray-100 shadow rounded-xl flex items-center justify-center">
          <Avatar
            src={logoUrl}
            alt={companyName}
            size={58}
            radius="100%"
            className=""
          >
            {companyName.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
      </Box>

      {/* Time Badge */}
      <Box className="absolute top-5 right-5">
        <Badge
          variant="filled"
          size="md"
          radius="md"
          style={{ backgroundColor: "#B0D9FF", color: "black", fontWeight: 500, padding: '0.8rem 0.8rem' }}
        >
          {timeAgo}
        </Badge>
      </Box>
      <div className="w-full h-2 bg-gray-white"></div>
      <Stack gap="sm" className="h-full pt-20">
        {/* Title */}
        <Text fw={700} size="xl" style={{ color: "black", fontWeight: 600, }} className="px-5">
          {jobTitle}
        </Text>

        {/* Meta info */}
        {/* Add flex-nowrap here to keep the three items in one line */}
        <div className="flex flex-nowrap gap-6 items-center mb-2 text-gray-600 text-sm">

          {/* Add whitespace-nowrap here to keep icon and text together */}
          <div className="flex items-center gap-1 whitespace-nowrap">
            <User size={20} className="text-gray-500" />
            <Text size="12px" fw={500}>
              {experience}
            </Text>
          </div>

          {/* Add whitespace-nowrap here */}
          <div className="flex items-center gap-1 whitespace-nowrap">
            <Building2 size={20} className="text-gray-500" />
            <Text size="12px" fw={500}>
              {workType}
            </Text>
          </div>

          {/* Add whitespace-nowrap here */}
          <div className="flex items-center gap-1 whitespace-nowrap">
            <Layers size={20} className="text-gray-500" />
            <Text size="12px" fw={500}>
              {salary}
            </Text>
          </div>

        </div>

        {/* Description */}
        <Stack gap={2} className="flex-1 overflow-hidden">
          {description.slice(0, 2).map((item, index) => (
            <Text
              key={index}
              size="sm"
              style={{ color: "##555555", fontWeight: 500, lineHeight: 1.4, fontSize: '14px' }}
              className="text-gray-500 leading-snug line-clamp-2"
            >
              • {item}
            </Text>
          ))}
        </Stack>

        {/* Apply Button */}
        <Button
          fullWidth
          size="md"
          radius="md"
          style={{ backgroundColor: "#00AAFF", color: "white", fontWeight: 600, padding: '0.6rem 0.6rem' }}
          onClick={onApply}
        >
          Apply Now
        </Button>
      </Stack>
    </Card>
  );
}
