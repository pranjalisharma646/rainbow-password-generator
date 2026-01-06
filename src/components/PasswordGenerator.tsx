import { useState, useCallback } from "react";
import { Copy, RefreshCw, Check, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import GlassCard from "./GlassCard";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = "";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!charset) {
      toast.error("Please select at least one character type");
      return;
    }

    let newPassword = "";
    const array = new Uint32Array(length[0]);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length[0]; i++) {
      newPassword += charset[array[i] % charset.length];
    }

    setPassword(newPassword);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const copyToClipboard = async () => {
    if (!password) {
      toast.error("Generate a password first");
      return;
    }
    
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password copied to clipboard!");
    
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    if (!password) return { label: "None", color: "text-muted-foreground", icon: Shield, percentage: 0 };
    
    let score = 0;
    if (password.length >= 12) score += 25;
    if (password.length >= 16) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;

    if (score < 40) return { label: "Weak", color: "text-rainbow-red", icon: ShieldAlert, percentage: 25 };
    if (score < 70) return { label: "Medium", color: "text-rainbow-yellow", icon: Shield, percentage: 50 };
    if (score < 90) return { label: "Strong", color: "text-rainbow-green", icon: ShieldCheck, percentage: 75 };
    return { label: "Very Strong", color: "text-rainbow-green", icon: ShieldCheck, percentage: 100 };
  };

  const strength = getStrength();
  const StrengthIcon = strength.icon;

  return (
    <GlassCard className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold rainbow-text mb-2">Password Generator</h2>
          <p className="text-foreground/70 text-sm">Create secure, random passwords</p>
        </div>

        {/* Password Display */}
        <div className="relative">
          <div className="rainbow-border rounded-xl">
            <div className="bg-background/80 backdrop-blur rounded-xl p-4 min-h-[60px] flex items-center justify-between gap-3">
              <span className="font-mono text-lg break-all flex-1 text-foreground">
                {password || "Click generate to create password"}
              </span>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="hover:bg-primary/20 text-foreground"
                >
                  {copied ? <Check className="h-5 w-5 text-rainbow-green" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/70">Password Strength</span>
              <span className={`flex items-center gap-1 font-medium ${strength.color}`}>
                <StrengthIcon className="h-4 w-4" />
                {strength.label}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500 rounded-full"
                style={{ 
                  width: `${strength.percentage}%`,
                  background: strength.percentage < 40 
                    ? 'hsl(var(--rainbow-red))' 
                    : strength.percentage < 70 
                    ? 'hsl(var(--rainbow-yellow))'
                    : 'hsl(var(--rainbow-green))'
                }}
              />
            </div>
          </div>
        )}

        {/* Length Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-foreground">Password Length</Label>
            <span className="text-lg font-bold rainbow-text">{length[0]}</span>
          </div>
          <Slider
            value={length}
            onValueChange={setLength}
            min={8}
            max={64}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>8</span>
            <span>64</span>
          </div>
        </div>

        {/* Character Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="uppercase"
              checked={includeUppercase}
              onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
            />
            <Label htmlFor="uppercase" className="text-sm cursor-pointer text-foreground">
              Uppercase (A-Z)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lowercase"
              checked={includeLowercase}
              onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
            />
            <Label htmlFor="lowercase" className="text-sm cursor-pointer text-foreground">
              Lowercase (a-z)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="numbers"
              checked={includeNumbers}
              onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
            />
            <Label htmlFor="numbers" className="text-sm cursor-pointer text-foreground">
              Numbers (0-9)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="symbols"
              checked={includeSymbols}
              onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
            />
            <Label htmlFor="symbols" className="text-sm cursor-pointer text-foreground">
              Symbols (!@#$)
            </Label>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generatePassword}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-rainbow-violet via-rainbow-blue to-rainbow-green hover:opacity-90 transition-opacity text-primary-foreground"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Generate Password
        </Button>
      </div>
    </GlassCard>
  );
};

export default PasswordGenerator;
