import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTicketsByContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contact = req.params.contact.trim();
    console.log(`🔍 Searching for tickets using contact: ${contact}`);

    // Find buyer by email or phone
    const buyer = await prisma.buyer.findFirst({
      where: {
        OR: [{ email: contact }, { phone: contact }],
      },
    });

    if (!buyer) {
      console.log("❌ No matching buyer found!");
      res.status(404).json({ message: "No tickets found for this contact" });
      return;
    }

    console.log(`🎟 Retrieving tickets for buyer ID: ${buyer.id}`);

    // Fetch tickets along with event details
    const tickets = await prisma.ticket.findMany({
      where: { buyerId: buyer.id },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            location: true,
            date: true,
            status: true,
          },
        },
      },
    });

    console.log(`✅ Found ${tickets.length} tickets.`);
    res.json(tickets);
  } catch (error) {
    console.error("❌ Error fetching tickets:", error);
    res
      .status(500)
      .json({
        message: "Error fetching tickets",
        error: (error as Error).message,
      });
  }
};

export const bookTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId, email, phone } = req.body;

    if (!eventId || !email) {
      res.status(400).json({ message: "Event ID and Email are required." });
      return;
    }

    let buyer = await prisma.buyer.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (!buyer) {
      buyer = await prisma.buyer.create({
        data: { email, phone },
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        eventId,
        buyerId: buyer.id,
        qrCode: `QR_${new Date().getTime()}`,
      },
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Ticket booking failed" });
  }
};
