"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface ShareLinkDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when dialog wants to change its open state */
  onOpenChange: (open: boolean) => void;
  /** The URL to show and copy */
  shareLink: string;
}

const ShareLinkDialog: React.FC<ShareLinkDialogProps> = ({
  open,
  onOpenChange,
  shareLink,
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Resume</DialogTitle>
          <DialogDescription>
            Here is your shareable link. Click “Copy Link” to copy it:
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Input value={shareLink} readOnly />
        </div>

        <DialogFooter className="flex gap-2">
          <Button onClick={handleCopy} disabled={!shareLink} className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-2 px-3 text-xs rounded shadow">
            Copy Link
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="bg-red-600 text-white">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareLinkDialog;
