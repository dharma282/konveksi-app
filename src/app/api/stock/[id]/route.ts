
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const materialId = params.id;
    const { quantity } = await request.json();

    if (quantity === undefined || quantity === null) {
      return NextResponse.json({ message: 'Quantity is required' }, { status: 400 });
    }

    const updatedStock = await prisma.stock.update({
      where: {
        materialId: materialId,
      },
      data: {
        quantity: parseFloat(quantity),
      },
    });

    return NextResponse.json(updatedStock);
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ message: 'Error updating stock' }, { status: 500 });
  }
}
