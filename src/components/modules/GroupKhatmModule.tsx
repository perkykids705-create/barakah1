import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { GroupKhatmTask } from '../../types';
import { KhatmCelebrationBadge } from '../common/BrandMark';
import {
  Users,
  Plus,
  BookOpen,
  Calendar,
  CheckCircle2,
  Copy,
  Clock,
  Sparkles,
  Award,
  Share2,
} from 'lucide-react';

export const GroupKhatmModule: React.FC = () => {
  const {
    currentUser,
    language,
    groupTasks,
    createGroupTask,
    claimGroupTaskPortion,
    completeGroupTaskPortion,
    extendGroupTaskDeadline,
    closeGroupTask,
    showNotification,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  const [selectedTask, setSelectedTask] = useState<GroupKhatmTask | null>(groupTasks[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');

  // Create task form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'para' | 'surah_repetition'>('para');
  const [newTargetSurah, setNewTargetSurah] = useState('Surah Ya-Sin');
  const [newRepetitionGoal, setNewRepetitionGoal] = useState<number>(121);
  const [newTargetDate, setNewTargetDate] = useState('2026-10-15');

  // Extend deadline modal state
  const [extendingTaskId, setExtendingTaskId] = useState<string | null>(null);
  const [newExtDate, setNewExtDate] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const result = createGroupTask(
      newTitle,
      newDesc,
      newType,
      newTargetDate,
      newType === 'surah_repetition' ? newTargetSurah : undefined,
      newType === 'surah_repetition' ? Number(newRepetitionGoal) : undefined
    );
    if (result.success) {
      setShowCreateModal(false);
      setNewTitle('');
      setNewDesc('');
    } else if (result.error) {
      showNotification(result.error);
    }
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCodeInput.trim().toUpperCase();
    const found = groupTasks.find((t) => t.code.toUpperCase() === code);
    if (found) {
      setSelectedTask(found);
      setJoinCodeInput('');
      showNotification(`Joined task: ${found.title}`);
    } else {
      showNotification(`No active khatm task found with code ${code}`);
    }
  };

  const copyJoinLink = (task: GroupKhatmTask) => {
    const link = `${window.location.origin}/#join=${task.code}`;
    navigator.clipboard?.writeText?.(link);
    showNotification(`Join link & code (${task.code}) copied to clipboard!`);
  };

  const currentTask = selectedTask ? groupTasks.find((t) => t.id === selectedTask.id) || selectedTask : null;

  return (
    <div className="space-y-6">
      {showCelebration && <KhatmCelebrationBadge onDismiss={() => setShowCelebration(false)} />}

      {/* 1. TOP HEADER & ACTIONS */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#0E8C74]" />
            <h2 className="text-2xl font-extrabold text-[#16241A]">{t('groupKhatmTitle')}</h2>
          </div>
          <p className="text-xs text-[#5D6B5A] mt-1">
            {t('taskDescPlaceholder')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Join with Code input */}
          <form onSubmit={handleJoinByCode} className="flex items-center gap-1.5">
            <input
              type="text"
              placeholder={t('enterCodePlaceholder')}
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
              data-no-phonetic="true"
              className="w-48 px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold uppercase tracking-wider outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#16241A] text-xs font-bold transition-colors"
            >
              {t('joinBtn')}
            </button>
          </form>

          {/* Create Khatm CTA */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-[#0E8C74] hover:bg-[#0b705d] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createKhatm')}</span>
          </button>
        </div>
      </div>

      {/* 2. TASK SELECTOR CAROUSEL / LIST */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {groupTasks.map((task) => {
          const isSelected = currentTask?.id === task.id;
          return (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`p-4 rounded-2xl border text-left shrink-0 w-72 transition-all ${
                isSelected
                  ? 'bg-white border-[#0E8C74] shadow-sm ring-2 ring-[#0E8C74]/20'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#DAF3EC] text-[#0E8C74]">
                  {task.type === 'para' ? t('type30Juz') : t('typeSurahRepetition')}
                </span>
                <span className="text-[11px] font-mono font-bold text-stone-400">{task.code}</span>
              </div>
              <h4 className="text-sm font-bold text-[#16241A] truncate">{task.title}</h4>
              <p className="text-[11px] text-[#5D6B5A] mt-1">{t('targetDateLabel')}: {task.targetDate}</p>
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE TASK DETAIL & CLAIM GRID */}
      {currentTask && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs space-y-6">
          {/* Task Info Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                  {currentTask.status}
                </span>
                <span className="text-xs text-[#5D6B5A]">
                  Created by <strong>{currentTask.creatorName}</strong> on {currentTask.createdAt}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#16241A]">{currentTask.title}</h3>
              <p className="text-xs text-[#5D6B5A] mt-1">{currentTask.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyJoinLink(currentTask)}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#16241A] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-[#0E8C74]" />
                <span>{currentTask.code}</span>
              </button>

              {/* Creator Deadline Extension Option (PRD §5.7) */}
              {currentUser?.id === currentTask.creatorId && (
                <button
                  onClick={() => setExtendingTaskId(currentTask.id)}
                  className="px-3.5 py-2 rounded-xl bg-[#0E8C74]/10 hover:bg-[#0E8C74]/20 text-[#0E8C74] text-xs font-bold transition-colors"
                >
                  {t('extendDeadline')}
                </button>
              )}
            </div>
          </div>

          {/* Chapter (Para) Khatm Grid (all 30 Juz) */}
          {currentTask.type === 'para' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#16241A]">
                  {t('type30Juz')}
                </h4>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-[#2E8B4F]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B4F]" /> {t('completedTasks')}
                  </span>
                  <span className="flex items-center gap-1 text-[#C89B2E]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C89B2E]" /> {t('claimedBy')}
                  </span>
                  <span className="flex items-center gap-1 text-stone-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-300" /> {t('claimBtn')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((paraNum) => {
                  const assignment = currentTask.assignments.find((a) => a.paraNumber === paraNum);
                  const isClaimedByMe = assignment?.userId === currentUser?.id;
                  const isCompleted = assignment?.status === 'completed';

                  return (
                    <div
                      key={paraNum}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between min-h-[90px] ${
                        isCompleted
                          ? 'bg-[#E1F2E7] border-[#2E8B4F] text-[#0B2E1C]'
                          : assignment
                          ? 'bg-[#FAF0D8] border-[#C89B2E] text-[#16241A]'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold">{t('portionPara')} {paraNum}</span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-[#2E8B4F]" />
                        ) : assignment ? (
                          <span className="text-[10px] font-bold text-[#C89B2E]">{t('claimedBy')}</span>
                        ) : (
                          <span className="text-[10px] font-bold text-stone-400">{t('claimBtn')}</span>
                        )}
                      </div>

                      <div className="mt-2">
                        {assignment ? (
                          <div>
                            <p className="text-[11px] font-bold truncate">{assignment.userName}</p>
                            {isClaimedByMe && !isCompleted && (
                              <button
                                onClick={() => {
                                  completeGroupTaskPortion(currentTask.id, assignment.id);
                                  setShowCelebration(true);
                                }}
                                className="w-full mt-1.5 py-1 px-2 rounded-lg bg-[#2E8B4F] text-white text-[10px] font-bold"
                              >
                                {t('markCompletedBtn')} ✓
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => claimGroupTaskPortion(currentTask.id, paraNum)}
                            className="w-full py-1 px-2 rounded-lg bg-white border border-stone-300 hover:border-[#0E8C74] text-[#0E8C74] text-[10px] font-bold"
                          >
                            {t('claimBtn')}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Surah Repetition Khatm */
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                <span className="text-xs font-bold text-[#0E8C74] uppercase">{t('targetSurahLabel')}</span>
                <h4 className="text-2xl font-extrabold text-[#16241A] mt-1">
                  {currentTask.targetSurah}
                </h4>
                <p className="text-sm font-semibold text-[#5D6B5A] mt-1">
                  {t('repetitionGoalLabel')}: {currentTask.repetitionGoal}
                </p>

                {/* Progress bar */}
                <div className="max-w-md mx-auto mt-4 space-y-1">
                  {(() => {
                    const completedTotal = currentTask.assignments
                      .filter((a) => a.status === 'completed')
                      .reduce((sum, a) => sum + (a.repetitionCount || 0), 0);
                    const repGoal = currentTask.repetitionGoal || 100;
                    const percent = Math.min(100, Math.round((completedTotal / repGoal) * 100));

                    return (
                      <>
                        <div className="flex justify-between text-xs font-bold">
                          <span>{completedTotal} {t('completedTasks')}</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-[#0E8C74] h-full rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Claim Repetition Form */}
              <div className="max-w-sm mx-auto p-4 rounded-xl border border-stone-200 bg-white space-y-3">
                <h5 className="text-xs font-bold text-[#16241A]">{t('claimBtn')}</h5>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    defaultValue={10}
                    id="repCountInput"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-bold"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('repCountInput') as HTMLInputElement;
                      const val = Number(input?.value) || 10;
                      claimGroupTaskPortion(currentTask.id, undefined, val);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#0E8C74] text-white text-xs font-bold"
                  >
                    {t('claimBtn')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. EXTEND DEADLINE MODAL */}
      {extendingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h4 className="text-base font-bold text-[#16241A]">{t('extendDeadline')}</h4>
            <p className="text-xs text-[#5D6B5A]">{t('targetDateLabel')}</p>
            <input
              type="date"
              value={newExtDate}
              onChange={(e) => setNewExtDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setExtendingTaskId(null)}
                className="flex-1 py-2 rounded-xl bg-stone-100 text-xs font-bold"
              >
                {t('cancelBtn')}
              </button>
              <button
                onClick={() => {
                  if (newExtDate) {
                    extendGroupTaskDeadline(extendingTaskId, newExtDate);
                    setExtendingTaskId(null);
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-[#0E8C74] text-white text-xs font-bold"
              >
                {t('saveSettingsBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CREATE KHATM TASK MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="text-lg font-bold text-[#16241A]">{t('createKhatm')}</h4>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('khatmTitleLabel')}</label>
                <input
                  type="text"
                  placeholder={t('taskTitlePlaceholder')}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('taskDescLabel')}</label>
                <textarea
                  rows={2}
                  placeholder={t('taskDescPlaceholder')}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('khatmTypeLabel')}</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                >
                  <option value="para">{t('type30Juz')}</option>
                  <option value="surah_repetition">{t('typeSurahRepetition')}</option>
                </select>
              </div>

              {newType === 'surah_repetition' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#5D6B5A] mb-1">{t('targetSurahLabel')}</label>
                    <input
                      type="text"
                      value={newTargetSurah}
                      onChange={(e) => setNewTargetSurah(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5D6B5A] mb-1">{t('repetitionGoalLabel')}</label>
                    <input
                      type="number"
                      min="1"
                      value={newRepetitionGoal}
                      onChange={(e) => setNewRepetitionGoal(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('targetDateLabel')}</label>
                <input
                  type="date"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0E8C74] hover:bg-[#0b705d] text-white font-bold"
                >
                  {t('createTaskSubmit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
