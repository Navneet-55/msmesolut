import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  globalThis.console.log('🌱 Seeding database...');

  // Create demo user
  const passwordHash = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@lumina.ai' },
    update: {},
    create: {
      email: 'demo@lumina.ai',
      passwordHash,
      name: 'Demo User',
      emailVerified: true,
    },
  });

  // Create demo organization
  const org = await prisma.organization.upsert({
    where: { slug: 'demo-org' },
    update: {},
    create: {
      name: 'Demo Organization',
      slug: 'demo-org',
      plan: 'pro',
    },
  });

  // Add user to organization as owner
  await prisma.orgMember.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      organizationId: org.id,
      role: 'owner',
    },
  });

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        organizationId: org.id,
        name: 'Acme Corp',
        email: 'contact@acme.com',
        phone: '+1-555-0100',
        company: 'Acme Corporation',
        tags: ['enterprise', 'priority'],
      },
    }),
    prisma.customer.create({
      data: {
        organizationId: org.id,
        name: 'TechStart Inc',
        email: 'hello@techstart.io',
        phone: '+1-555-0101',
        company: 'TechStart Inc',
        tags: ['startup', 'tech'],
      },
    }),
  ]);

  // Create sample tickets (use upsert to handle duplicates)
  const ticket1 = await prisma.ticket.upsert({
    where: { number: 'TKT-001' },
    update: {},
    create: {
      organizationId: org.id,
      customerId: customers[0].id,
      number: 'TKT-001',
      subject: 'Product inquiry',
      description: 'Interested in learning more about your enterprise features.',
      status: 'open',
      priority: 'high',
      category: 'sales',
    },
  });

  await prisma.ticket.upsert({
    where: { number: 'TKT-002' },
    update: {},
    create: {
      organizationId: org.id,
      customerId: customers[1].id,
      number: 'TKT-002',
      subject: 'Technical support needed',
      description: 'Having issues with API integration.',
      status: 'in_progress',
      priority: 'medium',
      category: 'support',
    },
  });

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        organizationId: org.id,
        name: 'Premium Widget',
        sku: 'WID-001',
        description: 'High-quality widget for enterprise use',
        category: 'Widgets',
        price: 99.99,
        cost: 50.00,
      },
    }),
    prisma.product.create({
      data: {
        organizationId: org.id,
        name: 'Standard Widget',
        sku: 'WID-002',
        description: 'Standard widget for general use',
        category: 'Widgets',
        price: 49.99,
        cost: 25.00,
      },
    }),
  ]);

  // Create inventory
  await Promise.all(
    products.map((product: { id: string }) =>
      prisma.inventoryItem.create({
        data: {
          organizationId: org.id,
          productId: product.id,
          quantity: Math.floor(Math.random() * 100) + 50,
          minStock: 20,
          maxStock: 200,
          location: 'Warehouse A',
        },
      })
    )
  );

  // Create sample transactions
  await prisma.transaction.createMany({
    data: [
      {
        organizationId: org.id,
        type: 'income',
        category: 'sales',
        amount: 999.99,
        description: 'Premium Widget sale',
        date: new Date(),
      },
      {
        organizationId: org.id,
        type: 'expense',
        category: 'operations',
        amount: 500.00,
        description: 'Monthly operations cost',
        date: new Date(),
      },
    ],
  });

  // Create sample campaigns
  const campaign = await prisma.campaign.create({
    data: {
      organizationId: org.id,
      name: 'Q1 Product Launch',
      type: 'email',
      status: 'active',
      startDate: new Date(),
      budget: 5000.00,
    },
  });

  // Create sample content
  await prisma.content.create({
    data: {
      organizationId: org.id,
      campaignId: campaign.id,
      title: 'Introducing Premium Widget',
      body: 'We are excited to announce our new Premium Widget...',
      type: 'email',
      status: 'published',
      publishedAt: new Date(),
    },
  });

  // Create sample leads
  await prisma.lead.createMany({
    data: [
      {
        organizationId: org.id,
        email: 'prospect@example.com',
        name: 'John Prospect',
        company: 'Prospect Corp',
        source: 'website',
        status: 'new',
        score: 75,
      },
      {
        organizationId: org.id,
        email: 'lead@example.com',
        name: 'Jane Lead',
        company: 'Lead Inc',
        source: 'referral',
        status: 'qualified',
        score: 90,
      },
    ],
  });

  // Create knowledge base entries
  await prisma.knowledgeBase.createMany({
    data: [
      {
        organizationId: org.id,
        title: 'Getting Started Guide',
        content: 'Welcome to Lumina AI. This guide will help you get started...',
        type: 'manual',
        category: 'onboarding',
        tags: ['getting-started', 'basics'],
        isPublic: true,
      },
      {
        organizationId: org.id,
        title: 'Customer Support SOP',
        content: 'Standard operating procedure for handling customer support tickets...',
        type: 'sop',
        category: 'support',
        tags: ['support', 'sop'],
        isPublic: false,
      },
    ],
  });

  // Create sample employees
  const employee = await prisma.employee.create({
    data: {
      organizationId: org.id,
      name: 'Sarah Johnson',
      email: 'sarah@demo-org.com',
      role: 'Customer Success Manager',
      department: 'Support',
      status: 'active',
      hireDate: new Date('2024-01-15'),
    },
  });

  // Create onboarding plan
  await prisma.onboardingPlan.create({
    data: {
      organizationId: org.id,
      employeeId: employee.id,
      name: '30-Day Onboarding',
      status: 'in_progress',
      tasks: [
        { id: '1', title: 'Complete company orientation', completed: true, dueDate: '2024-01-16' },
        { id: '2', title: 'Review product documentation', completed: true, dueDate: '2024-01-18' },
        { id: '3', title: 'Shadow senior team member', completed: false, dueDate: '2024-01-25' },
      ],
      startDate: new Date('2024-01-15'),
    },
  });

  // Create competitor
  await prisma.competitor.create({
    data: {
      organizationId: org.id,
      name: 'Competitor Inc',
      website: 'https://competitor.com',
      industry: 'SaaS',
      strengths: ['Strong brand', 'Large customer base'],
      weaknesses: ['Higher pricing', 'Slower innovation'],
    },
  });

  globalThis.console.log('✅ Database seeded successfully!');
  globalThis.console.log(`   User: demo@lumina.ai / demo123`);
  globalThis.console.log(`   Organization: ${org.slug}`);
}

main()
  .catch((e) => {
    globalThis.console.error('❌ Seeding failed:', e);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (globalThis as any).process !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).process.exit(1);
    }
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

