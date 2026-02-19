import { db } from '@repo/database-hirekit';

export interface PipelineStage {
  id: string;
  companyId: string;
  name: string;
  slug: string;
  color: string;
  bgColor: string;
  icon: string | null;
  order: number;
  type: string;
}

export const DEFAULT_STAGES: Omit<PipelineStage, 'id' | 'companyId'>[] = [
  { name: 'New', slug: 'new', color: '#4F46E5', bgColor: '#E0E7FF', icon: 'ph ph-envelope-simple', order: 0, type: 'active' },
  { name: 'Screening', slug: 'screening', color: '#D97706', bgColor: '#FEF3C7', icon: 'ph ph-eye', order: 1, type: 'active' },
  { name: 'Interviewing', slug: 'interviewing', color: '#2563EB', bgColor: '#DBEAFE', icon: 'ph ph-video-camera', order: 2, type: 'active' },
  { name: 'Offered', slug: 'offered', color: '#7C3AED', bgColor: '#F3E8FF', icon: 'ph ph-hand-heart', order: 3, type: 'active' },
  { name: 'Hired', slug: 'hired', color: '#16A34A', bgColor: '#DCFCE7', icon: 'ph ph-check-circle', order: 4, type: 'positive_end' },
  { name: 'Rejected', slug: 'rejected', color: '#DC2626', bgColor: '#FEE2E2', icon: 'ph ph-x-circle', order: 5, type: 'negative_end' },
];

export async function getPipelineStages(companyId: string): Promise<PipelineStage[]> {
  let stages = await db.pipelineStage.findMany({
    where: { companyId },
    orderBy: { order: 'asc' },
  });

  // Lazy seed: if no stages exist, create defaults
  if (stages.length === 0) {
    await db.pipelineStage.createMany({
      data: DEFAULT_STAGES.map((s) => ({ ...s, companyId })),
    });
    stages = await db.pipelineStage.findMany({
      where: { companyId },
      orderBy: { order: 'asc' },
    });
  }

  return stages;
}

export async function getValidStageSlugs(companyId: string): Promise<string[]> {
  const stages = await getPipelineStages(companyId);
  return stages.map((s) => s.slug);
}

export async function isValidStage(companyId: string, slug: string): Promise<boolean> {
  const slugs = await getValidStageSlugs(companyId);
  return slugs.includes(slug);
}

export async function getStageBySlug(companyId: string, slug: string): Promise<PipelineStage | null> {
  const stages = await getPipelineStages(companyId);
  return stages.find((s) => s.slug === slug) || null;
}
