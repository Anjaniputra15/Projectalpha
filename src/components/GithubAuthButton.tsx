
import { Github } from "lucide-react";
import SocialAuthButton from "./SocialAuthButton";

export default function GithubAuthButton() {
  return (
    <SocialAuthButton
      provider="github"
      label="Continue with GitHub"
      icon={<Github className="w-5 h-5 mr-2" />}
    />
  );
}
