import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import cashfree from "@/lib/cashfree";
import { pool } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await request.json();

    console.log("orderId", orderId);

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // 1. Get transaction from DB
    const txRes = await pool.query(
      "SELECT * FROM transactions WHERE order_id = $1",
      [orderId]
    );

    if (txRes.rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const transaction = txRes.rows[0];

    if (transaction.status === "PAID") {
      return NextResponse.json({ status: "PAID" });
    }

    // 2. Fetch Order Status from Cashfree
    // const response = await cashfree.PGFetchOrder("2023-08-01", orderId);
    const orderData = await cashfree
      .PGFetchOrder(orderId)
      .then((response) => {
        console.log("Order fetched successfully:", response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Error:", error.response.data.message);
        return null;
      });

    if (!orderData) {
      return NextResponse.json(
        { error: "Order data not found" },
        { status: 404 }
      );
    }

    if (orderData.order_status === "PAID") {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        // Update transaction status
        await client.query(
          "UPDATE transactions SET status = 'PAID', updated_at = NOW() WHERE id = $1",
          [transaction.id]
        );

        // Update user credits
        // We need to fetch current credits first or just increment
        // Using increment logic is safer for concurrency, but we also have the `credits` column default
        await client.query(
          'UPDATE "user" SET credits = credits + $1 WHERE id = $2',
          [transaction.credits, transaction.user_id]
        );

        await client.query("COMMIT");
        return NextResponse.json({ status: "PAID" });
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    } else if (orderData.order_status === "FAILED") {
      await pool.query(
        "UPDATE transactions SET status = 'FAILED', updated_at = NOW() WHERE id = $1",
        [transaction.id]
      );
      return NextResponse.json({ status: "FAILED" });
    } else {
      return NextResponse.json({ status: orderData.order_status });
    }
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
