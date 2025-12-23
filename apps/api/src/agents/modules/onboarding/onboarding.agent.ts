import { BaseAgent, AgentResult } from '../base.agent';
import { PrismaService } from '../../../prisma/prisma.service';
import { AIProvider } from '../../../ai/ai.provider';

export class OnboardingAgent extends BaseAgent {
  async execute(organizationId: string, input: any): Promise<AgentResult> {
    const { action, employeeId } = input;

    if (action === 'create_plan') {
      return this.createOnboardingPlan(organizationId, input);
    }

    if (action === 'generate_training') {
      return this.generateTraining(organizationId, employeeId);
    }

    if (action === 'assess_progress') {
      return this.assessProgress(organizationId, employeeId);
    }

    throw new Error(`Unknown action: ${action}`);
  }

  private async createOnboardingPlan(organizationId: string, input: any): Promise<AgentResult> {
    const { employeeName, role, department, startDate } = input;

    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    const existingPlans = await this.prisma.onboardingPlan.findMany({
      where: { organizationId },
      take: 5,
    });

    const knowledgeBase = await this.prisma.knowledgeBase.findMany({
      where: {
        organizationId,
        type: { in: ['manual', 'sop', 'policy'] },
      },
      take: 10,
    });

    const prompt = `Create a comprehensive 30-day onboarding plan for a new employee.

Organization: ${org?.name}
Employee: ${employeeName}
Role: ${role}
Department: ${department || 'General'}
Start Date: ${startDate || 'TBD'}

Existing Onboarding Plans (for reference):
${JSON.stringify(
  existingPlans.map((p) => ({
    name: p.name,
    tasks: p.tasks,
  })),
  null,
  2,
)}

Available Resources:
${knowledgeBase.map((kb) => `${kb.title} (${kb.type})`).join('\n')}

Create a structured 30-day plan with:
1. Week-by-week breakdown
2. Specific tasks and milestones
3. Required training modules
4. Key people to meet
5. Resources to review
6. Success criteria

Format as JSON:
{
  "planName": "...",
  "tasks": [
    {"id": "1", "title": "...", "description": "...", "dueDate": "...", "category": "orientation|training|integration", "completed": false}
  ],
  "milestones": [...],
  "resources": [...]
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        planName: 'string',
        tasks: [
          {
            id: 'string',
            title: 'string',
            description: 'string',
            dueDate: 'string',
            category: 'string',
            completed: 'boolean',
          },
        ],
        milestones: ['string'],
        resources: ['string'],
      },
    });

    return {
      output: {
        plan: structured,
      },
      reasoning: `Created personalized onboarding plan tailored to the employee's role, department, and organizational context.`,
    };
  }

  private async generateTraining(organizationId: string, employeeId: string): Promise<AgentResult> {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, organizationId },
      include: {
        trainingProgress: true,
        onboardingPlans: { take: 1 },
      },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    const knowledgeBase = await this.prisma.knowledgeBase.findMany({
      where: {
        organizationId,
        type: { in: ['manual', 'sop', 'article'] },
      },
      take: 10,
    });

    const prompt = `Generate a training curriculum for an employee.

Employee: ${employee.name}
Role: ${employee.role}
Department: ${employee.department || 'General'}

Current Training Progress:
${JSON.stringify(
  employee.trainingProgress.map((t) => ({
    course: t.courseName,
    progress: t.progress,
    completed: t.completed,
  })),
  null,
  2,
)}

Available Knowledge Base:
${knowledgeBase.map((kb) => `${kb.title}: ${kb.content.substring(0, 200)}...`).join('\n\n')}

Create:
1. Training modules relevant to their role
2. Learning objectives for each module
3. Suggested quiz questions
4. Progress tracking milestones
5. Recommended completion timeline

Format as JSON:
{
  "modules": [
    {"name": "...", "description": "...", "objectives": [...], "duration": "...", "quiz": [...]}
  ],
  "timeline": "..."
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        modules: [
          {
            name: 'string',
            description: 'string',
            objectives: ['string'],
            duration: 'string',
            quiz: [
              {
                question: 'string',
                options: ['string'],
                correctAnswer: 'number',
              },
            ],
          },
        ],
        timeline: 'string',
      },
    });

    return {
      output: {
        curriculum: structured,
        employeeId,
      },
      reasoning: 'Generated role-specific training curriculum based on employee profile and available organizational knowledge.',
    };
  }

  private async assessProgress(organizationId: string, employeeId: string): Promise<AgentResult> {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, organizationId },
      include: {
        onboardingPlans: true,
        trainingProgress: true,
      },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    const prompt = `Assess onboarding and training progress for an employee.

Employee: ${employee.name}
Role: ${employee.role}
Hire Date: ${employee.hireDate?.toISOString() || 'N/A'}

Onboarding Plans:
${JSON.stringify(
  employee.onboardingPlans.map((p) => ({
    name: p.name,
    status: p.status,
    tasks: p.tasks,
    startDate: p.startDate?.toISOString(),
    completedDate: p.completedDate?.toISOString(),
  })),
  null,
  2,
)}

Training Progress:
${JSON.stringify(
  employee.trainingProgress.map((t) => ({
    course: t.courseName,
    progress: t.progress,
    completed: t.completed,
    quizScores: t.quizScores,
  })),
  null,
  2,
)}

Provide:
1. Overall progress assessment (0-100%)
2. Completed vs. pending tasks
3. Training completion status
4. Areas of strength
5. Areas needing attention
6. Recommendations for acceleration
7. Estimated completion timeline

Format as JSON:
{
  "overallProgress": 0,
  "onboardingStatus": "...",
  "trainingStatus": "...",
  "strengths": [...],
  "needsAttention": [...],
  "recommendations": [...],
  "estimatedCompletion": "..."
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 1500,
      temperature: 0.6,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        overallProgress: 'number',
        onboardingStatus: 'string',
        trainingStatus: 'string',
        strengths: ['string'],
        needsAttention: ['string'],
        recommendations: ['string'],
        estimatedCompletion: 'string',
      },
    });

    return {
      output: {
        assessment: structured,
        employeeId,
      },
      reasoning: 'Assessed employee onboarding and training progress to provide actionable insights and recommendations.',
    };
  }
}


