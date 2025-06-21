import { ListChecksIcon } from "lucide-react"

import { ComponentPickerOption } from "@/components/ui/editor/plugins/picker/component-picker-option"
import { InsertPollDialog } from "@/components/ui/editor/plugins/poll-plugin"

export function PollPickerPlugin() {
  return new ComponentPickerOption("Poll", {
    icon: <ListChecksIcon className="size-4" />,
    keywords: ["poll", "vote"],
    onSelect: (_, editor, showModal) =>
      showModal("Insert Poll", (onClose) => (
        <InsertPollDialog activeEditor={editor} onClose={onClose} />
      )),
  })
}
