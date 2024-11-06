import dayjs from "dayjs";
import { atomWithDefault } from "jotai/utils";

const today = () => dayjs().locale("ko").format("YYYY-MM-DD");

const pickedDateAtom = atomWithDefault<string | null>(today);

export default pickedDateAtom;
