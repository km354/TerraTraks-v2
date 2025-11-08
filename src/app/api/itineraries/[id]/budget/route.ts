/**
 * Itinerary Budget API Route
 * 
 * Handles updating the budget for an itinerary
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { budget, budgetCurrency } = body;

    // Verify itinerary belongs to user
    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!itinerary) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    if (itinerary.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const updated = await prisma.itinerary.update({
      where: { id },
      data: {
        budget: budget !== null && budget !== undefined ? budget : null,
        budgetCurrency: budgetCurrency || 'USD',
      },
    });

    return NextResponse.json({
      budget: updated.budget ? Number(updated.budget) : null,
      budgetCurrency: updated.budgetCurrency,
    });
  } catch (error: any) {
    console.error('Error updating budget:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update budget' },
      { status: 500 }
    );
  }
}

