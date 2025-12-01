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

    const { amount, credits, planId } = await request.json();

    if (!amount || !credits) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const customerId = session.user.id; // Ensure valid characters, Cashfree might have restrictions
    // Cashfree customer_id usually alphanumeric, underscores, hyphens. UUID is fine.

    const requestData = {
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_name: session.user.name || "User",
        customer_email: session.user.email || "user@example.com",
        customer_phone: "9999999999", // Required by Cashfree, maybe use dummy if not available
      },
      order_meta: {
        return_url: `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/payment/status?order_id={order_id}`,
      },
      order_id: orderId,
    };

    const response = await cashfree.PGCreateOrder(requestData);
    const data = response.data;

    // Save to DB
    await pool.query(
      `INSERT INTO transactions 
       (user_id, order_id, payment_session_id, amount, credits, status) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        session.user.id,
        data.order_id,
        data.payment_session_id,
        amount,
        credits,
        "PENDING",
      ]
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
