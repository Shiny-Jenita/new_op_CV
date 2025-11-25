"use client"

import type React from "react"
import {
  Mail,
  Phone,
  Briefcase,
  MapPin,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ProfileData, ResumeData } from "./interface"

interface ProfileTabProps {
  profileData: ProfileData
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>
}

export default function ProfileTab({ profileData, setResumeData }: ProfileTabProps) {
  const toggleField = (field: keyof ProfileData["visible"]) => {
    setResumeData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        visible: {
          ...prev.profile.visible,
          name: true,
          [field]: !(prev.profile.visible?.[field] ?? false),
        },
      },
    }))
  }

  const toggleWebsite = (index: number) => {
    setResumeData((prev) => {
      const prevWebsitesVisible = [...(prev.profile.websitesVisible || [])]
      prevWebsitesVisible[index] = !prevWebsitesVisible[index]

      return {
        ...prev,
        profile: {
          ...prev.profile,
          websitesVisible: prevWebsitesVisible,
        },
      }
    })
  }

  const toggleAllWebsites = () => {
    const allVisible = profileData.websitesVisible?.every((v) => v) ?? false
    setResumeData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        websitesVisible: prev.profile.websites.map(() => !allVisible),
      },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <div className="space-y-4 p-4 border rounded-xl bg-gray-50 shadow-sm">
        <h2 className="text-md font-semibold text-gray-900">Contact Information</h2>

        {/* Name - always visible */}
        <div className="flex items-center gap-3">
          <span className="font-medium font-semibold text-gray-800">{profileData.name}</span>
        </div>

        {/* Email, Phone, Designation, Location */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="email"
              checked={profileData.visible?.email}
              onCheckedChange={() => toggleField("email")}
              className="mt-1"
              aria-label="Toggle Email Visibility"
            />
            <label
              htmlFor="email"
              title="Email"
              className={`flex items-center gap-2 text-sm ${
                !profileData.visible?.email ? "opacity-40 italic" : "text-gray-700"
              } transition-opacity duration-300`}
            >
              <Mail className="w-4 h-4 text-gray-500" />
              {profileData.email}
            </label>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="phone"
              checked={profileData.visible?.phone}
              onCheckedChange={() => toggleField("phone")}
              className="mt-1"
              aria-label="Toggle Phone Visibility"
            />
            <label
              htmlFor="phone"
              title="Phone"
              className={`flex items-center gap-2 text-sm ${
                !profileData.visible?.phone ? "opacity-40 italic" : "text-gray-700"
              } transition-opacity duration-300`}
            >
              <Phone className="w-4 h-4 text-gray-500" />
              {profileData.phone}
            </label>
          </div>

          {/* Designation */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="designation"
              checked={profileData.visible?.designation}
              onCheckedChange={() => toggleField("designation")}
              className="mt-1"
              aria-label="Toggle Designation Visibility"
            />
            <label
              htmlFor="designation"
              title="Designation"
              className={`flex items-center gap-2 text-sm ${
                !profileData.visible?.designation ? "opacity-40 italic" : "text-gray-700"
              } transition-opacity duration-300`}
            >
              <Briefcase className="w-4 h-4 text-gray-500" />
              {profileData.designation}
            </label>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="location"
              checked={profileData.visible?.location}
              onCheckedChange={() => toggleField("location")}
              className="mt-1"
              aria-label="Toggle Location Visibility"
            />
            <label
              htmlFor="location"
              title="Location"
              className={`flex items-center gap-2 text-sm ${
                !profileData.visible?.location ? "opacity-40 italic" : "text-gray-700"
              } transition-opacity duration-300`}
            >
              <MapPin className="w-4 h-4 text-gray-500" />
              {profileData.location}
            </label>
          </div>
        </div>
      </div>

      {/* Websites */}
      {profileData.websites?.some((w) => w.url) && (
        <div className="space-y-3 p-4 border rounded-xl bg-gray-50 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-md font-semibold text-gray-900">Websites</h2>
            <Button variant="outline" size="sm" onClick={toggleAllWebsites}>
              Toggle All
            </Button>
          </div>

          <div className="space-y-2">
            {profileData.websites.map((website, index) => {
              if (!website.url) return null
              return (
                <div key={index} className="flex items-start gap-3">
                  <Checkbox
                    id={`website-${index}`}
                    checked={profileData.websitesVisible?.[index] ?? false}
                    onCheckedChange={() => toggleWebsite(index)}
                    className="mt-1"
                    aria-label={`Toggle ${website.type} visibility`}
                  />
                  <label
                    htmlFor={`website-${index}`}
                    className={`text-sm ${
                      !profileData.websitesVisible?.[index] ? "opacity-40 italic" : "text-gray-700"
                    } transition-opacity duration-300`}
                  >
                    <span className="font-medium capitalize">{website.type}:</span>{" "}
                    <span className="text-blue-600 underline break-all inline-flex items-center gap-1">
                      {website.url}
                    </span>
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      {profileData.summary && (
        <div className="space-y-4 p-4 border rounded-xl bg-gray-50 shadow-sm">
          <h2 className="text-md font-semibold text-gray-900">Summary</h2>
          <div className="flex items-start gap-3">
            <Checkbox
              id="summary"
              checked={profileData.visible?.summary}
              onCheckedChange={() => toggleField("summary")}
              className="mt-1"
              aria-label="Toggle Summary Visibility"
            />
            <label
              htmlFor="summary"
              title="Professional Summary"
              className={`text-sm ${
                !profileData.visible?.summary ? "opacity-40 italic" : "text-gray-700"
              } transition-opacity duration-300`}
            >
              {profileData.summary}
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
