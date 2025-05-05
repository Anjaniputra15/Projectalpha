
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerificationCodeProps {
  onVerify: (code: string) => Promise<boolean>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function VerificationCode({ onVerify, onCancel, isLoading }: VerificationCodeProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter a valid verification code.",
      });
      return;
    }

    const success = await onVerify(verificationCode);
    if (!success) {
      setVerificationCode("");
    }
  };

  const handleResendCode = () => {
    setTimeLeft(60);
    setCanResend(false);
    toast({
      title: "Code resent",
      description: "A new verification code has been sent to your email.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="w-full max-w-md p-8 glass-panel animate-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-purple-600/20 rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-purple-400">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M8 11l3 3 5-5" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Two-Step Verification</h2>
          <p className="text-gray-400">
            Enter the 6-digit verification code sent to your email.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="flex justify-center">
              <Input
                type="text"
                placeholder="◯◯◯◯◯◯"
                className="bg-black/20 border-gray-700 focus:border-purple-500 rounded-full text-white placeholder:text-gray-500 text-center text-lg tracking-widest w-full max-w-xs"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length <= 6) {
                    setVerificationCode(value);
                  }
                }}
                maxLength={6}
                required
              />
            </div>
            
            <div className="text-sm text-center text-gray-400">
              {canResend ? (
                <button 
                  type="button" 
                  onClick={handleResendCode}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Resend code
                </button>
              ) : (
                <span>Resend code in {timeLeft}s</span>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 rounded-full py-6"
              disabled={isLoading || verificationCode.length < 6}
            >
              {isLoading ? (
                <>Verifying...</>
              ) : (
                <>
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Verify & Continue
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-gray-400 hover:text-white transition-colors duration-200"
              onClick={onCancel}
            >
              Back to Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
