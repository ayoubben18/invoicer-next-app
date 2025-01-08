"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Calendar, MapPin, Upload } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getTeam } from "@/services/database";

export default function TeamPage() {
  const [teamInfo, setTeamInfo] = useState({
    name: "Tech Haven",
    slogan: "Your One-Stop Electronics Shop",
    description:
      "At Tech Haven, we offer the latest and greatest in electronics, from cutting-edge gadgets to everyday tech essentials. Discover a world of innovation at unbeatable prices.",
    logoUrl:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "San Francisco, CA",
    foundedYear: "2018",
  });

  //this is not currently used
  const { data: team, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: () => getTeam(),
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamInfo((prev) => ({
          ...prev,
          logoUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card className="bg-card">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold">Team Profile</CardTitle>
            <Button
              variant={isEditing ? "destructive" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-[250px_1fr] gap-8">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-muted">
                <Image
                  src={teamInfo.logoUrl}
                  alt="Team Logo"
                  fill
                  className="object-cover"
                />
              </div>
              {isEditing && (
                <div className="space-y-2">
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer block w-full"
                  >
                    <div className="flex items-center justify-center gap-2 p-2 border-2 border-dashed rounded-lg hover:bg-accent">
                      <Upload className="h-4 w-4" />
                      <span>Change Logo</span>
                    </div>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Team Name</label>
                {isEditing ? (
                  <Input
                    value={teamInfo.name}
                    onChange={(e) =>
                      setTeamInfo((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter team name"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-2xl font-semibold">
                    <Building2 className="h-6 w-6" />
                    {teamInfo.name}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  {isEditing ? (
                    <Input
                      value={teamInfo.location}
                      onChange={(e) =>
                        setTeamInfo((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="Enter location"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {teamInfo.location}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Founded</label>
                  {isEditing ? (
                    <Input
                      value={teamInfo.foundedYear}
                      onChange={(e) =>
                        setTeamInfo((prev) => ({
                          ...prev,
                          foundedYear: e.target.value,
                        }))
                      }
                      placeholder="Enter founding year"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Since {teamInfo.foundedYear}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Team Slogan</label>
                {isEditing ? (
                  <Input
                    value={teamInfo.slogan}
                    onChange={(e) =>
                      setTeamInfo((prev) => ({
                        ...prev,
                        slogan: e.target.value,
                      }))
                    }
                    placeholder="Enter team slogan"
                  />
                ) : (
                  <p className="text-lg italic text-muted-foreground">
                    "{teamInfo.slogan}"
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                {isEditing ? (
                  <Textarea
                    value={teamInfo.description}
                    onChange={(e) =>
                      setTeamInfo((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter team description"
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {teamInfo.description}
                  </p>
                )}
              </div>

              {isEditing && (
                <Button className="w-full" onClick={() => setIsEditing(false)}>
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
