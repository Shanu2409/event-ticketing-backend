import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Get Events
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving events",
      error: (error as Error).message,
    });
  }
};

// ✅ Get Event by ID
export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving event",
      error: (error as Error).message,
    });
  }
};

// ✅ Add Event
export const addEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, date, location, totalTickets } = req.body;

    if (!name || !date || !location || !totalTickets) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    const event = await prisma.event.create({
      data: {
        name,
        description,
        date: new Date(date),
        location,
        totalTickets,
        availableTickets: totalTickets,
        status: "active",
      },
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({
      message: "Error creating event",
      error: (error as Error).message,
    });
  }
};

// ✅ Update Event
export const updateEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, date, location, totalTickets } = req.body;
    const { id } = req.params;

    const existingEvent = await prisma.event.findUnique({ where: { id } });

    if (!existingEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        name: name || existingEvent.name,
        description: description || existingEvent.description,
        date: date ? new Date(date) : existingEvent.date,
        location: location || existingEvent.location,
        totalTickets: totalTickets || existingEvent.totalTickets,
        availableTickets: totalTickets
          ? totalTickets -
            (existingEvent.totalTickets - existingEvent.availableTickets)
          : existingEvent.availableTickets,
      },
    });

    res.json({ message: "Event updated successfully", updatedEvent });
  } catch (error) {
    res.status(500).json({
      message: "Error updating event",
      error: (error as Error).message,
    });
  }
};

// ✅ Cancel Event
export const cancelEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingEvent = await prisma.event.findUnique({ where: { id } });

    if (!existingEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (existingEvent.status === "canceled") {
      res.status(400).json({ message: "Event is already canceled" });
      return;
    }

    await prisma.event.update({
      where: { id },
      data: { status: "canceled", availableTickets: 0 },
    });

    res.json({ message: "Event has been canceled successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Error canceling event",
      error: (error as Error).message,
    });
  }
};
