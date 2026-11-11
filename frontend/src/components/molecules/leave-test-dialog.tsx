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
};

export function LeaveTestDialog({ open, onStay, onLeave }: LeaveTestDialogProperties) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onStay()}>
      <AlertDialogContent>
        <AlertDialogTitle>Leave this test?</AlertDialogTitle>
        <AlertDialogDescription>
          Your answers so far are saved. You can pick up where you left off.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onLeave}>Leave test</AlertDialogAction>
          <AlertDialogCancel>Stay</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
