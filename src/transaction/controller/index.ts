import { Response, Request } from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import setlog from "../../utils/setlog";
import transactionDatas from "../data-access";
import transactionService from "../service";
import config from "../../../config.json"
import authDatas from "../../auth/data-access";

const PAYPAL_CLIENT_ID = config.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = config.PAYPAL_SECRET;
const PAYPAL_API = "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
  try {
    const { data } = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return data.access_token;
  } catch (err) {
    setlog("paypal", err);
    throw new Error("Failed to obtain PayPal access token");
  }
}

const transactionController = {
  createOrder: async (req: Request, res: Response) => {
    try {
      const { userId, amount } = req.body;
      const orderAmount = amount || "19.99";

      const orderData = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: orderAmount,
            },
            description: "Subscription Payment - $19.99/Year",
          },
        ]
      };

      const accessToken = await getAccessToken();
      const { data } = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, orderData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const approvalUrl = data.links.find((link: any) => link.rel === "approve")?.href;
      if (!approvalUrl) {
        return res.status(500).json({ message: "Failed to create PayPal order" });
      }

      return res.status(200).json({ orderID: data.id, approvalUrl });

    } catch (err) {
      setlog("request", err);
      return res.status(500).json({ message: err.message || "Internal error" });
    }
  },

  captureOrder: async (req: Request, res: Response) => {
    try {
      const { orderID, userId } = req.body;
      if (!orderID) {
        return res.status(400).json({ message: "orderID is required" });
      }

      const accessToken = await getAccessToken();
      const { data } = await axios.post(
        `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.status === "COMPLETED") {
        await transactionDatas.TransactionDB.create({
          id: uuidv4(),
          userId: userId,
          amount: data.purchase_units[0].payments.captures[0].amount.value,
          created: Date.now(),
        });
        await authDatas.AuthDB.update({ filter: { email: userId }, update: { subscription: Date.now() } });

        // Unlock full access for the user by calling your service
        const result = await transactionService.unlockFullAccess(userId);
        if (result) {
          return res.status(200).json({ message: "success" });
        }
        return res.status(302).json({ message: "failed to unlock" });
      } else {
        return res.status(400).json({ message: "Payment not completed" });
      }
    } catch (err) {
      setlog("request", err);
      return res.status(500).json({ message: err.message || "Internal error" });
    }
  },

  newTransaction: async (req: Request, res: Response) => {
    try {
      const { userId, amount } = req.body;
      const id = uuidv4();
      await transactionDatas.TransactionDB.create({
        id: id,
        userId: userId,
        amount: amount,
        created: Date.now(),
      });
      const result = await transactionService.unlockFullAccess(userId);
      if (result) {
        return res.status(200).json({ message: "success" });
      }
      return res.status(302).json({ message: "failed to unlock" });
    } catch (err) {
      setlog("request", err);
      return res.status(200).send({ message: err.message || "internal error" });
    }
  },
};

export default transactionController;
