import React from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { ProfileCard } from "../../components/profile/ProfileCard.tsx";
import { SecuritySettings } from "../../components/profile/SecuritySettings.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card.tsx";
import { Breadcrumb } from "../../components/layout/Breadcrumb.tsx";

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Core Menu", "My Corporate Profile"]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ProfileCard user={user} />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Security & Password Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <SecuritySettings />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
