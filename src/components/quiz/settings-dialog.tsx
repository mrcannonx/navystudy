import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Settings } from "./modules/settings/settings"
import { useQuizSettingsContext } from "@/contexts/quiz-settings-context"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const { settings, updateSettings } = useQuizSettingsContext()

  const handleSettingChange = (newSettings: Partial<typeof settings>) => {
    updateSettings({ ...settings, ...newSettings })
  }

  const handleSave = async () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Study Settings</DialogTitle>
          <DialogDescription>
            Customize your quiz study experience
          </DialogDescription>
        </DialogHeader>
        <Settings
          settings={settings}
          onSettingChange={handleSettingChange}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
