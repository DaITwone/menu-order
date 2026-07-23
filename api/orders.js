import { prisma } from "../lib/prisma.js";

function toOrder(invoice) {
  return {
    id: invoice.id,
    code: invoice.code,
    createdAt: invoice.createdAt.toLocaleString("vi-VN"),
    note: invoice.note,
    items: invoice.items,
    total: invoice.total,
  };
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method === "GET") {
      const invoices = await prisma.invoice.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(invoices.map(toOrder));
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const { note = "", items, total } = body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Đơn hàng phải có sản phẩm." });
      }

      const numericTotal = Number(total);
      if (!Number.isSafeInteger(numericTotal) || numericTotal < 0) {
        return res.status(400).json({ error: "Tổng tiền không hợp lệ." });
      }

      const invoice = await prisma.invoice.create({
        data: {
          code: `HD${Date.now()}`,
          note: String(note).slice(0, 1000),
          items,
          total: numericTotal,
        },
      });

      return res.status(201).json(toOrder(invoice));
    }

    if (req.method === "DELETE") {
      const id = req.query?.id;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Thiếu mã hóa đơn." });
      }

      await prisma.invoice.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "Phương thức không được hỗ trợ." });
  } catch (error) {
    console.error("Orders API error:", error);
    return res.status(500).json({
      error:
        globalThis.process?.env.NODE_ENV === "production"
          ? "Không thể xử lý hóa đơn. Kiểm tra DATABASE_URL trên Vercel."
          : error.message,
    });
  }
}
