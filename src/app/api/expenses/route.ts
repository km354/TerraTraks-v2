/**
 * Expenses API Route
 * 
 * Handles GET (list) and POST (create) operations for expenses
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const itineraryId = searchParams.get('itineraryId');

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.user.id,
        ...(itineraryId && { itineraryId }),
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({ expenses });
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, amount, currency, category, date, itineraryId } = body;

    if (!title || amount === undefined) {
      return NextResponse.json(
        { error: 'Title and amount are required' },
        { status: 400 }
      );
    }

    // Verify itinerary belongs to user if provided
    if (itineraryId) {
      const itinerary = await prisma.itinerary.findUnique({
        where: { id: itineraryId },
        select: { userId: true },
      });

      if (!itinerary || itinerary.userId !== session.user.id) {
        return NextResponse.json(
          { error: 'Itinerary not found or access denied' },
          { status: 403 }
        );
      }
    }

    const expense = await prisma.expense.create({
      data: {
        userId: session.user.id,
        itineraryId: itineraryId || null,
        title,
        description: description || null,
        amount,
        currency: currency || 'USD',
        category: category || 'other',
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create expense' },
      { status: 500 }
    );
  }
}

