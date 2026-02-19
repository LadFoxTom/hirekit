'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { KanbanCard } from './KanbanCard';

interface ApplicationItem {
  id: string;
  name: string | null;
  email: string;
  status: string;
  aiScore: number | null;
  createdAt: string;
  job?: { title: string } | null;
}

interface StageColumn {
  id: string;
  label: string;
  color: string;
  bg: string;
}

function DroppableColumn({
  id,
  label,
  color,
  bg,
  items,
  children,
}: {
  id: string;
  label: string;
  color: string;
  bg: string;
  items: ApplicationItem[];
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl border transition-all duration-200 min-w-[260px] w-[260px] ${
        isOver ? 'border-dashed border-2' : 'border-slate-200'
      }`}
      style={{
        borderColor: isOver ? color : undefined,
        backgroundColor: isOver ? `${bg}40` : '#FAFBFC',
      }}
    >
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-semibold text-[#1E293B]">{label}</span>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: bg, color }}
        >
          {items.length}
        </span>
      </div>
      <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
        {children}
      </div>
    </div>
  );
}

export function KanbanBoard({ applications, stages }: { applications: ApplicationItem[]; stages?: StageColumn[] }) {
  const COLUMNS: StageColumn[] = stages || [
    { id: 'new', label: 'New', color: '#4F46E5', bg: '#E0E7FF' },
    { id: 'screening', label: 'Screening', color: '#D97706', bg: '#FEF3C7' },
    { id: 'interviewing', label: 'Interviewing', color: '#2563EB', bg: '#DBEAFE' },
    { id: 'offered', label: 'Offered', color: '#7C3AED', bg: '#F3E8FF' },
    { id: 'hired', label: 'Hired', color: '#16A34A', bg: '#DCFCE7' },
    { id: 'rejected', label: 'Rejected', color: '#DC2626', bg: '#FEE2E2' },
  ];
  const [items, setItems] = useState(applications);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const getColumn = (status: string) => items.filter((item) => item.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = items.find((i) => i.id === active.id);
    if (!activeItem) return;

    // Check if dropping over a column
    const overColumn = COLUMNS.find((c) => c.id === over.id);
    if (overColumn && activeItem.status !== overColumn.id) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === active.id ? { ...item, status: overColumn.id } : item
        )
      );
      return;
    }

    // Check if dropping over another card
    const overItem = items.find((i) => i.id === over.id);
    if (overItem && activeItem.status !== overItem.status) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === active.id ? { ...item, status: overItem.status } : item
        )
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active } = event;
    setActiveId(null);

    const item = items.find((i) => i.id === active.id);
    if (!item) return;

    const originalItem = applications.find((i) => i.id === active.id);
    if (!originalItem || originalItem.status === item.status) return;

    try {
      const res = await fetch('/api/v1/applications/batch-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: item.id,
          status: item.status,
        }),
      });

      if (!res.ok) {
        // Revert on failure
        setItems((prev) =>
          prev.map((i) =>
            i.id === active.id ? { ...i, status: originalItem.status } : i
          )
        );
      }
    } catch {
      // Revert on error
      setItems((prev) =>
        prev.map((i) =>
          i.id === active.id ? { ...i, status: originalItem.status } : i
        )
      );
    }
  };

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const columnItems = getColumn(col.id);
          return (
            <DroppableColumn
              key={col.id}
              id={col.id}
              label={col.label}
              color={col.color}
              bg={col.bg}
              items={columnItems}
            >
              <SortableContext
                items={columnItems.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {columnItems.map((app) => (
                  <KanbanCard
                    key={app.id}
                    id={app.id}
                    name={app.name}
                    email={app.email}
                    jobTitle={app.job?.title}
                    aiScore={app.aiScore}
                    createdAt={app.createdAt}
                  />
                ))}
              </SortableContext>
              {columnItems.length === 0 && (
                <div className="text-center py-8 text-xs text-[#94A3B8]">
                  Drop here
                </div>
              )}
            </DroppableColumn>
          );
        })}
      </div>
      <DragOverlay>
        {activeItem && (
          <div className="opacity-90 rotate-2">
            <KanbanCard
              id={activeItem.id}
              name={activeItem.name}
              email={activeItem.email}
              jobTitle={activeItem.job?.title}
              aiScore={activeItem.aiScore}
              createdAt={activeItem.createdAt}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
