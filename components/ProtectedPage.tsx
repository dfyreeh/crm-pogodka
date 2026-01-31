"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedPageProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function ProtectedPage({ allowedRoles, children }: ProtectedPageProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role || !allowedRoles.includes(role)) {
      router.replace("/dashboard/no-access");
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, [router, allowedRoles]);

  if (isAuthorized === null) return null;
  if (isAuthorized === false) return null;

  return <>{children}</>;
}
