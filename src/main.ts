import lodash from "lodash";
import "./style/master.sass";

(function () {
  const x = lodash.defaults({ a: 1 }, { a: 3, b: 2 });
  console.log(x);
})();
