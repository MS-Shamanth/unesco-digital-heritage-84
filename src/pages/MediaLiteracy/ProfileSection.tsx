import { ArrowLeft, User, Edit, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const ProfileSection = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    joinDate: "January 2024"
  });
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast({
      title: "Profile Updated!",
      description: "Your profile changes have been saved successfully.",
    });
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button onClick={() => setLocation('/dashboard')} variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-inter font-bold text-xl text-[#2D3A8C]">Profile</h1>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-[#2D3A8C] hover:bg-[#252F75] text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
      </div>

      <main className="p-6 space-y-6">
        {/* Profile Header */}
        <Card className="bg-white shadow-sm rounded-[20px] border border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-[#2D3A8C] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            {isEditing ? (
              <Input
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                className="text-center text-2xl font-bold mb-2 border-0 bg-gray-50"
              />
            ) : (
              <h2 className="font-inter font-bold text-2xl text-gray-900 mb-2">
                {profile.name}
              </h2>
            )}
            <p className="text-gray-600">
              Media Literacy Enthusiast
            </p>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="bg-white shadow-sm rounded-[20px] border border-gray-200">
          <CardContent className="p-6 space-y-6">
            <h3 className="font-inter font-semibold text-lg text-gray-900 mb-4">
              Personal Information
            </h3>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-gray-600">{profile.email}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-gray-600">{profile.phone}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Location</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-gray-600">{profile.location}</p>
                )}
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-gray-600">{profile.joinDate}</p>
              </div>
            </div>

            {/* Action Buttons for Edit Mode */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSave}
                  className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60] text-white"
                >
                  Save Changes
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};