import { writeFileSync } from "node:fs";
import { MongoClient } from "mongodb";

const BASE = "http://localhost:3000";
const EMAIL = "qa.paynow@onrent.test";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("OnRent");

const signup = await fetch(`${BASE}/api/auth/sign-up/email`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: BASE },
  body: JSON.stringify({
    email: EMAIL,
    password: "Preview123",
    name: "QA Paynow",
    role: "customer",
  }),
});
const signupBody = await signup.json();
const cookie = (signup.headers.get("set-cookie") || "").split(";")[0];

const equipment = await db
  .collection("equipment")
  .find({ status: "approved" })
  .limit(2)
  .toArray();

const bookings = [];

for (const [index, item] of equipment.entries()) {
  const inserted = await db.collection("bookings").insertOne({
    equipmentId: String(item._id),
    equipmentName: item.name,
    equipmentImage: item.image,
    ownerId: item.ownerId,
    ownerName: item.ownerName ?? "",
    customerId: signupBody.user.id,
    customerName: "QA Paynow",
    customerEmail: EMAIL,
    startDate: "2026-12-01",
    endDate: `2026-12-0${index + 2}`,
    quantity: 1,
    units: index + 2,
    rentalType: item.rentalType,
    unitPrice: item.price,
    totalPrice: item.price * (index + 2),
    phone: "01700000000",
    address: "QA test address, Dhaka",
    note: "Pay now placement QA",
    status: "approved",
    paymentStatus: "unpaid",
    createdAt: new Date(),
  });

  bookings.push(String(inserted.insertedId));
}

writeFileSync(
  "C:/Users/dell/AppData/Local/Temp/opencode/paynow-test.json",
  JSON.stringify(
    { userId: signupBody.user.id, email: EMAIL, cookie, bookings },
    null,
    2
  )
);

console.log("created", bookings);
await client.close();
