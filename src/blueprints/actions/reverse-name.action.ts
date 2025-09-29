import { Flatfile } from "@flatfile/api";

export const reverseNameAction: Flatfile.Action = {
  operation: "reverseName",
  mode: Flatfile.ActionMode.Foreground,
  label: "Reverse Names",
  description: "Reverses the order of characters in the Name field for all records",
  confirm: true
};
