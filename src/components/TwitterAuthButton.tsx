
import { Twitter } from "lucide-react";
import SocialAuthButton from "./SocialAuthButton";

export default function TwitterAuthButton() {
  return (
    <SocialAuthButton
      provider="twitter"
      label="Continue with Twitter"
      icon={<Twitter className="w-5 h-5 mr-2" />}
    />
  );
}
