import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (pin: string) => boolean;
}

export const EditModeDialog = ({ open, onOpenChange, onVerify }: EditModeDialogProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = onVerify(pin);
    if (isValid) {
      setPin("");
      setError("");
      onOpenChange(false);
    } else {
      setError("Incorrect PIN");
      setPin("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Caregiver PIN</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="pin">4-Digit PIN</Label>
            <Input
              id="pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter PIN"
              className="text-2xl text-center tracking-widest"
              autoFocus
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={pin.length !== 4}>
              Unlock
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
