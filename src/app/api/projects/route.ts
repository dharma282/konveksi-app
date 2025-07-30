
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProjectStatus } from '@prisma/client';

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { // Include related data
        assignedTailors: {
          include: {
            tailor: true, // Include the user details for the tailor
          },
        },
        materialsUsed: {
          include: {
            material: true, // Include the material details
          },
        },
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Error fetching projects' }, { status: 500 });
  }
}

// POST a new project
export async function POST(request: Request) {
  try {
    const { clientName, projectName, projectValue, duration, itemsTarget, endDate } = await request.json();

    if (!clientName || !projectName || !projectValue || !duration || !itemsTarget || !endDate) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        clientName,
        projectName,
        projectValue: parseFloat(projectValue),
        duration: parseInt(duration, 10),
        itemsTarget: parseInt(itemsTarget, 10),
        endDate: new Date(endDate),
        status: ProjectStatus.PENDING, // Default status
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ message: 'Error creating project' }, { status: 500 });
  }
}
