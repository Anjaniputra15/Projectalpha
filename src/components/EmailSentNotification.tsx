
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface EmailSentNotificationProps {
  onBack: () => void;
  title?: string;
  description?: string;
}

export default function EmailSentNotification({ 
  onBack, 
  title = "Check your email",
  description = "We sent you a verification link. Please check your email to verify your account."
}: EmailSentNotificationProps) {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="w-full max-w-md p-8 glass-panel animate-in">
        <div className="text-center space-y-4">
          <div className="bg-purple-600/20 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center">
            <Mail className="h-10 w-10 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-400">
            {description}
          </p>
          <Button
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 rounded-full"
            onClick={onBack}
          >
            Back to login
          </Button>
        </div>
      </div>
    </div>
  );
}
