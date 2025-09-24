import { Flatfile } from "@flatfile/api";
import { reverseNameAction } from "../actions/reverse-name.action";

export const usersSheet: Flatfile.SheetConfig = {
  name: "Users",
  slug: "users",
  fields: [
    {
      key: "name",
      type: "string",
      label: "Name",
    },
    {
      key: "name2",
      type: "string",
      label: "Name2",
    },
  ],
  actions: [reverseNameAction],
};
