import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { defineBackend } from "@aws-amplify/backend";

defineBackend({
  auth,
  data,
  storage,
});
