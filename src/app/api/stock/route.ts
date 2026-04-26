
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UnitType } from '@prisma/client';

// GET all materials with stock
export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      include: {
        stock: true,
      },
    });
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json({ message: 'Error fetching stock' }, { status: 500 });
  }
}

// POST a new material with initial stock
export async function POST(request: Request) {
  try {
    const { name, barcode, unit, initialQuantity } = await request.json();

    if (!name || !barcode || !unit) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if material name or barcode already exists
    const existingMaterial = await prisma.material.findFirst({
      where: {
        OR: [
          { name },
          { barcode },
        ],
      },
    });

    if (existingMaterial) {
      return NextResponse.json({ message: 'Material with this name or barcode already exists' }, { status: 409 });
    }

    const newMaterial = await prisma.material.create({
      data: {
        name,
        barcode,
        unit: unit as UnitType,
        stock: {
          create: {
            quantity: parseFloat(initialQuantity) || 0,
          },
        },
      },
      include: {
        stock: true,
      },
    });

    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json({ message: 'Error creating material' }, { status: 500 });
  }
}
