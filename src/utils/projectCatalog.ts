import type { PortfolioProject } from '../data/portfolioData';

export const projectCategories = ['All Work', 'Design', 'Web Development', 'Graphic Design'] as const;
export const categoriesFor = (project: PortfolioProject) => [...new Set([project.category, ...(project.categories ?? [])])];

export function filterProjects(projects: PortfolioProject[], category: string, query = '') {
  const term = query.trim().toLowerCase();
  return projects.filter(project => {
    const matchesCategory = category === 'Design'
      ? categoriesFor(project).some(value => value === 'UI/UX Design' || value === 'Game Map Design')
      : categoriesFor(project).includes(category);
    if (category !== 'All Work' && !matchesCategory) return false;
    const searchable = [project.title, project.description, project.overview, project.format, project.role, ...categoriesFor(project), ...(project.tags ?? []), ...project.technologies, ...(project.tools ?? []), ...(project.deliverables ?? [])];
    return !term || searchable.filter(Boolean).join(' ').toLowerCase().includes(term);
  });
}
