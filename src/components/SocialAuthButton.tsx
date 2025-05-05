
import { Button } from "@/components/ui/button";
//import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { LucideIcon } from "lucide-react";

type Provider = 'google' | 'github' | 'twitter';

interface SocialAuthButtonProps {
  provider: Provider;
  icon: LucideIcon | React.ReactNode;
  label: string;
  className?: string;
}

export default function SocialAuthButton({ 
  provider, 
  icon, 
  label, 
  className 
}: SocialAuthButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full border-gray-700 hover:bg-gray-800 text-white ${className || ''}`}
      onClick={handleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        `Connecting to ${provider}...`
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </Button>
  );
}
