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
      label: "Name2_AUTO_UPDATE_TEST_SUCCESS",
    },
  ],
  actions: [reverseNameAction],
};
