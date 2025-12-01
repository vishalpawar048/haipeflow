import { Cashfree, CFEnvironment } from "cashfree-pg";

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_CLIENT_ID as string,
  process.env.CASHFREE_CLIENT_SECRET as string
);
export default cashfree;
