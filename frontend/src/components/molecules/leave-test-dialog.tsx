import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/atoms/alert-dialog";

type LeaveTestDialogProperties = {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
  title?: string;
  description?: string;
  leaveLabel?: string;
};

export function LeaveTestDialog({
  open,
  onStay,
  onLeave,
  title = "Leave this test?",
  description = "Your answers so far are saved. You can pick up where you left off.",
  leaveLabel = "Leave test",
}: LeaveTestDialogProperties) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onStay()}>
      <AlertDialogContent>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onLeave}>{leaveLabel}</AlertDialogAction>
          <AlertDialogCancel>Stay</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
