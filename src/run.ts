import browserslist from "../node_modules/browserslist/index";
import Obsolete from "./obsolete";

const lst = browserslist();
new Obsolete().test(lst);