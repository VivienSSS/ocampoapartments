import Pocketbase from "pocketbase";
import type { TypedPocketBase } from "./types";

export const pb = new Pocketbase("/") as TypedPocketBase;
